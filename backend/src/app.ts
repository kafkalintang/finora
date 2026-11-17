import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { env } from "./config";
import { authRouter } from "./auth";
import { errorHandler, originGuard } from "./middleware";

export const app = express();
app.set("trust proxy", 1);
app.use(helmet());
app.use(cors({ origin: env.FRONTEND_URL, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use(originGuard);
app.get("/api/v1/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api/v1/auth", rateLimit({ windowMs: 15 * 60 * 1000, limit: 30, standardHeaders: true, legacyHeaders: false }), authRouter);
app.use(errorHandler);
