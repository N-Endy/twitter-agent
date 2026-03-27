import { MutationButton } from "@/components/mutation-button";
import { Panel, StatusPill, Table, TableCell } from "@/components/dashboard";
import { JobTriggerButton } from "@/components/job-trigger-button";
import { formatRelative, getRepliesPageData } from "@/lib/data";

export default async function RepliesPage() {
  const suggestions = await getRepliesPageData();

  return (
    <Panel
      title="Reply suggestions"
      kicker="Human send gate"
      actions={<JobTriggerButton job="reply-draft" label="Draft reply backlog" />}
    >
      <Table headers={["Mention", "Suggested reply", "Confidence", "Latest action", "Updated", "Action"]}>
        {suggestions.map((suggestion) => {
          const latestAction = suggestion.replyActions[0];

          return (
            <tr key={suggestion.id}>
              <TableCell label="Mention">
                <p className="font-medium text-white">@{suggestion.mention.authorUsername}</p>
                <p className="mt-1 text-sm text-slate-300">{suggestion.mention.text}</p>
              </TableCell>
              <TableCell label="Suggested reply">{suggestion.draftText}</TableCell>
              <TableCell label="Confidence">{suggestion.confidence.toFixed(2)}</TableCell>
              <TableCell label="Latest action">
                {latestAction ? (
                  <StatusPill
                    tone={
                      latestAction.actionType === "SEND"
                        ? "good"
                        : latestAction.actionType === "ESCALATE"
                          ? "bad"
                          : "warning"
                    }
                  >
                    {latestAction.actionType}
                  </StatusPill>
                ) : (
                  <StatusPill tone="warning">Pending</StatusPill>
                )}
              </TableCell>
              <TableCell label="Updated">{formatRelative(suggestion.updatedAt)}</TableCell>
              <TableCell label="Action">
                {suggestion.mention.status !== "SENT" && suggestion.mention.status !== "SENDING" ? (
                  <div className="space-y-2">
                    <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                      <MutationButton
                        url={`/api/admin/replies/${suggestion.id}/send`}
                        label="Send reply"
                        confirmText="Send this reply to X now?"
                      />
                      <MutationButton
                        url={`/api/admin/replies/${suggestion.id}/decision`}
                        label="Ignore"
                        body={{ action: "IGNORE" }}
                        tone="warning"
                      />
                      <MutationButton
                        url={`/api/admin/replies/${suggestion.id}/decision`}
                        label="Escalate"
                        body={{ action: "ESCALATE" }}
                        tone="danger"
                      />
                    </div>
                    <p className="text-xs leading-5 text-slate-400">
                      Choose one action: send to X, ignore it, or escalate for manual handling.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <StatusPill tone={suggestion.mention.status === "SENT" ? "good" : "warning"}>
                      {suggestion.mention.status}
                    </StatusPill>
                    <p className="text-xs leading-5 text-slate-400">
                      {suggestion.mention.status === "SENT"
                        ? "This suggestion has already been sent to X."
                        : "This suggestion is currently being sent to X."}
                    </p>
                  </div>
                )}
              </TableCell>
            </tr>
          );
        })}
      </Table>
    </Panel>
  );
}
