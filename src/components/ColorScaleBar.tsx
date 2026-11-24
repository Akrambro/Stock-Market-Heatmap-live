import { Wrench, X } from 'lucide-react';
import type { ColorBucket, StockQuote } from '../types/market';

interface ColorScaleBarProps {
  buckets: ColorBucket[];
  stocksInScope: StockQuote[];
  selectedBucketId: string | null;
  onSelectBucket: (bucketId: string | null) => void;
  onOpenCustomizer: () => void;
}

export function ColorScaleBar({
  buckets,
  stocksInScope,
  selectedBucketId,
  onSelectBucket,
  onOpenCustomizer,
}: ColorScaleBarProps) {
  const countsByBucket = new Map<string, number>();
  for (const b of buckets) {
    countsByBucket.set(b.id, 0);
  }
  for (const s of stocksInScope) {
    for (const b of buckets) {
      if (b.matches(s.pctChange)) {
        countsByBucket.set(b.id, (countsByBucket.get(b.id) ?? 0) + 1);
        break;
      }
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/90 p-2.5">
      <div className="flex-1 min-w-0 overflow-x-auto pb-0.5 sm:pb-0">
        <div
          role="group"
          aria-label="Percentage change color scale legend"
          className="grid min-w-[610px] grid-cols-11 gap-1"
        >
        {buckets.map((bucket) => {
          const count = countsByBucket.get(bucket.id) ?? 0;
          const isSelected = selectedBucketId === bucket.id;
          const isDimmed = selectedBucketId !== null && !isSelected;

          return (
            <button
              key={bucket.id}
              type="button"
              onClick={() =>
                onSelectBucket(isSelected ? null : bucket.id)
              }
              aria-pressed={isSelected}
              title={`${bucket.label} (${count} stocks) — Click to filter`}
              style={{
                backgroundColor: bucket.bgHex,
                color: bucket.textHex,
              }}
              className={`flex flex-col items-center justify-center rounded px-1 py-1.5 font-mono tabular-nums transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-white ${
                isSelected
                  ? 'ring-2 ring-white shadow-sm scale-[1.02]'
                  : isDimmed
                  ? 'opacity-45 hover:opacity-85'
                  : 'hover:brightness-110'
              }`}
            >
              <span className="text-[11px] font-semibold leading-tight whitespace-nowrap">
                {bucket.label}
              </span>
              <span className="text-[10px] opacity-85 leading-tight">
                {count}
              </span>
            </button>
          );
        })}
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        {selectedBucketId && (
          <button
            type="button"
            onClick={() => onSelectBucket(null)}
            className="inline-flex items-center gap-1 rounded-md border border-slate-700 bg-slate-950 px-2.5 py-2 text-xs font-medium text-slate-200 hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
            Clear Band
          </button>
        )}

        <button
          type="button"
          onClick={onOpenCustomizer}
          aria-label="Customize Color Scale"
          title="Customize TradeTiger percentage thresholds and colors"
          className="inline-flex items-center gap-1.5 rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-medium text-slate-100 hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-emerald-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Wrench className="h-3.5 w-3.5 text-slate-300" />
          Color Scale
        </button>
      </div>
    </div>
  );
}
