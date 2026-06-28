import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import cluster from "cluster";
import os from "os";
import fs from "fs";

import { MongoService } from "./src/database/mongodb";
import { apiRouter } from "./src/server/routes/api.routes";

if (fs.existsSync(".env.local")) {
  dotenv.config({ path: ".env.local" });
} else {
  dotenv.config();
}

const app = express();
const PORT = 3000;

app.use(express.json());

// API Routes
app.use("/api", apiRouter);

// Configure Vite integration or static file server
async function startServer() {
  if (cluster.isPrimary) {
    // In dev mode, limit to 2 workers to save RAM (Vite uses a lot). In prod, use all CPUs.
    const numWorkers = process.env.NODE_ENV === "production" ? os.cpus().length : 2;
    console.log(`[Load Balancer] Primary process ${process.pid} is running.`);
    console.log(`[Load Balancer] Forking ${numWorkers} worker processes to balance load...`);
    
    for (let i = 0; i < numWorkers; i++) {
      cluster.fork();
    }
    
    cluster.on("exit", (worker, code, signal) => {
      console.warn(`[Load Balancer] Worker ${worker.process.pid} died. Restarting a new worker...`);
      cluster.fork();
    });
  } else {
    // Worker logic
    // 1. Initialize MongoDB Connection per worker
    const dbConnected = await MongoService.connect();
    if (!dbConnected) {
      console.warn(`[Worker ${process.pid}] Starting without MongoDB. Endpoints will fail unless MONGO_URI is valid.`);
    }

    if (process.env.NODE_ENV !== "production") {
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
    } else {
      const distPath = path.join(process.cwd(), "dist");
      app.use(express.static(distPath));
      app.get("*", (req, res) => {
        res.sendFile(path.join(distPath, "index.html"));
      });
    }

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`[Worker ${process.pid}] Kairos Server running at http://localhost:${PORT}`);
    });
  }
}

startServer();
