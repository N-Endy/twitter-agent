import { MutationButton } from "@/components/mutation-button";
import { Panel, StatusPill, Table, TableCell } from "@/components/dashboard";
import { formatRelative, getRepliesPageData } from "@/lib/data";

export default async function RepliesPage() {
  const suggestions = await getRepliesPageData();

  return (
    <Panel title="Reply suggestions" kicker="Human send gate">
      <Table headers={["Mention", "Suggested reply", "Confidence", "Latest action", "Updated", "Action"]}>
        {suggestions.map((suggestion) => {
          const latestAction = suggestion.replyActions[0];

          return (
            <tr key={suggestion.id}>
              <TableCell>
                <p className="font-medium text-white">@{suggestion.mention.authorUsername}</p>
                <p className="mt-1 text-sm text-slate-300">{suggestion.mention.text}</p>
              </TableCell>
              <TableCell>{suggestion.draftText}</TableCell>
              <TableCell>{suggestion.confidence.toFixed(2)}</TableCell>
              <TableCell>
                {latestAction ? (
                  <StatusPill tone={latestAction.actionType === "SEND" ? "good" : "warning"}>
                    {latestAction.actionType}
                  </StatusPill>
                ) : (
                  <StatusPill tone="warning">Pending</StatusPill>
                )}
              </TableCell>
              <TableCell>{formatRelative(suggestion.updatedAt)}</TableCell>
              <TableCell>
                {!latestAction || latestAction.actionType !== "SEND" ? (
                  <MutationButton
                    url={`/api/admin/replies/${suggestion.id}/send`}
                    label="Send reply"
                    confirmText="Send this reply to X now?"
                  />
                ) : null}
              </TableCell>
            </tr>
          );
        })}
      </Table>
    </Panel>
  );
}
