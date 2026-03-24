import { MutationButton } from "@/components/mutation-button";
import { Panel, StatusPill, Table, TableCell } from "@/components/dashboard";
import { formatDashboardDate, getPromptsPageData } from "@/lib/data";

export default async function PromptsPage() {
  const prompts = await getPromptsPageData();

  return (
    <Panel title="Prompt versions" kicker="Prompt governance">
      <Table headers={["Kind", "Version", "Name", "Status", "Activated", "Action"]}>
        {prompts.map((prompt) => (
          <tr key={prompt.id}>
            <TableCell>{prompt.kind}</TableCell>
            <TableCell>v{prompt.version}</TableCell>
            <TableCell>{prompt.name}</TableCell>
            <TableCell>
              <StatusPill tone={prompt.isActive ? "good" : "warning"}>
                {prompt.isActive ? "ACTIVE" : "INACTIVE"}
              </StatusPill>
            </TableCell>
            <TableCell>{formatDashboardDate(prompt.activatedAt)}</TableCell>
            <TableCell>
              {!prompt.isActive ? (
                <MutationButton
                  url={`/api/admin/prompts/${prompt.id}/activate`}
                  label="Activate"
                  confirmText="Make this the active prompt version?"
                />
              ) : null}
            </TableCell>
          </tr>
        ))}
      </Table>
    </Panel>
  );
}
