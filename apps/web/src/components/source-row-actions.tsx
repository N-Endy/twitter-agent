"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

type SourceRowActionsProps = {
  source: {
    id: string;
    title: string;
    notes: string | null;
    isActive: boolean;
  };
};

export function SourceRowActions({ source }: SourceRowActionsProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(source.title);
  const [notes, setNotes] = useState(source.notes ?? "");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function send(body: Record<string, unknown>) {
    startTransition(async () => {
      setError(null);

      const response = await fetch(`/api/admin/sources/${source.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        setError(payload?.error ?? "Unable to update this source.");
        return;
      }

      if (body.action === "edit") {
        setIsEditing(false);
      }

      router.refresh();
    });
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <button
          type="button"
          disabled={isPending}
          onClick={() => send({ action: "toggle" })}
          className="inline-flex w-full justify-center rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-2 text-xs font-medium text-amber-100 transition hover:bg-amber-300/20 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {isPending ? "Working..." : source.isActive ? "Pause" : "Resume"}
        </button>

        <button
          type="button"
          disabled={isPending}
          onClick={() => {
            setError(null);
            setIsEditing((current) => !current);
          }}
          className="inline-flex w-full justify-center rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-slate-100 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {isEditing ? "Cancel edit" : "Edit"}
        </button>
      </div>

      {isEditing ? (
        <div className="space-y-3 rounded-2xl border border-white/10 bg-slate-950/30 p-3">
          <div>
            <label className="mb-1 block text-[11px] uppercase tracking-[0.18em] text-slate-400">Title</label>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-cyan-300/40 focus:ring-1 focus:ring-cyan-300/20"
            />
          </div>

          <div>
            <label className="mb-1 block text-[11px] uppercase tracking-[0.18em] text-slate-400">Notes</label>
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              rows={3}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-cyan-300/40 focus:ring-1 focus:ring-cyan-300/20"
            />
          </div>

          <button
            type="button"
            disabled={isPending}
            onClick={() => send({ action: "edit", title, notes })}
            className="inline-flex w-full justify-center rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-2 text-xs font-medium text-cyan-100 transition hover:bg-cyan-300/20 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {isPending ? "Saving..." : "Save changes"}
          </button>
        </div>
      ) : null}

      {error ? <p className="text-xs text-rose-300">{error}</p> : null}
    </div>
  );
}
