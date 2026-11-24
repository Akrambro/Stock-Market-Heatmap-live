import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildColorBuckets,
  calculateFirst5mChangePct,
  calculateMarketBreadth,
  DEFAULT_COLOR_SCALE,
  filterAndSortStocks,
  getBucketForPct,
  getOpenSignal,
  getReadableTextColor,
  getShortlistedByIndex,
  NIFTY_INDICES,
  normalizeThresholds,
} from './heatmapLogic';
import type { HoldingEntry, StockQuote } from '../types/market';

const makeStock = (overrides: Partial<StockQuote>): StockQuote => ({
  symbol: 'TEST',
  name: 'Test Stock Ltd',
  sector: 'IT',
  indices: ['NIFTY_50', 'NIFTY_100', 'NIFTY_200', 'NIFTY_500'],
  prevClose: 1000,
  open: 1005,
  high: 1020,
  low: 998,
  ltp: 1010,
  change: 10,
  pctChange: 1.0,
  volume: 100000,
  marketCapCr: 50000,
  first5mOpen: 1005,
  first5mClose: 1012,
  first5mChangePct: 0.7,
  ...overrides,
});

test('NIFTY_INDICES includes NIFTY_500 and NIFTY_BANK', () => {
  const ids = NIFTY_INDICES.map((i) => i.id);
  assert.ok(ids.includes('NIFTY_500'));
  assert.ok(ids.includes('NIFTY_BANK'));
  assert.ok(ids.includes('NIFTY_MIDCAP_100'));
});

test('getOpenSignal identifies O=L, O=H, and neutral stocks accurately', () => {
  assert.equal(getOpenSignal(100.0, 105.0, 100.0), 'O=L');
  assert.equal(getOpenSignal(250.5, 250.5, 244.0), 'O=H');
  assert.equal(getOpenSignal(100.0, 104.0, 98.0), null);
  assert.equal(getOpenSignal(100.0, 100.0, 100.0), null);
});

test('calculateFirst5mChangePct computes 9:15-9:20 candle percentage accurately', () => {
  assert.equal(calculateFirst5mChangePct(1000, 1015), 1.5);
  assert.equal(calculateFirst5mChangePct(500, 492.5), -1.5);
  assert.equal(calculateFirst5mChangePct(0, 100), 0);
});

test('getShortlistedByIndex returns only O=L and O=H stocks for a given index', () => {
  const stocks: StockQuote[] = [
    makeStock({
      symbol: 'HDFCBANK',
      indices: ['NIFTY_50', 'NIFTY_500', 'NIFTY_BANK'],
      open: 1700,
      low: 1700,
      high: 1735,
      first5mOpen: 1700,
      first5mClose: 1717,
      first5mChangePct: 1.0,
    }),
    makeStock({
      symbol: 'INDUSINDBK',
      indices: ['NIFTY_50', 'NIFTY_500', 'NIFTY_BANK'],
      open: 1050,
      high: 1050,
      low: 1010,
      first5mOpen: 1050,
      first5mClose: 1034,
      first5mChangePct: -1.52,
    }),
    makeStock({
      symbol: 'SBIN',
      indices: ['NIFTY_50', 'NIFTY_500', 'NIFTY_BANK'],
      open: 800,
      high: 815,
      low: 792,
    }),
    makeStock({
      symbol: 'CDSL',
      indices: ['NIFTY_500'],
      open: 1500,
      low: 1500,
      high: 1550,
      first5mOpen: 1500,
      first5mClose: 1530,
      first5mChangePct: 2.0,
    }),
  ];

  const bankShortlist = getShortlistedByIndex(stocks, 'NIFTY_BANK', 'BOTH');
  assert.deepEqual(
    bankShortlist.map((r) => [r.stock.symbol, r.signal]),
    [
      ['HDFCBANK', 'O=L'],
      ['INDUSINDBK', 'O=H'],
    ]
  );

  const bankOlOnly = getShortlistedByIndex(stocks, 'NIFTY_BANK', 'O=L');
  assert.deepEqual(
    bankOlOnly.map((r) => r.stock.symbol),
    ['HDFCBANK']
  );

  const nifty500Shortlist = getShortlistedByIndex(stocks, 'NIFTY_500', 'BOTH');
  assert.equal(nifty500Shortlist.length, 3);
  assert.equal(nifty500Shortlist[0].stock.symbol, 'CDSL');
});

