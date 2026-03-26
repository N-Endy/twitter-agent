import { Panel, StatusPill, Table, TableCell } from "@/components/dashboard";
import { AddSourceForm } from "@/components/add-source-form";
import { SourceRowActions } from "@/components/source-row-actions";
import { formatDashboardDate, getSourcesPageData } from "@/lib/data";

export default async function SourcesPage() {
  const sources = await getSourcesPageData();

  return (
    <Panel title="Research sources" kicker="Curated intake">
      <div className="mb-5">
        <AddSourceForm />
      </div>

      <Table headers={["Source", "Kind", "Snapshots", "Ideas", "Last updated", "State", "Actions"]}>
        {sources.map((source) => (
          <tr key={source.id}>
            <TableCell label="Source">
              <p className="font-medium text-white">{source.title}</p>
              <p className="mt-1 text-xs text-slate-400">{source.uri}</p>
              {source.notes ? <p className="mt-2 text-xs leading-5 text-slate-300">{source.notes}</p> : null}
            </TableCell>
            <TableCell label="Kind">{source.kind}</TableCell>
            <TableCell label="Snapshots">{source._count.researchSnapshots}</TableCell>
            <TableCell label="Ideas">{source._count.contentIdeas}</TableCell>
            <TableCell label="Last updated">{formatDashboardDate(source.updatedAt)}</TableCell>
            <TableCell label="State">
              <StatusPill tone={source.isActive ? "good" : "warning"}>{source.isActive ? "ACTIVE" : "PAUSED"}</StatusPill>
            </TableCell>
            <TableCell label="Actions">
              <SourceRowActions
                source={{
                  id: source.id,
                  title: source.title,
                  notes: source.notes,
                  isActive: source.isActive
                }}
              />
            </TableCell>
          </tr>
        ))}
      </Table>
    </Panel>
  );
}
