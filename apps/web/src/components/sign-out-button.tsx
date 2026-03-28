"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      type="button"
      className="inline-flex w-full justify-center border border-white/10 bg-white/5 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-300 transition-all hover:bg-white/10 sm:w-auto"
      onClick={() => {
        void signOut({ callbackUrl: "/login" });
      }}
    >
      Sign out
    </button>
  );
}
