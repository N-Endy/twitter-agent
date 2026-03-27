"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export function MutationButton({
  url,
  label,
  body,
  confirmText,
  tone = "success"
}: {
  url: string;
  label: string;
  body?: Record<string, unknown>;
  confirmText?: string;
  tone?: "success" | "warning" | "danger" | "neutral";
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const toneClass =
    tone === "warning"
      ? "border-amber-300/20 bg-amber-300/10 text-amber-100 hover:bg-amber-300/20"
      : tone === "danger"
        ? "border-rose-300/20 bg-rose-300/10 text-rose-100 hover:bg-rose-300/20"
        : tone === "neutral"
          ? "border-white/10 bg-white/5 text-slate-100 hover:bg-white/10"
          : "border-emerald-300/20 bg-emerald-300/10 text-emerald-100 hover:bg-emerald-300/20";

  return (
    <div className="space-y-2">
      <button
        type="button"
        disabled={isPending}
        aria-busy={isPending}
        className={`inline-flex w-full justify-center rounded-full border px-3 py-2 text-xs font-medium transition disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto ${toneClass}`}
        onClick={() => {
          if (confirmText && !window.confirm(confirmText)) {
            return;
          }

          startTransition(async () => {
            setError(null);

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

            router.refresh();
          });
        }}
      >
        {isPending ? "Working..." : label}
      </button>
      {error ? <p className="text-xs text-rose-300" role="alert">{error}</p> : null}
    </div>
  );
}
