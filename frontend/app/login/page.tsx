"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Mail } from "lucide-react";
import { AuthShell } from "@/components/AuthShell";
import { Field, Notice, Submit } from "@/components/ui";
import { post } from "@/lib/api";
import { email } from "@/lib/schemas";

const schema = z.object({ email, password: z.string().min(1, "Kata sandi wajib diisi") });
type Form = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Form>({ resolver: zodResolver(schema) });
  const onSubmit = async (d: Form) => {
    setError("");
    try { await post("/auth/login", d); router.push("/dashboard"); }
    catch (e) { setError((e as Error).message); }
  };
  return (
    <AuthShell title="Masuk ke FINORA" subtitle="Gunakan akun perusahaan Anda untuk melanjutkan."
      footer={<>Belum punya akun? <Link href="/register" className="font-semibold text-indigo-600 hover:underline">Daftarkan perusahaan</Link></>}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        {error && <Notice kind="error">{error}</Notice>}
        <Field label="Email" icon={Mail} type="email" autoComplete="email" error={errors.email?.message} {...register("email")} />
        <Field label="Kata sandi" icon={Lock} type="password" autoComplete="current-password" error={errors.password?.message} {...register("password")} />
        <div className="text-right text-sm"><Link href="/forgot-password" className="font-medium text-indigo-600 hover:underline">Lupa kata sandi?</Link></div>
        <Submit loading={isSubmitting}>Masuk</Submit>
      </form>
    </AuthShell>
  );
}
