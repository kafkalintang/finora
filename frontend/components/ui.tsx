"use client";
import { forwardRef, useState, type ComponentType, type InputHTMLAttributes } from "react";
import { AlertCircle, CheckCircle2, Eye, EyeOff, Loader2, type LucideProps } from "lucide-react";

type FieldProps = InputHTMLAttributes<HTMLInputElement> & { label: string; icon: ComponentType<LucideProps>; error?: string };
export const Field = forwardRef<HTMLInputElement, FieldProps>(({ label, icon: Icon, error, type, ...rest }, ref) => {
  const [show, setShow] = useState(false);
  const isPw = type === "password";
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">{label}</label>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input ref={ref} type={isPw && show ? "text" : type} {...rest}
          className={`h-11 w-full rounded-lg border bg-white pl-10 ${isPw ? "pr-10" : "pr-3"} text-base sm:text-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/25 ${error ? "border-red-400" : "border-slate-300"}`} />
        {isPw && (
          <button type="button" onClick={() => setShow(!show)} aria-label={show ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
});
Field.displayName = "Field";

export function Submit({ loading, children }: { loading: boolean; children: React.ReactNode }) {
  return (
    <button type="submit" disabled={loading}
      className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60">
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}{children}
    </button>
  );
}

export function Notice({ kind, children }: { kind: "error" | "success"; children: React.ReactNode }) {
  const Icon = kind === "error" ? AlertCircle : CheckCircle2;
  const tone = kind === "error" ? "border-red-200 bg-red-50 text-red-700" : "border-emerald-200 bg-emerald-50 text-emerald-700";
  return <div role="alert" className={`flex items-start gap-2 rounded-lg border p-3 text-sm ${tone}`}><Icon className="mt-0.5 h-4 w-4 shrink-0" /><span>{children}</span></div>;
}
