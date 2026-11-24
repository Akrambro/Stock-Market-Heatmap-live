import { RefreshCw } from 'lucide-react';
import type { FeedStatusPayload, IndexId, IndexTicker } from '../types/market';
import type { MarketBreadth } from '../utils/heatmapLogic';
import { formatInr } from '../utils/heatmapLogic';

interface MarketBreadthStripProps {
  indices: IndexTicker[];
  breadth: MarketBreadth;
  onSelectIndex: (indexId: IndexId) => void;
  feedStatus: FeedStatusPayload;
  onChangeSpeed: (ms: number) => void;
  onPollNseNow: () => void;
}

const INDEX_LINK_MAP: Record<string, IndexId | undefined> = {
  NIFTY_50: 'NIFTY_50',
  NIFTY_500: 'NIFTY_500',
  NIFTY_BANK: 'NIFTY_BANK',
  NIFTY_IT: 'NIFTY_IT',
  NIFTY_MIDCAP_100: 'NIFTY_MIDCAP_100',
};

export function MarketBreadthStrip({
  indices,
  breadth,
  onSelectIndex,
  feedStatus,
  onChangeSpeed,
  onPollNseNow,
}: MarketBreadthStripProps) {
  const showNseNotice =
    feedStatus.feedState === 'BLOCKED' || feedStatus.feedState === 'ERROR';

  return (
    <div className="border-b border-slate-800/80 bg-slate-900/70">
      <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-4 px-4 sm:px-6 py-2 text-xs">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5">
          {indices.map((idx) => {
            const up = idx.pctChange >= 0;
            const targetId = INDEX_LINK_MAP[idx.id];
            const content = (
              <span className="inline-flex items-baseline gap-1.5 font-mono tabular-nums whitespace-nowrap">
                <span className="font-sans font-semibold text-slate-300">
                  {idx.label}
                </span>
                <span className="text-slate-100 font-medium">
                  {formatInr(idx.ltp)}
                </span>
                <span
                  className={
                    up ? 'text-emerald-400 font-medium' : 'text-red-400 font-medium'
                  }
                >
                  {up ? '+' : ''}
                  {idx.pctChange.toFixed(2)}%
                </span>
              </span>
            );

            if (targetId) {
              return (
                <button
                  key={idx.id}
                  type="button"
                  onClick={() => onSelectIndex(targetId)}
                  className="hover:opacity-80 transition-opacity cursor-pointer"
                  title={`Load ${idx.label} Heatmap`}
                >
                  {content}
                </button>
              );
            }
            return <div key={idx.id}>{content}</div>;
          })}
        </div>

        <div className="flex flex-wrap items-center gap-4 text-slate-400 font-mono tabular-nums">
          <div className="flex items-center gap-2 whitespace-nowrap">
            <span>Adv:</span>
            <span className="text-emerald-400 font-semibold">{breadth.advances}</span>
            <span aria-hidden="true">·</span>
            <span>Dec:</span>
            <span className="text-red-400 font-semibold">{breadth.declines}</span>
            <span aria-hidden="true">·</span>
            <span>Flat:</span>
            <span className="text-slate-200">{breadth.unchanged}</span>
          </div>

          <div className="hidden xl:flex items-center gap-2 whitespace-nowrap">
            <span>Holdings MTM:</span>
            <span
              className={
                breadth.portfolioPnl >= 0
                  ? 'text-emerald-400 font-semibold'
                  : 'text-red-400 font-semibold'
              }
            >
              {breadth.portfolioPnl >= 0 ? '+' : ''}
              ₹{formatInr(breadth.portfolioPnl)}
            </span>
          </div>

          <label className="inline-flex items-center gap-1.5 font-sans text-slate-400 whitespace-nowrap">
            <span>NSE Poll:</span>
            <select
              aria-label="NSE poll interval"
              value={feedStatus.pollIntervalMs}
              onChange={(e) => onChangeSpeed(Number(e.target.value))}
              className="rounded border border-slate-700 bg-slate-900 px-1.5 py-0.5 text-xs font-mono text-slate-200 focus-visible:outline-2 focus-visible:outline-emerald-400"
            >
              <option value={2000}>2s</option>
              <option value={3000}>3s</option>
              <option value={5000}>5s</option>
            </select>
          </label>
        </div>
      </div>

      {showNseNotice && (
        <div className="border-t border-amber-800/50 bg-amber-950/35 px-4 sm:px-6 py-1.5 text-xs">
          <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-2">
            <span className="text-amber-200">
              {feedStatus.statusMessage} Displaying baseline NSE 500 snapshot until live session succeeds.
            </span>
            <button
              type="button"
              onClick={onPollNseNow}
              className="inline-flex items-center gap-1.5 rounded border border-amber-700/70 bg-amber-900/40 px-2.5 py-1 text-xs font-medium text-amber-100 hover:bg-amber-800/50 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <RefreshCw className="h-3 w-3" />
              Retry NSE Feed
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
