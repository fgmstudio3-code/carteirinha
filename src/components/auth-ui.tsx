import { InputHTMLAttributes } from "react";

export function FormField({
  label,
  ...props
}: { label: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="mb-4">
      <label className="mb-1.5 block text-sm font-medium text-slate-200">
        {label}
      </label>
      <input
        {...props}
        className="w-full rounded-lg border border-white/10 bg-slate-900/60 px-3.5 py-2.5 text-white placeholder:text-slate-500 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30"
      />
    </div>
  );
}

export function SubmitButton({
  children,
  pending,
}: {
  children: React.ReactNode;
  pending?: boolean;
}) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2.5 font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Aguarde..." : children}
    </button>
  );
}

export function FormMessage({ error, success }: { error?: string; success?: string }) {
  if (!error && !success) return null;
  return (
    <div
      className={`mb-4 rounded-lg px-3.5 py-2.5 text-sm ${
        error
          ? "border border-red-500/30 bg-red-500/10 text-red-300"
          : "border border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
      }`}
    >
      {error || success}
    </div>
  );
}

export function AuthLinks({
  links,
}: {
  links: { label: string; href: string }[];
}) {
  return (
    <div className="mt-6 flex flex-col items-center gap-2 text-sm text-slate-400">
      {links.map((link) => (
        <a key={link.href} href={link.href} className="hover:text-white transition">
          {link.label}
        </a>
      ))}
    </div>
  );
}

