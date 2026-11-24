import { RefreshCw, Search, X } from 'lucide-react';
import type {
  IndexId,
  OpenSignalFilter,
  SortOption,
  ViewMode,
} from '../types/market';
import { NIFTY_INDICES } from '../utils/heatmapLogic';

interface HeatmapControlsProps {
  viewMode: ViewMode;
  onChangeViewMode: (mode: ViewMode) => void;
  selectedIndex: IndexId;
  onChangeIndex: (idx: IndexId) => void;
  sectorFilter: string;
  sectors: string[];
  onChangeSector: (sector: string) => void;
  openSignalFilter: OpenSignalFilter;
  onChangeOpenSignalFilter: (f: OpenSignalFilter) => void;
  openLowCount: number;
  openHighCount: number;
  searchQuery: string;
  onChangeSearch: (q: string) => void;
  sortBy: SortOption;
  onChangeSortBy: (s: SortOption) => void;
  watchlistCount: number;
  holdingsCount: number;
  hasActiveFilters: boolean;
  onResetFilters: () => void;
  onPollNseNow: () => void;
}

export function HeatmapControls({
  viewMode,
  onChangeViewMode,
  selectedIndex,
  onChangeIndex,
  sectorFilter,
  sectors,
  onChangeSector,
  openSignalFilter,
  onChangeOpenSignalFilter,
  openLowCount,
  openHighCount,
  searchQuery,
  onChangeSearch,
  sortBy,
  onChangeSortBy,
  watchlistCount,
  holdingsCount,
  hasActiveFilters,
  onResetFilters,
  onPollNseNow,
}: HeatmapControlsProps) {
  return (
    <section
      aria-label="Heatmap Filters and Controls"
      className="flex flex-col gap-3 rounded-lg border border-slate-800 bg-slate-900/90 p-3.5"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Market Segment / Personal Dashboard Switch */}
        <div className="flex flex-wrap items-center gap-3">
          <div
            role="tablist"
            aria-label="Market view mode"
            className="inline-flex items-center rounded-md border border-slate-800 bg-slate-950 p-0.5"
          >
            <button
              type="button"
              role="tab"
              aria-selected={viewMode === 'INDEX'}
              onClick={() => onChangeViewMode('INDEX')}
              className={`rounded px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                viewMode === 'INDEX'
                  ? 'bg-slate-800 text-slate-50'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              NSE Indices
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={viewMode === 'WATCHLIST'}
              onClick={() => onChangeViewMode('WATCHLIST')}
              className={`rounded px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                viewMode === 'WATCHLIST'
                  ? 'bg-slate-800 text-slate-50'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Watchlist ({watchlistCount})
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={viewMode === 'HOLDINGS'}
              onClick={() => onChangeViewMode('HOLDINGS')}
              className={`rounded px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                viewMode === 'HOLDINGS'
                  ? 'bg-slate-800 text-slate-50'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Holdings ({holdingsCount})
            </button>
          </div>

          {viewMode === 'INDEX' && (
            <label className="inline-flex items-center gap-2 text-xs text-slate-400">
              <span className="font-medium text-slate-300 whitespace-nowrap">
                Index
              </span>
              <select
                aria-label="Select Nifty Index"
                value={selectedIndex}
                onChange={(e) => onChangeIndex(e.target.value as IndexId)}
                className="rounded-md border border-slate-700 bg-slate-950 px-2.5 py-1.5 text-xs font-medium text-slate-100 focus-visible:outline-2 focus-visible:outline-emerald-400 cursor-pointer"
              >
                {NIFTY_INDICES.map((idx) => (
                  <option key={idx.id} value={idx.id}>
                    {idx.label}
                  </option>
                ))}
              </select>
            </label>
          )}

          <label className="inline-flex items-center gap-2 text-xs text-slate-400">
            <span className="font-medium text-slate-300 whitespace-nowrap">
              Sector
            </span>
            <select
              aria-label="Filter by sector"
              value={sectorFilter}
              onChange={(e) => onChangeSector(e.target.value)}
              className="rounded-md border border-slate-700 bg-slate-950 px-2.5 py-1.5 text-xs font-medium text-slate-100 focus-visible:outline-2 focus-visible:outline-emerald-400 cursor-pointer"
            >
              <option value="ALL">All Sectors</option>
              {sectors.map((sec) => (
                <option key={sec} value={sec}>
                  {sec}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* Search, Sort & Poll NSE */}
        <div className="flex w-full sm:w-auto flex-wrap items-center gap-2.5">
          <div className="relative flex-1 sm:flex-initial">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500"
            />
            <input
              type="text"
              aria-label="Search symbol or company"
              placeholder="Search ticker or sector..."
              value={searchQuery}
              onChange={(e) => onChangeSearch(e.target.value)}
              className="w-full sm:w-52 rounded-md border border-slate-700 bg-slate-950 pl-8 pr-7 py-1.5 text-xs text-slate-100 placeholder:text-slate-500 focus-visible:outline-2 focus-visible:outline-emerald-400"
            />
            {searchQuery && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => onChangeSearch('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <label className="inline-flex items-center gap-2 text-xs text-slate-400">
            <span className="font-medium text-slate-300 whitespace-nowrap">
              Sort By
            </span>
            <select
              aria-label="Sort heatmap tiles"
              value={sortBy}
              onChange={(e) => onChangeSortBy(e.target.value as SortOption)}
              className="rounded-md border border-slate-700 bg-slate-950 px-2.5 py-1.5 text-xs font-medium text-slate-100 focus-visible:outline-2 focus-visible:outline-emerald-400 cursor-pointer"
            >
              <option value="PCT_DESC">% Change (High → Low)</option>
              <option value="PCT_ASC">% Change (Low → High)</option>
              <option value="SYMBOL_ASC">Symbol (A → Z)</option>
              <option value="LTP_DESC">Price (High → Low)</option>
              <option value="VOLUME_DESC">Volume (High → Low)</option>
              {viewMode === 'HOLDINGS' && (
                <option value="PNL_DESC">Holding P&amp;L (High → Low)</option>
              )}
            </select>
          </label>

          <button
            type="button"
            onClick={onPollNseNow}
            title="Fetch fresh snapshot from nseindia.com"
            className="inline-flex items-center gap-1.5 rounded-md border border-slate-700 bg-slate-950 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-slate-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Sync NSE
          </button>
        </div>
      </div>

      {/* Intraday Open=Low / Open=High Scanner Filter Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800/80 pt-2.5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-slate-400 whitespace-nowrap">
            Intraday Signal:
          </span>
          <div
            role="group"
            aria-label="Open equals Low or High filter"
            className="inline-flex flex-wrap items-center gap-1 rounded-md border border-slate-800 bg-slate-950 p-0.5"
          >
            <button
              type="button"
              onClick={() => onChangeOpenSignalFilter('ALL')}
              aria-pressed={openSignalFilter === 'ALL'}
              className={`rounded px-2.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                openSignalFilter === 'ALL'
                  ? 'bg-slate-800 text-slate-50'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Stocks
            </button>
            <button
              type="button"
              onClick={() => onChangeOpenSignalFilter('O=L')}
              aria-pressed={openSignalFilter === 'O=L'}
              className={`rounded px-2.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                openSignalFilter === 'O=L'
                  ? 'bg-emerald-900/70 text-emerald-200 ring-1 ring-emerald-500/50'
                  : 'text-slate-300 hover:bg-slate-800/80'
              }`}
            >
              ▲ Open = Low ({openLowCount})
            </button>
            <button
              type="button"
              onClick={() => onChangeOpenSignalFilter('O=H')}
              aria-pressed={openSignalFilter === 'O=H'}
              className={`rounded px-2.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                openSignalFilter === 'O=H'
                  ? 'bg-red-900/70 text-red-200 ring-1 ring-red-500/50'
                  : 'text-slate-300 hover:bg-slate-800/80'
              }`}
            >
              ▼ Open = High ({openHighCount})
            </button>
            <button
              type="button"
              onClick={() => onChangeOpenSignalFilter('BOTH')}
              aria-pressed={openSignalFilter === 'BOTH'}
              className={`rounded px-2.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                openSignalFilter === 'BOTH'
                  ? 'bg-slate-800 text-slate-50'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              O=L &amp; O=H ({openLowCount + openHighCount})
            </button>
          </div>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="rounded-md border border-slate-700 bg-slate-950 px-2.5 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Clear Filters
            </button>
          )}
        </div>

        <p className="text-xs text-slate-400">
          O=L marks intraday bullish floor · O=H marks intraday bearish ceiling
        </p>
      </div>
    </section>
  );
}
