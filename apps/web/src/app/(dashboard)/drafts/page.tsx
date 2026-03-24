import { MutationButton } from "@/components/mutation-button";
import { Panel, StatusPill, Table, TableCell } from "@/components/dashboard";
import { formatRelative, getDraftsPageData } from "@/lib/data";

export default async function DraftsPage() {
  const drafts = await getDraftsPageData();

  return (
    <Panel title="Draft queue" kicker="Human approval required">
      <Table headers={["Draft", "Scores", "Review", "Schedule", "Updated", "Actions"]}>
        {drafts.map((draft) => {
          const latestReview = draft.reviews[0];

          return (
            <tr key={draft.id}>
              <TableCell>
                <p className="font-medium text-white">{draft.idea.hook}</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">{draft.text}</p>
              </TableCell>
              <TableCell>
                <p>Chars: {draft.characterCount}</p>
                <p className="mt-1 text-xs text-slate-400">Confidence: {draft.confidence ?? "n/a"}</p>
              </TableCell>
              <TableCell>
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
              <TableCell>
                {draft.scheduleSlot ? (
                  <StatusPill tone="good">{draft.scheduleSlot.status}</StatusPill>
                ) : (
                  <StatusPill tone="warning">UNSCHEDULED</StatusPill>
                )}
              </TableCell>
              <TableCell>{formatRelative(draft.updatedAt)}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-2">
                  {draft.status !== "APPROVED" && draft.status !== "SCHEDULED" ? (
                    <MutationButton url={`/api/admin/posts/${draft.id}/approve`} label="Approve" />
                  ) : null}
                  {draft.status === "APPROVED" && !draft.scheduleSlot ? (
                    <MutationButton
                      url={`/api/admin/posts/${draft.id}/schedule`}
                      label="Schedule next"
                      confirmText="Assign this draft to the next open slot?"
                    />
                  ) : null}
                  <StatusPill tone={draft.status === "APPROVED" || draft.status === "SCHEDULED" ? "good" : "warning"}>
                    {draft.status}
                  </StatusPill>
                </div>
              </TableCell>
            </tr>
          );
        })}
      </Table>
    </Panel>
  );
}
