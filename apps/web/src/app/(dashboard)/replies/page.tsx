import { MutationButton } from "@/components/mutation-button";
import { EmptyState, Panel, StatusPill, SummaryStrip, Table, TableCell } from "@/components/dashboard";
import { JobTriggerButton } from "@/components/job-trigger-button";
import { formatRelative, getRepliesPageData } from "@/lib/data";

export default async function RepliesPage() {
  const suggestions = await getRepliesPageData();
  const actionable = suggestions.filter(
    (suggestion) => suggestion.mention.status !== "SENT" && suggestion.mention.status !== "SENDING"
  ).length;
  const sent = suggestions.filter((suggestion) => suggestion.mention.status === "SENT").length;
  const escalated = suggestions.filter((suggestion) => suggestion.mention.status === "ESCALATED").length;

  return (
    <Panel
      title="Reply suggestions"
      kicker="Human send gate"
      description="This page is the final human gate before a reply reaches X. The best UX here is clarity: what is safe to send, what needs escalation, and what is already resolved."
      actions={<JobTriggerButton job="reply-draft" label="Draft reply backlog" />}
    >
      <div className="space-y-5">
        <SummaryStrip
          items={[
            { label: "Suggestions", value: suggestions.length, helper: "Reply drafts currently in view.", tone: suggestions.length > 0 ? "good" : "warning" },
            { label: "Actionable", value: actionable, helper: "Still waiting for a send, ignore, or escalate decision.", tone: actionable > 0 ? "warning" : "default" },
            { label: "Escalated", value: escalated, helper: "Needs manual handling beyond the normal send path.", tone: escalated > 0 ? "bad" : "default" },
            { label: "Sent", value: sent, helper: "Already resolved with a live reply.", tone: sent > 0 ? "good" : "default" }
          ]}
        />

        {suggestions.length === 0 ? (
          <EmptyState
            title="No reply suggestions yet"
            body="Draft replies from the mentions queue first. Suggestions will show up here once the worker has something ready for operator review."
            actions={<JobTriggerButton job="reply-draft" label="Draft reply backlog" />}
          />
        ) : (
          <Table headers={[
            { label: "Mention" },
            { label: "Suggested reply" },
            { label: "Confidence", className: "tech-column" },
            { label: "Latest action", className: "tech-column" },
            { label: "Updated", className: "tech-column" },
            { label: "Action", className: "tech-column" }
          ]}>
            {suggestions.map((suggestion) => {
              const latestAction = suggestion.replyActions[0];

              return (
                <tr key={suggestion.id}>
                  <TableCell label="Mention">
                    <p className="font-bold text-white uppercase tracking-tight text-xs">@{suggestion.mention.authorUsername}</p>
                    <p className="mt-2 text-xs leading-5 text-slate-400">{suggestion.mention.text}</p>
                  </TableCell>
                  <TableCell label="Suggested reply" className="font-medium text-slate-200">
                    {suggestion.draftText}
                  </TableCell>
                  <TableCell label="Confidence" className="tech-column font-mono text-xs">
                    {suggestion.confidence.toFixed(2)}
                  </TableCell>
                  <TableCell label="Latest action" className="tech-column">
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
                      <StatusPill tone="warning">PENDING</StatusPill>
                    )}
                  </TableCell>
                  <TableCell label="Updated" className="tech-column text-[10px] uppercase tracking-wide text-slate-500">
                    {formatRelative(suggestion.updatedAt)}
                  </TableCell>
                  <TableCell label="Action" className="tech-column">
                    {suggestion.mention.status !== "SENT" && suggestion.mention.status !== "SENDING" ? (
                      <div className="flex flex-col gap-2">
                        <div className="flex flex-col gap-2">
                          <MutationButton
                            url={`/api/admin/replies/${suggestion.id}/send`}
                            label="Send reply"
                            confirmText="Send this reply to X now?"
                          />
                          <div className="grid grid-cols-2 gap-2">
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
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <StatusPill tone={suggestion.mention.status === "SENT" ? "good" : "warning"}>
                          {suggestion.mention.status}
                        </StatusPill>
                      </div>
                    )}
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
