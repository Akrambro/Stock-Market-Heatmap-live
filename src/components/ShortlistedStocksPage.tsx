import { useMemo, useState } from 'react';
import { ArrowUpRight, Search, X } from 'lucide-react';
import type { IndexId, OpenSignalFilter, StockQuote } from '../types/market';
import {
  formatCompactVolume,
  formatInr,
  getShortlistedByIndex,
  NIFTY_INDICES,
} from '../utils/heatmapLogic';

interface ShortlistedStocksPageProps {
  stocks: StockQuote[];
  selectedSymbol: string | null;
  onSelectStock: (symbol: string) => void;
  onOpenIndexInHeatmap: (indexId: IndexId) => void;
}

export function ShortlistedStocksPage({
  stocks,
  selectedSymbol,
  onSelectStock,
  onOpenIndexInHeatmap,
}: ShortlistedStocksPageProps) {
  const [signalFilter, setSignalFilter] = useState<OpenSignalFilter>('BOTH');
  const [searchQuery, setSearchQuery] = useState('');

  const tablesByIndex = useMemo(() => {
    return NIFTY_INDICES.map((meta) => {
      const rows = getShortlistedByIndex(
        stocks,
        meta.id,
        signalFilter,
        searchQuery
      );
      const olCount = rows.filter((r) => r.signal === 'O=L').length;
      const ohCount = rows.filter((r) => r.signal === 'O=H').length;
      return {
        meta,
        rows,
        olCount,
        ohCount,
      };
    });
  }, [stocks, signalFilter, searchQuery]);

  const scrollToTable = (indexId: IndexId) => {
    const el = document.getElementById(`shortlist-table-${indexId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div data-testid="shortlisted-page" className="space-y-4">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-slate-50 text-balance">
            Shortlisted Stocks — Open = Low / High Scanner
          </h1>
          <p className="text-xs text-slate-400">
            Dedicated tables across every Nifty index and Bank Nifty showing Open = Low &amp; Open = High stocks with first 5-minute candle (09:15–09:20) gain/loss %
          </p>
        </div>
      </div>

      {/* Filter & Quick Index Jump Bar */}
      <section
        aria-label="Shortlisted stocks filters"
        className="flex flex-col gap-3 rounded-lg border border-slate-800 bg-slate-900/90 p-3.5"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div
            role="group"
            aria-label="Filter shortlisted signal type"
            className="inline-flex flex-wrap items-center gap-1 rounded-md border border-slate-800 bg-slate-950 p-0.5"
          >
            <button
              type="button"
              onClick={() => setSignalFilter('BOTH')}
              aria-pressed={signalFilter === 'BOTH'}
              className={`rounded px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                signalFilter === 'BOTH'
                  ? 'bg-slate-800 text-slate-50'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All O=L &amp; O=H
            </button>
            <button
              type="button"
              onClick={() => setSignalFilter('O=L')}
              aria-pressed={signalFilter === 'O=L'}
              className={`rounded px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                signalFilter === 'O=L'
                  ? 'bg-emerald-900/70 text-emerald-200 ring-1 ring-emerald-500/50'
                  : 'text-slate-300 hover:bg-slate-800/80'
              }`}
            >
              ▲ Open = Low Only
            </button>
            <button
              type="button"
              onClick={() => setSignalFilter('O=H')}
              aria-pressed={signalFilter === 'O=H'}
              className={`rounded px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                signalFilter === 'O=H'
                  ? 'bg-red-900/70 text-red-200 ring-1 ring-red-500/50'
                  : 'text-slate-300 hover:bg-slate-800/80'
              }`}
            >
              ▼ Open = High Only
            </button>
          </div>

          <div className="relative w-full sm:w-60">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500"
            />
            <input
              type="text"
              aria-label="Filter shortlisted stocks by ticker"
              placeholder="Filter ticker or sector..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border border-slate-700 bg-slate-950 pl-8 pr-7 py-1.5 text-xs text-slate-100 placeholder:text-slate-500 focus-visible:outline-2 focus-visible:outline-emerald-400"
            />
            {searchQuery && (
              <button
                type="button"
                aria-label="Clear shortlisted search"
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Quick Jump Index Strip */}
        <div className="flex flex-wrap items-center gap-1.5 border-t border-slate-800/80 pt-2.5">
          <span className="text-xs text-slate-400 mr-1">Jump to table:</span>
          {tablesByIndex.map(({ meta, rows }) => (
            <button
              key={meta.id}
              type="button"
              onClick={() => scrollToTable(meta.id)}
              className="rounded border border-slate-800 bg-slate-950 px-2.5 py-1 text-xs font-medium text-slate-300 hover:border-slate-700 hover:text-slate-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer font-mono tabular-nums"
            >
              {meta.shortLabel} ({rows.length})
            </button>
          ))}
        </div>
      </section>

      {/* Multiple Tables — One per Nifty Index & Bank Nifty */}
      <div className="space-y-5">
        {tablesByIndex.map(({ meta, rows, olCount, ohCount }) => (
          <section
            key={meta.id}
            id={`shortlist-table-${meta.id}`}
            data-testid={`shortlist-table-${meta.id}`}
            aria-labelledby={`heading-${meta.id}`}
            className="rounded-lg border border-slate-800 bg-slate-900/90 overflow-hidden"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 bg-slate-900 px-4 py-3">
              <div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <h2
                    id={`heading-${meta.id}`}
                    className="text-sm font-semibold text-slate-50"
                  >
                    {meta.label}
                  </h2>
                  <span className="text-xs font-mono tabular-nums text-slate-400">
                    {rows.length} shortlisted ·{' '}
                    <span className="text-emerald-400">{olCount} O=L</span> ·{' '}
                    <span className="text-red-400">{ohCount} O=H</span>
                  </span>
                </div>
                <p className="text-xs text-slate-400">{meta.description}</p>
              </div>

              <button
                type="button"
                onClick={() => onOpenIndexInHeatmap(meta.id)}
                className="inline-flex items-center gap-1 rounded-md border border-slate-700 bg-slate-950 px-2.5 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Open Heatmap
                <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/70 text-[11px] font-medium text-slate-400">
                    <th className="py-2.5 pl-4 pr-3 whitespace-nowrap">Symbol</th>
                    <th className="py-2.5 px-3 whitespace-nowrap">Sector</th>
                    <th className="py-2.5 px-3 whitespace-nowrap">Signal</th>
                    <th className="py-2.5 px-3 text-right whitespace-nowrap">Open (₹)</th>
                    <th className="py-2.5 px-3 text-right whitespace-nowrap">Low / High (₹)</th>
                    <th className="py-2.5 px-3 text-right whitespace-nowrap">LTP (₹)</th>
                    <th className="py-2.5 px-3 text-right whitespace-nowrap">
                      9:15–9:20 Candle
                    </th>
                    <th className="py-2.5 px-3 text-right whitespace-nowrap">
                      1st 5m % (9:15–9:20)
                    </th>
                    <th className="py-2.5 px-3 text-right whitespace-nowrap">Day %</th>
                    <th className="py-2.5 pl-3 pr-4 text-right whitespace-nowrap">
                      Volume
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/70">
                  {rows.length === 0 ? (
                    <tr>
                      <td
                        colSpan={10}
                        className="px-4 py-6 text-center text-xs text-slate-400"
                      >
                        No Open = Low or Open = High setups matching current filter in{' '}
                        {meta.label}.
                      </td>
                    </tr>
                  ) : (
                    rows.map(({ stock, signal }) => {
                      const isOl = signal === 'O=L';
                      const f5mUp = stock.first5mChangePct >= 0;
                      const dayUp = stock.pctChange >= 0;
                      const isSelected = selectedSymbol === stock.symbol;

                      return (
                        <tr
                          key={`${meta.id}-${stock.symbol}`}
                          className={`transition-colors hover:bg-slate-800/60 ${
                            isSelected ? 'bg-slate-800/80' : ''
                          }`}
                        >
                          <td className="py-2.5 pl-4 pr-3 whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => onSelectStock(stock.symbol)}
                              className="text-left font-semibold text-slate-100 hover:text-emerald-400 focus-visible:outline-2 focus-visible:outline-emerald-400 cursor-pointer"
                            >
                              <div>{stock.symbol}</div>
                              <div className="text-[11px] font-normal text-slate-400 truncate max-w-[170px]">
                                {stock.name}
                              </div>
                            </button>
                          </td>
                          <td className="py-2.5 px-3 text-slate-300 whitespace-nowrap">
                            {stock.sector}
                          </td>
                          <td className="py-2.5 px-3 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center rounded border px-1.5 py-0.5 font-mono text-[11px] font-semibold ${
                                isOl
                                  ? 'border-emerald-700/80 bg-emerald-950/70 text-emerald-300'
                                  : 'border-red-700/80 bg-red-950/70 text-red-300'
                              }`}
                            >
                              {isOl ? '▲ Open = Low' : '▼ Open = High'}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono tabular-nums text-slate-200 whitespace-nowrap">
                            {formatInr(stock.open)}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono tabular-nums text-slate-400 whitespace-nowrap">
                            {formatInr(stock.low)} – {formatInr(stock.high)}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-semibold tabular-nums text-slate-50 whitespace-nowrap">
                            {formatInr(stock.ltp)}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono tabular-nums text-slate-300 whitespace-nowrap">
                            {formatInr(stock.first5mOpen)} →{' '}
                            {formatInr(stock.first5mClose)}
                          </td>
                          <td
                            className={`py-2.5 px-3 text-right font-mono font-semibold tabular-nums whitespace-nowrap ${
                              f5mUp ? 'text-emerald-400' : 'text-red-400'
                            }`}
                          >
                            {f5mUp ? '+' : ''}
                            {stock.first5mChangePct.toFixed(2)}%
                          </td>
                          <td
                            className={`py-2.5 px-3 text-right font-mono font-semibold tabular-nums whitespace-nowrap ${
                              dayUp ? 'text-emerald-400' : 'text-red-400'
                            }`}
                          >
                            {dayUp ? '+' : ''}
                            {stock.pctChange.toFixed(2)}%
                          </td>
                          <td className="py-2.5 pl-3 pr-4 text-right font-mono tabular-nums text-slate-400 whitespace-nowrap">
                            {formatCompactVolume(stock.volume)}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
