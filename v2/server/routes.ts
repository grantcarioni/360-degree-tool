import { type Request, Response } from "express";
import { type Server } from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import type { FeedbackRequest, StaffMember } from "../src/types.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cache staff data at startup — avoids blocking I/O on every request
const staffPath = path.join(__dirname, "data", "competencies.json");
let staffCache: StaffMember[] = [];
try {
  staffCache = JSON.parse(fs.readFileSync(staffPath, "utf8")) as StaffMember[];
} catch (e) {
  console.error("Failed to load staff data at startup:", e);
}

// In-memory feedback request store (prototype)
const feedbackRequests: FeedbackRequest[] = [
  {
    id: "req-1",
    subjectId: "1",
    subjectName: "Grant Carioni",
    status: "pending",
    dateRequested: "2026-03-15",
    raters: [
      { name: "Arif Pyarali", status: "submitted" },
      { name: "Aatekah Owais", status: "pending" },
      { name: "Sarah Chen", status: "pending" },
    ],
    competencies: ["HR Strategy", "Leadership"],
    personalNote: "Looking to develop my strategic leadership approach.",
  },
  {
    id: "req-2",
    subjectId: "1",
    subjectName: "Grant Carioni",
    status: "completed",
    dateRequested: "2025-11-01",
    raters: [
      { name: "Arif Pyarali", status: "submitted" },
      { name: "Priya Sharma", status: "submitted" },
    ],
    competencies: ["DEI Strategy", "Employee Relations"],
  },
];

export async function registerRoutes(app: any): Promise<Server> {

  // Staff API (replaces /api/competencies — people are not competencies)
  app.get("/api/staff", (_req: Request, res: Response) => {
    res.json(staffCache);
  });

  // Feedback Requests — GET
  app.get("/api/feedback-requests", (req: Request, res: Response) => {
    const { subjectId } = req.query;
    const results = subjectId
      ? feedbackRequests.filter((r) => r.subjectId === subjectId)
      : feedbackRequests;
    res.json(results);
  });

  // Feedback Requests — POST (submit a new request)
  app.post("/api/feedback-requests", (req: Request, res: Response) => {
    const { subjectId, subjectName, raters, personalNote, competencies } = req.body as {
      subjectId: string;
      subjectName: string;
      raters: string[];
      personalNote?: string;
      competencies?: string[];
    };

    if (!subjectId || !subjectName || !Array.isArray(raters) || raters.length === 0) {
      return res.status(400).json({ message: "subjectId, subjectName, and at least one rater are required." });
    }

    const newRequest: FeedbackRequest = {
      id: `req-${Date.now()}`,
      subjectId,
      subjectName,
      status: "pending",
      dateRequested: new Date().toISOString().split("T")[0],
      raters: raters.map((name) => ({ name, status: "pending" })),
      competencies: competencies ?? [],
      personalNote,
    };

    feedbackRequests.push(newRequest);
    return res.status(201).json(newRequest);
  });

  // Health check
  app.get("/api/health", (_req: Request, res: Response) => {
    res.json({ status: "ok", staffLoaded: staffCache.length });
  });

  return app;
}
