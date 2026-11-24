import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import { WebSocket, WebSocketServer } from 'ws';
import type { WsClientMessage, WsServerMessage } from './src/types/market.ts';
import { MarketEngine } from './server/marketEngine.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = Number(process.env.PORT ?? 3000);
const IS_PROD = process.env.NODE_ENV === 'production';

async function startServer() {
  const app = express();
  app.use(express.json());

  const server = http.createServer(app);
  const wss = new WebSocketServer({ server, path: '/ws' });

  const broadcast = (message: WsServerMessage) => {
    const raw = JSON.stringify(message);
    for (const client of wss.clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(raw);
      }
    }
  };

  const marketEngine = new MarketEngine(
    (tickPayload) => {
      broadcast({ type: 'ticks', payload: tickPayload });
    },
    (statusPayload) => {
      broadcast({ type: 'feed_status', payload: statusPayload });
    }
  );
  marketEngine.start();

  app.get('/api/health', (_req, res) => {
    res.json({
      ok: true,
      clients: wss.clients.size,
      feedStatus: marketEngine.getFeedStatus(),
    });
  });

  app.get('/api/market/snapshot', (_req, res) => {
    res.json(marketEngine.getSnapshot());
  });

  wss.on('connection', (socket) => {
    const send = (msg: WsServerMessage) => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(msg));
      }
    };

    send({ type: 'snapshot', payload: marketEngine.getSnapshot() });

    socket.on('message', (data) => {
      try {
        const parsed = JSON.parse(data.toString()) as WsClientMessage;
        switch (parsed.type) {
          case 'request_snapshot': {
            send({ type: 'snapshot', payload: marketEngine.getSnapshot() });
            break;
          }
          case 'set_paused': {
            marketEngine.setPaused(Boolean(parsed.paused));
            break;
          }
          case 'set_speed': {
            marketEngine.setPollInterval(parsed.pollIntervalMs);
            break;
          }
          case 'poll_nse_now': {
            void marketEngine.pollNow();
            break;
          }
          case 'toggle_watchlist': {
            const portfolio = marketEngine.toggleWatchlist(parsed.symbol);
            broadcast({ type: 'portfolio_update', payload: portfolio });
            break;
          }
          case 'upsert_holding': {
            const portfolio = marketEngine.upsertHolding(
              parsed.symbol,
              parsed.qty,
              parsed.avgPrice
            );
            broadcast({ type: 'portfolio_update', payload: portfolio });
            break;
          }
          case 'remove_holding': {
            const portfolio = marketEngine.removeHolding(parsed.symbol);
            broadcast({ type: 'portfolio_update', payload: portfolio });
            break;
          }
        }
      } catch {
        // Ignore malformed client frames cleanly
      }
    });
  });

  if (IS_PROD) {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('/{*splat}', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: false },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`TradeTiger Equity Heatmap server listening on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
