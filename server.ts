import express from "express";
import { createServer } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);
  const wss = new WebSocketServer({ server });

  const PORT = 3000;

  // Store current votes in memory (server-side source of truth)
  let votes: Record<string, number> = {};

  // WebSocket connection handling
  wss.on("connection", (ws) => {
    console.log("New client connected");

    // Send current state to the new client
    ws.send(JSON.stringify({ type: "SYNC_VOTES", votes }));

    ws.on("message", (data) => {
      try {
        const message = JSON.parse(data.toString());

        if (message.type === "VOTE") {
          const { optionId } = message;
          votes[optionId] = (votes[optionId] || 0) + 1;
          
          // Broadcast update to all clients
          const broadcastData = JSON.stringify({ type: "VOTE_UPDATE", votes });
          wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(broadcastData);
            }
          });
        }

        if (message.type === "RESET_VOTES") {
          votes = {};
          const broadcastData = JSON.stringify({ type: "VOTE_UPDATE", votes });
          wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(broadcastData);
            }
          });
        }
      } catch (err) {
        console.error("Error processing message:", err);
      }
    });

    ws.on("close", () => {
      console.log("Client disconnected");
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
