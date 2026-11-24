import type {
  FeedStatusPayload,
  HoldingEntry,
  IndexTicker,
  MarketSnapshotPayload,
  NseFeedState,
  StockQuote,
  StockTickDelta,
} from '../src/types/market.ts';
import {
  buildInitialStocks,
  INITIAL_HOLDINGS,
  INITIAL_WATCHLIST,
} from './marketData.ts';
import { NseFeedAdapter } from './nseFeedAdapter.ts';

export class MarketEngine {
  private stocks: StockQuote[];
  private stockMap: Map<string, StockQuote>;
  private liveIndices: IndexTicker[] | null = null;
  private watchlist: Set<string>;
  private holdings: Map<string, HoldingEntry>;
  private paused = false;
  private pollIntervalMs = 3000;
  private feedState: NseFeedState = 'CONNECTING';
  private lastHttpStatus: number | null = null;
  private lastSuccessAt: number | null = null;
  private lastAttemptAt: number | null = null;
  private statusMessage = 'Connecting to nseindia.com live session...';
  private timer: ReturnType<typeof setTimeout> | null = null;
  private isPolling = false;
  private nseAdapter = new NseFeedAdapter();

  private onTickBroadcast: (payload: {
    deltas: StockTickDelta[];
    newStocks?: StockQuote[];
    indices: IndexTicker[];
    serverTime: number;
  }) => void;
  private onStatusBroadcast: (status: FeedStatusPayload) => void;

  constructor(
    onTickBroadcast: (payload: {
      deltas: StockTickDelta[];
      newStocks?: StockQuote[];
      indices: IndexTicker[];
      serverTime: number;
    }) => void,
    onStatusBroadcast: (status: FeedStatusPayload) => void
  ) {
    this.onTickBroadcast = onTickBroadcast;
    this.onStatusBroadcast = onStatusBroadcast;
    this.stocks = buildInitialStocks();
    this.stockMap = new Map(this.stocks.map((s) => [s.symbol, s]));
    this.watchlist = new Set(INITIAL_WATCHLIST);
    this.holdings = new Map(INITIAL_HOLDINGS.map((h) => [h.symbol, h]));
  }

  start(): void {
    this.stop();
    void this.pollNow();
  }

  stop(): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  private scheduleNextPoll(): void {
    this.stop();
    if (this.paused) return;
    // Back off to 60s when Akamai WAF blocks this cloud IP so we don't spam NSE
    const delay =
      this.feedState === 'BLOCKED' ? 60_000 : this.pollIntervalMs;
    this.timer = setTimeout(() => {
      void this.pollNow();
    }, delay);
  }

  async pollNow(): Promise<void> {
    if (this.isPolling) return;
    this.isPolling = true;
    this.lastAttemptAt = Date.now();

    try {
      const { feedState, result } = await this.nseAdapter.pollAllIndices(
        this.stockMap
      );
      this.feedState = this.paused ? 'PAUSED' : feedState;
      this.lastHttpStatus = result.httpStatus;
      this.statusMessage = result.message;

      if (result.ok) {
        this.lastSuccessAt = Date.now();
        if (result.indices.length > 0) {
          this.liveIndices = result.indices;
        }

        const deltas: StockTickDelta[] = [];
        const newStocks: StockQuote[] = [];

        for (const incoming of result.updatedStocks) {
          const prev = this.stockMap.get(incoming.symbol);
          if (!prev) {
            this.stockMap.set(incoming.symbol, incoming);
            this.stocks.push(incoming);
            newStocks.push(incoming);
          } else {
            const changed =
              prev.ltp !== incoming.ltp ||
              prev.volume !== incoming.volume ||
              prev.high !== incoming.high ||
              prev.low !== incoming.low ||
              prev.indices.length !== incoming.indices.length;

            this.stockMap.set(incoming.symbol, incoming);
            const idx = this.stocks.findIndex(
              (s) => s.symbol === incoming.symbol
            );
            if (idx >= 0) this.stocks[idx] = incoming;

            if (changed) {
              deltas.push({
                symbol: incoming.symbol,
                ltp: incoming.ltp,
                open: incoming.open,
                high: incoming.high,
                low: incoming.low,
                prevClose: incoming.prevClose,
                change: incoming.change,
                pctChange: incoming.pctChange,
                volume: incoming.volume,
                first5mOpen: incoming.first5mOpen,
                first5mClose: incoming.first5mClose,
                first5mChangePct: incoming.first5mChangePct,
                tickDirection: incoming.tickDirection ?? 'flat',
                lastTickAt: incoming.lastTickAt ?? Date.now(),
              });
            }
          }
        }

        if (deltas.length > 0 || newStocks.length > 0) {
          this.onTickBroadcast({
            deltas,
            newStocks: newStocks.length > 0 ? newStocks : undefined,
            indices: this.computeIndexTickers(),
            serverTime: Date.now(),
          });
        }
      }

      this.onStatusBroadcast(this.getFeedStatus());
    } finally {
      this.isPolling = false;
      this.scheduleNextPoll();
    }
  }

