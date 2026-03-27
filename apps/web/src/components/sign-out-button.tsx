"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      type="button"
      className="inline-flex w-full justify-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:border-white/20 hover:bg-white/10 sm:w-auto"
      onClick={() => {
        void signOut({ callbackUrl: "/login" });
      }}
    >
      Sign out
    </button>
  );
}
