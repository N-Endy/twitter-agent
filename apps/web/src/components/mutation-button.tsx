"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export function MutationButton({
  url,
  label,
  body,
  confirmText,
  tone = "success",
  fullWidth = false,
  disabled = false
}: {
  url: string;
  label: string;
  body?: Record<string, unknown>;
  confirmText?: string;
  tone?: "success" | "warning" | "danger" | "neutral";
  fullWidth?: boolean;
  disabled?: boolean;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const toneClass =
    tone === "warning"
      ? "border-amber-300/30 bg-amber-400/10 text-amber-400 hover:bg-amber-400/20"
      : tone === "danger"
        ? "border-rose-300/30 bg-rose-500/10 text-rose-500 hover:bg-rose-500/20"
        : tone === "neutral"
          ? "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:border-white/20"
          : "border-[var(--accent)]/30 bg-[var(--accent)]/10 text-[var(--accent)] hover:bg-[var(--accent)]/20 hover:border-[var(--accent)]/50";

  return (
    <div className="space-y-2">
      <button
        type="button"
        disabled={isPending || disabled}
        aria-busy={isPending || disabled}
        className={`inline-flex w-full justify-center border border-white/10 px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-all disabled:cursor-not-allowed disabled:opacity-50 ${fullWidth ? "" : "sm:w-auto"} ${toneClass}`}
        onClick={() => {
          if (disabled) {
            return;
          }

          if (confirmText && !window.confirm(confirmText)) {
            return;
          }

          startTransition(async () => {
            setError(null);
            setSuccess(null);

            const response = await fetch(url, {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: body ? JSON.stringify(body) : undefined
            });

            if (!response.ok) {
              const payload = (await response.json().catch(() => null)) as { error?: string } | null;
              setError(payload?.error ?? "Request failed.");
              return;
            }

            const payload = (await response.json().catch(() => null)) as
              | { ok?: boolean; jobId?: string | number; queue?: string; message?: string }
              | null;

            if (payload?.message) {
              setSuccess(payload.message);
            } else if (payload?.jobId && payload?.queue) {
              setSuccess(`Queued on ${payload.queue} (#${payload.jobId}).`);
            } else {
              setSuccess("Done.");
            }

            router.refresh();
          });
        }}
      >
        {isPending ? "Working..." : label}
      </button>
      {success ? <p className="text-xs text-emerald-300" role="status">{success}</p> : null}
      {error ? <p className="text-xs text-rose-300" role="alert">{error}</p> : null}
    </div>
  );
}
