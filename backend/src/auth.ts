import { Request, Response, Router } from "express";
import { z } from "zod";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { prisma } from "./db";
import { env } from "./config";
import { authenticate, HttpError, wrap } from "./middleware";

const sha = (s: string) => crypto.createHash("sha256").update(s).digest("hex");
const DAY = 864e5;
const cookie = { httpOnly: true, secure: env.NODE_ENV === "production", sameSite: "lax" as const, path: "/" };

// Validasi password: minimal 10 karakter, ada huruf kecil, huruf besar, dan angka
const password = z.string().min(10, "Minimal 10 karakter").regex(/[a-z]/, "Harus ada huruf kecil").regex(/[A-Z]/, "Harus ada huruf besar").regex(/\d/, "Harus ada angka");

const registerSchema = z.object({ 
  name: z.string().trim().min(2), 
  companyName: z.string().trim().min(2), 
  email: z.string().trim().toLowerCase().email(), 
  password 
});

const loginSchema = z.object({ 
  email: z.string().trim().toLowerCase().email(), 
  password: z.string().min(1) 
});

const audit = (userId: string | null, action: string, req: Request) =>
  prisma.auditLog.create({ data: { userId, action, ip: req.ip } }).catch(() => undefined);

async function issueSession(res: Response, u: { id: string; companyId: string | null; role: { code: string } }) {
  const access = jwt.sign({ role: u.role.code, companyId: u.companyId }, env.JWT_ACCESS_SECRET, { subject: u.id, expiresIn: "15m" });
  const raw = crypto.randomBytes(48).toString("hex");
  
  await prisma.refreshToken.create({ 
    data: { 
      userId: u.id, 
      tokenHash: sha(raw), 
      expiresAt: new Date(Date.now() + 7 * DAY) 
    } 
  });
  
  res.cookie("finora_at", access, { ...cookie, maxAge: 15 * 60 * 1000 });
  res.cookie("finora_rt", raw, { ...cookie, maxAge: 7 * DAY });
}

// Format user yang dikirim ke frontend (tidak menyertakan passwordHash)
const publicUser = (u: any) => ({ 
  id: u.id, 
  name: u.name, 
  email: u.email, 
  role: u.role.code, 
  company: u.company && { id: u.company.id, name: u.company.name, baseCurrency: u.company.baseCurrency } 
});

const include = { role: true, company: true } as const;

export const authRouter = Router();

authRouter.post("/register", wrap(async (req, res) => {
  const d = registerSchema.parse(req.body);
  
  // Cek apakah email sudah terdaftar
  if (await prisma.user.findUnique({ where: { email: d.email } })) {
    throw new HttpError(409, "Email sudah terdaftar");
  }
  
  // Transaksi database: Buat Company, Role, dan User secara bersamaan
  const user = await prisma.$transaction(async (tx) => {
    const company = await tx.company.create({ data: { name: d.companyName } });
    
    const role = await tx.role.upsert({ 
      where: { code: "SUPER_ADMIN" }, 
      update: {}, 
      create: { code: "SUPER_ADMIN", name: "Super Administrator" } 
    });
    
    return tx.user.create({ 
      data: { 
        name: d.name, 
        email: d.email, 
        passwordHash: await bcrypt.hash(d.password, 12), 
        roleId: role.id, 
        companyId: company.id 
      }, 
      include 
    });
  });
  
  await issueSession(res, user); 
  await audit(user.id, "auth.register", req);
  
  res.status(201).json({ user: publicUser(user) });
}));

