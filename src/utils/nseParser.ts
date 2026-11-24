import type { IndexId, IndexTicker, StockQuote } from '../types/market.ts';

export interface NseIndexRowRaw {
  symbol?: string;
  identifier?: string;
  open?: number;
  dayHigh?: number;
  dayLow?: number;
  lastPrice?: number;
  previousClose?: number;
  change?: number;
  pChange?: number;
  totalTradedVolume?: number;
  ffmc?: number;
  meta?: {
    companyName?: string;
    industry?: string;
  };
}

export interface NseIndexResponseRaw {
  name?: string;
  data?: NseIndexRowRaw[];
}

export interface NseAllIndicesRowRaw {
  index?: string;
  indexSymbol?: string;
  last?: number;
  variation?: number;
  percentChange?: number;
}

export function parseNseEquityRows(
  payload: NseIndexResponseRaw,
  targetIndexId: IndexId,
  existingMap: Map<string, StockQuote>
): StockQuote[] {
  if (!payload || !Array.isArray(payload.data)) return [];

  const now = Date.now();
  const parsed: StockQuote[] = [];

  for (const row of payload.data) {
    const symbol = typeof row.symbol === 'string' ? row.symbol.trim() : '';
    // Skip the index summary row itself (e.g., "NIFTY 50", "NIFTY 500")
    if (!symbol || symbol.includes(' ') || symbol.startsWith('NIFTY')) {
      continue;
    }

    const prevClose = Number(row.previousClose ?? 0);
    const open = Number(row.open ?? 0);
    const high = Number(row.dayHigh ?? 0);
    const low = Number(row.dayLow ?? 0);
    const ltp = Number(row.lastPrice ?? 0);

    if (!Number.isFinite(ltp) || ltp <= 0) continue;

    const existing = existingMap.get(symbol);
    const changeVal =
      typeof row.change === 'number' && Number.isFinite(row.change)
        ? row.change
        : ltp - prevClose;
    const change = Number(changeVal.toFixed(2));
    const pctVal =
      typeof row.pChange === 'number' && Number.isFinite(row.pChange)
        ? row.pChange
        : prevClose > 0
        ? ((ltp - prevClose) / prevClose) * 100
        : 0;
    const pctChange = Number(pctVal.toFixed(2));

    const mergedIndices = existing
      ? Array.from(new Set([...existing.indices, targetIndexId]))
      : [targetIndexId];

    // If we don't yet have a 09:20 candle close from chart API, initialize 9:15 open cleanly
    const first5mOpen =
      existing && existing.first5mOpen > 0 ? existing.first5mOpen : open;
    const first5mClose =
      existing && existing.first5mClose > 0 ? existing.first5mClose : ltp;
    const first5mChangePct =
      first5mOpen > 0
        ? Number(
            (((first5mClose - first5mOpen) / first5mOpen) * 100).toFixed(2)
          )
        : 0;

    const tickDirection: 'up' | 'down' | 'flat' = existing
      ? ltp > existing.ltp
        ? 'up'
        : ltp < existing.ltp
        ? 'down'
        : 'flat'
      : 'flat';

    parsed.push({
      symbol,
      name: row.meta?.companyName || existing?.name || symbol,
      sector: row.meta?.industry || existing?.sector || 'Equity',
      indices: mergedIndices,
      prevClose: prevClose > 0 ? prevClose : existing?.prevClose ?? ltp,
      open: open > 0 ? open : existing?.open ?? ltp,
      high: high > 0 ? high : existing?.high ?? ltp,
      low: low > 0 ? low : existing?.low ?? ltp,
      ltp,
      change,
      pctChange,
      volume: Number(row.totalTradedVolume ?? existing?.volume ?? 0),
      marketCapCr:
        Number.isFinite(row.ffmc) && (row.ffmc ?? 0) > 0
          ? Math.round((row.ffmc ?? 0) / 1e7)
          : existing?.marketCapCr ?? 10000,
      first5mOpen,
      first5mClose,
      first5mChangePct,
      tickDirection,
      lastTickAt: now,
    });
  }

  return parsed;
}

export function parseNseAllIndices(rows: NseAllIndicesRowRaw[]): IndexTicker[] {
  const WANTED: Record<string, { id: string; label: string }> = {
    'NIFTY 50': { id: 'NIFTY_50', label: 'NIFTY 50' },
    'NIFTY 500': { id: 'NIFTY_500', label: 'NIFTY 500' },
    'NIFTY BANK': { id: 'NIFTY_BANK', label: 'NIFTY BANK' },
    'NIFTY IT': { id: 'NIFTY_IT', label: 'NIFTY IT' },
    'NIFTY MIDCAP 100': { id: 'NIFTY_MIDCAP_100', label: 'MIDCAP 100' },
  };

  const result: IndexTicker[] = [];
  for (const row of rows) {
    const key = row.indexSymbol || row.index || '';
    const meta = WANTED[key];
    if (!meta || !Number.isFinite(row.last)) continue;
    result.push({
      id: meta.id,
      label: meta.label,
      ltp: Number((row.last ?? 0).toFixed(2)),
      change: Number((row.variation ?? 0).toFixed(2)),
      pctChange: Number((row.percentChange ?? 0).toFixed(2)),
    });
  }
  return result;
}

/**
 * Extracts the first 5-minute candle (09:15 - 09:20 IST) gain/loss % from NSE intraday chart points:
 * NSE chart-databyindex returns `grapthData: [[timestampMs, price], ...]`.
 */
export function extractFirst5mCandleFromChart(
  points: [number, number][],
  dayOpen: number
): { first5mOpen: number; first5mClose: number; first5mChangePct: number } | null {
  if (!Array.isArray(points) || points.length === 0) return null;

  // Group into IST (UTC+5:30) time of day minutes from midnight
  let firstPrice = dayOpen > 0 ? dayOpen : points[0][1];
  let close920 = points[0][1];

  for (const [tsMs, price] of points) {
    if (!Number.isFinite(tsMs) || !Number.isFinite(price) || price <= 0) {
      continue;
    }
    const istDate = new Date(tsMs + 330 * 60 * 1000);
    const minutes = istDate.getUTCHours() * 60 + istDate.getUTCMinutes();
    if (minutes >= 9 * 60 + 15 && minutes <= 9 * 60 + 20) {
      close920 = price;
    } else if (minutes > 9 * 60 + 20) {
      break;
    }
  }

  if (firstPrice <= 0) return null;
  const pct = Number((((close920 - firstPrice) / firstPrice) * 100).toFixed(2));
  return {
    first5mOpen: Number(firstPrice.toFixed(2)),
    first5mClose: Number(close920.toFixed(2)),
    first5mChangePct: pct,
  };
}
