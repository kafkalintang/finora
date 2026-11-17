"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock } from "lucide-react";
import { AuthShell } from "@/components/AuthShell";
import { Field, Notice, Submit } from "@/components/ui";
import { post } from "@/lib/api";
import { password } from "@/lib/schemas";

const schema = z.object({ password, confirm: z.string() }).refine((d) => d.password === d.confirm, { path: ["confirm"], message: "Kata sandi tidak sama" });
type Form = z.infer<typeof schema>;

function ResetForm() {
  const router = useRouter();
  const token = useSearchParams().get("token") ?? "";
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Form>({ resolver: zodResolver(schema) });
  const onSubmit = async (d: Form) => {
    setError("");
    try { await post("/auth/reset-password", { token, password: d.password }); setDone(true); setTimeout(() => router.push("/login"), 1800); }
    catch (e) { setError((e as Error).message); }
  };
  if (!token) return <Notice kind="error">Tautan tidak lengkap. <Link href="/forgot-password" className="font-semibold underline">Minta tautan baru</Link></Notice>;
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {error && <Notice kind="error">{error}</Notice>}
      {done && <Notice kind="success">Kata sandi berhasil diubah. Mengalihkan ke halaman masuk.</Notice>}
      <Field label="Kata sandi baru" icon={Lock} type="password" autoComplete="new-password" error={errors.password?.message} {...register("password")} />
      <Field label="Ulangi kata sandi baru" icon={Lock} type="password" autoComplete="new-password" error={errors.confirm?.message} {...register("confirm")} />
      <Submit loading={isSubmitting}>Simpan kata sandi baru</Submit>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <AuthShell title="Buat kata sandi baru" subtitle="Semua sesi yang sedang aktif akan keluar setelah kata sandi diubah."
      footer={<Link href="/login" className="font-semibold text-indigo-600 hover:underline">Kembali ke halaman masuk</Link>}>
      <Suspense><ResetForm /></Suspense>
    </AuthShell>
  );
}
