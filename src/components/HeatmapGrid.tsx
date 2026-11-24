import { useEffect, useState } from 'react';
import type { ColorBucket, HoldingEntry, StockQuote } from '../types/market';
import {
  formatInr,
  getBucketForPct,
  getOpenSignal,
} from '../utils/heatmapLogic';

interface HeatmapGridProps {
  stocks: StockQuote[];
  buckets: ColorBucket[];
  holdingsMap: Map<string, HoldingEntry>;
  watchlistSet: Set<string>;
  selectedSymbol: string | null;
  loading: boolean;
  onSelectStock: (symbol: string) => void;
  onResetFilters: () => void;
}

export function HeatmapGrid({
  stocks,
  buckets,
  holdingsMap,
  watchlistSet,
  selectedSymbol,
  loading,
  onSelectStock,
  onResetFilters,
}: HeatmapGridProps) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 300);
    return () => clearInterval(id);
  }, []);

  if (loading) {
    return (
      <div
        aria-label="Loading heatmap"
        className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-1 rounded-lg border border-slate-800 bg-slate-950 p-1.5"
      >
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="h-[78px] rounded bg-slate-900 animate-pulse border border-slate-800/60"
          />
        ))}
      </div>
    );
  }

  if (stocks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-slate-800 bg-slate-900/70 px-6 py-16 text-center">
        <h3 className="text-base font-semibold text-slate-100">
          No matching stocks in this view
        </h3>
        <p className="mt-1.5 max-w-md text-xs text-slate-400">
          Try clearing your percentage bucket filter, Open=Low/High scanner filter,
          sector selection, or search query.
        </p>
        <button
          type="button"
          onClick={onResetFilters}
          className="mt-4 rounded-md bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-500 transition-colors cursor-pointer"
        >
          Reset Filters
        </button>
      </div>
    );
  }

  return (
    <div
      data-testid="heatmap-grid"
      className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-1 rounded-lg border border-slate-800 bg-slate-950 p-1.5"
    >
      {stocks.map((stock) => {
        const bucket = getBucketForPct(stock.pctChange, buckets);
        const openSig = getOpenSignal(stock.open, stock.high, stock.low);
        const holding = holdingsMap.get(stock.symbol);
        const inWatchlist = watchlistSet.has(stock.symbol);
        const isSelected = selectedSymbol === stock.symbol;
        const recentlyTicked =
          stock.lastTickAt !== undefined && now - stock.lastTickAt < 650;
        const flashClass =
          recentlyTicked && stock.tickDirection === 'up'
            ? 'tick-flash-up'
            : recentlyTicked && stock.tickDirection === 'down'
            ? 'tick-flash-down'
            : '';

        const signalAria =
          openSig === 'O=L'
            ? ', Open equals Low'
            : openSig === 'O=H'
            ? ', Open equals High'
            : '';

        return (
          <button
            key={stock.symbol}
            type="button"
            onClick={() => onSelectStock(stock.symbol)}
            aria-label={`${stock.symbol} LTP ${stock.ltp.toFixed(2)} ${
              stock.pctChange >= 0 ? '+' : ''
            }${stock.pctChange.toFixed(2)}%${signalAria}`}
            style={{
              backgroundColor: bucket.bgHex,
              color: bucket.textHex,
            }}
            className={`group relative flex min-h-[78px] flex-col justify-between rounded-[3px] px-2 py-1.5 text-left transition-transform duration-150 hover:brightness-110 focus-visible:outline-2 focus-visible:outline-white cursor-pointer ${flashClass} ${
              isSelected ? 'ring-2 ring-white z-10' : ''
            }`}
          >
            {/* Top row: Symbol + O=L / O=H indicator */}
            <div className="flex w-full items-center justify-between gap-1">
              <span className="truncate text-[11px] font-bold tracking-tight leading-tight">
                {stock.symbol}
              </span>

              {openSig === 'O=L' && (
                <span
                  title="Open = Low (Intraday Bullish Strength)"
                  className="shrink-0 rounded-[2px] border border-emerald-400/70 bg-slate-950/90 px-1 py-px font-mono text-[9px] font-bold leading-none text-emerald-300"
                >
                  O=L
                </span>
              )}

              {openSig === 'O=H' && (
                <span
                  title="Open = High (Intraday Bearish Pressure)"
                  className="shrink-0 rounded-[2px] border border-red-400/70 bg-slate-950/90 px-1 py-px font-mono text-[9px] font-bold leading-none text-red-300"
                >
                  O=H
                </span>
              )}
            </div>

            {/* Middle row: LTP */}
            <div className="mt-1 font-mono text-xs font-semibold tabular-nums leading-tight">
              {formatInr(stock.ltp)}
            </div>

            {/* Bottom row: % change + personal marker */}
            <div className="flex w-full items-center justify-between gap-1 font-mono text-[11px] font-semibold tabular-nums leading-tight">
              <span>
                {stock.pctChange > 0 ? '+' : ''}
                {stock.pctChange.toFixed(2)}%
              </span>

              {(holding || inWatchlist) && (
                <span
                  className="text-[9px] font-sans font-semibold opacity-80"
                  title={
                    holding
                      ? `Holding ${holding.qty} shares`
                      : 'In Watchlist'
                  }
                >
                  {holding ? `${holding.qty}q` : '★'}
                </span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
