"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const SOURCE_KINDS = [
  { value: "URL", label: "URL (article / blog)" },
  { value: "RSS", label: "RSS Feed" },
  { value: "X_POST", label: "X Post" },
  { value: "X_ACCOUNT", label: "X Account" }
];

const SOURCE_MODES = [
  {
    value: "TOPIC_AND_STYLE",
    label: "Topic + Style",
    description: "Use this when the source should influence both what the app talks about and how it sounds."
  },
  {
    value: "STYLE_ONLY",
    label: "Style only",
    description: "Use this when the source should teach cadence, humor, or storytelling mechanics without reusing the literal topic."
  }
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
      mode: form.get("mode"),
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
        className="inline-flex w-full items-center justify-center gap-2 border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-[var(--accent)] transition hover:border-[var(--accent)]/50 hover:bg-[var(--accent)]/20 sm:w-auto"
      >
        <span className="text-lg leading-none">+</span> ADD SOURCE
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 border border-white/10 bg-white/[0.02] p-6 shadow-xl"
    >
      <h3 className="text-lg font-semibold text-white">Add a new source</h3>
      <p className="text-sm leading-6 text-slate-300">
        Sources can now do two jobs: shape topics and shape style, or shape style only. Use style-only mode for old
        posts you love stylistically but do not want the app to keep paraphrasing.
      </p>

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
            className="w-full border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-600 outline-none focus:border-[var(--accent)]/40 focus:ring-1 focus:ring-[var(--accent)]/20"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs uppercase tracking-wider text-slate-400">Kind</label>
          <select
            name="kind"
            required
            className="w-full border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-[var(--accent)]/40 focus:ring-1 focus:ring-[var(--accent)]/20"
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
        <label className="mb-1 block text-xs uppercase tracking-wider text-slate-400">Influence mode</label>
        <select
          name="mode"
          defaultValue="TOPIC_AND_STYLE"
          className="w-full border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-[var(--accent)]/40 focus:ring-1 focus:ring-[var(--accent)]/20"
        >
          {SOURCE_MODES.map((mode) => (
            <option key={mode.value} value={mode.value} className="bg-slate-900">
              {mode.label}
            </option>
          ))}
        </select>
        <div className="mt-2 space-y-1 text-xs leading-5 text-slate-400">
          {SOURCE_MODES.map((mode) => (
            <p key={mode.value}>
              <span className="font-bold text-slate-300">{mode.label}:</span> {mode.description}
            </p>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs uppercase tracking-wider text-slate-400">URI</label>
        <input
          name="uri"
          required
          placeholder="https://example.com/feed.xml or @username"
          className="w-full border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-600 outline-none focus:border-[var(--accent)]/40 focus:ring-1 focus:ring-[var(--accent)]/20"
        />
        <p className="mt-2 text-xs leading-5 text-slate-400">
          Use a full URL for articles, feeds, or single X posts. For X accounts, paste the profile URL and add notes so
          the model understands why this source matters.
        </p>
      </div>

      <div>
        <label className="mb-1 block text-xs uppercase tracking-wider text-slate-400">Notes (optional)</label>
        <input
          name="notes"
          placeholder="Example: feminine energy, relationships, calm tone, audience is women in their 20s and 30s"
          className="w-full border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-600 outline-none focus:border-[var(--accent)]/40 focus:ring-1 focus:ring-[var(--accent)]/20"
        />
        <p className="mt-2 text-xs leading-5 text-slate-400">
          This is the highest-leverage field in the form. For style-only sources, tell the system which writing
          mechanics to borrow and which literal topics or scenarios it must not keep repeating.
        </p>
      </div>

      <div className="flex flex-col gap-3 pt-4 sm:flex-row">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex justify-center border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-[var(--accent)] transition-all hover:bg-[var(--accent)]/20 disabled:opacity-50 sm:w-auto"
        >
          {loading ? "ADDING..." : "ADD SOURCE"}
        </button>
        <button
          type="button"
          onClick={() => { setOpen(false); setError(null); }}
          className="inline-flex justify-center border border-white/10 bg-white/5 px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-300 transition-all hover:bg-white/10 sm:w-auto"
        >
          CANCEL
        </button>
      </div>
    </form>
  );
}
