import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { prisma } from "./prisma/client.js";
import { HttpError } from "./errors/http-error.js";

import { AuthService } from "./service/auth.service.js";
import { AuthController } from "./controller/auth.controller.js";
import { authRouter } from "./routes/auth.routes.js";
import { authMiddleware } from "./middleware/auth.middleware.js";

import { TasksService } from "./service/tasks.service.js";
import { TasksController } from "./controller/tasks.controller.js";
import { tasksRouter } from "./routes/tasks.routes.js";

const tasksService = new TasksService(prisma);
const tasksController = new TasksController(tasksService);

const authService = new AuthService();
const authController = new AuthController(authService);

export const app = express();

const allowedOrigins = new Set([
  "http://localhost:4200",
  "http://localhost:8100",
]);

app.use(express.json());

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.has(origin)) return callback(null, true);

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);

app.use("/api", authMiddleware);
app.use("/api", authRouter(authController));
app.use("/api", tasksRouter(tasksController));

app.get("/health/db", async (_req, res) => {
  const tasksCount = await prisma.task.count();
  res.json({ ok: true, tasksCount });
});

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).send("Server is working");
});

app.get("/crash", (_req: Request, _res: Response, next: NextFunction) => {
  next(new Error("Test error from /crash"));
});

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof HttpError) {
    return res.status(err.statusCode).json({ error: { message: err.message } });
  }

  return res.status(500).json({ error: { message: "Internal server error" } });
});
