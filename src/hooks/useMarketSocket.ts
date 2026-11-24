import { useCallback, useEffect, useRef, useState } from 'react';
import type {
  FeedStatusPayload,
  HoldingEntry,
  IndexTicker,
  StockQuote,
  WsClientMessage,
  WsServerMessage,
} from '../types/market';

export type ConnectionStatus = 'connecting' | 'connected' | 'reconnecting';

export interface MarketSocketState {
  stocks: StockQuote[];
  indices: IndexTicker[];
  watchlist: string[];
  holdings: HoldingEntry[];
  feedStatus: FeedStatusPayload;
  connectionStatus: ConnectionStatus;
  lastServerTime: number | null;
  sendCommand: (cmd: WsClientMessage) => void;
}

const DEFAULT_FEED_STATUS: FeedStatusPayload = {
  paused: false,
  pollIntervalMs: 3000,
  feedState: 'CONNECTING',
  lastHttpStatus: null,
  lastSuccessAt: null,
  lastAttemptAt: null,
  statusMessage: 'Connecting to NSE WebSocket relay...',
};

export function useMarketSocket(): MarketSocketState {
  const [stocks, setStocks] = useState<StockQuote[]>([]);
  const [indices, setIndices] = useState<IndexTicker[]>([]);
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [holdings, setHoldings] = useState<HoldingEntry[]>([]);
  const [feedStatus, setFeedStatus] =
    useState<FeedStatusPayload>(DEFAULT_FEED_STATUS);
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>('connecting');
  const [lastServerTime, setLastServerTime] = useState<number | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const unmountedRef = useRef(false);

  const sendCommand = useCallback((cmd: WsClientMessage) => {
    const ws = wsRef.current;
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(cmd));
    }
  }, []);

  useEffect(() => {
    unmountedRef.current = false;
    let attempt = 0;

    const connect = () => {
      if (unmountedRef.current) return;
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws`;

      setConnectionStatus(attempt === 0 ? 'connecting' : 'reconnecting');
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        if (unmountedRef.current) return;
        attempt = 0;
        setConnectionStatus('connected');
      };

      ws.onmessage = (event) => {
        if (unmountedRef.current) return;
        try {
          const msg = JSON.parse(event.data as string) as WsServerMessage;
          switch (msg.type) {
            case 'snapshot': {
              setStocks(msg.payload.stocks);
              setIndices(msg.payload.indices);
              setWatchlist(msg.payload.watchlist);
              setHoldings(msg.payload.holdings);
              setFeedStatus(msg.payload.feedStatus);
              setLastServerTime(msg.payload.serverTime);
              break;
            }
            case 'ticks': {
              const deltaMap = new Map(
                msg.payload.deltas.map((d) => [d.symbol, d])
              );
              setStocks((prev) => {
                const updated = prev.map((stock) => {
                  const delta = deltaMap.get(stock.symbol);
                  if (!delta) return stock;
                  return {
                    ...stock,
                    ltp: delta.ltp,
                    open: delta.open,
                    high: delta.high,
                    low: delta.low,
                    prevClose: delta.prevClose,
                    change: delta.change,
                    pctChange: delta.pctChange,
                    volume: delta.volume,
                    first5mOpen: delta.first5mOpen,
                    first5mClose: delta.first5mClose,
                    first5mChangePct: delta.first5mChangePct,
                    tickDirection: delta.tickDirection,
                    lastTickAt: delta.lastTickAt,
                  };
                });
                if (msg.payload.newStocks && msg.payload.newStocks.length > 0) {
                  const seen = new Set(updated.map((s) => s.symbol));
                  for (const ns of msg.payload.newStocks) {
                    if (!seen.has(ns.symbol)) {
                      updated.push(ns);
                    }
                  }
                }
                return updated;
              });
              setIndices(msg.payload.indices);
              setLastServerTime(msg.payload.serverTime);
              break;
            }
            case 'portfolio_update': {
              setWatchlist(msg.payload.watchlist);
              setHoldings(msg.payload.holdings);
              break;
            }
            case 'feed_status': {
              setFeedStatus(msg.payload);
              break;
            }
          }
        } catch {
          // Ignore malformed WS message
        }
      };

      ws.onclose = () => {
        if (unmountedRef.current) return;
        wsRef.current = null;
        attempt += 1;
        setConnectionStatus('reconnecting');
        const delay = Math.min(
          5000,
          600 * Math.pow(1.5, Math.min(attempt, 5))
        );
        reconnectTimerRef.current = setTimeout(connect, delay);
      };

      ws.onerror = () => {
        ws.close();
      };
    };

    connect();

    return () => {
      unmountedRef.current = true;
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, []);

  return {
    stocks,
    indices,
    watchlist,
    holdings,
    feedStatus,
    connectionStatus,
    lastServerTime,
    sendCommand,
  };
}
