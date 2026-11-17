import "dotenv/config";
import { z } from "zod";
export const env = z.object({
  NODE_ENV: z.string().default("development"),
  PORT: z.coerce.number().default(4000),
  DATABASE_URL: z.string(),
  FRONTEND_URL: z.string().default("http://localhost:3000"),
  JWT_ACCESS_SECRET: z.string().min(32),
}).parse(process.env);
