import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ZodError } from "zod";
import { env } from "./config";

declare global { namespace Express { interface Request { auth?: { userId: string; role: string; companyId: string | null } } } }

export class HttpError extends Error { constructor(public status: number, message: string) { super(message); } }

type Handler = (req: Request, res: Response, next: NextFunction) => Promise<unknown>;
export const wrap = (fn: Handler) => (req: Request, res: Response, next: NextFunction) => { fn(req, res, next).catch(next); };

export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const token = req.cookies?.finora_at;
  if (!token) return next(new HttpError(401, "Belum masuk"));
  try {
    const p = jwt.verify(token, env.JWT_ACCESS_SECRET) as jwt.JwtPayload;
    req.auth = { userId: p.sub as string, role: p.role, companyId: p.companyId ?? null };
    next();
  } catch { next(new HttpError(401, "Sesi berakhir")); }
}

export const requireRole = (...roles: string[]) => (req: Request, _res: Response, next: NextFunction) =>
  req.auth && roles.includes(req.auth.role) ? next() : next(new HttpError(403, "Anda tidak memiliki akses"));

export function originGuard(req: Request, _res: Response, next: NextFunction) {
  const origin = req.headers.origin;
  if (req.method !== "GET" && origin && origin !== env.FRONTEND_URL) return next(new HttpError(403, "Origin tidak diizinkan"));
  next();
}

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ZodError) return res.status(422).json({ message: "Data tidak valid", fields: err.flatten().fieldErrors });
  if (err instanceof HttpError) return res.status(err.status).json({ message: err.message });
  console.error(err);
  res.status(500).json({ message: "Terjadi kesalahan pada server" });
}
