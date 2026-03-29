"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export function BrandVoiceEditor({ initialValue }: { initialValue: string | null }) {
  const router = useRouter();
  const [guide, setGuide] = useState(initialValue ?? "");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function save(nextGuide: string) {
    startTransition(async () => {
      setError(null);
      setNotice(null);

      const response = await fetch("/api/admin/settings/brand-voice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          guide: nextGuide
        })
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        setError(payload?.error ?? "Unable to save the brand voice.");
        return;
      }

      setNotice(nextGuide.trim() ? "Brand voice saved." : "Brand voice cleared.");
      router.refresh();
    });
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="block text-[11px] font-black uppercase tracking-[0.24em] text-slate-400">
          Account voice guide
        </label>
        <textarea
          value={guide}
          onChange={(event) => setGuide(event.target.value)}
          rows={14}
          placeholder="Paste the account-wide voice guide here. This sits above individual source notes and helps the system keep a consistent overall voice."
          className="w-full rounded-[22px] border border-white/10 bg-slate-950/40 px-4 py-4 text-sm leading-7 text-white outline-none transition focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]/30"
        />
        <div className="flex items-center justify-between gap-3 text-xs text-slate-400">
          <p>
            This applies across ideation, draft writing, and QA. Source notes still shape the lane of each source.
          </p>
          <span className="shrink-0 font-mono">{guide.trim().length} chars</span>
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <button
          type="button"
          disabled={isPending}
          onClick={() => save(guide)}
          className="inline-flex w-full justify-center border border-[var(--accent)]/40 bg-[var(--accent)]/15 px-4 py-2.5 text-[10px] font-black uppercase tracking-[0.22em] text-[var(--accent)] transition-all hover:border-[var(--accent)]/60 hover:bg-[var(--accent)]/25 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {isPending ? "Saving..." : "Save brand voice"}
        </button>
        <button
          type="button"
          disabled={isPending}
          onClick={() => {
            setGuide("");
            save("");
          }}
          className="inline-flex w-full justify-center border border-white/10 bg-white/5 px-4 py-2.5 text-[10px] font-black uppercase tracking-[0.22em] text-slate-300 transition-all hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          Clear
        </button>
      </div>

      {notice ? <p className="text-xs text-emerald-300">{notice}</p> : null}
      {error ? <p className="text-xs text-rose-300">{error}</p> : null}
    </div>
  );
}
