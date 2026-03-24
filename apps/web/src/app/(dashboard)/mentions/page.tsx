import { Panel, StatusPill, Table, TableCell } from "@/components/dashboard";
import { formatRelative, getMentionsPageData } from "@/lib/data";

export default async function MentionsPage() {
  const mentions = await getMentionsPageData();

  return (
    <Panel title="Mentions queue" kicker="Inbound triage">
      <Table headers={["Author", "Mention", "Status", "Latest suggestion", "Last action", "Received"]}>
        {mentions.map((mention) => (
          <tr key={mention.id}>
            <TableCell>
              <p className="font-medium text-white">@{mention.authorUsername}</p>
              <p className="mt-1 text-xs text-slate-400">{mention.authorId}</p>
            </TableCell>
            <TableCell>{mention.text}</TableCell>
            <TableCell>
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
            <TableCell>{mention.replySuggestions[0]?.draftText ?? "No suggestion yet"}</TableCell>
            <TableCell>{mention.replyActions[0]?.actionType ?? "No action yet"}</TableCell>
            <TableCell>{formatRelative(mention.receivedAt)}</TableCell>
          </tr>
        ))}
      </Table>
    </Panel>
  );
}
