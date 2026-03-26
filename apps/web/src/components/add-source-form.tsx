"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const SOURCE_KINDS = [
  { value: "URL", label: "URL (article / blog)" },
  { value: "RSS", label: "RSS Feed" },
  { value: "X_POST", label: "X Post" },
  { value: "X_ACCOUNT", label: "X Account" }
];

export function AddSourceForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = new FormData(e.currentTarget);
    const body = {
      title: form.get("title"),
      uri: form.get("uri"),
      kind: form.get("kind"),
      notes: form.get("notes") || undefined
    };

    const res = await fetch("/api/admin/sources", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Something went wrong.");
      setLoading(false);
      return;
    }

    setOpen(false);
    router.refresh();
    setLoading(false);
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-5 py-2.5 text-sm font-medium text-cyan-100 transition hover:border-cyan-200/50 hover:bg-cyan-300/20 sm:w-auto"
      >
        <span className="text-lg leading-none">+</span> Add source
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-[20px] border border-white/10 bg-white/[0.04] p-4 sm:p-5"
    >
      <h3 className="text-lg font-semibold text-white">Add a new source</h3>

      {error && (
        <p className="rounded-lg border border-rose-300/20 bg-rose-300/10 px-4 py-2 text-sm text-rose-200">
          {error}
        </p>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs uppercase tracking-wider text-slate-400">Title</label>
          <input
            name="title"
            required
            placeholder="e.g. TechCrunch AI"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-300/40 focus:ring-1 focus:ring-cyan-300/20"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs uppercase tracking-wider text-slate-400">Kind</label>
          <select
            name="kind"
            required
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-cyan-300/40 focus:ring-1 focus:ring-cyan-300/20"
          >
            {SOURCE_KINDS.map((k) => (
              <option key={k.value} value={k.value} className="bg-slate-900">
                {k.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs uppercase tracking-wider text-slate-400">URI</label>
        <input
          name="uri"
          required
          placeholder="https://example.com/feed.xml or @username"
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-300/40 focus:ring-1 focus:ring-cyan-300/20"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs uppercase tracking-wider text-slate-400">Notes (optional)</label>
        <input
          name="notes"
          placeholder="Any notes about this source"
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-300/40 focus:ring-1 focus:ring-cyan-300/20"
        />
      </div>

      <div className="flex flex-col gap-3 pt-2 sm:flex-row">
        <button
          type="submit"
          disabled={loading}
          className="rounded-full border border-cyan-300/20 bg-cyan-400/20 px-6 py-2.5 text-sm font-medium text-cyan-100 transition hover:bg-cyan-400/30 disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add source"}
        </button>
        <button
          type="button"
          onClick={() => { setOpen(false); setError(null); }}
          className="rounded-full border border-white/10 bg-white/5 px-6 py-2.5 text-sm text-slate-300 transition hover:bg-white/10"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
