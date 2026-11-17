"use client";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Mail } from "lucide-react";
import { AuthShell } from "@/components/AuthShell";
import { Field, Notice, Submit } from "@/components/ui";
import { post } from "@/lib/api";
import { email } from "@/lib/schemas";

const schema = z.object({ email });
type Form = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Form>({ resolver: zodResolver(schema) });
  const onSubmit = async (d: Form) => {
    setError(""); setMsg("");
    try { const r = await post<{ message: string }>("/auth/forgot-password", d); setMsg(r.message); }
    catch (e) { setError((e as Error).message); }
  };
  return (
    <AuthShell title="Atur ulang kata sandi" subtitle="Masukkan email akun Anda. Kami akan mengirim tautan yang berlaku 30 menit."
      footer={<Link href="/login" className="inline-flex items-center gap-1.5 font-semibold text-indigo-600 hover:underline"><ArrowLeft className="h-4 w-4" />Kembali ke halaman masuk</Link>}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        {error && <Notice kind="error">{error}</Notice>}
        {msg && <Notice kind="success">{msg}</Notice>}
        <Field label="Email" icon={Mail} type="email" autoComplete="email" error={errors.email?.message} {...register("email")} />
        <Submit loading={isSubmitting}>Kirim tautan reset</Submit>
      </form>
    </AuthShell>
  );
}
