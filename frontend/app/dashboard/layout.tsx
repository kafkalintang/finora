"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, BarChart3, BookOpen, Building2, FileBarChart, HandCoins, LayoutDashboard, LineChart, Loader2, Landmark, LogOut, Menu, Percent, PiggyBank, ReceiptText, Settings, ShieldCheck, Sparkles, TrendingUp, Users, Wallet, X, type LucideIcon } from "lucide-react";
import { Brand } from "@/components/AuthShell";
import { api, post, type User } from "@/lib/api";
import { UserContext } from "./user-context";

const nav: { label: string; icon: LucideIcon; phase?: number }[] = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Accounting", icon: BookOpen, phase: 2 }, { label: "Accounts Payable", icon: ReceiptText, phase: 3 },
  { label: "Accounts Receivable", icon: HandCoins, phase: 3 }, { label: "Cash & Bank", icon: Landmark, phase: 3 },
  { label: "Budget", icon: PiggyBank, phase: 4 }, { label: "Expenses", icon: Wallet, phase: 4 },
  { label: "Planning & Forecasting", icon: LineChart, phase: 5 }, { label: "Fixed Assets", icon: Building2, phase: 4 },
  { label: "Tax", icon: Percent, phase: 4 }, { label: "Investments", icon: TrendingUp, phase: 5 },
  { label: "Reports", icon: FileBarChart, phase: 5 }, { label: "Analytics", icon: BarChart3, phase: 5 },
  { label: "Audit & Control", icon: ShieldCheck, phase: 6 }, { label: "Risk Management", icon: AlertTriangle, phase: 6 },
  { label: "AI Assistant", icon: Sparkles, phase: 7 }, { label: "Administration", icon: Users, phase: 2 }, { label: "Settings", icon: Settings, phase: 2 },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    api<{ user: User }>("/auth/me").then((r) => setUser(r.user)).catch(() => router.replace("/login"));
  }, [router]);
  const logout = async () => { await post("/auth/logout").catch(() => undefined); router.replace("/login"); };

  if (!user) return <div className="flex min-h-screen items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-indigo-600" /></div>;

  const sidebar = (
    <div className="flex h-full flex-col bg-navy-900 text-slate-300">
      <div className="flex h-16 shrink-0 items-center justify-between px-5"><Brand dark /><button className="lg:hidden" onClick={() => setOpen(false)} aria-label="Tutup menu"><X className="h-5 w-5" /></button></div>
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 pb-4">
        {nav.map(({ label, icon: Icon, phase }) => phase ? (
          <div key={label} aria-disabled className="flex cursor-not-allowed items-center gap-3 rounded-lg px-3 py-2 text-sm opacity-45">
            <Icon className="h-4 w-4" /><span className="flex-1">{label}</span><span className="text-[11px]">Fase {phase}</span>
          </div>
        ) : (
          <div key={label} className="flex items-center gap-3 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white"><Icon className="h-4 w-4" />{label}</div>
        ))}
      </nav>
    </div>
  );

  return (
    <UserContext.Provider value={user}>
      <div className="min-h-screen lg:pl-64">
        <aside className="fixed inset-y-0 left-0 hidden w-64 lg:block">{sidebar}</aside>
        {open && <div className="fixed inset-0 z-40 lg:hidden"><div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} /><aside className="absolute inset-y-0 left-0 w-72 max-w-[85vw]">{sidebar}</aside></div>}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-slate-200 bg-white px-4 sm:px-6">
          <button className="rounded-lg p-2 hover:bg-slate-100 lg:hidden" onClick={() => setOpen(true)} aria-label="Buka menu"><Menu className="h-5 w-5" /></button>
          <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-navy-900">{user.company?.name}</p><p className="text-xs text-slate-500">Overview</p></div>
          <div className="hidden text-right sm:block"><p className="text-sm font-medium text-navy-900">{user.name}</p><p className="text-xs text-slate-500">{user.role.replaceAll("_", " ")}</p></div>
          <button onClick={logout} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100" aria-label="Keluar"><LogOut className="h-4 w-4" /><span className="hidden sm:inline">Keluar</span></button>
        </header>
        <main className="p-4 sm:p-6">{children}</main>
      </div>
    </UserContext.Provider>
  );
}
