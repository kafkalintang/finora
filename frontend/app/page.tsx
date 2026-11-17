import Link from "next/link";
import { BarChart3, BookOpen, Building2, CheckCircle2, FileBarChart, HandCoins, KeyRound, Landmark, Layers, PiggyBank, ReceiptText, ScrollText, ShieldCheck, Sparkles, UserCheck, Wallet } from "lucide-react";
import { Brand } from "@/components/AuthShell";

const modules = [
  { icon: BookOpen, name: "Akuntansi", text: "Buku besar, jurnal berimbang, periode, dan penutupan." },
  { icon: ReceiptText, name: "Utang usaha", text: "Faktur vendor, jadwal bayar, dan deteksi faktur ganda." },
  { icon: HandCoins, name: "Piutang usaha", text: "Penagihan, nota kredit, dan laporan umur piutang." },
  { icon: Landmark, name: "Kas dan bank", text: "Banyak rekening, rekonsiliasi, dan proyeksi likuiditas." },
  { icon: PiggyBank, name: "Anggaran", text: "Anggaran per departemen dan proyek, realisasi vs rencana." },
  { icon: Wallet, name: "Pengeluaran", text: "Klaim, reimburse, dan unggah bukti dari ponsel." },
  { icon: Building2, name: "Aset tetap dan pajak", text: "Penyusutan, pelepasan, dan kalender kepatuhan pajak." },
  { icon: FileBarChart, name: "Laporan", text: "Laba rugi, neraca, arus kas, ekspor PDF, Excel, CSV." },
  { icon: Sparkles, name: "Asisten AI", text: "Menjelaskan varians dengan rujukan ke data yang Anda berhak lihat." },
];
const controls = [
  { icon: Layers, title: "Perusahaan, cabang, dan mata uang", text: "Kelola banyak entitas hukum, konsolidasi, dan kurs dalam satu tempat." },
  { icon: UserCheck, title: "Persetujuan berjenjang", text: "Batas nilai dan alur per departemen, bisa disetujui dari ponsel." },
  { icon: ScrollText, title: "Audit trail menyeluruh", text: "Siapa mengubah apa dan kapan, tidak bisa dihapus." },
  { icon: KeyRound, title: "Hak akses berbasis peran", text: "16 peran dengan batas per perusahaan, cabang, dan pusat biaya." },
];

function JournalPreview() {
  const rows = [["1-1100 Kas di Bank BCA", "125.000.000", ""], ["4-1000 Pendapatan Jasa", "", "112.612.613"], ["2-1300 PPN Keluaran", "", "12.387.387"]];
  return (
    <div className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-xl ring-1 ring-slate-200 sm:p-6" aria-label="Contoh jurnal">
      <div className="flex items-center justify-between gap-3">
        <div><p className="text-sm font-semibold text-navy-900">Jurnal JV-2026-00418</p><p className="text-xs text-slate-500">Penerimaan pembayaran faktur (contoh)</p></div>
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700"><CheckCircle2 className="h-3.5 w-3.5" />Berimbang</span>
      </div>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[420px] text-left text-sm">
          <thead className="text-xs text-slate-500"><tr><th className="py-2 font-medium">Akun</th><th className="py-2 text-right font-medium">Debit</th><th className="py-2 text-right font-medium">Kredit</th></tr></thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map(([a, d, c]) => <tr key={a}><td className="py-2.5 text-slate-700">{a}</td><td className="py-2.5 text-right tabular-nums">{d}</td><td className="py-2.5 text-right tabular-nums">{c}</td></tr>)}
          </tbody>
          <tfoot><tr className="border-t border-slate-200 font-semibold text-navy-900"><td className="py-2.5">Total</td><td className="py-2.5 text-right tabular-nums">125.000.000</td><td className="py-2.5 text-right tabular-nums">125.000.000</td></tr></tfoot>
        </table>
      </div>
    </div>
  );
}

export default function Landing() {
  return (
    <div className="bg-white">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <Brand />
          <nav className="hidden gap-8 text-sm font-medium text-slate-600 md:flex">
            <a href="#modul" className="hover:text-navy-900">Modul</a><a href="#kontrol" className="hover:text-navy-900">Kontrol dan keamanan</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/login" className="rounded-lg px-3.5 py-2 text-sm font-semibold text-navy-900 hover:bg-slate-100">Masuk</Link>
            <Link href="/register" className="rounded-lg bg-indigo-600 px-3.5 py-2 text-sm font-semibold text-white hover:bg-indigo-700">Daftar</Link>
          </div>
        </div>
      </header>

      <section className="bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-14 sm:py-20 lg:grid-cols-2">
          <div>
            <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-navy-900 sm:text-5xl">Satu sistem untuk seluruh keuangan perusahaan Anda.</h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-slate-600">Dari anggaran dan pembukuan sampai pembayaran dan laporan direksi. Setiap angka bisa ditelusuri ke jurnal dan dokumen asalnya.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/register" className="rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700">Daftarkan perusahaan</Link>
              <Link href="/login" className="rounded-lg border border-slate-300 px-5 py-3 text-sm font-semibold text-navy-900 hover:bg-slate-50">Masuk</Link>
            </div>
          </div>
          <div className="flex justify-center lg:justify-end"><JournalPreview /></div>
        </div>
      </section>

      <section id="modul" className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="max-w-xl text-3xl font-bold text-navy-900">Seluruh siklus keuangan, terhubung.</h2>
        <p className="mt-3 max-w-2xl text-slate-600">Faktur yang disetujui otomatis masuk ke utang usaha dan pembukuan. Pembayaran yang selesai memperbarui saldo utang, bank, dan buku besar.</p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map(({ icon: Icon, name, text }) => (
            <div key={name} className="rounded-xl border border-slate-200 p-5">
              <Icon className="h-6 w-6 text-indigo-600" /><h3 className="mt-3 font-semibold text-navy-900">{name}</h3><p className="mt-1 text-sm leading-relaxed text-slate-600">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="kontrol" className="bg-navy-900 text-white">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <div className="flex items-center gap-3"><ShieldCheck className="h-7 w-7 text-indigo-400" /><h2 className="text-3xl font-bold">Dibangun untuk diaudit.</h2></div>
          <div className="mt-10 grid gap-8 sm:grid-cols-2">
            {controls.map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex gap-4"><Icon className="mt-1 h-6 w-6 shrink-0 text-indigo-400" /><div><h3 className="font-semibold">{title}</h3><p className="mt-1 text-sm leading-relaxed text-slate-300">{text}</p></div></div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="flex flex-col items-start justify-between gap-6 rounded-2xl bg-indigo-600 p-8 text-white sm:flex-row sm:items-center sm:p-12">
          <div><h2 className="text-2xl font-bold sm:text-3xl">Siap merapikan keuangan perusahaan?</h2><p className="mt-2 text-indigo-100">Buat akun perusahaan dan mulai dari dashboard.</p></div>
          <Link href="/register" className="shrink-0 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-indigo-700 hover:bg-indigo-50">Daftarkan perusahaan</Link>
        </div>
      </section>

      <footer className="border-t border-slate-200 py-8 text-center text-sm text-slate-500">FINORA - Financial Operations & Intelligence Platform</footer>
    </div>
  );
}
