import type {
  ColorBucket,
  ColorScaleConfig,
  ColorScalePresetId,
  HoldingEntry,
  IndexId,
  IndexMeta,
  OpenSignal,
  OpenSignalFilter,
  SortOption,
  StockQuote,
  ViewMode,
} from '../types/market';

export const NIFTY_INDICES: IndexMeta[] = [
  {
    id: 'NIFTY_50',
    label: 'NIFTY 50',
    shortLabel: 'NIFTY 50',
    nseParam: 'NIFTY 50',
    description: 'Flagship 50 large-cap NSE benchmark constituents',
  },
  {
    id: 'NIFTY_100',
    label: 'NIFTY 100',
    shortLabel: 'NIFTY 100',
    nseParam: 'NIFTY 100',
    description: 'Large-cap universe (NIFTY 50 + NIFTY Next 50)',
  },
  {
    id: 'NIFTY_200',
    label: 'NIFTY 200',
    shortLabel: 'NIFTY 200',
    nseParam: 'NIFTY 200',
    description: 'Broad large & mid-cap NSE 200 constituents',
  },
  {
    id: 'NIFTY_500',
    label: 'NIFTY 500',
    shortLabel: 'NIFTY 500',
    nseParam: 'NIFTY 500',
    description: 'Broad-market NSE 500 large, mid & small-cap constituents',
  },
  {
    id: 'NIFTY_MIDCAP_100',
    label: 'NIFTY MIDCAP 100',
    shortLabel: 'MIDCAP 100',
    nseParam: 'NIFTY MIDCAP 100',
    description: 'High-beta mid-sector growth stocks',
  },
  {
    id: 'NIFTY_BANK',
    label: 'NIFTY BANK',
    shortLabel: 'BANK NIFTY',
    nseParam: 'NIFTY BANK',
    description: 'Private & PSU banking leaders',
  },
  {
    id: 'NIFTY_IT',
    label: 'NIFTY IT',
    shortLabel: 'NIFTY IT',
    nseParam: 'NIFTY IT',
    description: 'Software services & digital engineering exporters',
  },
  {
    id: 'NIFTY_AUTO',
    label: 'NIFTY AUTO',
    shortLabel: 'NIFTY AUTO',
    nseParam: 'NIFTY AUTO',
    description: 'OEMs, EV mobility & auto ancillaries',
  },
  {
    id: 'NIFTY_PHARMA',
    label: 'NIFTY PHARMA',
    shortLabel: 'PHARMA',
    nseParam: 'NIFTY PHARMA',
    description: 'Formulations, APIs & healthcare',
  },
  {
    id: 'NIFTY_FMCG',
    label: 'NIFTY FMCG',
    shortLabel: 'FMCG',
    nseParam: 'NIFTY FMCG',
    description: 'Consumer staples & household brands',
  },
  {
    id: 'NIFTY_METAL',
    label: 'NIFTY METAL',
    shortLabel: 'METAL',
    nseParam: 'NIFTY METAL',
    description: 'Ferrous, non-ferrous metals & mining',
  },
];

export const COLOR_SCALE_PRESETS: Record<
  Exclude<ColorScalePresetId, 'CUSTOM'>,
  { name: string; config: ColorScaleConfig }
> = {
  TRADETIGER: {
    name: 'TradeTiger Classic',
    config: {
      presetId: 'TRADETIGER',
      thresholds: [1, 2, 3, 4],
      colors: {
        maxLoss: '#6F1111',
        midLoss: '#B32424',
        minLoss: '#E13B3B',
        flat: '#525866',
        minGain: '#29D629',
        midGain: '#0E8A1A',
        maxGain: '#0A5414',
      },
    },
  },
  HIGH_CONTRAST: {
    name: 'Terminal Crimson & Emerald',
    config: {
      presetId: 'HIGH_CONTRAST',
      thresholds: [0.5, 1.5, 3, 5],
      colors: {
        maxLoss: '#7F1D1D',
        midLoss: '#DC2626',
        minLoss: '#F87171',
        flat: '#475569',
        minGain: '#34D399',
        midGain: '#059669',
        maxGain: '#064E3B',
      },
    },
  },
  COLORBLIND: {
    name: 'Blue / Amber Accessible',
    config: {
      presetId: 'COLORBLIND',
      thresholds: [1, 2, 3, 4],
      colors: {
        maxLoss: '#7C2D12',
        midLoss: '#D97706',
        minLoss: '#F59E0B',
        flat: '#475569',
        minGain: '#38BDF8',
        midGain: '#0284C7',
        maxGain: '#0C4A6E',
      },
    },
  },
};

export const DEFAULT_COLOR_SCALE: ColorScaleConfig =
  COLOR_SCALE_PRESETS.TRADETIGER.config;

