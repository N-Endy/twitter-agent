"use client";

import Link from "next/link";
import { useState, useTransition } from "react";

import { InfoNotice, Panel, StatusPill, SummaryStrip } from "@/components/dashboard";
import type { getDraftWorkshopData } from "@/lib/data";

type DraftWorkshopPayload = NonNullable<Awaited<ReturnType<typeof getDraftWorkshopData>>>;
type DraftWorkshopStatus = DraftWorkshopPayload["draft"]["status"];

function formatStamp(value: Date | string | null | undefined) {
  if (!value) {
    return "Never";
  }

  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

function formatTagLabel(tag: string) {
  return tag.replaceAll("_", " ");
}

function formatRevisionKind(kind: string) {
  return kind.replaceAll("_", " ");
}

function sortNewestFirst<T extends { createdAt: Date | string }>(items: T[]) {
  return [...items].sort(
    (left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
  );
}

function upsertById<T extends { id: string; createdAt: Date | string }>(items: T[], nextItem: T) {
  const filtered = items.filter((item) => item.id !== nextItem.id);
  return sortNewestFirst([nextItem, ...filtered]);
}

export function DraftWorkshop({ workshop }: { workshop: DraftWorkshopPayload }) {
  const [draftText, setDraftText] = useState(workshop.draft.text);
  const [operatorNote, setOperatorNote] = useState(
    workshop.draft.revisions.find((revision) => revision.kind === "HUMAN_EDIT")?.note ?? ""
  );
  const [selectedTags, setSelectedTags] = useState<string[]>(
    workshop.draft.revisions.find((revision) => revision.kind === "HUMAN_EDIT")?.feedbackTags ?? []
  );
  const [draftStatus, setDraftStatus] = useState<DraftWorkshopStatus>(workshop.draft.status);
  const [approvedAt, setApprovedAt] = useState<string | Date | null>(workshop.draft.approvedAt);
  const [scheduleSlot, setScheduleSlot] = useState(workshop.draft.scheduleSlot);
  const [revisions, setRevisions] = useState(sortNewestFirst(workshop.draft.revisions));
  const [voiceExamples, setVoiceExamples] = useState(
    [...workshop.draft.voiceExamples].sort(
      (left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime()
    )
  );
  const [tunedCandidate, setTunedCandidate] = useState<null | { id: string; text: string; rationale?: string | null }>(null);
  const [selectedSourceRevisionId, setSelectedSourceRevisionId] = useState(
    workshop.draft.revisions.find((revision) => revision.kind !== "HUMAN_EDIT")?.id ?? ""
  );
  const [selectedPreferredRevisionId, setSelectedPreferredRevisionId] = useState(
    workshop.draft.revisions.find((revision) => revision.kind === "HUMAN_EDIT")?.id ?? ""
  );
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const latestReview = workshop.draft.reviews[0] ?? null;
  const latestAiRevision = revisions.find((revision) => revision.kind !== "HUMAN_EDIT") ?? null;
  const latestHumanRevision = revisions.find((revision) => revision.kind === "HUMAN_EDIT") ?? null;
  const draftLocked = draftStatus === "SCHEDULED" || draftStatus === "PUBLISHING" || draftStatus === "PUBLISHED";
  const teachableSourceRevisions = revisions.filter((revision) => revision.kind !== "HUMAN_EDIT");
  const humanRevisions = revisions.filter((revision) => revision.kind === "HUMAN_EDIT");

  const sourceGuidanceSummary = [
    workshop.brandVoiceGuide ? `Brand voice: ${workshop.brandVoiceGuide}` : null,
    workshop.draft.idea.sourceItem.notes ? `Source notes: ${workshop.draft.idea.sourceItem.notes}` : null,
    workshop.draft.idea.snapshot?.summary ? `Snapshot summary: ${workshop.draft.idea.snapshot.summary}` : null
  ]
    .filter(Boolean)
    .join("\n\n");

  function toggleTag(tag: string) {
    setSelectedTags((current) =>
      current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag]
    );
  }

  async function postJson<T>(url: string, body: Record<string, unknown>) {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    const payload = (await response.json().catch(() => null)) as (T & { error?: string }) | null;

    if (!response.ok) {
      throw new Error(payload?.error ?? "Request failed.");
    }

    return payload as T;
  }

  function runAction(action: string, work: () => Promise<void>) {
    startTransition(async () => {
      setActiveAction(action);
      setError(null);
      setNotice(null);

      try {
        await work();
      } catch (reason) {
        setError(reason instanceof Error ? reason.message : "Request failed.");
      } finally {
        setActiveAction(null);
      }
    });
  }

  function unscheduleDraft() {
    runAction("unschedule", async () => {
      const payload = await postJson<{
        draft: { status: string; approvedAt: string | null; scheduleSlot: DraftWorkshopPayload["draft"]["scheduleSlot"] };
      }>(`/api/admin/posts/${workshop.draft.id}/schedule`, {
        action: "unschedule"
      });

      setDraftStatus(payload.draft.status as DraftWorkshopStatus);
      setApprovedAt(payload.draft.approvedAt);
      setScheduleSlot(payload.draft.scheduleSlot);
      setNotice("Draft unscheduled. You can now edit and retrain it.");
    });
  }

  function saveRewrite() {
    runAction("save", async () => {
      const wasApproved = draftStatus === "APPROVED";
      const payload = await postJson<{
        draft: { status: string; approvedAt: string | null; text: string };
        revision: (typeof revisions)[number];
      }>(`/api/admin/drafts/${workshop.draft.id}/revisions`, {
        text: draftText,
        note: operatorNote,
        feedbackTags: selectedTags
      });

      setDraftStatus(payload.draft.status as DraftWorkshopStatus);
      setApprovedAt(payload.draft.approvedAt);
      setRevisions((current) => upsertById(current, payload.revision));
      setSelectedPreferredRevisionId(payload.revision.id);
      setNotice(
        payload.draft.status === "NEEDS_REVIEW" && wasApproved
          ? "Rewrite saved. The draft has been moved back to NEEDS_REVIEW."
          : "Rewrite saved."
      );
    });
  }

  function tuneWithRewrite() {
    runAction("tune", async () => {
      const payload = await postJson<{
        draft: { status: string; approvedAt: string | null };
        humanRevision: (typeof revisions)[number];
        tunedRevision: (typeof revisions)[number] & { rationale?: string | null };
      }>(`/api/admin/drafts/${workshop.draft.id}/tune`, {
        text: draftText,
        note: operatorNote,
        feedbackTags: selectedTags
      });

      setDraftStatus(payload.draft.status as DraftWorkshopStatus);
      setApprovedAt(payload.draft.approvedAt);
      setRevisions((current) => upsertById(upsertById(current, payload.humanRevision), payload.tunedRevision));
      setSelectedPreferredRevisionId(payload.humanRevision.id);
      setSelectedSourceRevisionId(payload.tunedRevision.id);
      setTunedCandidate({
        id: payload.tunedRevision.id,
        text: payload.tunedRevision.text,
        rationale: payload.tunedRevision.rationale ?? null
      });
      setNotice("AI produced a new tuned candidate from your rewrite. Review it before saving.");
    });
  }

  function teachStyle() {
    runAction("teach", async () => {
      if (!selectedSourceRevisionId) {
        throw new Error("Choose an AI revision to teach from.");
      }

      if (!selectedPreferredRevisionId) {
        throw new Error("Save a human rewrite before teaching this style.");
      }

      const payload = await postJson<{
        voiceExample: {
          id: string;
          status: string;
          operatorNote: string | null;
          feedbackTags: string[];
        };
      }>(`/api/admin/drafts/${workshop.draft.id}/teach`, {
        sourceRevisionId: selectedSourceRevisionId,
        preferredRevisionId: selectedPreferredRevisionId,
        note: operatorNote,
        feedbackTags: selectedTags
      });

      const sourceRevision = revisions.find((revision) => revision.id === selectedSourceRevisionId);
      const preferredRevision = revisions.find((revision) => revision.id === selectedPreferredRevisionId);

      if (!sourceRevision || !preferredRevision) {
        throw new Error("The selected revisions could not be found.");
      }

      setVoiceExamples((current) =>
        [
          {
            id: payload.voiceExample.id,
            status: payload.voiceExample.status as (typeof workshop.draft.voiceExamples)[number]["status"],
            operatorNote: payload.voiceExample.operatorNote,
            feedbackTags: payload.voiceExample.feedbackTags,
            createdAt: new Date(),
            updatedAt: new Date(),
            draftId: workshop.draft.id,
            sourceItemId: workshop.draft.idea.sourceItem.id,
            pillarTag: workshop.draft.pillarTag,
            hookTag: workshop.draft.hookTag,
            sourceRevisionId: sourceRevision.id,
            preferredRevisionId: preferredRevision.id,
            createdBy: "owner",
            sourceItem: {
              id: workshop.draft.idea.sourceItem.id,
              title: workshop.draft.idea.sourceItem.title,
              kind: workshop.draft.idea.sourceItem.kind,
              uri: workshop.draft.idea.sourceItem.uri,
              allowlistHandle: workshop.draft.idea.sourceItem.allowlistHandle,
              notes: workshop.draft.idea.sourceItem.notes,
              isActive: true,
              createdAt: new Date(workshop.draft.createdAt),
              updatedAt: new Date(workshop.draft.updatedAt)
            },
            sourceRevision,
            preferredRevision
          },
          ...current.filter((example) => example.id !== payload.voiceExample.id)
        ].sort((left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime())
      );
      setNotice("Voice example saved. Future drafts can now learn from this before/after pair.");
    });
  }

  function approveFinalDraft() {
    runAction("approve", async () => {
      await postJson(`/api/admin/posts/${workshop.draft.id}/approve`, {});
      const now = new Date().toISOString();
      setDraftStatus("APPROVED");
      setApprovedAt(now);
      setNotice("Draft approved. You can now schedule it from the main Drafts page.");
    });
  }

  function toggleVoiceExample(exampleId: string, action: "archive" | "restore") {
    runAction(action, async () => {
      await postJson(`/api/admin/voice-examples/${exampleId}/archive`, { action });
      setVoiceExamples((current) =>
        current.map((example) =>
          example.id === exampleId
            ? { ...example, status: action === "archive" ? "ARCHIVED" : "ACTIVE", updatedAt: new Date() }
            : example
        )
      );
      setNotice(action === "archive" ? "Voice example archived." : "Voice example restored.");
    });
  }

  const activeVoiceExamples = voiceExamples.filter((example) => example.status === "ACTIVE").length;

  return (
    <div className="space-y-8">
      <Panel
        title="Draft workshop"
        kicker="Human-in-the-loop training"
        description="Rewrite weak AI drafts into your real voice, tune them again from your correction, and explicitly promote the best before/after pairs into reusable voice examples."
        actions={
          <Link
            href="/drafts"
            className="inline-flex w-full justify-center border border-white/10 bg-white/5 px-4 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-slate-300 transition-all hover:bg-white/10 sm:w-auto"
          >
            Back to drafts
          </Link>
        }
      >
        <div className="space-y-5">
          <SummaryStrip
            items={[
              {
                label: "Draft status",
                value: draftStatus,
                helper: approvedAt ? `Approved ${formatStamp(approvedAt)}.` : "Human approval still controls publishing.",
                tone:
                  draftStatus === "APPROVED"
                    ? "good"
                    : draftStatus === "REJECTED"
                      ? "bad"
                      : draftStatus === "NEEDS_REVIEW"
                        ? "warning"
                        : "default"
              },
              {
                label: "Source",
                value: workshop.draft.idea.sourceItem.title,
                helper: workshop.draft.idea.pillar,
                tone: "default"
              },
              {
                label: "Revisions",
                value: revisions.length,
                helper: latestHumanRevision ? "Human rewrites are being preserved." : "No saved human rewrite yet.",
                tone: revisions.length > 1 ? "good" : "warning"
              },
              {
                label: "Voice examples",
                value: activeVoiceExamples,
                helper: activeVoiceExamples > 0 ? "Curated examples from this draft are active." : "Nothing from this draft is teaching the system yet.",
                tone: activeVoiceExamples > 0 ? "good" : "warning"
              }
            ]}
          />

          {draftLocked ? (
            <InfoNotice title="Workshop locked" tone="warning">
              This draft is already scheduled, publishing, or published. You can inspect the history here, but training edits are blocked to protect the live pipeline.
            </InfoNotice>
          ) : null}

          {draftStatus === "APPROVED" ? (
            <InfoNotice title="Already approved" tone="good">
              Editing this draft again will move it back to NEEDS REVIEW so approval always applies to the exact text on screen.
            </InfoNotice>
          ) : null}

          {scheduleSlot ? (
            <InfoNotice title="Scheduling note">
              This draft already has a schedule slot: {formatStamp(scheduleSlot.slotAt)}. Unschedule it before changing the text so the live queue stays safe.
            </InfoNotice>
          ) : null}
        </div>
      </Panel>

      <div className="grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
        <Panel
          title="AI context"
          kicker="What the system thinks"
          description="Use this side to understand the source lane, what the AI produced, and how QA judged it before you start rewriting."
        >
          <div className="space-y-6">
            <div className="space-y-3 border border-white/10 bg-white/[0.02] p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-500">Latest AI candidate</p>
                {latestAiRevision ? (
                  <StatusPill tone="warning">{formatRevisionKind(latestAiRevision.kind)}</StatusPill>
                ) : null}
              </div>
              <p className="text-sm leading-7 text-white">{latestAiRevision?.text ?? workshop.draft.text}</p>
              <p className="text-xs text-slate-400">
                {latestAiRevision?.rationale ?? workshop.draft.rationale ?? "No AI rationale was stored for this draft."}
              </p>
            </div>

            {latestReview ? (
              <div className="space-y-4 border border-white/10 bg-white/[0.02] p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-500">Latest QA review</p>
                  <StatusPill tone={latestReview.status === "PASS" ? "good" : "warning"}>{latestReview.status}</StatusPill>
                </div>
                <SummaryStrip
                  items={[
                    { label: "Voice", value: latestReview.voiceScore, helper: "How close QA thinks it is to the target voice.", tone: latestReview.voiceScore >= 7 ? "good" : "warning" },
                    { label: "Clarity", value: latestReview.clarityScore, helper: "Sentence-level readability.", tone: latestReview.clarityScore >= 7 ? "good" : "warning" },
                    { label: "Novelty", value: latestReview.noveltyScore, helper: "How non-generic it feels.", tone: latestReview.noveltyScore >= 7 ? "good" : "warning" },
                    { label: "Safety", value: latestReview.safetyScore, helper: "Risk posture before approval.", tone: latestReview.safetyScore >= 7 ? "good" : "warning" }
                  ]}
                />
                <div className="space-y-2 text-xs text-slate-300">
                  <p className="font-bold uppercase tracking-[0.22em] text-slate-500">QA notes</p>
                  <p>{latestReview.notes}</p>
                  {latestReview.issues.length > 0 ? (
                    <ul className="space-y-2 text-slate-400">
                      {latestReview.issues.map((issue) => (
                        <li key={issue}>- {issue}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-slate-400">No specific QA issues were recorded.</p>
                  )}
                </div>
              </div>
            ) : null}

            <div className="space-y-4 border border-white/10 bg-white/[0.02] p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-500">Revision timeline</p>
              <div className="space-y-3">
                {revisions.length > 0 ? (
                  revisions.map((revision) => (
                    <article key={revision.id} className="border border-white/10 bg-slate-950/30 p-4">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-2">
                          <StatusPill tone={revision.kind === "HUMAN_EDIT" ? "good" : "warning"}>
                            {formatRevisionKind(revision.kind)}
                          </StatusPill>
                          {revision.createdBy ? (
                            <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500">{revision.createdBy}</span>
                          ) : null}
                        </div>
                        <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
                          {formatStamp(revision.createdAt)}
                        </span>
                      </div>
                      <p className="mt-3 text-sm leading-7 text-white">{revision.text}</p>
                      {revision.note ? <p className="mt-3 text-xs leading-6 text-slate-400">{revision.note}</p> : null}
                      {revision.feedbackTags.length > 0 ? (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {revision.feedbackTags.map((tag) => (
                            <span
                              key={`${revision.id}-${tag}`}
                              className="inline-flex border border-white/10 bg-white/[0.04] px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-slate-300"
                            >
                              {formatTagLabel(tag)}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </article>
                  ))
                ) : (
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                    No revision history has been saved for this draft yet.
                  </p>
                )}
              </div>
            </div>
          </div>
        </Panel>

        <Panel
          title="Rewrite lab"
          kicker="Your voice wins"
          description="Rewrite the draft in your real voice. Save it when the text is right, or ask the AI to try again using your rewrite as the strongest training signal."
        >
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="block text-[11px] font-black uppercase tracking-[0.24em] text-slate-400">
                Working copy
              </label>
              <textarea
                value={draftText}
                onChange={(event) => setDraftText(event.target.value)}
                rows={12}
                disabled={draftLocked}
                className="w-full rounded-[22px] border border-white/10 bg-slate-950/40 px-4 py-4 text-sm leading-7 text-white outline-none transition focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]/30 disabled:cursor-not-allowed disabled:opacity-60"
              />
              <div className="flex items-center justify-between gap-3 text-xs text-slate-400">
                <p>Current working copy used for future review and approval.</p>
                <span className="font-mono">{draftText.trim().length} chars</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[11px] font-black uppercase tracking-[0.24em] text-slate-400">
                Feedback note
              </label>
              <textarea
                value={operatorNote}
                onChange={(event) => setOperatorNote(event.target.value)}
                rows={4}
                disabled={draftLocked}
                placeholder="Example: simpler phrasing, more natural Lagos/Nigerian cadence, less polished internet advice."
                className="w-full rounded-[18px] border border-white/10 bg-slate-950/40 px-4 py-3 text-sm leading-6 text-white outline-none transition focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]/30 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            <div className="space-y-3">
              <p className="text-[11px] font-black uppercase tracking-[0.24em] text-slate-400">Quick feedback tags</p>
              <div className="flex flex-wrap gap-2">
                {workshop.feedbackTagOptions.map((tag) => {
                  const active = selectedTags.includes(tag);

                  return (
                    <button
                      key={tag}
                      type="button"
                      disabled={draftLocked}
                      onClick={() => toggleTag(tag)}
                      className={`inline-flex border px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all disabled:cursor-not-allowed disabled:opacity-60 ${
                        active
                          ? "border-[var(--accent)]/40 bg-[var(--accent)]/15 text-[var(--accent)]"
                          : "border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.08]"
                      }`}
                    >
                      {formatTagLabel(tag)}
                    </button>
                  );
                })}
              </div>
            </div>

            {tunedCandidate ? (
              <div className="space-y-3 border border-[var(--accent)]/20 bg-[var(--accent)]/10 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[var(--accent)]">Latest tuned candidate</p>
                  <button
                    type="button"
                    onClick={() => setDraftText(tunedCandidate.text)}
                    className="inline-flex border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--accent)] transition-all hover:bg-[var(--accent)]/20"
                  >
                    Use in editor
                  </button>
                </div>
                <p className="text-sm leading-7 text-white">{tunedCandidate.text}</p>
                {tunedCandidate.rationale ? <p className="text-xs leading-6 text-slate-300">{tunedCandidate.rationale}</p> : null}
              </div>
            ) : null}

            <div className="flex flex-col gap-2">
              {draftStatus === "SCHEDULED" ? (
                <button
                  type="button"
                  disabled={isPending}
                  onClick={unscheduleDraft}
                  className="inline-flex w-full justify-center border border-amber-300/30 bg-amber-400/10 px-4 py-2.5 text-[10px] font-black uppercase tracking-[0.22em] text-amber-300 transition-all hover:bg-amber-400/20 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isPending && activeAction === "unschedule" ? "Unscheduling..." : "Unschedule to edit"}
                </button>
              ) : null}
              <button
                type="button"
                disabled={isPending || draftLocked}
                onClick={saveRewrite}
                className="inline-flex w-full justify-center border border-[var(--accent)]/40 bg-[var(--accent)]/15 px-4 py-2.5 text-[10px] font-black uppercase tracking-[0.22em] text-[var(--accent)] transition-all hover:border-[var(--accent)]/60 hover:bg-[var(--accent)]/25 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPending && activeAction === "save" ? "Saving..." : "Save rewrite"}
              </button>
              <button
                type="button"
                disabled={isPending || draftLocked}
                onClick={tuneWithRewrite}
                className="inline-flex w-full justify-center border border-white/10 bg-white/5 px-4 py-2.5 text-[10px] font-black uppercase tracking-[0.22em] text-slate-200 transition-all hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPending && activeAction === "tune" ? "Tuning..." : "Tune with my rewrite"}
              </button>
              <button
                type="button"
                disabled={isPending || draftLocked || draftStatus !== "NEEDS_REVIEW"}
                onClick={approveFinalDraft}
                className="inline-flex w-full justify-center border border-emerald-300/30 bg-emerald-400/10 px-4 py-2.5 text-[10px] font-black uppercase tracking-[0.22em] text-emerald-300 transition-all hover:bg-emerald-400/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPending && activeAction === "approve"
                  ? "Approving..."
                  : draftStatus === "APPROVED"
                    ? "Already approved"
                    : draftStatus === "NEEDS_REVIEW"
                      ? "Approve final draft"
                      : "Save or run QA first"}
              </button>
            </div>

            {notice ? <p className="text-xs text-emerald-300">{notice}</p> : null}
            {error ? <p className="text-xs text-rose-300">{error}</p> : null}
          </div>
        </Panel>
      </div>

      <div className="grid gap-8 xl:grid-cols-[0.9fr_1.1fr]">
        <Panel
          title="Source and voice guidance"
          kicker="What should shape the writing"
          description="This is the fixed context the system is supposed to honor before it ever reaches for generic AI phrasing."
        >
          <div className="space-y-5">
            <div className="border border-white/10 bg-white/[0.02] p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-500">Source lane</p>
              <p className="mt-3 text-sm text-white">{workshop.draft.idea.sourceItem.title}</p>
              <p className="mt-1 text-xs text-slate-500">{workshop.draft.idea.sourceItem.uri}</p>
              {workshop.draft.idea.sourceItem.notes ? (
                <p className="mt-3 text-xs leading-6 text-slate-300">{workshop.draft.idea.sourceItem.notes}</p>
              ) : (
                <p className="mt-3 text-xs text-slate-500">No source-specific notes saved yet.</p>
              )}
            </div>

            <div className="border border-white/10 bg-white/[0.02] p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-500">Account voice</p>
              {workshop.brandVoiceGuide ? (
                <p className="mt-3 whitespace-pre-wrap text-xs leading-6 text-slate-300">{workshop.brandVoiceGuide}</p>
              ) : (
                <p className="mt-3 text-xs text-slate-500">No account-wide voice guide has been saved yet.</p>
              )}
            </div>

            <div className="border border-white/10 bg-white/[0.02] p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-500">Snapshot context</p>
              {sourceGuidanceSummary ? (
                <pre className="mt-3 whitespace-pre-wrap text-xs leading-6 text-slate-300">{sourceGuidanceSummary}</pre>
              ) : (
                <p className="mt-3 text-xs text-slate-500">No extra voice context was found for this draft.</p>
              )}
            </div>
          </div>
        </Panel>

        <Panel
          title="Teach this style"
          kicker="Curated voice memory"
          description="Choose the AI version you disliked and the human rewrite you prefer. Only these explicit before/after pairs become reusable training examples for future drafts."
        >
          <div className="space-y-5">
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="space-y-2">
                <label className="block text-[11px] font-black uppercase tracking-[0.24em] text-slate-400">
                  AI revision
                </label>
                <select
                  value={selectedSourceRevisionId}
                  onChange={(event) => setSelectedSourceRevisionId(event.target.value)}
                  className="w-full border border-white/10 bg-slate-950/50 px-4 py-3 text-sm text-white outline-none transition focus:border-[var(--accent)]"
                >
                  <option value="">Select AI revision</option>
                  {teachableSourceRevisions.map((revision) => (
                    <option key={revision.id} value={revision.id}>
                      {formatRevisionKind(revision.kind)} • {formatStamp(revision.createdAt)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-[11px] font-black uppercase tracking-[0.24em] text-slate-400">
                  Human rewrite
                </label>
                <select
                  value={selectedPreferredRevisionId}
                  onChange={(event) => setSelectedPreferredRevisionId(event.target.value)}
                  className="w-full border border-white/10 bg-slate-950/50 px-4 py-3 text-sm text-white outline-none transition focus:border-[var(--accent)]"
                >
                  <option value="">Select human rewrite</option>
                  {humanRevisions.map((revision) => (
                    <option key={revision.id} value={revision.id}>
                      {formatRevisionKind(revision.kind)} • {formatStamp(revision.createdAt)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="button"
              disabled={isPending || !selectedSourceRevisionId || !selectedPreferredRevisionId}
              onClick={teachStyle}
              className="inline-flex w-full justify-center border border-[var(--accent)]/40 bg-[var(--accent)]/15 px-4 py-2.5 text-[10px] font-black uppercase tracking-[0.22em] text-[var(--accent)] transition-all hover:border-[var(--accent)]/60 hover:bg-[var(--accent)]/25 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending && activeAction === "teach" ? "Teaching..." : "Teach this style"}
            </button>

            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-500">Voice examples from this draft</p>
                <StatusPill tone={activeVoiceExamples > 0 ? "good" : "warning"}>
                  {activeVoiceExamples} active
                </StatusPill>
              </div>
              {voiceExamples.length > 0 ? (
                voiceExamples.map((example) => (
                  <article key={example.id} className="space-y-4 border border-white/10 bg-white/[0.02] p-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-2">
                        <StatusPill tone={example.status === "ACTIVE" ? "good" : "warning"}>
                          {example.status}
                        </StatusPill>
                        <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
                          {formatStamp(example.updatedAt)}
                        </span>
                      </div>
                      <button
                        type="button"
                        disabled={isPending}
                        onClick={() => toggleVoiceExample(example.id, example.status === "ACTIVE" ? "archive" : "restore")}
                        className="inline-flex justify-center border border-white/10 bg-white/5 px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-200 transition-all hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {example.status === "ACTIVE" ? "Archive" : "Restore"}
                      </button>
                    </div>
                    <div className="grid gap-4 lg:grid-cols-2">
                      <div className="border border-white/10 bg-slate-950/30 p-3">
                        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-500">Original AI version</p>
                        <p className="mt-3 text-sm leading-7 text-white">{example.sourceRevision.text}</p>
                      </div>
                      <div className="border border-white/10 bg-slate-950/30 p-3">
                        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-500">Preferred rewrite</p>
                        <p className="mt-3 text-sm leading-7 text-white">{example.preferredRevision.text}</p>
                      </div>
                    </div>
                    {example.operatorNote ? <p className="text-xs leading-6 text-slate-300">{example.operatorNote}</p> : null}
                    {example.feedbackTags.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {example.feedbackTags.map((tag) => (
                          <span
                            key={`${example.id}-${tag}`}
                            className="inline-flex border border-white/10 bg-white/[0.04] px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-slate-300"
                          >
                            {formatTagLabel(tag)}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </article>
                ))
              ) : (
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  No curated voice examples have been created from this draft yet.
                </p>
              )}
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}
