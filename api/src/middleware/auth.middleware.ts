import type { NextFunction, Request, Response } from "express";
import { HttpError } from "../errors/http-error.js";

export function authMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  if (req.method === "POST" && req.path === "/login") return next();

  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    throw new HttpError(401, "Missing Authorization header");
  }

  const token = header.slice("Bearer ".length).trim();
  const expected = process.env.AUTH_TOKEN || "valid-token";

  if (token !== expected) {
    throw new HttpError(401, "Invalid token");
  }

  return next();
}
