import { z } from "zod";
export const email = z.string().trim().email("Email tidak valid");
export const password = z.string().min(10, "Minimal 10 karakter").regex(/[a-z]/, "Harus ada huruf kecil").regex(/[A-Z]/, "Harus ada huruf besar").regex(/\d/, "Harus ada angka");
