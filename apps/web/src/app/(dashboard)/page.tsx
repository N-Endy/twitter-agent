import { EmptyState, GhostLink, InfoNotice, MetricGrid, MiniList, Panel, StatusPill, SummaryStrip } from "@/components/dashboard";
import { JobTriggerButton } from "@/components/job-trigger-button";
import { formatDashboardDate, formatRelative, getDashboardMetrics, getOverviewFeed } from "@/lib/data";

export default async function OverviewPage() {
  const [metrics, feed] = await Promise.all([getDashboardMetrics(), getOverviewFeed()]);
  const nextAction =
    metrics.xStatus.label === "Missing"
      ? {
          title: "Connect the X account first",
          tone: "warning" as const,
          body: "Posting, mentions, and reply sending stay blocked until the owner account is connected.",
          actions: (
            <a
              href="/api/auth/x/start"
              className="inline-flex justify-center border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-[var(--accent)] transition-all hover:bg-[var(--accent)]/20"
            >
              Connect account
            </a>
          )
        }
      : metrics.xStatus.label === "Billing blocked"
        ? {
            title: "X credits are blocking live actions",
            tone: "bad" as const,
            body: "Source ingestion from X, publish checks, mention polling, and metrics sync are paused until X billing is healthy again.",
            actions: <JobTriggerButton job="source-ingest" label="Retry ingest" tone="warning" />
          }
        : metrics.sources === 0
          ? {
              title: "Start by shaping the source mix",
              tone: "neutral" as const,
              body: "Add sources with strong notes so the system knows the themes, tone, and audience it should learn from.",
              actions: <GhostLink href="/sources">Open sources</GhostLink>
            }
          : metrics.drafts === 0
            ? {
                title: "Your next move is to generate a fresh batch",
                tone: "good" as const,
                body: "Ingest the latest source material, then generate ideas and drafts so the approval queue has something to work with.",
                actions: (
                  <>
                    <JobTriggerButton job="source-ingest" label="Run ingest" />
                    <JobTriggerButton job="weekly-batch" label="Run batch" />
                  </>
                )
              }
            : metrics.mentions > 0
              ? {
                  title: "The mention queue needs attention",
                  tone: "warning" as const,
                  body: "Draft or resolve replies before the queue goes stale. Mentions feel more manageable when you process them in small batches.",
                  actions: <GhostLink href="/replies">Open replies</GhostLink>
                }
              : {
                  title: "The system is healthy enough to operate",
                  tone: "good" as const,
                  body: "Use the controls below to keep the content engine moving and focus your attention on drafts that need human judgment.",
                  actions: <GhostLink href="/drafts">Open drafts</GhostLink>
                };

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

      <InfoNotice title={nextAction.title} tone={nextAction.tone} actions={nextAction.actions}>
        {nextAction.body}
      </InfoNotice>

      <SummaryStrip
        items={[
          {
            label: "Recent drafts shown",
            value: feed.recentDrafts.length,
            helper: "Latest drafts visible on this page.",
            tone: feed.recentDrafts.length > 0 ? "good" : "warning"
          },
          {
            label: "Upcoming slots",
            value: feed.nextSlots.length,
            helper: "Future slots visible right now.",
            tone: feed.nextSlots.some((slot) => !slot.draft) ? "good" : "warning"
          },
          {
            label: "Recent mentions shown",
            value: feed.recentMentions.length,
            helper: "Latest inbound mentions on deck.",
            tone: feed.recentMentions.length > 0 ? "warning" : "default"
          },
          {
            label: "Prompt versions live",
            value: feed.activePrompts.length,
            helper: "Active prompt definitions in the system.",
            tone: "default"
          }
        ]}
      />

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Panel title="Recent drafts" kicker="Queue pulse" description="The newest drafts are your fastest signal for whether the source mix and prompt stack are behaving the way you expect.">
          {feed.recentDrafts.length === 0 ? (
            <EmptyState
              title="No drafts yet"
              body="Run source ingest, then generate a weekly batch. Once drafts exist, this panel becomes your quickest QA snapshot."
              actions={
                <>
                  <JobTriggerButton job="source-ingest" label="Run ingest" />
                  <JobTriggerButton job="weekly-batch" label="Run batch" />
                </>
              }
            />
          ) : (
            <MiniList
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
          )}
        </Panel>

        <Panel title="Upcoming slots" kicker="Schedule" description="Open slots are capacity. Filled slots are commitments. This panel helps you spot whether the queue is ahead of schedule or about to run dry.">
          {feed.nextSlots.length === 0 ? (
            <EmptyState
              title="No upcoming slots"
              body="The scheduler has no visible future slots yet. Run the publish and scheduling pipeline to repopulate the calendar."
              actions={<GhostLink href="/scheduled">Open schedule</GhostLink>}
            />
          ) : (
            <MiniList
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
          )}
        </Panel>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Panel
          title="Run the engine"
          kicker="Operator controls"
          description="Each control maps to one stage of the pipeline. Use them deliberately: inputs first, then generation, then QA, then live account actions."
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

        <Panel title="Mention queue" kicker="Reply drafting" description="This is the fastest way to see whether inbound engagement is flowing into drafted, reviewable replies or getting stuck upstream.">
          {feed.recentMentions.length === 0 ? (
            <EmptyState
              title="No mentions yet"
              body="Once mentions are polled from X, they will appear here with a clear status so you know whether to draft, send, ignore, or escalate."
              actions={<JobTriggerButton job="mention-poll" label="Poll mentions" />}
            />
          ) : (
            <MiniList
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
          )}
        </Panel>

        <Panel title="Active prompt versions" kicker="Prompt control" description="Prompt changes are powerful, but the operator still needs a quick read on live status, integration health, and the active prompt set.">
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
