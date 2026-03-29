import { MutationButton } from "@/components/mutation-button";
import { EmptyState, InfoNotice, Panel, StatusPill, SummaryStrip, Table, TableCell } from "@/components/dashboard";
import { JobTriggerButton } from "@/components/job-trigger-button";
import { ScheduleDraftControls } from "@/components/schedule-draft-controls";
import { formatDashboardDate, formatRelative, getDraftsPageData } from "@/lib/data";

export default async function DraftsPage() {
  const { drafts, availableSlots, weeklyBatch } = await getDraftsPageData();
  const pendingQa = drafts.filter((draft) => draft.status === "PENDING_QA").length;
  const needsReview = drafts.filter((draft) => draft.status === "NEEDS_REVIEW").length;
  const approved = drafts.filter((draft) => draft.status === "APPROVED").length;
  const scheduled = drafts.filter((draft) => draft.status === "SCHEDULED" || draft.status === "PUBLISHING").length;
  const weeklyBatchRunning = weeklyBatch?.status === "RUNNING";

  return (
    <Panel
      title="Draft queue"
      kicker="Human approval required"
      description="Drafts are where the operator spends judgment. This page should tell you what is blocked in QA, what is ready for approval, and what is already committed to the calendar."
      actions={
        <>
          <JobTriggerButton job="draft-qa" label="Run QA backlog" />
          <JobTriggerButton job="publish-post" label="Run publish" />
        </>
      }
    >
      <div className="space-y-5">
        {weeklyBatchRunning ? (
          <InfoNotice title="Weekly batch running" tone="warning">
            New drafts may continue appearing while the current batch finishes writing and queuing QA work.
            {weeklyBatch?.startedAt ? ` Started ${formatRelative(weeklyBatch.startedAt)}.` : ""}
          </InfoNotice>
        ) : null}

        <SummaryStrip
          items={[
            { label: "Pending QA", value: pendingQa, helper: "Drafts still waiting for the QA worker.", tone: pendingQa > 0 ? "warning" : "default" },
            { label: "Needs review", value: needsReview, helper: "Ready for human approval.", tone: needsReview > 0 ? "good" : "default" },
            { label: "Approved", value: approved, helper: "Approved drafts not yet scheduled.", tone: approved > 0 ? "good" : "default" },
            { label: "Scheduled", value: scheduled, helper: "Already committed to a slot or publishing now.", tone: scheduled > 0 ? "default" : "warning" },
            {
              label: "Batch status",
              value: weeklyBatchRunning ? "Running" : weeklyBatch?.status === "FAILED" ? "Failed" : weeklyBatch?.status === "SUCCEEDED" ? "Ready" : "Idle",
              helper: weeklyBatchRunning
                ? "The current batch is still writing drafts."
                : weeklyBatch?.finishedAt
                  ? `Last finished ${formatRelative(weeklyBatch.finishedAt)}.`
                  : "No completed batch state recorded yet.",
              tone: weeklyBatchRunning ? "warning" : weeklyBatch?.status === "FAILED" ? "bad" : weeklyBatch?.status === "SUCCEEDED" ? "good" : "default"
            }
          ]}
        />

        {drafts.length === 0 ? (
          <EmptyState
            title="No drafts yet"
            body="Run source ingest, then start a weekly batch from the Ideas page. Once drafts exist, this page becomes your main approval queue."
            actions={
              <>
                <JobTriggerButton job="source-ingest" label="Run ingest" />
              </>
            }
          />
        ) : (
          <Table headers={[
            { label: "Draft" },
            { label: "Scores", className: "tech-column" },
            { label: "Review", className: "tech-column" },
            { label: "Schedule", className: "tech-column" },
            { label: "Updated", className: "tech-column" },
            { label: "Actions", className: "tech-column" }
          ]}>
            {drafts.map((draft) => {
              const latestReview = draft.reviews[0];

              return (
                <tr key={draft.id}>
                  <TableCell label="Draft">
                    <p className="font-bold text-white uppercase tracking-tight text-xs">{draft.idea.hook}</p>
                    <p className="mt-2 text-xs leading-6 text-slate-400">{draft.text}</p>
                  </TableCell>
                  <TableCell label="Scores" className="tech-column text-[10px] uppercase tracking-wider text-slate-500">
                    <p>Chars: <span className="text-slate-300 font-bold">{draft.characterCount}</span></p>
                    <p className="mt-1">Conf: <span className="text-[var(--accent)] font-bold">{draft.confidence ?? "n/a"}</span></p>
                  </TableCell>
                  <TableCell label="Review" className="tech-column">
                    {latestReview ? (
                      <div>
                        <StatusPill tone={latestReview.status === "PASS" ? "good" : "bad"}>{latestReview.status}</StatusPill>
                        <p className="mt-2 text-[9px] uppercase tracking-tighter text-slate-500 font-mono">
                          V {latestReview.voiceScore} • S {latestReview.safetyScore}
                        </p>
                      </div>
                    ) : (
                      <span className="text-slate-500 uppercase tracking-widest text-[9px]">Pending</span>
                    )}
                  </TableCell>
                  <TableCell label="Schedule" className="tech-column">
                    {draft.scheduleSlot ? (
                      <StatusPill tone="good">{draft.scheduleSlot.status}</StatusPill>
                    ) : (
                      <StatusPill tone="warning">OPEN</StatusPill>
                    )}
                  </TableCell>
                  <TableCell label="Updated" className="tech-column text-[10px] uppercase tracking-wide text-slate-500">
                    {formatRelative(draft.updatedAt)}
                  </TableCell>
                  <TableCell label="Actions" className="tech-column">
                    <div className="flex flex-col gap-2">
                        {draft.status === "PENDING_QA" ? (
                          <JobTriggerButton
                            job="draft-qa"
                            label="Run QA"
                            body={{ draftId: draft.id }}
                            tone="neutral"
                          />
                        ) : null}
                        {draft.status === "NEEDS_REVIEW" ? (
                          <MutationButton url={`/api/admin/posts/${draft.id}/approve`} label="Approve" />
                        ) : null}
                        {draft.status === "APPROVED" && !draft.scheduleSlot ? (
                          <ScheduleDraftControls draftId={draft.id} slots={availableSlots} />
                        ) : null}
                        <StatusPill
                          tone={
                            draft.status === "REJECTED"
                              ? "bad"
                              : draft.status === "APPROVED" || draft.status === "SCHEDULED" || draft.status === "PUBLISHED"
                                ? "good"
                                : "warning"
                          }
                        >
                          {draft.status}
                        </StatusPill>
                    </div>
                  </TableCell>
                </tr>
              );
            })}
          </Table>
        )}
      </div>
    </Panel>
  );
}