function clampByte(n: number): number {
  return Math.max(0, Math.min(255, Math.round(n)));
}

export function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '').trim();
  const full =
    clean.length === 3
      ? clean
          .split('')
          .map((c) => c + c)
          .join('')
      : clean.padEnd(6, '0').slice(0, 6);
  const num = Number.parseInt(full, 16);
  if (Number.isNaN(num)) return [71, 85, 105];
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

export function rgbToHex(r: number, g: number, b: number): string {
  return (
    '#' +
    [clampByte(r), clampByte(g), clampByte(b)]
      .map((x) => x.toString(16).padStart(2, '0'))
      .join('')
  );
}

export function interpolateHex(hexA: string, hexB: string, t: number): string {
  const [r1, g1, b1] = hexToRgb(hexA);
  const [r2, g2, b2] = hexToRgb(hexB);
  const ratio = Math.max(0, Math.min(1, t));
  return rgbToHex(
    r1 + (r2 - r1) * ratio,
    g1 + (g2 - g1) * ratio,
    b1 + (b2 - b1) * ratio
  );
}

export function getReadableTextColor(bgHex: string): string {
  const [r, g, b] = hexToRgb(bgHex);
  const toLinear = (v: number) => {
    const srgb = v / 255;
    return srgb <= 0.03928
      ? srgb / 12.92
      : Math.pow((srgb + 0.055) / 1.055, 2.4);
  };
  const lum =
    0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
  const contrastWhite = 1.05 / (lum + 0.05);
  const contrastDark = (lum + 0.05) / (0.0085 + 0.05);
  return contrastDark > contrastWhite ? '#0B1120' : '#FFFFFF';
}

export function getOpenSignal(
  open: number,
  high: number,
  low: number
): OpenSignal {
  if (open <= 0 || high <= 0 || low <= 0) return null;
  if (Math.abs(high - low) < 0.01) return null;

  const isOpenLow = Math.abs(open - low) < 0.01;
  const isOpenHigh = Math.abs(open - high) < 0.01;

  if (isOpenLow && !isOpenHigh) return 'O=L';
  if (isOpenHigh && !isOpenLow) return 'O=H';
  return null;
}

/**
 * Calculates percentage gain/loss for the first 5-minute candle (09:15 - 09:20 IST).
 */
export function calculateFirst5mChangePct(
  open915: number,
  close920: number
): number {
  if (!Number.isFinite(open915) || open915 <= 0 || !Number.isFinite(close920)) {
    return 0;
  }
  return Number((((close920 - open915) / open915) * 100).toFixed(2));
}

export function normalizeThresholds(
  raw: [number, number, number, number]
): [number, number, number, number] {
  const sanitized = raw
    .map((v) => (Number.isFinite(v) && v > 0 ? Number(v.toFixed(2)) : 1))
    .sort((a, b) => a - b);
  for (let i = 1; i < sanitized.length; i++) {
    if (sanitized[i] <= sanitized[i - 1]) {
      sanitized[i] = Number((sanitized[i - 1] + 0.5).toFixed(2));
    }
  }
  return [sanitized[0], sanitized[1], sanitized[2], sanitized[3]];
}

function formatPctThreshold(val: number): string {
  return Number.isInteger(val) ? `${val}%` : `${val.toFixed(1)}%`;
}

