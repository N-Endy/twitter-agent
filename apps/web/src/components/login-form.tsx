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
        <span className="text-sm text-slate-300">Email</span>
        <input
          className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none ring-0 placeholder:text-slate-500 focus:border-cyan-300/40"
          name="email"
          type="email"
          placeholder="owner@example.com"
          required
        />
      </label>
      <label className="block">
        <span className="text-sm text-slate-300">Password</span>
        <input
          className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none ring-0 placeholder:text-slate-500 focus:border-cyan-300/40"
          name="password"
          type="password"
          placeholder="••••••••"
          required
        />
      </label>
      {error ? <p className="text-sm text-rose-300">{error}</p> : null}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-2xl bg-cyan-300 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? "Signing in..." : "Enter dashboard"}
      </button>
    </form>
  );
}
