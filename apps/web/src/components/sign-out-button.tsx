"use client";

import { signOut } from "next-auth/react";

export function SignOutButton({ email }: { email?: string | null }) {
  return (
    <button
      type="button"
      className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:border-white/20 hover:bg-white/10"
      onClick={() => {
        void signOut({ callbackUrl: "/login" });
      }}
    >
      Sign out {email ? `(${email})` : ""}
    </button>
  );
}
