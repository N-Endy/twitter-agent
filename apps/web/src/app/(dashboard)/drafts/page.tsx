import { MutationButton } from "@/components/mutation-button";
import { Panel, StatusPill, Table, TableCell } from "@/components/dashboard";
import { JobTriggerButton } from "@/components/job-trigger-button";
import { ScheduleDraftControls } from "@/components/schedule-draft-controls";
import { formatDashboardDate, formatRelative, getDraftsPageData } from "@/lib/data";

export default async function DraftsPage() {
  const { drafts, availableSlots } = await getDraftsPageData();

  return (
    <Panel
      title="Draft queue"
      kicker="Human approval required"
      actions={
        <>
          <JobTriggerButton job="weekly-batch" label="Run batch" />
          <JobTriggerButton job="draft-qa" label="Run QA backlog" />
          <JobTriggerButton job="publish-post" label="Run publish" />
        </>
      }
    >
      <Table headers={["Draft", "Scores", "Review", "Schedule", "Updated", "Actions"]}>
        {drafts.map((draft) => {
          const latestReview = draft.reviews[0];

          return (
            <tr key={draft.id}>
              <TableCell label="Draft">
                <p className="font-medium text-white">{draft.idea.hook}</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">{draft.text}</p>
              </TableCell>
              <TableCell label="Scores">
                <p>Chars: {draft.characterCount}</p>
                <p className="mt-1 text-xs text-slate-400">Confidence: {draft.confidence ?? "n/a"}</p>
              </TableCell>
              <TableCell label="Review">
                {latestReview ? (
                  <>
                    <p className="text-white">{latestReview.status}</p>
                    <p className="mt-1 text-xs text-slate-400">
                      Voice {latestReview.voiceScore} • Safety {latestReview.safetyScore}
                    </p>
                  </>
                ) : (
                  <span className="text-slate-400">No review yet</span>
                )}
              </TableCell>
              <TableCell label="Schedule">
                {draft.scheduleSlot ? (
                  <StatusPill tone="good">{draft.scheduleSlot.status}</StatusPill>
                ) : (
                  <StatusPill tone="warning">UNSCHEDULED</StatusPill>
                )}
              </TableCell>
              <TableCell label="Updated">{formatRelative(draft.updatedAt)}</TableCell>
              <TableCell label="Actions">
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
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
                  <p className="text-xs leading-5 text-slate-400">
                    {draft.status === "PENDING_QA"
                      ? "Waiting for the draft-QA worker. Use Run QA if the queue looks stuck."
                      : draft.status === "NEEDS_REVIEW"
                        ? "Ready for human approval."
                        : draft.status === "APPROVED" && !draft.scheduleSlot
                          ? "Approved and waiting for a schedule slot."
                          : draft.status === "SCHEDULED" && draft.scheduleSlot
                            ? `Scheduled for ${formatDashboardDate(draft.scheduleSlot.slotAt)}.`
                            : draft.status === "PUBLISHING"
                              ? "Currently being posted to X."
                              : draft.status === "PUBLISHED"
                                ? "Already published."
                                : draft.status === "REJECTED"
                                  ? draft.qualitySummary || latestReview?.notes || "Rejected during QA or moderation."
                                  : "No manual action available right now."}
                  </p>
                </div>
              </TableCell>
            </tr>
          );
        })}
      </Table>
    </Panel>
  );
}
