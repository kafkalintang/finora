"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, Lock, Mail, User } from "lucide-react";
import { AuthShell } from "@/components/AuthShell";
import { Field, Notice, Submit } from "@/components/ui";
import { ApiError, post } from "@/lib/api";
import { email, password } from "@/lib/schemas";

const schema = z.object({
  name: z.string().trim().min(2, "Nama minimal 2 karakter"),
  companyName: z.string().trim().min(2, "Nama perusahaan minimal 2 karakter"),
  email, password, confirm: z.string(),
}).refine((d) => d.password === d.confirm, { path: ["confirm"], message: "Kata sandi tidak sama" });
type Form = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const { register, handleSubmit, setError: setFieldError, formState: { errors, isSubmitting } } = useForm<Form>({ resolver: zodResolver(schema) });
  const onSubmit = async ({ confirm: _c, ...d }: Form) => {
    setError("");
    try { await post("/auth/register", d); router.push("/dashboard"); }
    catch (e) {
      if (e instanceof ApiError && e.status === 409) setFieldError("email", { message: e.message });
      else setError((e as Error).message);
    }
  };
  return (
    <AuthShell title="Daftarkan perusahaan Anda" subtitle="Akun pertama menjadi Super Administrator dan dapat mengundang tim."
      footer={<>Sudah punya akun? <Link href="/login" className="font-semibold text-indigo-600 hover:underline">Masuk</Link></>}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        {error && <Notice kind="error">{error}</Notice>}
        <Field label="Nama lengkap" icon={User} autoComplete="name" error={errors.name?.message} {...register("name")} />
        <Field label="Nama perusahaan" icon={Building2} autoComplete="organization" error={errors.companyName?.message} {...register("companyName")} />
        <Field label="Email kerja" icon={Mail} type="email" autoComplete="email" error={errors.email?.message} {...register("email")} />
        <Field label="Kata sandi" icon={Lock} type="password" autoComplete="new-password" error={errors.password?.message} {...register("password")} />
        <Field label="Ulangi kata sandi" icon={Lock} type="password" autoComplete="new-password" error={errors.confirm?.message} {...register("confirm")} />
        <p className="text-xs text-slate-500">Minimal 10 karakter dengan huruf besar, huruf kecil, dan angka.</p>
        <Submit loading={isSubmitting}>Buat akun</Submit>
      </form>
    </AuthShell>
  );
}
