import Link from "next/link";
import { BookCheck, Landmark, ShieldCheck, Wallet } from "lucide-react";

export function Brand({ dark = false }: { dark?: boolean }) {
  return (
    <Link href="/" className="inline-flex items-center gap-2.5">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500 text-lg font-bold text-white">F</span>
      <span className={`text-lg font-bold tracking-tight ${dark ? "text-white" : "text-navy-900"}`}>FINORA</span>
    </Link>
  );
}

const points = [
  { icon: BookCheck, text: "Jurnal berimbang dan terkunci setelah diposting" },
  { icon: Landmark, text: "Kas, bank, utang, dan piutang dalam satu sistem" },
  { icon: ShieldCheck, text: "Setiap perubahan tercatat di audit trail" },
  { icon: Wallet, text: "Anggaran dan persetujuan berjenjang" },
];

export function AuthShell({ title, subtitle, children, footer }: { title: string; subtitle: string; children: React.ReactNode; footer: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      <aside className="hidden flex-col justify-between bg-navy-900 p-12 text-white lg:flex">
        <Brand dark />
        <div>
          <h2 className="max-w-md text-3xl font-bold leading-tight">Keuangan perusahaan yang bisa Anda pertanggungjawabkan.</h2>
          <ul className="mt-8 space-y-4">
            {points.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-sm text-slate-300"><Icon className="h-5 w-5 text-indigo-400" />{text}</li>
            ))}
          </ul>
        </div>
        <p className="text-xs text-slate-400">Financial Operations & Intelligence Platform</p>
      </aside>
      <main className="flex flex-col justify-center px-5 py-10 sm:px-12">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8 lg:hidden"><Brand /></div>
          <h1 className="text-2xl font-bold text-navy-900">{title}</h1>
          <p className="mt-2 text-sm text-slate-600">{subtitle}</p>
          <div className="mt-8 space-y-5">{children}</div>
          <div className="mt-8 text-center text-sm text-slate-600">{footer}</div>
        </div>
      </main>
    </div>
  );
}
