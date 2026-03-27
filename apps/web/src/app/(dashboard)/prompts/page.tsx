import { MutationButton } from "@/components/mutation-button";
import { EmptyState, Panel, StatusPill, SummaryStrip, Table, TableCell } from "@/components/dashboard";
import { formatDashboardDate, getPromptsPageData } from "@/lib/data";

export default async function PromptsPage() {
  const prompts = await getPromptsPageData();
  const activePrompts = prompts.filter((prompt) => prompt.isActive).length;

  return (
    <Panel title="Prompt versions" kicker="Prompt governance" description="Prompt controls are low-frequency but high-impact, so the mobile version needs to stay calm and easy to scan.">
      <div className="space-y-5">
        <SummaryStrip
          items={[
            { label: "Prompt rows", value: prompts.length, helper: "Versions available in the system.", tone: prompts.length > 0 ? "default" : "warning" },
            { label: "Active", value: activePrompts, helper: "Live prompt versions currently in use.", tone: activePrompts > 0 ? "good" : "warning" },
            {
              label: "Inactive",
              value: prompts.length - activePrompts,
              helper: "Available alternatives you can switch to.",
              tone: prompts.length - activePrompts > 0 ? "default" : "default"
            },
            {
              label: "Prompt kinds",
              value: new Set(prompts.map((prompt) => prompt.kind)).size,
              helper: "Distinct workflow stages represented here.",
              tone: "default"
            }
          ]}
        />

        {prompts.length === 0 ? (
          <EmptyState
            title="No prompt versions found"
            body="Prompt versions will appear here once they are seeded or created in the system."
          />
        ) : (
          <Table headers={["Kind", "Version", "Name", "Status", "Activated", "Action"]}>
            {prompts.map((prompt) => (
              <tr key={prompt.id}>
                <TableCell label="Kind">{prompt.kind}</TableCell>
                <TableCell label="Version">v{prompt.version}</TableCell>
                <TableCell label="Name">{prompt.name}</TableCell>
                <TableCell label="Status">
                  <StatusPill tone={prompt.isActive ? "good" : "warning"}>
                    {prompt.isActive ? "ACTIVE" : "INACTIVE"}
                  </StatusPill>
                </TableCell>
                <TableCell label="Activated">{formatDashboardDate(prompt.activatedAt)}</TableCell>
                <TableCell label="Action">
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
        )}
      </div>
    </Panel>
  );
}
