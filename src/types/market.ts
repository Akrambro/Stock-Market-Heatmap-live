export type IndexId =
  | 'NIFTY_50'
  | 'NIFTY_100'
  | 'NIFTY_200'
  | 'NIFTY_500'
  | 'NIFTY_MIDCAP_100'
  | 'NIFTY_BANK'
  | 'NIFTY_IT'
  | 'NIFTY_AUTO'
  | 'NIFTY_PHARMA'
  | 'NIFTY_FMCG'
  | 'NIFTY_METAL';

export interface IndexMeta {
  id: IndexId;
  label: string;
  shortLabel: string;
  nseParam: string;
  description: string;
}

export type AppPage = 'HEATMAP' | 'SHORTLISTED';

export type ViewMode = 'INDEX' | 'WATCHLIST' | 'HOLDINGS';

export type OpenSignal = 'O=L' | 'O=H' | null;

export type OpenSignalFilter = 'ALL' | 'O=L' | 'O=H' | 'BOTH';

export type SortOption =
  | 'PCT_DESC'
  | 'PCT_ASC'
  | 'SYMBOL_ASC'
  | 'LTP_DESC'
  | 'VOLUME_DESC'
  | 'PNL_DESC';

export interface StockQuote {
  symbol: string;
  name: string;
  sector: string;
  indices: IndexId[];
  prevClose: number;
  open: number;
  high: number;
  low: number;
  ltp: number;
  change: number;
  pctChange: number;
  volume: number;
  marketCapCr: number;
  /** First 5-minute candle (09:15 - 09:20 IST) open price */
  first5mOpen: number;
  /** First 5-minute candle (09:15 - 09:20 IST) close price */
  first5mClose: number;
  /** First 5-minute candle (09:15 - 09:20 IST) gain/loss percentage */
  first5mChangePct: number;
  tickDirection?: 'up' | 'down' | 'flat';
  lastTickAt?: number;
}

export interface IndexTicker {
  id: string;
  label: string;
  ltp: number;
  change: number;
  pctChange: number;
}

export interface HoldingEntry {
  symbol: string;
  qty: number;
  avgPrice: number;
}

export type ColorScalePresetId =
  | 'TRADETIGER'
  | 'HIGH_CONTRAST'
  | 'COLORBLIND'
  | 'CUSTOM';

export interface ColorScaleColors {
  maxLoss: string;
  midLoss: string;
  minLoss: string;
  flat: string;
  minGain: string;
  midGain: string;
  maxGain: string;
}

export interface ColorScaleConfig {
  presetId: ColorScalePresetId;
  thresholds: [number, number, number, number];
  colors: ColorScaleColors;
}

export interface ColorBucket {
  id: string;
  label: string;
  bgHex: string;
  textHex: string;
  kind: 'loss' | 'flat' | 'gain';
  matches: (pctChange: number) => boolean;
}

export interface StockTickDelta {
  symbol: string;
  ltp: number;
  open: number;
  high: number;
  low: number;
  prevClose: number;
  change: number;
  pctChange: number;
  volume: number;
  first5mOpen: number;
  first5mClose: number;
  first5mChangePct: number;
  tickDirection: 'up' | 'down' | 'flat';
  lastTickAt: number;
}

export type NseFeedState = 'CONNECTING' | 'LIVE' | 'PAUSED' | 'BLOCKED' | 'ERROR';

export interface FeedStatusPayload {
  paused: boolean;
  pollIntervalMs: number;
  feedState: NseFeedState;
  lastHttpStatus: number | null;
  lastSuccessAt: number | null;
  lastAttemptAt: number | null;
  statusMessage: string;
}

export interface MarketSnapshotPayload {
  stocks: StockQuote[];
  indices: IndexTicker[];
  watchlist: string[];
  holdings: HoldingEntry[];
  feedStatus: FeedStatusPayload;
  serverTime: number;
}

export type WsServerMessage =
  | { type: 'snapshot'; payload: MarketSnapshotPayload }
  | {
      type: 'ticks';
      payload: {
        deltas: StockTickDelta[];
        newStocks?: StockQuote[];
        indices: IndexTicker[];
        serverTime: number;
      };
    }
  | {
      type: 'portfolio_update';
      payload: {
        watchlist: string[];
        holdings: HoldingEntry[];
      };
    }
  | {
      type: 'feed_status';
      payload: FeedStatusPayload;
    };

export type WsClientMessage =
  | { type: 'request_snapshot' }
  | { type: 'set_paused'; paused: boolean }
  | { type: 'set_speed'; pollIntervalMs: number }
  | { type: 'poll_nse_now' }
  | { type: 'toggle_watchlist'; symbol: string }
  | { type: 'upsert_holding'; symbol: string; qty: number; avgPrice: number }
  | { type: 'remove_holding'; symbol: string };