  setPaused(paused: boolean): void {
    this.paused = paused;
    if (paused) {
      this.feedState = 'PAUSED';
      this.stop();
      this.onStatusBroadcast(this.getFeedStatus());
    } else {
      this.feedState = 'CONNECTING';
      this.onStatusBroadcast(this.getFeedStatus());
      void this.pollNow();
    }
  }

  setPollInterval(ms: number): void {
    this.pollIntervalMs = Math.max(1500, Math.min(15000, Math.round(ms)));
    this.onStatusBroadcast(this.getFeedStatus());
    if (!this.paused) {
      this.scheduleNextPoll();
    }
  }

  getFeedStatus(): FeedStatusPayload {
    return {
      paused: this.paused,
      pollIntervalMs: this.pollIntervalMs,
      feedState: this.feedState,
      lastHttpStatus: this.lastHttpStatus,
      lastSuccessAt: this.lastSuccessAt,
      lastAttemptAt: this.lastAttemptAt,
      statusMessage: this.statusMessage,
    };
  }

  toggleWatchlist(symbol: string): {
    watchlist: string[];
    holdings: HoldingEntry[];
  } {
    if (this.stockMap.has(symbol)) {
      if (this.watchlist.has(symbol)) {
        this.watchlist.delete(symbol);
      } else {
        this.watchlist.add(symbol);
      }
    }
    return this.getPortfolioState();
  }

  upsertHolding(
    symbol: string,
    qty: number,
    avgPrice: number
  ): { watchlist: string[]; holdings: HoldingEntry[] } {
    if (
      this.stockMap.has(symbol) &&
      Number.isFinite(qty) &&
      qty > 0 &&
      Number.isFinite(avgPrice) &&
      avgPrice > 0
    ) {
      this.holdings.set(symbol, {
        symbol,
        qty: Math.round(qty),
        avgPrice: Number(avgPrice.toFixed(2)),
      });
    }
    return this.getPortfolioState();
  }

  removeHolding(symbol: string): {
    watchlist: string[];
    holdings: HoldingEntry[];
  } {
    this.holdings.delete(symbol);
    return this.getPortfolioState();
  }

  getPortfolioState(): { watchlist: string[]; holdings: HoldingEntry[] } {
    return {
      watchlist: Array.from(this.watchlist),
      holdings: Array.from(this.holdings.values()),
    };
  }

  getSnapshot(): MarketSnapshotPayload {
    return {
      stocks: this.stocks,
      indices: this.computeIndexTickers(),
      watchlist: Array.from(this.watchlist),
      holdings: Array.from(this.holdings.values()),
      feedStatus: this.getFeedStatus(),
      serverTime: Date.now(),
    };
  }

  private computeIndexTickers(): IndexTicker[] {
    if (this.liveIndices && this.liveIndices.length > 0) {
      return this.liveIndices;
    }

    const calcWeightedPct = (indexId: StockQuote['indices'][number]) => {
      let weightedSum = 0;
      let totalCap = 0;
      for (const s of this.stocks) {
        if (s.indices.includes(indexId)) {
          weightedSum += s.pctChange * s.marketCapCr;
          totalCap += s.marketCapCr;
        }
      }
      return totalCap > 0 ? weightedSum / totalCap : 0;
    };

    const mk = (id: StockQuote['indices'][number], label: string, base: number) => {
      const pct = Number(calcWeightedPct(id).toFixed(2));
      const ltp = Number((base * (1 + pct / 100)).toFixed(2));
      return {
        id,
        label,
        ltp,
        change: Number((ltp - base).toFixed(2)),
        pctChange: pct,
      };
    };

    return [
      mk('NIFTY_50', 'NIFTY 50', 24180.5),
      mk('NIFTY_500', 'NIFTY 500', 22410.2),
      mk('NIFTY_BANK', 'NIFTY BANK', 51840.0),
      mk('NIFTY_IT', 'NIFTY IT', 42910.0),
      mk('NIFTY_MIDCAP_100', 'MIDCAP 100', 56420.0),
    ];
  }
}
