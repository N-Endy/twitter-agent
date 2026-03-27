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
      ? "border-cyan-200/50 bg-cyan-300/20 text-white shadow-lg shadow-cyan-950/30"
      : "border-white/10 bg-white/[0.04] text-slate-200";
  }

  return isActive
    ? "border-cyan-300/30 bg-cyan-300/10 text-white"
    : "border-transparent text-slate-200 hover:border-cyan-300/30 hover:bg-cyan-300/10 hover:text-white";
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
              className={`inline-flex min-h-11 items-center justify-center rounded-2xl border px-4 py-2 text-center text-sm transition ${linkTone(isActive, "mobile")}`}
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
            className={`block rounded-2xl border px-4 py-3 text-sm transition ${linkTone(isActive, "desktop")}`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
