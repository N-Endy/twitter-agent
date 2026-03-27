import { EmptyState, InfoNotice, Panel, StatusPill, SummaryStrip, Table, TableCell } from "@/components/dashboard";
import { AddSourceForm } from "@/components/add-source-form";
import { JobTriggerButton } from "@/components/job-trigger-button";
import { SourceRowActions } from "@/components/source-row-actions";
import { formatDashboardDate, getSourcesPageData } from "@/lib/data";

export default async function SourcesPage() {
  const sources = await getSourcesPageData();
  const activeSources = sources.filter((source) => source.isActive).length;
  const sourcesWithNotes = sources.filter((source) => Boolean(source.notes?.trim())).length;
  const sourcesWithSnapshots = sources.filter((source) => source._count.researchSnapshots > 0).length;

  return (
    <Panel
      title="Research sources"
      kicker="Curated intake"
      description="This page decides what the system learns from. Strong source notes and a healthy source mix matter more than prompt tweaks when you want better content quality."
      actions={<JobTriggerButton job="source-ingest" label="Run ingest now" />}
    >
      <div className="mb-5">
        <AddSourceForm />
      </div>

      <div className="space-y-5">
        <SummaryStrip
          items={[
            { label: "Active", value: activeSources, helper: "Sources currently feeding the system.", tone: "good" },
            {
              label: "Paused",
              value: sources.length - activeSources,
              helper: "Sources held back from ingestion.",
              tone: sources.length - activeSources > 0 ? "warning" : "default"
            },
            {
              label: "With notes",
              value: sourcesWithNotes,
              helper: "Notes make the source influence more specific.",
              tone: sourcesWithNotes === sources.length && sources.length > 0 ? "good" : "warning"
            },
            {
              label: "Snapshots captured",
              value: sourcesWithSnapshots,
              helper: "Sources that have produced at least one research snapshot.",
              tone: sourcesWithSnapshots > 0 ? "good" : "warning"
            }
          ]}
        />

        <InfoNotice title="Operator tip">
          If a source is meant to shift the account away from tech content, give it explicit notes about topic, tone,
          audience, and emotional style. The model follows source guidance better than vague titles alone.
        </InfoNotice>

        {sources.length === 0 ? (
          <EmptyState
            title="No sources yet"
            body="Add at least one strong source before running ingest. Good source notes make the rest of the pipeline much easier to steer."
          />
        ) : (
          <Table headers={[
            { label: "Source" },
            { label: "Kind", className: "tech-column" },
            { label: "Snapshots", className: "tech-column" },
            { label: "Ideas", className: "tech-column" },
            { label: "Last updated", className: "tech-column" },
            { label: "State", className: "tech-column" },
            { label: "Actions", className: "tech-column" }
          ]}>
            {sources.map((source) => (
              <tr key={source.id}>
                <TableCell label="Source">
                  <p className="font-bold text-white uppercase tracking-tight text-xs">{source.title}</p>
                  <p className="mt-1 text-[9px] text-slate-500 font-mono tracking-tighter">{source.uri}</p>
                  {source.notes ? <p className="mt-3 text-xs leading-6 text-slate-400 border-l border-white/10 pl-3">{source.notes}</p> : null}
                </TableCell>
                <TableCell label="Kind" className="tech-column text-[10px] uppercase tracking-widest text-slate-500 font-bold">{source.kind}</TableCell>
                <TableCell label="Snapshots" className="tech-column text-xs font-mono">{source._count.researchSnapshots}</TableCell>
                <TableCell label="Ideas" className="tech-column text-xs font-mono">{source._count.contentIdeas}</TableCell>
                <TableCell label="Last updated" className="tech-column text-[10px] uppercase tracking-wide text-slate-500">
                  {formatDashboardDate(source.updatedAt)}
                </TableCell>
                <TableCell label="State" className="tech-column">
                  <StatusPill tone={source.isActive ? "good" : "warning"}>{source.isActive ? "ACTIVE" : "PAUSED"}</StatusPill>
                </TableCell>
                <TableCell label="Actions" className="tech-column">
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
        )}
      </div>
    </Panel>
  );
}