export function buildColorBuckets(config: ColorScaleConfig): ColorBucket[] {
  const [t1, t2, t3, t4] = normalizeThresholds(config.thresholds);
  const { maxLoss, midLoss, minLoss, flat, minGain, midGain, maxGain } =
    config.colors;

  const lossColors = [
    maxLoss,
    interpolateHex(maxLoss, midLoss, 0.5),
    midLoss,
    interpolateHex(midLoss, minLoss, 0.5),
    minLoss,
  ];
  const gainColors = [
    minGain,
    interpolateHex(minGain, midGain, 0.5),
    midGain,
    interpolateHex(midGain, maxGain, 0.5),
    maxGain,
  ];

  const FLAT_EPS = 0.005;

  return [
    {
      id: 'loss-4',
      label: `< -${formatPctThreshold(t4)}`,
      bgHex: lossColors[0],
      textHex: getReadableTextColor(lossColors[0]),
      kind: 'loss',
      matches: (pct) => pct < -t4,
    },
    {
      id: 'loss-3',
      label: `< -${formatPctThreshold(t3)}`,
      bgHex: lossColors[1],
      textHex: getReadableTextColor(lossColors[1]),
      kind: 'loss',
      matches: (pct) => pct >= -t4 && pct < -t3,
    },
    {
      id: 'loss-2',
      label: `< -${formatPctThreshold(t2)}`,
      bgHex: lossColors[2],
      textHex: getReadableTextColor(lossColors[2]),
      kind: 'loss',
      matches: (pct) => pct >= -t3 && pct < -t2,
    },
    {
      id: 'loss-1',
      label: `< -${formatPctThreshold(t1)}`,
      bgHex: lossColors[3],
      textHex: getReadableTextColor(lossColors[3]),
      kind: 'loss',
      matches: (pct) => pct >= -t2 && pct < -t1,
    },
    {
      id: 'loss-0',
      label: '< 0%',
      bgHex: lossColors[4],
      textHex: getReadableTextColor(lossColors[4]),
      kind: 'loss',
      matches: (pct) => pct >= -t1 && pct <= -FLAT_EPS,
    },
    {
      id: 'flat',
      label: '= 0%',
      bgHex: flat,
      textHex: getReadableTextColor(flat),
      kind: 'flat',
      matches: (pct) => Math.abs(pct) < FLAT_EPS,
    },
    {
      id: 'gain-0',
      label: '> 0%',
      bgHex: gainColors[0],
      textHex: getReadableTextColor(gainColors[0]),
      kind: 'gain',
      matches: (pct) => pct >= FLAT_EPS && pct <= t1,
    },
    {
      id: 'gain-1',
      label: `> ${formatPctThreshold(t1)}`,
      bgHex: gainColors[1],
      textHex: getReadableTextColor(gainColors[1]),
      kind: 'gain',
      matches: (pct) => pct > t1 && pct <= t2,
    },
    {
      id: 'gain-2',
      label: `> ${formatPctThreshold(t2)}`,
      bgHex: gainColors[2],
      textHex: getReadableTextColor(gainColors[2]),
      kind: 'gain',
      matches: (pct) => pct > t2 && pct <= t3,
    },
    {
      id: 'gain-3',
      label: `> ${formatPctThreshold(t3)}`,
      bgHex: gainColors[3],
      textHex: getReadableTextColor(gainColors[3]),
      kind: 'gain',
      matches: (pct) => pct > t3 && pct <= t4,
    },
    {
      id: 'gain-4',
      label: `> ${formatPctThreshold(t4)}`,
      bgHex: gainColors[4],
      textHex: getReadableTextColor(gainColors[4]),
      kind: 'gain',
      matches: (pct) => pct > t4,
    },
  ];
}

export function getBucketForPct(
  pctChange: number,
  buckets: ColorBucket[]
): ColorBucket {
  for (const bucket of buckets) {
    if (bucket.matches(pctChange)) return bucket;
  }
  return buckets[Math.floor(buckets.length / 2)];
}

export interface FilterAndSortOptions {
  viewMode: ViewMode;
  selectedIndex: IndexId;
  watchlistSet: Set<string>;
  holdingsMap: Map<string, HoldingEntry>;
  sectorFilter: string;
  openSignalFilter: OpenSignalFilter;
  selectedBucketId: string | null;
  buckets: ColorBucket[];
  searchQuery: string;
  sortBy: SortOption;
}

export function filterStocksByScope(
  stocks: StockQuote[],
  viewMode: ViewMode,
  selectedIndex: IndexId,
  watchlistSet: Set<string>,
  holdingsMap: Map<string, HoldingEntry>
): StockQuote[] {
  if (viewMode === 'WATCHLIST') {
    return stocks.filter((s) => watchlistSet.has(s.symbol));
  }
  if (viewMode === 'HOLDINGS') {
    return stocks.filter((s) => holdingsMap.has(s.symbol));
  }
  return stocks.filter((s) => s.indices.includes(selectedIndex));
}

