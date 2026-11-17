"use client";
import { Building2, CalendarRange, Coins, ShieldCheck } from "lucide-react";
import { useUser } from "./user-context";

export default function DashboardHome() {
  const user = useUser();
  const cards = [
    { icon: Building2, label: "Perusahaan", value: user.company?.name ?? "-" },
    { icon: ShieldCheck, label: "Peran Anda", value: user.role.replaceAll("_", " ") },
    { icon: Coins, label: "Mata uang dasar", value: user.company?.baseCurrency ?? "-" },
    { icon: CalendarRange, label: "Tahun fiskal", value: "Mulai Januari" },
  ];
  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="text-xl font-bold text-navy-900 sm:text-2xl">Selamat datang, {user.name}</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ icon: Icon, label, value }) => (
          <div key={label} className="rounded-xl border border-slate-200 bg-white p-5">
            <Icon className="h-5 w-5 text-indigo-600" /><p className="mt-3 text-xs text-slate-500">{label}</p><p className="mt-0.5 break-words font-semibold text-navy-900">{value}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
        <p className="font-semibold text-navy-900">Belum ada data keuangan</p>
        <p className="mx-auto mt-1 max-w-md text-sm text-slate-600">Ringkasan pendapatan, biaya, dan kas muncul di sini setelah modul akuntansi aktif pada Fase 2.</p>
      </div>
    </div>
  );
}
