"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <form
      className="mt-6 space-y-5"
      onSubmit={async (event) => {
        event.preventDefault();
        setError(null);
        setIsLoading(true);

        const formData = new FormData(event.currentTarget);
        const result = await signIn("credentials", {
          email: String(formData.get("email") ?? ""),
          password: String(formData.get("password") ?? ""),
          redirect: false
        });

        setIsLoading(false);

        if (result?.error) {
          setError("Invalid email or password.");
          return;
        }

        router.push("/");
        router.refresh();
      }}
    >
      <label className="block">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Operator Email</p>
        <input
          className="mt-2 w-full border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition-all placeholder:text-slate-600 focus:border-[var(--accent)]/50 focus:bg-white/[0.08]"
          name="email"
          type="email"
          placeholder="operator@nexus.local"
          required
        />
      </label>
      <label className="block">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Security Key</p>
        <input
          className="mt-2 w-full border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition-all placeholder:text-slate-600 focus:border-[var(--accent)]/50 focus:bg-white/[0.08]"
          name="password"
          type="password"
          placeholder="••••••••"
          required
        />
      </label>
      {error ? <p className="text-xs font-bold uppercase tracking-wide text-rose-500">{error}</p> : null}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full border border-[var(--accent)]/40 bg-[var(--accent)]/10 py-4 text-[11px] font-black uppercase tracking-[0.3em] text-[var(--accent)] transition-all hover:bg-[var(--accent)]/20 hover:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading ? "Authenticating..." : "Establish Connection"}
      </button>
    </form>
  );
}