export function filterAndSortStocks(
  stocks: StockQuote[],
  options: FilterAndSortOptions
): StockQuote[] {
  const scoped = filterStocksByScope(
    stocks,
    options.viewMode,
    options.selectedIndex,
    options.watchlistSet,
    options.holdingsMap
  );

  const query = options.searchQuery.trim().toLowerCase();
  const activeBucket = options.selectedBucketId
    ? options.buckets.find((b) => b.id === options.selectedBucketId) ?? null
    : null;

  const filtered = scoped.filter((stock) => {
    if (
      options.sectorFilter !== 'ALL' &&
      stock.sector !== options.sectorFilter
    ) {
      return false;
    }

    if (options.openSignalFilter !== 'ALL') {
      const sig = getOpenSignal(stock.open, stock.high, stock.low);
      if (options.openSignalFilter === 'O=L' && sig !== 'O=L') return false;
      if (options.openSignalFilter === 'O=H' && sig !== 'O=H') return false;
      if (options.openSignalFilter === 'BOTH' && sig === null) return false;
    }

    if (activeBucket && !activeBucket.matches(stock.pctChange)) {
      return false;
    }

    if (query.length > 0) {
      const symMatch = stock.symbol.toLowerCase().includes(query);
      const nameMatch = stock.name.toLowerCase().includes(query);
      const sectorMatch = stock.sector.toLowerCase().includes(query);
      if (!symMatch && !nameMatch && !sectorMatch) return false;
    }

    return true;
  });

  const sorted = [...filtered];
  sorted.sort((a, b) => {
    switch (options.sortBy) {
      case 'PCT_DESC':
        return b.pctChange - a.pctChange || a.symbol.localeCompare(b.symbol);
      case 'PCT_ASC':
        return a.pctChange - b.pctChange || a.symbol.localeCompare(b.symbol);
      case 'SYMBOL_ASC':
        return a.symbol.localeCompare(b.symbol);
      case 'LTP_DESC':
        return b.ltp - a.ltp || a.symbol.localeCompare(b.symbol);
      case 'VOLUME_DESC':
        return b.volume - a.volume || a.symbol.localeCompare(b.symbol);
      case 'PNL_DESC': {
        const hA = options.holdingsMap.get(a.symbol);
        const hB = options.holdingsMap.get(b.symbol);
        const pnlA = hA ? (a.ltp - hA.avgPrice) * hA.qty : -Infinity;
        const pnlB = hB ? (b.ltp - hB.avgPrice) * hB.qty : -Infinity;
        return pnlB - pnlA || b.pctChange - a.pctChange;
      }
    }
  });

  return sorted;
}

export interface ShortlistedRow {
  stock: StockQuote;
  signal: 'O=L' | 'O=H';
}

export function getShortlistedByIndex(
  stocks: StockQuote[],
  indexId: IndexId,
  signalFilter: OpenSignalFilter = 'BOTH',
  searchQuery = ''
): ShortlistedRow[] {
  const q = searchQuery.trim().toLowerCase();
  const rows: ShortlistedRow[] = [];

  for (const stock of stocks) {
    if (!stock.indices.includes(indexId)) continue;
    const sig = getOpenSignal(stock.open, stock.high, stock.low);
    if (!sig) continue;
    if (signalFilter === 'O=L' && sig !== 'O=L') continue;
    if (signalFilter === 'O=H' && sig !== 'O=H') continue;
    if (
      q.length > 0 &&
      !stock.symbol.toLowerCase().includes(q) &&
      !stock.name.toLowerCase().includes(q) &&
      !stock.sector.toLowerCase().includes(q)
    ) {
      continue;
    }
    rows.push({ stock, signal: sig });
  }

  rows.sort((a, b) => {
    if (a.signal !== b.signal) {
      return a.signal === 'O=L' ? -1 : 1;
    }
    return (
      Math.abs(b.stock.first5mChangePct) - Math.abs(a.stock.first5mChangePct) ||
      a.stock.symbol.localeCompare(b.stock.symbol)
    );
  });

  return rows;
}

export interface MarketBreadth {
  total: number;
  advances: number;
  declines: number;
  unchanged: number;
  openLowCount: number;
  openHighCount: number;
  portfolioValue: number;
  portfolioPnl: number;
}

export function calculateMarketBreadth(
  stocks: StockQuote[],
  holdingsMap: Map<string, HoldingEntry>
): MarketBreadth {
  let advances = 0;
  let declines = 0;
  let unchanged = 0;
  let openLowCount = 0;
  let openHighCount = 0;
  let portfolioValue = 0;
  let portfolioPnl = 0;

  for (const s of stocks) {
    if (s.pctChange >= 0.005) advances++;
    else if (s.pctChange <= -0.005) declines++;
    else unchanged++;

    const sig = getOpenSignal(s.open, s.high, s.low);
    if (sig === 'O=L') openLowCount++;
    if (sig === 'O=H') openHighCount++;

    const holding = holdingsMap.get(s.symbol);
    if (holding) {
      portfolioValue += s.ltp * holding.qty;
      portfolioPnl += (s.ltp - holding.avgPrice) * holding.qty;
    }
  }

  return {
    total: stocks.length,
    advances,
    declines,
    unchanged,
    openLowCount,
    openHighCount,
    portfolioValue,
    portfolioPnl,
  };
}

export function formatInr(value: number): string {
  return value.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatCompactVolume(vol: number): string {
  if (vol >= 1_00_00_000) return `${(vol / 1_00_00_000).toFixed(2)} Cr`;
  if (vol >= 1_00_000) return `${(vol / 1_00_000).toFixed(2)} L`;
  if (vol >= 1_000) return `${(vol / 1_000).toFixed(1)} K`;
  return String(vol);
}
