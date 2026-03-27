import { Panel, StatusPill, Table, TableCell } from "@/components/dashboard";
import { JobTriggerButton } from "@/components/job-trigger-button";
import { formatRelative, getIdeasPageData } from "@/lib/data";

export default async function IdeasPage() {
  const ideas = await getIdeasPageData();

  return (
    <Panel
      title="Content ideas"
      kicker="Ideation backlog"
      actions={<JobTriggerButton job="weekly-batch" label="Run weekly batch" />}
    >
      <Table headers={["Idea", "Source", "Tags", "Drafts", "Created", "State"]}>
        {ideas.map((idea) => (
          <tr key={idea.id}>
            <TableCell label="Idea">
              <p className="font-medium text-white">{idea.hook}</p>
              <p className="mt-1 text-xs text-slate-400">{idea.angle}</p>
            </TableCell>
            <TableCell label="Source">
              <p>{idea.sourceItem.title}</p>
              <p className="mt-1 text-xs text-slate-400">{idea.pillar}</p>
            </TableCell>
            <TableCell label="Tags">{idea.tags.join(", ") || "No tags"}</TableCell>
            <TableCell label="Drafts">{idea.drafts.length}</TableCell>
            <TableCell label="Created">{formatRelative(idea.createdAt)}</TableCell>
            <TableCell label="State">
              <StatusPill tone={idea.status === "ACTIVE" ? "good" : "warning"}>{idea.status}</StatusPill>
            </TableCell>
          </tr>
        ))}
      </Table>
    </Panel>
  );
}
