"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

type SlotOption = {
  id: string;
  label: string;
  isExperimental: boolean;
};

export function ScheduleDraftControls({
  draftId,
  slots
}: {
  draftId: string;
  slots: SlotOption[];
}) {
  const router = useRouter();
  const [selectedSlotId, setSelectedSlotId] = useState(slots[0]?.id ?? "");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function submit(body?: Record<string, unknown>, confirmText?: string) {
    if (confirmText && !window.confirm(confirmText)) {
      return;
    }

    startTransition(async () => {
      setError(null);

      const response = await fetch(`/api/admin/posts/${draftId}/schedule`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: body ? JSON.stringify(body) : undefined
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        setError(payload?.error ?? "Unable to schedule this draft.");
        return;
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
          onClick={() => submit(undefined, "Assign this draft to the next open slot?")}
          className="inline-flex w-full justify-center border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-4 py-2 text-[10px] uppercase tracking-widest font-bold text-[var(--accent)] transition-all hover:bg-[var(--accent)]/20 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {isPending ? "WORKING..." : "SCHEDULE NEXT"}
        </button>

        {slots.length > 0 ? (
          <>
            <select
              value={selectedSlotId}
              disabled={isPending}
              onChange={(event) => setSelectedSlotId(event.target.value)}
              className="min-w-0 flex-1 border border-white/10 bg-white/5 px-4 py-2 text-xs text-white outline-none focus:border-[var(--accent)]/40 focus:ring-1 focus:ring-[var(--accent)]/20 sm:min-w-[220px]"
            >
              {slots.map((slot) => (
                <option key={slot.id} value={slot.id} className="bg-slate-950">
                  {slot.label}{slot.isExperimental ? " • Experimental" : ""}
                </option>
              ))}
            </select>

            <button
              type="button"
              disabled={isPending || !selectedSlotId}
              onClick={() => submit({ slotId: selectedSlotId }, "Assign this draft to the selected slot?")}
              className="inline-flex w-full justify-center border border-white/10 bg-white/5 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-300 transition-all hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {isPending ? "WORKING..." : "SCHEDULE SELECTED"}
            </button>
          </>
        ) : null}
      </div>

      {error ? <p className="text-xs text-rose-300">{error}</p> : null}
    </div>
  );
}
