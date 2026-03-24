import { Panel, StatusPill, Table, TableCell } from "@/components/dashboard";
import { formatDashboardDate, getSourcesPageData } from "@/lib/data";

export default async function SourcesPage() {
  const sources = await getSourcesPageData();

  return (
    <Panel title="Research sources" kicker="Curated intake">
      <Table headers={["Source", "Kind", "Snapshots", "Ideas", "Last updated", "State"]}>
        {sources.map((source) => (
          <tr key={source.id}>
            <TableCell>
              <p className="font-medium text-white">{source.title}</p>
              <p className="mt-1 text-xs text-slate-400">{source.uri}</p>
            </TableCell>
            <TableCell>{source.kind}</TableCell>
            <TableCell>{source._count.researchSnapshots}</TableCell>
            <TableCell>{source._count.contentIdeas}</TableCell>
            <TableCell>{formatDashboardDate(source.updatedAt)}</TableCell>
            <TableCell>
              <StatusPill tone={source.isActive ? "good" : "warning"}>{source.isActive ? "ACTIVE" : "PAUSED"}</StatusPill>
            </TableCell>
          </tr>
        ))}
      </Table>
    </Panel>
  );
}
