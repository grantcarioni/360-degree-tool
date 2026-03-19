import { type Request, Response, NextFunction } from "express";
import { type Server } from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function registerRoutes(app: any): Promise<Server> {
  // Competencies API
  app.get("/api/competencies", (req: Request, res: Response) => {
    try {
      const competenciesPath = path.join(__dirname, "data", "competencies.json");
      const data = fs.readFileSync(competenciesPath, "utf8");
      res.json(JSON.parse(data));
    } catch (error) {
      console.error("Error reading competencies:", error);
      res.status(500).json({ message: "Failed to load competencies" });
    }
  });

  // Mock Feedback Requests API
  app.get("/api/feedback-requests", (req: Request, res: Response) => {
    res.json([
      {
        id: "req-1",
        subjectName: "Grant Carioni",
        status: "pending",
        dateRequested: "2024-03-15",
        raters: [
          { name: "Arif Pyarali", status: "submitted" },
          { name: "Aatekah Owais", status: "pending" }
        ],
        competencies: ["HR Strategy", "Leadership"]
      }
    ]);
  });

  // Health check
  app.get("/api/health", (req: Request, res: Response) => {
    res.json({ status: "ok" });
  });

  return app;
}
