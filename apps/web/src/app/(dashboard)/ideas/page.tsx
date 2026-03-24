import { Panel, StatusPill, Table, TableCell } from "@/components/dashboard";
import { formatRelative, getIdeasPageData } from "@/lib/data";

export default async function IdeasPage() {
  const ideas = await getIdeasPageData();

  return (
    <Panel title="Content ideas" kicker="Ideation backlog">
      <Table headers={["Idea", "Source", "Tags", "Drafts", "Created", "State"]}>
        {ideas.map((idea) => (
          <tr key={idea.id}>
            <TableCell>
              <p className="font-medium text-white">{idea.hook}</p>
              <p className="mt-1 text-xs text-slate-400">{idea.angle}</p>
            </TableCell>
            <TableCell>
              <p>{idea.sourceItem.title}</p>
              <p className="mt-1 text-xs text-slate-400">{idea.pillar}</p>
            </TableCell>
            <TableCell>{idea.tags.join(", ") || "No tags"}</TableCell>
            <TableCell>{idea.drafts.length}</TableCell>
            <TableCell>{formatRelative(idea.createdAt)}</TableCell>
            <TableCell>
              <StatusPill tone={idea.status === "ACTIVE" ? "good" : "warning"}>{idea.status}</StatusPill>
            </TableCell>
          </tr>
        ))}
      </Table>
    </Panel>
  );
}
