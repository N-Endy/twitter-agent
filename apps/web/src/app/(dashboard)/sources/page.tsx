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
        )}
      </div>
    </Panel>
  );
}
