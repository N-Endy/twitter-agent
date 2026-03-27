import { Panel, StatusPill, Table, TableCell } from "@/components/dashboard";
import { JobTriggerButton } from "@/components/job-trigger-button";
import { formatRelative, getMentionsPageData } from "@/lib/data";

export default async function MentionsPage() {
  const mentions = await getMentionsPageData();

  return (
    <Panel
      title="Mentions queue"
      kicker="Inbound triage"
      actions={
        <>
          <JobTriggerButton job="mention-poll" label="Poll mentions" />
          <JobTriggerButton job="reply-draft" label="Draft backlog" />
        </>
      }
    >
      <Table headers={["Author", "Mention", "Status", "Latest suggestion", "Last action", "Received", "Next step"]}>
        {mentions.map((mention) => (
          <tr key={mention.id}>
            <TableCell label="Author">
              <p className="font-medium text-white">@{mention.authorUsername}</p>
              <p className="mt-1 text-xs text-slate-400">{mention.authorId}</p>
            </TableCell>
            <TableCell label="Mention">{mention.text}</TableCell>
            <TableCell label="Status">
              <StatusPill
                tone={
                  mention.status === "SENT"
                    ? "good"
                    : mention.status === "ESCALATED" || mention.status === "BLOCKED"
                      ? "bad"
                      : "warning"
                }
              >
                {mention.status}
              </StatusPill>
            </TableCell>
            <TableCell label="Latest suggestion">{mention.replySuggestions[0]?.draftText ?? "No suggestion yet"}</TableCell>
            <TableCell label="Last action">{mention.replyActions[0]?.actionType ?? "No action yet"}</TableCell>
            <TableCell label="Received">{formatRelative(mention.receivedAt)}</TableCell>
            <TableCell label="Next step">
              <div className="space-y-2">
                {mention.status === "NEW" ? (
                  <JobTriggerButton
                    job="reply-draft"
                    label="Draft reply"
                    body={{ mentionId: mention.id }}
                    tone="neutral"
                  />
                ) : null}
                <p className="text-xs leading-5 text-slate-400">
                  {mention.status === "NEW"
                    ? "No reply has been drafted yet."
                    : mention.status === "DRAFTED" || mention.status === "APPROVED"
                      ? "Open the Replies tab to send, ignore, or escalate."
                      : mention.status === "IGNORED"
                        ? "Ignored by an operator or classifier."
                        : mention.status === "ESCALATED"
                          ? "Escalated for manual handling."
                          : mention.status === "BLOCKED"
                            ? "Blocked by moderation rules."
                            : mention.status === "SENDING"
                              ? "Reply is on its way to X."
                              : mention.status === "SENT"
                                ? "Reply already sent."
                                : "No manual action available right now."}
                </p>
              </div>
            </TableCell>
          </tr>
        ))}
      </Table>
    </Panel>
  );
}
