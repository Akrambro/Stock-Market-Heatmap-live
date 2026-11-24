import type {
  IndexId,
  IndexTicker,
  NseFeedState,
  StockQuote,
} from '../src/types/market.ts';
import { NIFTY_INDICES } from '../src/utils/heatmapLogic.ts';
import {
  extractFirst5mCandleFromChart,
  parseNseAllIndices,
  parseNseEquityRows,
  type NseAllIndicesRowRaw,
  type NseIndexResponseRaw,
} from '../src/utils/nseParser.ts';

const NSE_BASE_URL = 'https://www.nseindia.com';
const BROWSER_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  Accept: 'application/json, text/plain, */*',
  'Accept-Language': 'en-US,en;q=0.9',
  Referer: 'https://www.nseindia.com/market-data/live-equity-market',
};

export interface NsePollResult {
  ok: boolean;
  httpStatus: number;
  updatedStocks: StockQuote[];
  indices: IndexTicker[];
  message: string;
}

export class NseFeedAdapter {
  private cookies = new Map<string, string>();
  private lastCookieRefresh = 0;
  private first5mCache = new Map<
    string,
    { first5mOpen: number; first5mClose: number; first5mChangePct: number }
  >();

  private getCookieHeader(): string {
    return Array.from(this.cookies.entries())
      .map(([k, v]) => `${k}=${v}`)
      .join('; ');
  }

  private storeSetCookies(res: Response): void {
    const rawSetCookies =
      typeof res.headers.getSetCookie === 'function'
        ? res.headers.getSetCookie()
        : [];
    for (const entry of rawSetCookies) {
      const pair = entry.split(';')[0]?.trim();
      if (!pair) continue;
      const eqIdx = pair.indexOf('=');
      if (eqIdx > 0) {
        const name = pair.slice(0, eqIdx).trim();
        const val = pair.slice(eqIdx + 1).trim();
        this.cookies.set(name, val);
      }
    }
  }

  async initSession(force = false): Promise<{ ok: boolean; status: number }> {
    const now = Date.now();
    if (!force && this.cookies.size > 0 && now - this.lastCookieRefresh < 240_000) {
      return { ok: true, status: 200 };
    }

    this.cookies.clear();
    const res = await fetch(NSE_BASE_URL, {
      method: 'GET',
      headers: {
        ...BROWSER_HEADERS,
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      },
      signal: AbortSignal.timeout(7000),
    });

    this.storeSetCookies(res);
    if (!res.ok) {
      return { ok: false, status: res.status };
    }

    // Secondary market-data page warm-up for Akamai session cookies
    const marketPage = await fetch(
      `${NSE_BASE_URL}/market-data/live-equity-market`,
      {
        method: 'GET',
        headers: {
          ...BROWSER_HEADERS,
          Accept:
            'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          Cookie: this.getCookieHeader(),
        },
        signal: AbortSignal.timeout(7000),
      }
    );
    this.storeSetCookies(marketPage);
    this.lastCookieRefresh = now;
    return { ok: marketPage.ok, status: marketPage.status };
  }

  async fetchJson<T>(apiPath: string): Promise<{
    ok: boolean;
    status: number;
    data: T | null;
  }> {
    const session = await this.initSession();
    if (!session.ok) {
      return { ok: false, status: session.status, data: null };
    }

    const res = await fetch(`${NSE_BASE_URL}${apiPath}`, {
      method: 'GET',
      headers: {
        ...BROWSER_HEADERS,
        Cookie: this.getCookieHeader(),
      },
      signal: AbortSignal.timeout(8000),
    });
    this.storeSetCookies(res);

    if (res.status === 401 || res.status === 403) {
      // Retry once with a fresh cookie session
      const refresh = await this.initSession(true);
      if (!refresh.ok) {
        return { ok: false, status: refresh.status, data: null };
      }
      const retry = await fetch(`${NSE_BASE_URL}${apiPath}`, {
        method: 'GET',
        headers: {
          ...BROWSER_HEADERS,
          Cookie: this.getCookieHeader(),
        },
        signal: AbortSignal.timeout(8000),
      });
      this.storeSetCookies(retry);
      if (!retry.ok) {
        return { ok: false, status: retry.status, data: null };
      }
      const retryJson = (await retry.json()) as T;
      return { ok: true, status: retry.status, data: retryJson };
    }

    if (!res.ok) {
      return { ok: false, status: res.status, data: null };
    }

    const json = (await res.json()) as T;
    return { ok: true, status: res.status, data: json };
  }

