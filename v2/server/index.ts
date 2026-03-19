import express from "express";
import { createServer } from "http";
import { registerRoutes } from "./routes.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} ${res.statusCode} (${duration}ms)`);
  });
  next();
});

(async () => {
  await registerRoutes(app);

  // Error handling
  app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    console.error(err);
    res.status(status).json({ message });
  });

  const port = process.env.PORT || 5000;
  const httpServer = createServer(app);
  
  httpServer.listen(port, "0.0.0.0", () => {
    console.log(`v2 server listening on port ${port}`);
  });
})();