test('buildColorBuckets creates 11 TradeTiger buckets and matches pct changes cleanly', () => {
  const buckets = buildColorBuckets(DEFAULT_COLOR_SCALE);
  assert.equal(buckets.length, 11);
  assert.equal(buckets[0].label, '< -4%');
  assert.equal(buckets[5].label, '= 0%');
  assert.equal(buckets[10].label, '> 4%');

  assert.equal(getBucketForPct(-4.5, buckets).id, 'loss-4');
  assert.equal(getBucketForPct(-3.5, buckets).id, 'loss-3');
  assert.equal(getBucketForPct(-2.1, buckets).id, 'loss-2');
  assert.equal(getBucketForPct(-1.2, buckets).id, 'loss-1');
  assert.equal(getBucketForPct(-0.4, buckets).id, 'loss-0');
  assert.equal(getBucketForPct(0.0, buckets).id, 'flat');
  assert.equal(getBucketForPct(0.5, buckets).id, 'gain-0');
  assert.equal(getBucketForPct(1.5, buckets).id, 'gain-1');
  assert.equal(getBucketForPct(2.4, buckets).id, 'gain-2');
  assert.equal(getBucketForPct(3.4, buckets).id, 'gain-3');
  assert.equal(getBucketForPct(5.2, buckets).id, 'gain-4');
});

test('normalizeThresholds enforces ascending positive thresholds', () => {
  const normalized = normalizeThresholds([4, 1, 1, 2]);
  assert.deepEqual(normalized, [1, 1.5, 2, 4]);
});

test('getReadableTextColor chooses dark text on bright colors and white on dark colors', () => {
  assert.equal(getReadableTextColor('#29D629'), '#0B1120');
  assert.equal(getReadableTextColor('#6F1111'), '#FFFFFF');
});

test('filterAndSortStocks filters by index, Open=Low/High, bucket, and sorts descending', () => {
  const stocks: StockQuote[] = [
    makeStock({
      symbol: 'INFY',
      sector: 'IT',
      indices: ['NIFTY_50', 'NIFTY_500', 'NIFTY_IT'],
      open: 1500,
      low: 1500,
      high: 1550,
      ltp: 1545,
      pctChange: 3.0,
    }),
    makeStock({
      symbol: 'TCS',
      sector: 'IT',
      indices: ['NIFTY_50', 'NIFTY_500', 'NIFTY_IT'],
      open: 4000,
      high: 4000,
      low: 3920,
      ltp: 3930,
      pctChange: -1.75,
    }),
    makeStock({
      symbol: 'KPITTECH',
      sector: 'IT',
      indices: ['NIFTY_MIDCAP_100', 'NIFTY_500', 'NIFTY_IT'],
      open: 1400,
      low: 1400,
      high: 1480,
      ltp: 1470,
      pctChange: 5.0,
    }),
  ];

  const buckets = buildColorBuckets(DEFAULT_COLOR_SCALE);
  const watchlist = new Set<string>(['INFY']);
  const holdings = new Map<string, HoldingEntry>([
    ['TCS', { symbol: 'TCS', qty: 10, avgPrice: 3900 }],
  ]);

  const nifty500All = filterAndSortStocks(stocks, {
    viewMode: 'INDEX',
    selectedIndex: 'NIFTY_500',
    watchlistSet: watchlist,
    holdingsMap: holdings,
    sectorFilter: 'ALL',
    openSignalFilter: 'ALL',
    selectedBucketId: null,
    buckets,
    searchQuery: '',
    sortBy: 'PCT_DESC',
  });
  assert.deepEqual(
    nifty500All.map((s) => s.symbol),
    ['KPITTECH', 'INFY', 'TCS']
  );

  const bucketFilter = filterAndSortStocks(stocks, {
    viewMode: 'INDEX',
    selectedIndex: 'NIFTY_IT',
    watchlistSet: watchlist,
    holdingsMap: holdings,
    sectorFilter: 'ALL',
    openSignalFilter: 'ALL',
    selectedBucketId: 'loss-1',
    buckets,
    searchQuery: '',
    sortBy: 'PCT_DESC',
  });
  assert.deepEqual(
    bucketFilter.map((s) => s.symbol),
    ['TCS']
  );
});

test('calculateMarketBreadth tallies advances, declines, O=L, O=H, and portfolio P&L', () => {
  const stocks: StockQuote[] = [
    makeStock({
      symbol: 'A',
      open: 100,
      low: 100,
      high: 105,
      ltp: 104,
      pctChange: 4.0,
    }),
    makeStock({
      symbol: 'B',
      open: 200,
      high: 200,
      low: 194,
      ltp: 195,
      pctChange: -2.5,
    }),
    makeStock({
      symbol: 'C',
      open: 300,
      high: 302,
      low: 298,
      ltp: 300,
      pctChange: 0.0,
    }),
  ];
  const holdings = new Map<string, HoldingEntry>([
    ['A', { symbol: 'A', qty: 10, avgPrice: 100 }],
  ]);

  const breadth = calculateMarketBreadth(stocks, holdings);
  assert.equal(breadth.total, 3);
  assert.equal(breadth.advances, 1);
  assert.equal(breadth.declines, 1);
  assert.equal(breadth.unchanged, 1);
  assert.equal(breadth.openLowCount, 1);
  assert.equal(breadth.openHighCount, 1);
  assert.equal(breadth.portfolioValue, 1040);
  assert.equal(breadth.portfolioPnl, 40);
});
