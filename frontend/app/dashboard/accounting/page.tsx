export default function AccountingPage() {
  return (
    <div className="space-y-6">
      {/* Header Halaman */}
      <div>
        <h1 className="text-2xl font-bold text-navy-900">Accounting</h1>
        <p className="mt-1 text-sm text-slate-500">
          Kelola jurnal umum, buku besar, dan laporan keuangan perusahaan Anda.
        </p>
      </div>

      {/* Kotak Placeholder */}
      <div className="flex h-64 flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 text-center">
        <div className="mb-3 rounded-full bg-indigo-100 p-3 text-indigo-600">
          {/* Ikon sederhana sebagai hiasan */}
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-navy-900">Modul Accounting Segera Hadir</h3>
        <p className="mt-1 max-w-sm text-sm text-slate-500">
          Fitur ini sedang dalam tahap pengembangan. Silakan kembali lagi nanti.
        </p>
      </div>
    </div>
  );
}