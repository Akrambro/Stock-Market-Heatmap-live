import { Pause, Play } from 'lucide-react';
import type { ConnectionStatus } from '../hooks/useMarketSocket';
import type { AppPage, FeedStatusPayload, IndexId } from '../types/market';

interface TopTickerBarProps {
  activePage: AppPage;
  onChangePage: (page: AppPage) => void;
  selectedIndex: IndexId;
  onSelectIndex: (indexId: IndexId) => void;
  feedStatus: FeedStatusPayload;
  onTogglePause: () => void;
  connectionStatus: ConnectionStatus;
}

export function TopTickerBar({
  activePage,
  onChangePage,
  selectedIndex,
  onSelectIndex,
  feedStatus,
  onTogglePause,
  connectionStatus,
}: TopTickerBarProps) {
  const statusDotClass =
    connectionStatus !== 'connected'
      ? 'bg-red-500'
      : feedStatus.feedState === 'LIVE'
      ? 'bg-emerald-500'
      : feedStatus.feedState === 'BLOCKED' || feedStatus.feedState === 'ERROR'
      ? 'bg-amber-500'
      : 'bg-slate-400';

  const statusText =
    connectionStatus !== 'connected'
      ? 'WS Reconnecting'
      : feedStatus.paused
      ? 'Feed Paused'
      : feedStatus.feedState === 'LIVE'
      ? 'NSE Live WS'
      : feedStatus.feedState === 'BLOCKED'
      ? 'NSE 403 / Baseline'
      : feedStatus.feedState === 'ERROR'
      ? 'NSE Feed Error'
      : 'Connecting NSE';

  return (
    <header className="border-b border-slate-800 bg-slate-950 px-4 sm:px-6 py-3">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 sm:gap-8">
        <button
          type="button"
          onClick={() => onChangePage('HEATMAP')}
          className="text-lg font-semibold tracking-tight text-slate-50 whitespace-nowrap shrink-0 cursor-pointer"
        >
          TradeTiger Heatmap
        </button>

        <nav
          aria-label="Primary navigation"
          className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm font-medium overflow-x-auto"
        >
          <button
            type="button"
            onClick={() => onChangePage('HEATMAP')}
            className={`whitespace-nowrap shrink-0 pb-0.5 transition-colors cursor-pointer ${
              activePage === 'HEATMAP'
                ? 'text-emerald-400 border-b-2 border-emerald-400'
                : 'text-slate-400 hover:text-slate-100 border-b-2 border-transparent'
            }`}
          >
            Heatmap
          </button>

          <button
            type="button"
            onClick={() => onChangePage('SHORTLISTED')}
            className={`whitespace-nowrap shrink-0 pb-0.5 transition-colors cursor-pointer ${
              activePage === 'SHORTLISTED'
                ? 'text-emerald-400 border-b-2 border-emerald-400'
                : 'text-slate-400 hover:text-slate-100 border-b-2 border-transparent'
            }`}
          >
            Shortlisted Stocks
          </button>

          <button
            type="button"
            onClick={() => {
              onChangePage('HEATMAP');
              onSelectIndex('NIFTY_50');
            }}
            className={`hidden md:inline-block whitespace-nowrap shrink-0 pb-0.5 transition-colors cursor-pointer ${
              activePage === 'HEATMAP' && selectedIndex === 'NIFTY_50'
                ? 'text-slate-100 border-b-2 border-slate-500'
                : 'text-slate-400 hover:text-slate-100 border-b-2 border-transparent'
            }`}
          >
            Nifty 50
          </button>

          <button
            type="button"
            onClick={() => {
              onChangePage('HEATMAP');
              onSelectIndex('NIFTY_500');
            }}
            className={`hidden md:inline-block whitespace-nowrap shrink-0 pb-0.5 transition-colors cursor-pointer ${
              activePage === 'HEATMAP' && selectedIndex === 'NIFTY_500'
                ? 'text-slate-100 border-b-2 border-slate-500'
                : 'text-slate-400 hover:text-slate-100 border-b-2 border-transparent'
            }`}
          >
            Nifty 500
          </button>

          <button
            type="button"
            onClick={() => {
              onChangePage('HEATMAP');
              onSelectIndex('NIFTY_BANK');
            }}
            className={`hidden lg:inline-block whitespace-nowrap shrink-0 pb-0.5 transition-colors cursor-pointer ${
              activePage === 'HEATMAP' && selectedIndex === 'NIFTY_BANK'
                ? 'text-slate-100 border-b-2 border-slate-500'
                : 'text-slate-400 hover:text-slate-100 border-b-2 border-transparent'
            }`}
          >
            Bank Nifty
          </button>
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          <span
            title={feedStatus.statusMessage}
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono tabular-nums text-slate-300 whitespace-nowrap"
            aria-label={`WebSocket stream ${statusText}`}
          >
            <span className={`h-2 w-2 rounded-full ${statusDotClass}`} />
            {statusText}
          </span>

          <button
            type="button"
            onClick={onTogglePause}
            className="inline-flex items-center gap-2 rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-100 hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-emerald-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {feedStatus.paused ? (
              <>
                <Play className="h-3.5 w-3.5 text-emerald-400" />
                Resume Feed
              </>
            ) : (
              <>
                <Pause className="h-3.5 w-3.5 text-amber-400" />
                Pause Feed
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
