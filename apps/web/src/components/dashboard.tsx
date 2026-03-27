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
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(188,253,73,0.08),_transparent_45%),linear-gradient(180deg,_#030712_0%,_#020617_100%)] text-slate-100">
      <div className="mx-auto flex w-full max-w-7xl gap-6 px-4 py-4 sm:px-6 sm:py-6 lg:gap-8 lg:px-10 lg:py-8">
        <aside className="sidebar-scroll hidden w-72 shrink-0 self-start border border-white/5 bg-white/[0.02] p-6 backdrop-blur-md lg:sticky lg:top-6 lg:flex lg:max-h-[calc(100vh-3rem)] lg:flex-col lg:overflow-y-auto">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 bg-[var(--accent)] shadow-[0_0_8px_var(--accent)]" />
            <p className="text-[10px] uppercase tracking-[0.4em] text-[var(--accent)] opacity-80">System Operator</p>
          </div>
          <h2 className="mt-4 text-xl font-bold tracking-tight text-white">OPERATOR_CONSOLE</h2>
          <p className="mt-3 text-xs leading-5 text-slate-400">
            High-precision content pipeline, mention triage, and prompt version control.
          </p>

          <div className="mt-8 flex-1 space-y-8">
            <div className="border border-white/5 bg-white/[0.01] p-4">
              <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500">Pipeline Stages</p>
              <div className="mt-4 space-y-3 text-xs font-medium text-slate-300">
                {["Sources", "Ideas", "Drafts", "Published", "Mentions", "Replies"].map((step, index) => (
                  <div key={step} className="flex items-center gap-3">
                    <span className="flex h-5 w-5 items-center justify-center border border-white/10 bg-white/5 text-[9px] text-slate-400">
                      0{index + 1}
                    </span>
                    <span className="tracking-wide uppercase">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            <DashboardNav items={navItems} variant="desktop" />
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <div className="mb-6 border border-[var(--accent)]/20 bg-[var(--accent)]/5 p-4 lg:hidden">
            <p className="text-[10px] uppercase tracking-[0.4em] text-[var(--accent)]">System Operator</p>
            <div className="mt-3 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight">OPERATOR_CONSOLE</h2>
                <p className="mt-1 text-xs text-slate-400">
                  Mobile terminal active.
                </p>
              </div>
            </div>
            <div className="mt-4">
              <DashboardNav items={navItems} variant="mobile" />
            </div>
          </div>

          <div className="border border-white/10 bg-slate-950/40 p-4 shadow-2xl backdrop-blur-sm sm:p-8">
            <div className="flex flex-col gap-6 border-b border-white/10 pb-6 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.4em] text-[var(--accent)] font-semibold">Nexus Terminal v1.0</p>
                <h1 className="mt-4 text-3xl font-black uppercase tracking-tighter text-white sm:text-5xl">{title}</h1>
                {subtitle ? (
                  <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">{subtitle}</p>
                ) : null}
                <div className="mt-6 flex flex-wrap gap-2">
                  {["Research", "Ideation", "Approval", "Safety"].map((item) => (
                    <span
                      key={item}
                      className="inline-flex border border-white/10 bg-white/[0.03] px-2 py-1 text-[9px] uppercase tracking-[0.25em] text-slate-500 font-bold"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              {actions ? <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap">{actions}</div> : null}
            </div>

            <div className="mt-8 space-y-8">{children}</div>
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
          className="border border-white/10 bg-white/[0.02] p-5 shadow-inner"
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">{item.label}</p>
          <p
            className={[
              "mt-5 text-4xl font-black tracking-tight sm:text-5xl",
              item.tone === "good"
                ? "text-[var(--accent)]"
                : item.tone === "warning"
                  ? "text-amber-400"
                  : item.tone === "bad"
                    ? "text-rose-500"
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
  description,
  actions,
  children
}: {
  title: string;
  kicker?: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="border border-white/10 bg-white/[0.02] p-5 sm:p-6 shadow-xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          {kicker ? <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--accent)] opacity-70">{kicker}</p> : null}
          <h2 className="mt-2 text-xl font-bold uppercase tracking-tight text-white">{title}</h2>
          {description ? <p className="mt-2 max-w-2xl text-xs leading-6 text-slate-400">{description}</p> : null}
        </div>
        {actions ? <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">{actions}</div> : null}
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}

export function SummaryStrip({
  items
}: {
  items: Array<{ label: string; value: string | number; helper?: string; tone?: "default" | "good" | "warning" | "bad" }>;
}) {
  return (
    <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <article
          key={item.label}
          className="border border-white/5 bg-white/[0.01] p-4"
        >
          <div className="flex items-start justify-between gap-3">
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500">{item.label}</p>
            <span
              className={[
                "inline-flex h-1.5 w-1.5",
                item.tone === "good"
                  ? "bg-[var(--accent)]"
                  : item.tone === "warning"
                    ? "bg-amber-400"
                    : item.tone === "bad"
                      ? "bg-rose-500"
                      : "bg-slate-600"
              ].join(" ")}
            />
          </div>
          <p className="mt-4 text-3xl font-bold tracking-tight text-white">{item.value}</p>
          {item.helper ? <p className="mt-2 text-[10px] leading-5 text-slate-500 uppercase tracking-wide">{item.helper}</p> : null}
        </article>
      ))}
    </section>
  );
}

export function InfoNotice({
  title,
  tone = "neutral",
  children,
  actions
}: {
  title: string;
  tone?: "neutral" | "good" | "warning" | "bad";
  children: ReactNode;
  actions?: ReactNode;
}) {
  const toneClass =
    tone === "good"
      ? "border-[var(--accent)]/20 bg-[var(--accent)]/10 text-[var(--accent)]"
      : tone === "warning"
        ? "border-amber-400/20 bg-amber-400/10 text-amber-300"
        : tone === "bad"
          ? "border-rose-500/20 bg-rose-500/10 text-rose-300"
          : "border-white/10 bg-white/5 text-slate-300";

  return (
    <section className={`border p-5 shadow-2xl ${toneClass}`}>
      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className={`h-1.5 w-1.5 ${tone === 'bad' ? 'bg-rose-500' : tone === 'warning' ? 'bg-amber-400' : tone === 'good' ? 'bg-[var(--accent)]' : 'bg-slate-400'}`} />
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white underline decoration-[var(--accent)]/30 underline-offset-4">{title}</p>
          </div>
          <div className="mt-4 text-xs leading-7 text-slate-400 uppercase tracking-wide">{children}</div>
        </div>
        {actions ? <div className="flex flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap">{actions}</div> : null}
      </div>
    </section>
  );
}

export function EmptyState({
  title,
  body,
  actions
}: {
  title: string;
  body: string;
  actions?: ReactNode;
}) {
  return (
    <div className="border border-dashed border-white/10 bg-white/[0.01] p-8 text-center">
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-white">{title}</p>
      <p className="mx-auto mt-4 max-w-lg text-xs leading-6 text-slate-500 uppercase tracking-wide">{body}</p>
      {actions ? <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">{actions}</div> : null}
    </div>
  );
}

export function StatusPill({ tone = "neutral", children }: { tone?: "neutral" | "good" | "warning" | "bad"; children: ReactNode }) {
  const toneClass =
    tone === "good"
      ? "border-[var(--accent)]/30 bg-[var(--accent)]/20 text-[var(--accent)]"
      : tone === "warning"
        ? "border-amber-400/30 bg-amber-400/20 text-amber-400"
        : tone === "bad"
          ? "border-rose-500/30 bg-rose-500/20 text-rose-500"
          : "border-white/20 bg-white/10 text-slate-400";

  return (
    <span className={`inline-flex shrink-0 whitespace-nowrap border px-2 py-1 text-[9px] font-black uppercase tracking-[0.2em] shadow-sm ${toneClass}`}>
      {children}
    </span>
  );
}

export function Table({
  headers,
  children
}: {
  headers: Array<string | { label: string; className?: string }>;
  children: ReactNode;
}) {
  return (
    <div className="dashboard-table-wrap overflow-x-auto">
      <table className="dashboard-table min-w-[800px] w-full divide-y divide-white/10 text-left text-sm table-fixed">
        <thead className="bg-white/[0.04] text-slate-500 uppercase tracking-widest text-[9px] font-black">
          <tr>
            {headers.map((h, i) => {
              const label = typeof h === "string" ? h : h.label;
              const className = typeof h === "string" ? "" : h.className;
              return (
                <th key={label + i} className={`px-4 py-4 font-black ${className}`}>
                  {label}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5 bg-slate-950/20">{children}</tbody>
      </table>
    </div>
  );
}

export function TableCell({
  children,
  label,
  className = ""
}: {
  children: ReactNode;
  label: string;
  className?: string;
}) {
  return (
    <td data-label={label} className={`dashboard-cell px-4 py-4 align-top text-slate-300 ${className}`}>
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
      className="inline-flex justify-center border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--accent)] transition-all hover:bg-[var(--accent)]/20 hover:border-[var(--accent)]/50"
    >
      {children}
    </Link>
  );
}
