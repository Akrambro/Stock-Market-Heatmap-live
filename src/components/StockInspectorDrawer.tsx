import { useEffect, useState } from 'react';
import { Bookmark, Trash2, X } from 'lucide-react';
import type { HoldingEntry, StockQuote } from '../types/market';
import {
  formatCompactVolume,
  formatInr,
  getOpenSignal,
  NIFTY_INDICES,
} from '../utils/heatmapLogic';

interface StockInspectorDrawerProps {
  stock: StockQuote | null;
  inWatchlist: boolean;
  holding: HoldingEntry | undefined;
  onClose: () => void;
  onToggleWatchlist: (symbol: string) => void;
  onUpsertHolding: (symbol: string, qty: number, avgPrice: number) => void;
  onRemoveHolding: (symbol: string) => void;
}

export function StockInspectorDrawer({
  stock,
  inWatchlist,
  holding,
  onClose,
  onToggleWatchlist,
  onUpsertHolding,
  onRemoveHolding,
}: StockInspectorDrawerProps) {
  const [qtyInput, setQtyInput] = useState('10');
  const [avgInput, setAvgInput] = useState('');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (!stock) return;
    setQtyInput(holding ? String(holding.qty) : '10');
    setAvgInput(holding ? String(holding.avgPrice) : String(stock.ltp));
    setFormError('');
  }, [stock?.symbol, holding?.qty, holding?.avgPrice]);

  if (!stock) return null;

  const openSig = getOpenSignal(stock.open, stock.high, stock.low);
  const up = stock.pctChange >= 0;
  const rangeSpan = Math.max(0.01, stock.high - stock.low);
  const ltpPos = Math.max(
    0,
    Math.min(100, ((stock.ltp - stock.low) / rangeSpan) * 100)
  );
  const openPos = Math.max(
    0,
    Math.min(100, ((stock.open - stock.low) / rangeSpan) * 100)
  );

  const indexLabels = stock.indices
    .map((id) => NIFTY_INDICES.find((m) => m.id === id)?.shortLabel ?? id)
    .join(' · ');

  const currentPnl = holding
    ? (stock.ltp - holding.avgPrice) * holding.qty
    : null;
  const currentPnlPct =
    holding && holding.avgPrice > 0
      ? ((stock.ltp - holding.avgPrice) / holding.avgPrice) * 100
      : null;

  const handleSaveHolding = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = Number(qtyInput);
    const avg = Number(avgInput);
    if (!Number.isFinite(qty) || qty <= 0) {
      setFormError('Quantity must be greater than 0.');
      return;
    }
    if (!Number.isFinite(avg) || avg <= 0) {
      setFormError('Average price must be greater than 0.');
      return;
    }
    setFormError('');
    onUpsertHolding(stock.symbol, qty, avg);
  };

  return (
    <aside
      aria-label={`${stock.symbol} Stock Inspector`}
      className="fixed inset-y-0 right-0 z-40 flex w-full max-w-md flex-col border-l border-slate-800 bg-slate-900 shadow-2xl"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 border-b border-slate-800 px-5 py-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-50">{stock.symbol}</h2>
            <span className="text-xs text-slate-400">· {stock.sector}</span>
          </div>
          <p className="mt-0.5 text-xs text-slate-400">{stock.name}</p>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close stock inspector"
          className="rounded p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-100 cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Scrollable Body */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
        {/* Price & Change */}
        <div className="flex items-baseline justify-between">
          <div>
            <span className="block text-xs text-slate-400">Last Traded Price</span>
            <span className="font-mono text-2xl font-bold tabular-nums text-slate-50">
              ₹{formatInr(stock.ltp)}
            </span>
          </div>
          <div className="text-right font-mono tabular-nums">
            <span
              className={`block text-base font-bold ${
                up ? 'text-emerald-400' : 'text-red-400'
              }`}
            >
              {up ? '+' : ''}
              {stock.pctChange.toFixed(2)}%
            </span>
            <span
              className={`block text-xs ${
                up ? 'text-emerald-400/90' : 'text-red-400/90'
              }`}
            >
              {stock.change >= 0 ? '+' : ''}
              {formatInr(stock.change)}
            </span>
          </div>
        </div>

        {/* Open = Low / High Setup Readout */}
        {openSig && (
          <div
            className={`rounded-md border px-3.5 py-2.5 text-xs ${
              openSig === 'O=L'
                ? 'border-emerald-700/70 bg-emerald-950/50 text-emerald-200'
                : 'border-red-700/70 bg-red-950/50 text-red-200'
            }`}
          >
            <span className="font-semibold">
              {openSig === 'O=L'
                ? '▲ Open = Low Intraday Signal'
                : '▼ Open = High Intraday Signal'}
            </span>
            <p className="mt-1 opacity-90">
              {openSig === 'O=L'
                ? `Opened at ₹${formatInr(
                    stock.open
                  )} and has not traded below its opening print today, indicating sustained buying absorption.`
                : `Opened at ₹${formatInr(
                    stock.open
                  )} and has not traded above its opening print today, indicating overhead supply pressure.`}
            </p>
          </div>
        )}

        {/* Day's Range Bar */}
        <div className="rounded-md border border-slate-800 bg-slate-950 p-3.5">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Day&apos;s Range</span>
            <span className="font-mono tabular-nums text-slate-200">
              ₹{formatInr(stock.low)} — ₹{formatInr(stock.high)}
            </span>
          </div>
          <div className="relative h-2 w-full rounded-full bg-slate-800">
            <div
              className="absolute top-0 h-2 rounded-full bg-slate-600"
              style={{
                left: `${Math.min(openPos, ltpPos)}%`,
                width: `${Math.max(3, Math.abs(ltpPos - openPos))}%`,
              }}
            />
            <div
              title={`Open: ₹${formatInr(stock.open)}`}
              className="absolute -top-1 h-4 w-0.5 bg-amber-400"
              style={{ left: `${openPos}%` }}
            />
            <div
              title={`LTP: ₹${formatInr(stock.ltp)}`}
              className={`absolute -top-1 h-4 w-1.5 -translate-x-1/2 rounded-sm ${
                up ? 'bg-emerald-400' : 'bg-red-400'
              }`}
              style={{ left: `${ltpPos}%` }}
            />
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] font-mono tabular-nums text-slate-400">
            <span>L: ₹{formatInr(stock.low)}</span>
            <span className="text-amber-300">O: ₹{formatInr(stock.open)}</span>
            <span>H: ₹{formatInr(stock.high)}</span>
          </div>
        </div>

        {/* First 5-Minute Candle (09:15 - 09:20 IST) */}
        <div className="rounded-md border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-medium text-slate-300">
              First 5m Candle (09:15–09:20)
            </span>
            <span
              className={`font-mono font-semibold tabular-nums ${
                stock.first5mChangePct >= 0
                  ? 'text-emerald-400'
                  : 'text-red-400'
              }`}
            >
              {stock.first5mChangePct >= 0 ? '+' : ''}
              {stock.first5mChangePct.toFixed(2)}%
            </span>
          </div>
          <div className="mt-1 flex items-center justify-between font-mono tabular-nums text-[11px] text-slate-400">
            <span>9:15 Open: ₹{formatInr(stock.first5mOpen)}</span>
            <span>9:20 Close: ₹{formatInr(stock.first5mClose)}</span>
          </div>
        </div>

        {/* OHLC & Fundamentals Grid */}
        <div className="grid grid-cols-2 gap-2.5 text-xs">
          <div className="rounded border border-slate-800 bg-slate-950 px-3 py-2">
            <span className="text-slate-400">Prev Close</span>
            <div className="mt-0.5 font-mono font-semibold tabular-nums text-slate-100">
              ₹{formatInr(stock.prevClose)}
            </div>
          </div>
          <div className="rounded border border-slate-800 bg-slate-950 px-3 py-2">
            <span className="text-slate-400">Open</span>
            <div className="mt-0.5 font-mono font-semibold tabular-nums text-slate-100">
              ₹{formatInr(stock.open)}
            </div>
          </div>
          <div className="rounded border border-slate-800 bg-slate-950 px-3 py-2">
            <span className="text-slate-400">Volume</span>
            <div className="mt-0.5 font-mono font-semibold tabular-nums text-slate-100">
              {formatCompactVolume(stock.volume)}
            </div>
          </div>
          <div className="rounded border border-slate-800 bg-slate-950 px-3 py-2">
            <span className="text-slate-400">Market Cap</span>
            <div className="mt-0.5 font-mono font-semibold tabular-nums text-slate-100">
              ₹{(stock.marketCapCr / 1000).toFixed(1)}k Cr
            </div>
          </div>
        </div>

        <div className="text-xs text-slate-400">
          <span className="font-medium text-slate-300">Indices: </span>
          <span>{indexLabels}</span>
        </div>

        {/* Personal Watchlist Action */}
        <div className="border-t border-slate-800 pt-4">
          <button
            type="button"
            onClick={() => onToggleWatchlist(stock.symbol)}
            className={`inline-flex w-full items-center justify-center gap-2 rounded-md border px-4 py-2 text-xs font-semibold transition-colors cursor-pointer ${
              inWatchlist
                ? 'border-amber-600/70 bg-amber-950/50 text-amber-200 hover:bg-amber-900/60'
                : 'border-slate-700 bg-slate-950 text-slate-100 hover:bg-slate-800'
            }`}
          >
            <Bookmark className="h-3.5 w-3.5" />
            {inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
          </button>
        </div>

        {/* Personal Holdings Form */}
        <form
          onSubmit={handleSaveHolding}
          className="rounded-md border border-slate-800 bg-slate-950 p-3.5 space-y-3"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-slate-200">
              Personal Holding
            </h3>
            {currentPnl !== null && currentPnlPct !== null && (
              <span
                className={`font-mono text-xs font-semibold tabular-nums ${
                  currentPnl >= 0 ? 'text-emerald-400' : 'text-red-400'
                }`}
              >
                {currentPnl >= 0 ? '+' : ''}₹{formatInr(currentPnl)} (
                {currentPnlPct >= 0 ? '+' : ''}
                {currentPnlPct.toFixed(2)}%)
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <label className="flex flex-col gap-1 text-xs text-slate-400">
              <span>Quantity</span>
              <input
                type="number"
                min="1"
                step="1"
                value={qtyInput}
                onChange={(e) => setQtyInput(e.target.value)}
                className="rounded border border-slate-700 bg-slate-900 px-2.5 py-1.5 font-mono text-xs text-slate-100 focus-visible:outline-2 focus-visible:outline-emerald-400"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs text-slate-400">
              <span>Avg Buy (₹)</span>
              <input
                type="number"
                min="0.05"
                step="0.05"
                value={avgInput}
                onChange={(e) => setAvgInput(e.target.value)}
                className="rounded border border-slate-700 bg-slate-900 px-2.5 py-1.5 font-mono text-xs text-slate-100 focus-visible:outline-2 focus-visible:outline-emerald-400"
              />
            </label>
          </div>

          {formError && <p className="text-xs text-red-400">{formError}</p>}

          <div className="flex items-center gap-2">
            <button
              type="submit"
              className="flex-1 rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500 transition-colors cursor-pointer"
            >
              {holding ? 'Update Holding' : 'Add Holding'}
            </button>

            {holding && (
              <button
                type="button"
                aria-label={`Remove ${stock.symbol} holding`}
                onClick={() => onRemoveHolding(stock.symbol)}
                className="inline-flex items-center gap-1 rounded-md border border-red-800/70 bg-red-950/50 px-3 py-1.5 text-xs font-medium text-red-300 hover:bg-red-900/60 transition-colors cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Remove
              </button>
            )}
          </div>
        </form>
      </div>
    </aside>
  );
}
