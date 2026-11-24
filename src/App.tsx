import { useEffect, useMemo, useState } from 'react';
import { ColorScaleBar } from './components/ColorScaleBar';
import { ColorScaleModal } from './components/ColorScaleModal';
import { HeatmapControls } from './components/HeatmapControls';
import { HeatmapGrid } from './components/HeatmapGrid';
import { MarketBreadthStrip } from './components/MarketBreadthStrip';
import { ShortlistedStocksPage } from './components/ShortlistedStocksPage';
import { StockInspectorDrawer } from './components/StockInspectorDrawer';
import { TopTickerBar } from './components/TopTickerBar';
import { useMarketSocket } from './hooks/useMarketSocket';
import type {
  AppPage,
  ColorScaleConfig,
  HoldingEntry,
  IndexId,
  OpenSignalFilter,
  SortOption,
  ViewMode,
} from './types/market';
import {
  buildColorBuckets,
  calculateMarketBreadth,
  DEFAULT_COLOR_SCALE,
  filterAndSortStocks,
  filterStocksByScope,
  NIFTY_INDICES,
} from './utils/heatmapLogic';

const COLOR_SCALE_STORAGE_KEY = 'tradetiger_heatmap_color_scale_v1';

function loadSavedColorScale(): ColorScaleConfig {
  try {
    const raw = window.localStorage.getItem(COLOR_SCALE_STORAGE_KEY);
    if (!raw) return DEFAULT_COLOR_SCALE;
    const parsed = JSON.parse(raw) as ColorScaleConfig;
    if (
      Array.isArray(parsed.thresholds) &&
      parsed.thresholds.length === 4 &&
      parsed.colors?.maxGain &&
      parsed.colors?.maxLoss
    ) {
      return parsed;
    }
  } catch {
    // Ignore storage errors
  }
  return DEFAULT_COLOR_SCALE;
}

