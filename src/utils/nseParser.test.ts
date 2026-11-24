import test from 'node:test';
import assert from 'node:assert/strict';
import {
  extractFirst5mCandleFromChart,
  parseNseAllIndices,
  parseNseEquityRows,
} from './nseParser';
import type { StockQuote } from '../types/market';

test('parseNseEquityRows parses NSE index JSON and skips summary index row', () => {
  const existing = new Map<string, StockQuote>();
  const rows = parseNseEquityRows(
    {
      name: 'NIFTY 500',
      data: [
        {
          symbol: 'NIFTY 500',
          lastPrice: 22450,
          previousClose: 22300,
        },
        {
          symbol: 'RELIANCE',
          open: 1295,
          dayHigh: 1320,
          dayLow: 1295,
          lastPrice: 1315,
          previousClose: 1290,
          change: 25,
          pChange: 1.94,
          totalTradedVolume: 4500000,
          meta: {
            companyName: 'Reliance Industries Limited',
            industry: 'Oil Gas & Consumable Fuels',
          },
        },
      ],
    },
    'NIFTY_500',
    existing
  );

  assert.equal(rows.length, 1);
  assert.equal(rows[0].symbol, 'RELIANCE');
  assert.equal(rows[0].pctChange, 1.94);
  assert.deepEqual(rows[0].indices, ['NIFTY_500']);
});

test('parseNseAllIndices extracts key benchmark indices', () => {
  const tickers = parseNseAllIndices([
    { indexSymbol: 'NIFTY 50', last: 24210.5, variation: 120.2, percentChange: 0.5 },
    { indexSymbol: 'NIFTY 500', last: 22510.1, variation: 180.0, percentChange: 0.81 },
    { indexSymbol: 'NIFTY BANK', last: 51900.0, variation: -110.5, percentChange: -0.21 },
  ]);

  assert.equal(tickers.length, 3);
  assert.equal(tickers[1].id, 'NIFTY_500');
  assert.equal(tickers[2].pctChange, -0.21);
});

test('extractFirst5mCandleFromChart computes 9:15 to 9:20 IST candle move', () => {
  // 2026-11-23 09:15 IST = 03:45 UTC
  const t915 = Date.UTC(2026, 10, 23, 3, 45, 0);
  const t918 = Date.UTC(2026, 10, 23, 3, 48, 0);
  const t920 = Date.UTC(2026, 10, 23, 3, 50, 0);
  const t925 = Date.UTC(2026, 10, 23, 3, 55, 0);

  const candle = extractFirst5mCandleFromChart(
    [
      [t915, 1000],
      [t918, 1008],
      [t920, 1015],
      [t925, 1030],
    ],
    1000
  );

  assert.ok(candle);
  assert.equal(candle.first5mOpen, 1000);
  assert.equal(candle.first5mClose, 1015);
  assert.equal(candle.first5mChangePct, 1.5);
});
