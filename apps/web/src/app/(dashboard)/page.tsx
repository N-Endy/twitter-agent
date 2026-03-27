import { GhostLink, MetricGrid, MiniList, Panel, StatusPill } from "@/components/dashboard";
import { JobTriggerButton } from "@/components/job-trigger-button";
import { formatDashboardDate, formatRelative, getDashboardMetrics, getOverviewFeed } from "@/lib/data";

export default async function OverviewPage() {
  const [metrics, feed] = await Promise.all([getDashboardMetrics(), getOverviewFeed()]);

  return (
    <>
      <MetricGrid
        items={[
          { label: "Active sources", value: metrics.sources },
          { label: "Open draft queue", value: metrics.drafts, tone: "warning" },
          { label: "Published posts", value: metrics.published, tone: "good" },
          { label: "Mentions pending", value: metrics.mentions, tone: "warning" },
          { label: "Active prompts", value: metrics.prompts },
          { label: "X integration", value: metrics.xStatus.label, tone: metrics.xStatus.tone }
        ]}
      />

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Panel title="Recent drafts" kicker="Queue pulse">
          <MiniList
            emptyLabel="No drafts yet. Run the weekly batch first."
            items={feed.recentDrafts.map((draft) => (
              <article key={draft.id} className="rounded-2xl border border-white/10 bg-slate-950/30 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-white">{draft.idea.hook}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-300">{draft.text}</p>
                  </div>
                  <StatusPill
                    tone={
                      draft.status === "PUBLISHED"
                        ? "good"
                        : draft.status === "REJECTED"
                          ? "bad"
                          : draft.status === "APPROVED"
                            ? "good"
                            : "warning"
                    }
                  >
                    {draft.status}
                  </StatusPill>
                </div>
                <p className="mt-3 text-xs text-slate-400">Updated {formatRelative(draft.updatedAt)}</p>
              </article>
            ))}
          />
        </Panel>

        <Panel title="Upcoming slots" kicker="Schedule">
          <MiniList
            emptyLabel="No upcoming slots found."
            items={feed.nextSlots.map((slot) => (
              <article key={slot.id} className="rounded-2xl border border-white/10 bg-slate-950/30 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-white">{formatDashboardDate(slot.slotAt)}</p>
                    <p className="mt-1 text-xs text-slate-400">
                      {slot.draft ? slot.draft.text.slice(0, 110) : "Open slot"}
                    </p>
                  </div>
                  <StatusPill tone={slot.draft ? "good" : "warning"}>{slot.status}</StatusPill>
                </div>
              </article>
            ))}
          />
        </Panel>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Panel
          title="Run the engine"
          kicker="Operator controls"
          actions={
            <>
              <JobTriggerButton job="source-ingest" label="Run ingest" />
              <JobTriggerButton job="weekly-batch" label="Run batch" />
              <JobTriggerButton job="draft-qa" label="Run QA" />
            </>
          }
        >
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-slate-950/30 p-4">
              <p className="text-sm font-medium text-white">Content pipeline</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Ingest sources, generate ideas and drafts, then push anything stuck in QA forward.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/30 p-4">
              <div className="flex flex-wrap gap-2">
                <JobTriggerButton job="publish-post" label="Run publish" />
                <JobTriggerButton job="metrics-sync" label="Sync metrics" />
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Force a publish check for due slots and refresh metrics on already-posted tweets.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/30 p-4">
              <div className="flex flex-wrap gap-2">
                <JobTriggerButton job="mention-poll" label="Poll mentions" />
                <JobTriggerButton job="reply-draft" label="Draft replies" />
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Pull fresh mentions from X, then draft suggested replies for anything still waiting.
              </p>
            </div>
          </div>
        </Panel>

        <Panel title="Mention queue" kicker="Reply drafting">
          <MiniList
            emptyLabel="No mentions ingested yet."
            items={feed.recentMentions.map((mention) => (
              <article key={mention.id} className="rounded-2xl border border-white/10 bg-slate-950/30 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-white">@{mention.authorUsername}</p>
                  <StatusPill
                    tone={
                      mention.status === "SENT"
                        ? "good"
                        : mention.status === "SENDING"
                          ? "warning"
                        : mention.status === "ESCALATED" || mention.status === "BLOCKED"
                          ? "bad"
                          : "warning"
                    }
                  >
                    {mention.status}
                  </StatusPill>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-300">{mention.text}</p>
                <p className="mt-3 text-xs text-slate-400">Received {formatRelative(mention.receivedAt)}</p>
              </article>
            ))}
          />
        </Panel>

        <Panel title="Active prompt versions" kicker="Prompt control">
          <MiniList
            items={feed.activePrompts.map((prompt) => (
              <article key={prompt.id} className="rounded-2xl border border-white/10 bg-slate-950/30 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-white">{prompt.kind}</p>
                    <p className="mt-1 text-xs text-slate-400">v{prompt.version} • {prompt.name}</p>
                  </div>
                  <StatusPill tone="good">Active</StatusPill>
                </div>
              </article>
            ))}
          />
          <div className="mt-4 flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-medium text-white">X integration</p>
                <StatusPill tone={feed.xStatus.tone}>{feed.xStatus.label}</StatusPill>
              </div>
              <p className="mt-1 text-xs text-slate-400">{feed.xStatus.detail}</p>
              <p className="mt-2 text-xs text-slate-500">Mention cursor: {feed.lastCursor ?? "Not started yet"}</p>
            </div>
            <GhostLink href="/prompts">Manage prompts</GhostLink>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <JobTriggerButton job="cleanup" label="Run cleanup" tone="neutral" />
          </div>
        </Panel>
      </div>
    </>
  );
}