  async fetchFirst5mCandle(
    symbol: string,
    dayOpen: number
  ): Promise<{
    first5mOpen: number;
    first5mClose: number;
    first5mChangePct: number;
  } | null> {
    const cached = this.first5mCache.get(symbol);
    if (cached) return cached;

    try {
      const res = await this.fetchJson<{ grapthData?: [number, number][] }>(
        `/api/chart-databyindex?index=${encodeURIComponent(`${symbol}EQN`)}`
      );
      if (!res.ok || !res.data?.grapthData) return null;
      const extracted = extractFirst5mCandleFromChart(
        res.data.grapthData,
        dayOpen
      );
      if (extracted) {
        this.first5mCache.set(symbol, extracted);
      }
      return extracted;
    } catch {
      return null;
    }
  }

  async pollAllIndices(
    existingMap: Map<string, StockQuote>
  ): Promise<{
    feedState: NseFeedState;
    result: NsePollResult;
  }> {
    try {
      // 1. Poll NIFTY 500 first (covers the broad universe), then NIFTY 50 / 100 / 200 / Midcap / Sectoral tags
      const indexOrder: IndexId[] = [
        'NIFTY_500',
        'NIFTY_50',
        'NIFTY_100',
        'NIFTY_200',
        'NIFTY_MIDCAP_100',
        'NIFTY_BANK',
        'NIFTY_IT',
        'NIFTY_AUTO',
        'NIFTY_PHARMA',
        'NIFTY_FMCG',
        'NIFTY_METAL',
      ];

      const workingMap = new Map<string, StockQuote>(existingMap);
      const updatedSymbols = new Set<string>();
      let lastStatus = 200;

      for (const idxId of indexOrder) {
        const meta = NIFTY_INDICES.find((m) => m.id === idxId);
        if (!meta) continue;

        const res = await this.fetchJson<NseIndexResponseRaw>(
          `/api/equity-stockIndices?index=${encodeURIComponent(meta.nseParam)}`
        );
        lastStatus = res.status;

        if (!res.ok || !res.data) {
          const isBlocked = res.status === 403 || res.status === 401;
          return {
            feedState: isBlocked ? 'BLOCKED' : 'ERROR',
            result: {
              ok: false,
              httpStatus: res.status,
              updatedStocks: [],
              indices: [],
              message: isBlocked
                ? `NSE India returned HTTP ${res.status} (Akamai WAF blocks cloud IPs). Run locally on a residential IP for live nseindia.com streaming.`
                : `NSE India endpoint returned HTTP ${res.status}.`,
            },
          };
        }

        const parsed = parseNseEquityRows(res.data, idxId, workingMap);
        for (const stock of parsed) {
          // Enrich O=L / O=H stocks with real 9:15-9:20 candle if available
          const isSignal =
            Math.abs(stock.open - stock.low) < 0.01 ||
            Math.abs(stock.open - stock.high) < 0.01;
          if (isSignal && !this.first5mCache.has(stock.symbol)) {
            const candle = await this.fetchFirst5mCandle(
              stock.symbol,
              stock.open
            );
            if (candle) {
              stock.first5mOpen = candle.first5mOpen;
              stock.first5mClose = candle.first5mClose;
              stock.first5mChangePct = candle.first5mChangePct;
            }
          }
          workingMap.set(stock.symbol, stock);
          updatedSymbols.add(stock.symbol);
        }
      }

      const indicesRes = await this.fetchJson<{ data?: NseAllIndicesRowRaw[] }>(
        '/api/allIndices'
      );
      const parsedIndices =
        indicesRes.ok && indicesRes.data?.data
          ? parseNseAllIndices(indicesRes.data.data)
          : [];

      const updatedStocks = Array.from(updatedSymbols)
        .map((sym) => workingMap.get(sym))
        .filter((s): s is StockQuote => Boolean(s));

      return {
        feedState: 'LIVE',
        result: {
          ok: true,
          httpStatus: lastStatus,
          updatedStocks,
          indices: parsedIndices,
          message: `Connected to nseindia.com live stream (${updatedStocks.length} NSE equities synced).`,
        },
      };
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Network error reaching nseindia.com';
      return {
        feedState: 'ERROR',
        result: {
          ok: false,
          httpStatus: 0,
          updatedStocks: [],
          indices: [],
          message: `NSE feed connection error: ${msg}`,
        },
      };
    }
  }
}