export default function App() {
  const {
    stocks,
    indices,
    watchlist,
    holdings,
    feedStatus,
    connectionStatus,
    sendCommand,
  } = useMarketSocket();

  const [activePage, setActivePage] = useState<AppPage>('HEATMAP');
  const [viewMode, setViewMode] = useState<ViewMode>('INDEX');
  const [selectedIndex, setSelectedIndex] = useState<IndexId>('NIFTY_50');
  const [sectorFilter, setSectorFilter] = useState<string>('ALL');
  const [openSignalFilter, setOpenSignalFilter] =
    useState<OpenSignalFilter>('ALL');
  const [selectedBucketId, setSelectedBucketId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('PCT_DESC');

  const [colorScaleConfig, setColorScaleConfig] = useState<ColorScaleConfig>(
    loadSavedColorScale
  );
  const [showColorModal, setShowColorModal] = useState(false);
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        COLOR_SCALE_STORAGE_KEY,
        JSON.stringify(colorScaleConfig)
      );
    } catch {
      // Ignore storage errors
    }
  }, [colorScaleConfig]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showColorModal) setShowColorModal(false);
        else if (selectedSymbol) setSelectedSymbol(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [showColorModal, selectedSymbol]);

  const watchlistSet = useMemo(() => new Set(watchlist), [watchlist]);
  const holdingsMap = useMemo(
    () => new Map<string, HoldingEntry>(holdings.map((h) => [h.symbol, h])),
    [holdings]
  );

  const buckets = useMemo(
    () => buildColorBuckets(colorScaleConfig),
    [colorScaleConfig]
  );

  const scopedStocks = useMemo(
    () =>
      filterStocksByScope(
        stocks,
        viewMode,
        selectedIndex,
        watchlistSet,
        holdingsMap
      ),
    [stocks, viewMode, selectedIndex, watchlistSet, holdingsMap]
  );

  const sectors = useMemo(() => {
    const set = new Set(scopedStocks.map((s) => s.sector));
    return Array.from(set).sort();
  }, [scopedStocks]);

  const breadth = useMemo(
    () => calculateMarketBreadth(scopedStocks, holdingsMap),
    [scopedStocks, holdingsMap]
  );

  const visibleStocks = useMemo(
    () =>
      filterAndSortStocks(stocks, {
        viewMode,
        selectedIndex,
        watchlistSet,
        holdingsMap,
        sectorFilter,
        openSignalFilter,
        selectedBucketId,
        buckets,
        searchQuery,
        sortBy,
      }),
    [
      stocks,
      viewMode,
      selectedIndex,
      watchlistSet,
      holdingsMap,
      sectorFilter,
      openSignalFilter,
      selectedBucketId,
      buckets,
      searchQuery,
      sortBy,
    ]
  );

  const selectedStock = useMemo(
    () => stocks.find((s) => s.symbol === selectedSymbol) ?? null,
    [stocks, selectedSymbol]
  );

  const activeIndexMeta = useMemo(
    () => NIFTY_INDICES.find((m) => m.id === selectedIndex),
    [selectedIndex]
  );

  const handleSelectIndexFromNav = (idx: IndexId) => {
    setActivePage('HEATMAP');
    setViewMode('INDEX');
    setSelectedIndex(idx);
    setSectorFilter('ALL');
  };

  const handleResetFilters = () => {
    setSectorFilter('ALL');
    setOpenSignalFilter('ALL');
    setSelectedBucketId(null);
    setSearchQuery('');
  };

  const viewTitle =
    viewMode === 'WATCHLIST'
      ? 'Personal Watchlist'
      : viewMode === 'HOLDINGS'
      ? 'Personal Holdings'
      : activeIndexMeta?.label ?? 'NIFTY 50';

  const viewSubtitle =
    viewMode === 'WATCHLIST'
      ? 'Tracked NSE equities synced live over WebSocket'
      : viewMode === 'HOLDINGS'
      ? 'Portfolio positions with live mark-to-market P&L'
      : activeIndexMeta?.description ?? '';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <TopTickerBar
        activePage={activePage}
        onChangePage={setActivePage}
        selectedIndex={selectedIndex}
        onSelectIndex={handleSelectIndexFromNav}
        feedStatus={feedStatus}
        onTogglePause={() =>
          sendCommand({ type: 'set_paused', paused: !feedStatus.paused })
        }
        connectionStatus={connectionStatus}
      />

      <MarketBreadthStrip
        indices={indices}
        breadth={breadth}
        onSelectIndex={handleSelectIndexFromNav}
        feedStatus={feedStatus}
        onChangeSpeed={(ms) =>
          sendCommand({ type: 'set_speed', pollIntervalMs: ms })
        }
        onPollNseNow={() => sendCommand({ type: 'poll_nse_now' })}
      />

      <main
        id="heatmap"
        className="mx-auto w-full max-w-[1600px] flex-1 px-4 sm:px-6 py-4 space-y-3"
      >
        {activePage === 'SHORTLISTED' ? (
          <ShortlistedStocksPage
            stocks={stocks}
            selectedSymbol={selectedSymbol}
            onSelectStock={(sym) => setSelectedSymbol(sym)}
            onOpenIndexInHeatmap={handleSelectIndexFromNav}
          />
        ) : (
          <>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div>
                <h1 className="text-xl font-semibold tracking-tight text-slate-50 text-balance">
                  {viewTitle} Heat Map
                </h1>
                <p className="text-xs text-slate-400">
                  {viewSubtitle} · Showing{' '}
                  <span className="font-mono tabular-nums text-slate-200">
                    {visibleStocks.length}
                  </span>{' '}
                  of{' '}
                  <span className="font-mono tabular-nums text-slate-200">
                    {scopedStocks.length}
                  </span>{' '}
                  stocks
                </p>
              </div>
            </div>

            <HeatmapControls
              viewMode={viewMode}
              onChangeViewMode={(mode) => {
                setViewMode(mode);
                setSectorFilter('ALL');
                if (mode !== 'HOLDINGS' && sortBy === 'PNL_DESC') {
                  setSortBy('PCT_DESC');
                }
              }}
              selectedIndex={selectedIndex}
              onChangeIndex={(idx) => {
                setSelectedIndex(idx);
                setSectorFilter('ALL');
              }}
              sectorFilter={sectorFilter}
              sectors={sectors}
              onChangeSector={setSectorFilter}
              openSignalFilter={openSignalFilter}
              onChangeOpenSignalFilter={setOpenSignalFilter}
              openLowCount={breadth.openLowCount}
              openHighCount={breadth.openHighCount}
              searchQuery={searchQuery}
              onChangeSearch={setSearchQuery}
              sortBy={sortBy}
              onChangeSortBy={setSortBy}
              watchlistCount={watchlist.length}
              holdingsCount={holdings.length}
              hasActiveFilters={
                sectorFilter !== 'ALL' ||
                openSignalFilter !== 'ALL' ||
                selectedBucketId !== null ||
                searchQuery.trim().length > 0
              }
              onResetFilters={handleResetFilters}
              onPollNseNow={() => sendCommand({ type: 'poll_nse_now' })}
            />

            <ColorScaleBar
              buckets={buckets}
              stocksInScope={scopedStocks}
              selectedBucketId={selectedBucketId}
              onSelectBucket={setSelectedBucketId}
              onOpenCustomizer={() => setShowColorModal(true)}
            />

            <HeatmapGrid
              stocks={visibleStocks}
              buckets={buckets}
              holdingsMap={holdingsMap}
              watchlistSet={watchlistSet}
              selectedSymbol={selectedSymbol}
              loading={stocks.length === 0}
              onSelectStock={(sym) => setSelectedSymbol(sym)}
              onResetFilters={handleResetFilters}
            />
          </>
        )}
      </main>

      {showColorModal && (
        <ColorScaleModal
          config={colorScaleConfig}
          onApply={setColorScaleConfig}
          onClose={() => setShowColorModal(false)}
        />
      )}

      <StockInspectorDrawer
        stock={selectedStock}
        inWatchlist={
          selectedStock ? watchlistSet.has(selectedStock.symbol) : false
        }
        holding={
          selectedStock ? holdingsMap.get(selectedStock.symbol) : undefined
        }
        onClose={() => setSelectedSymbol(null)}
        onToggleWatchlist={(symbol) =>
          sendCommand({ type: 'toggle_watchlist', symbol })
        }
        onUpsertHolding={(symbol, qty, avgPrice) =>
          sendCommand({ type: 'upsert_holding', symbol, qty, avgPrice })
        }
        onRemoveHolding={(symbol) =>
          sendCommand({ type: 'remove_holding', symbol })
        }
      />
    </div>
  );
}
