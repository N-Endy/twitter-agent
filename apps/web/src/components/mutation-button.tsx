"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export function MutationButton({
  url,
  label,
  body,
  confirmText
}: {
  url: string;
  label: string;
  body?: Record<string, unknown>;
  confirmText?: string;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="space-y-2">
      <button
        type="button"
        disabled={isPending}
        className="inline-flex rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-2 text-xs font-medium text-emerald-100 transition hover:bg-emerald-300/20 disabled:cursor-not-allowed disabled:opacity-60"
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
      {error ? <p className="text-xs text-rose-300">{error}</p> : null}
    </div>
  );
}