authRouter.post("/login", wrap(async (req, res) => {
  const d = loginSchema.parse(req.body);
  const user = await prisma.user.findUnique({ where: { email: d.email }, include });
  
  if (user?.lockedUntil && user.lockedUntil > new Date()) {
    throw new HttpError(423, "Akun terkunci sementara. Coba lagi dalam 15 menit");
  }
  
  const ok = user && user.isActive && (await bcrypt.compare(d.password, user.passwordHash));
  
  if (!user || !ok) {
    if (user) { 
      const n = user.failedLogins + 1; 
      await prisma.user.update({ 
        where: { id: user.id }, 
        data: { 
          failedLogins: n, 
          lockedUntil: n >= 5 ? new Date(Date.now() + 15 * 60 * 1000) : null 
        } 
      }); 
    }
    await audit(user?.id ?? null, "auth.login_failed", req);
    throw new HttpError(401, "Email atau kata sandi salah");
  }
  
  await prisma.user.update({ where: { id: user.id }, data: { failedLogins: 0, lockedUntil: null } });
  await issueSession(res, user); 
  await audit(user.id, "auth.login", req);
  
  res.json({ user: publicUser(user) });
}));

authRouter.post("/refresh", wrap(async (req, res) => {
  const raw = req.cookies?.finora_rt;
  if (!raw) throw new HttpError(401, "Belum masuk");
  
  const t = await prisma.refreshToken.findUnique({ where: { tokenHash: sha(raw) }, include: { user: { include } } });
  
  if (!t || t.revokedAt || t.expiresAt < new Date() || !t.user.isActive) {
    throw new HttpError(401, "Sesi berakhir");
  }
  
  await prisma.refreshToken.update({ where: { id: t.id }, data: { revokedAt: new Date() } });
  await issueSession(res, t.user);
  
  res.json({ ok: true });
}));

authRouter.post("/logout", wrap(async (req, res) => {
  const raw = req.cookies?.finora_rt;
  if (raw) {
    await prisma.refreshToken.updateMany({ 
      where: { tokenHash: sha(raw), revokedAt: null }, 
      data: { revokedAt: new Date() } 
    });
  }
  res.clearCookie("finora_at", cookie).clearCookie("finora_rt", cookie).json({ ok: true });
}));

authRouter.post("/forgot-password", wrap(async (req, res) => {
  const { email } = z.object({ email: z.string().trim().toLowerCase().email() }).parse(req.body);
  const user = await prisma.user.findUnique({ where: { email } });
  
  if (user && user.isActive) {
    const raw = crypto.randomBytes(32).toString("hex");
    await prisma.passwordResetToken.create({ 
      data: { 
        userId: user.id, 
        tokenHash: sha(raw), 
        expiresAt: new Date(Date.now() + 30 * 60 * 1000) 
      } 
    });
    // TODO Phase 7: kirim lewat SMTP. Untuk development, tautan dicetak ke console.
    console.log(`[reset-password] ${user.email}: ${env.FRONTEND_URL}/reset-password?token=${raw}`);
    await audit(user.id, "auth.forgot_password", req);
  }
  
  res.json({ message: "Jika email terdaftar, tautan reset kata sandi telah dikirim." });
}));

authRouter.post("/reset-password", wrap(async (req, res) => {
  const d = z.object({ token: z.string().min(20), password }).parse(req.body);
  const t = await prisma.passwordResetToken.findUnique({ where: { tokenHash: sha(d.token) } });
  
  if (!t || t.usedAt || t.expiresAt < new Date()) {
    throw new HttpError(400, "Tautan reset tidak valid atau sudah kedaluwarsa");
  }
  
  const passwordHash = await bcrypt.hash(d.password, 12);
  await prisma.$transaction([
    prisma.user.update({ where: { id: t.userId }, data: { passwordHash, failedLogins: 0, lockedUntil: null } }),
    prisma.passwordResetToken.update({ where: { id: t.id }, data: { usedAt: new Date() } }),
    prisma.refreshToken.updateMany({ where: { userId: t.userId, revokedAt: null }, data: { revokedAt: new Date() } }),
  ]);
  
  await audit(t.userId, "auth.reset_password", req);
  res.json({ message: "Kata sandi berhasil diubah. Silakan masuk." });
}));

authRouter.get("/me", authenticate, wrap(async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.auth!.userId }, include });
  if (!user) throw new HttpError(401, "Belum masuk");
  res.json({ user: publicUser(user) });
}));