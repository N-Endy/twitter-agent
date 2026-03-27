import type { Route } from "next";
import Link from "next/link";
import { type ReactNode } from "react";

import { DashboardNav } from "./dashboard-nav";

export function AppShell({
  title,
  subtitle,
  actions,
  children
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const navItems: Array<{ href: Route; label: string }> = [
    { href: "/", label: "Overview" },
    { href: "/sources", label: "Sources" },
    { href: "/ideas", label: "Ideas" },
    { href: "/drafts", label: "Drafts" },
    { href: "/scheduled", label: "Scheduled" },
    { href: "/published", label: "Published" },
    { href: "/mentions", label: "Mentions" },
    { href: "/replies", label: "Replies" },
    { href: "/incidents", label: "Incidents" },
    { href: "/prompts", label: "Prompt Versions" }
  ];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(73,125,255,0.18),_transparent_38%),linear-gradient(180deg,_#09111f_0%,_#07101b_100%)] text-slate-100">
      <div className="mx-auto flex w-full max-w-7xl gap-6 px-4 py-4 sm:px-6 sm:py-6 lg:gap-8 lg:px-10 lg:py-8">
        <aside className="hidden w-72 shrink-0 rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur lg:block">
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/80">Twitter Agent MVP</p>
          <h2 className="mt-3 text-2xl font-semibold text-white">Operator Console</h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            AI-assisted publishing, mentions triage, prompt control, and audit-safe workflows.
          </p>

          <DashboardNav items={navItems} variant="desktop" />
        </aside>

        <main className="min-w-0 flex-1">
          <div className="mb-4 rounded-[24px] border border-white/10 bg-white/[0.04] p-4 shadow-xl backdrop-blur lg:hidden">
            <p className="text-[11px] uppercase tracking-[0.32em] text-cyan-200/75">Twitter Agent MVP</p>
            <div className="mt-3 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-white">Operator Console</h2>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Jump between queues and keep the workflow moving from your phone.
                </p>
              </div>
              <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs text-cyan-100">
                Mobile
              </span>
            </div>
            <div className="mt-4">
              <DashboardNav items={navItems} variant="mobile" />
            </div>
          </div>

          <div className="rounded-[24px] border border-white/10 bg-slate-950/55 p-4 shadow-2xl backdrop-blur sm:rounded-[30px] sm:p-6">
            <div className="flex flex-col gap-5 border-b border-white/10 pb-5 sm:pb-6 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/80">Internal Dashboard</p>
                <h1 className="mt-3 text-2xl font-semibold text-white sm:text-3xl">{title}</h1>
                {subtitle ? (
                  <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">{subtitle}</p>
                ) : null}
              </div>
              {actions ? <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap">{actions}</div> : null}
            </div>

            <div className="mt-6 space-y-6">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}

export function MetricGrid({
  items
}: {
  items: Array<{ label: string; value: string | number; tone?: "default" | "good" | "warning" | "bad" }>;
}) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <article
          key={item.label}
          className="rounded-[20px] border border-white/10 bg-white/[0.04] p-4 shadow-lg sm:rounded-[24px] sm:p-5"
        >
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400">{item.label}</p>
          <p
            className={[
              "mt-4 text-2xl font-semibold sm:text-3xl",
              item.tone === "good"
                ? "text-emerald-300"
                : item.tone === "warning"
                  ? "text-amber-300"
                  : item.tone === "bad"
                    ? "text-rose-300"
                  : "text-white"
            ].join(" ")}
          >
            {item.value}
          </p>
        </article>
      ))}
    </section>
  );
}

export function Panel({
  title,
  kicker,
  actions,
  children
}: {
  title: string;
  kicker?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[20px] border border-white/10 bg-white/[0.04] p-4 shadow-lg sm:rounded-[24px] sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          {kicker ? <p className="text-xs uppercase tracking-[0.25em] text-cyan-200/70">{kicker}</p> : null}
          <h2 className="mt-2 text-xl font-semibold text-white">{title}</h2>
        </div>
        {actions ? <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">{actions}</div> : null}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export function StatusPill({ tone = "neutral", children }: { tone?: "neutral" | "good" | "warning" | "bad"; children: ReactNode }) {
  const toneClass =
    tone === "good"
      ? "border-emerald-300/20 bg-emerald-300/10 text-emerald-200"
      : tone === "warning"
        ? "border-amber-300/20 bg-amber-300/10 text-amber-200"
        : tone === "bad"
          ? "border-rose-300/20 bg-rose-300/10 text-rose-200"
          : "border-white/10 bg-white/10 text-slate-200";

  return (
    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${toneClass}`}>
      {children}
    </span>
  );
}

export function Table({
  headers,
  children
}: {
  headers: string[];
  children: ReactNode;
}) {
  return (
    <div className="dashboard-table-wrap">
      <table className="dashboard-table min-w-full divide-y divide-white/10 text-left text-sm">
        <thead className="bg-white/[0.04] text-slate-300">
          <tr>
            {headers.map((header) => (
              <th key={header} className="px-4 py-3 font-medium">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5 bg-slate-950/20">{children}</tbody>
      </table>
    </div>
  );
}

export function TableCell({
  children,
  label
}: {
  children: ReactNode;
  label: string;
}) {
  return (
    <td data-label={label} className="dashboard-cell px-4 py-3 align-top text-slate-200">
      {children}
    </td>
  );
}

export function MiniList({
  items,
  emptyLabel = "Nothing here yet."
}: {
  items: Array<ReactNode>;
  emptyLabel?: string;
}) {
  if (items.length === 0) {
    return <p className="text-sm text-slate-400">{emptyLabel}</p>;
  }

  return <div className="space-y-3">{items}</div>;
}

export function GhostLink({ href, children }: { href: Route; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex justify-center rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-100 transition hover:border-cyan-200/50 hover:bg-cyan-300/20"
    >
      {children}
    </Link>
  );
}
