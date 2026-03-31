"use client";

import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  href: Route;
  label: string;
};

function linkTone(isActive: boolean, variant: "desktop" | "mobile") {
  if (variant === "mobile") {
    return isActive
      ? "border-[var(--accent)]/40 bg-[var(--accent)]/15 text-white shadow-lg shadow-black/40"
      : "border-white/10 bg-white/[0.04] text-slate-200";
  }

  return isActive
    ? "border-[var(--accent)]/30 bg-[var(--accent)]/10 text-white"
    : "border-transparent text-slate-400 hover:border-white/10 hover:bg-white/[0.04] hover:text-white";
}

export function DashboardNav({
  items,
  variant
}: {
  items: NavItem[];
  variant: "desktop" | "mobile";
}) {
  const pathname = usePathname();

  if (variant === "mobile") {
    return (
      <nav className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {items.map(({ href, label }) => {
          const isActive = pathname === href;

          return (
            <Link
              key={href}
              href={href}
              className={`inline-flex min-h-12 items-center justify-center border px-2 py-2 sm:px-4 text-center text-[9px] sm:text-[10px] leading-tight font-bold uppercase tracking-widest transition-all ${linkTone(isActive, "mobile")}`}
            >
              {label}
            </Link>
          );
        })}
      </nav>
    );
  }

  return (
    <nav className="mt-8 space-y-2">
      {items.map(({ href, label }) => {
        const isActive = pathname === href;

        return (
          <Link
            key={href}
            href={href}
            className={`block border px-4 py-3 text-[11px] font-bold uppercase tracking-[0.2em] transition-all ${linkTone(isActive, "desktop")}`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
