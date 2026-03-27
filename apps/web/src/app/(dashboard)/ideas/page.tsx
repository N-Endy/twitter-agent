import { EmptyState, Panel, StatusPill, SummaryStrip, Table, TableCell } from "@/components/dashboard";
import { JobTriggerButton } from "@/components/job-trigger-button";
import { formatRelative, getIdeasPageData } from "@/lib/data";

export default async function IdeasPage() {
  const ideas = await getIdeasPageData();
  const ideasWithDrafts = ideas.filter((idea) => idea.drafts.length > 0).length;
  const uniqueSources = new Set(ideas.map((idea) => idea.sourceItemId)).size;

  return (
    <Panel
      title="Content ideas"
      kicker="Ideation backlog"
      description="This is where source material becomes angles worth writing. If these hooks feel off, the issue is usually source mix or source notes before it is draft writing."
      actions={<JobTriggerButton job="weekly-batch" label="Run weekly batch" />}
    >
      <div className="space-y-5">
        <SummaryStrip
          items={[
            { label: "Ideas loaded", value: ideas.length, helper: "Most recent ideas in the backlog.", tone: ideas.length > 0 ? "good" : "warning" },
            { label: "With drafts", value: ideasWithDrafts, helper: "Ideas that have already moved into writing.", tone: ideasWithDrafts > 0 ? "good" : "default" },
            { label: "Unique sources", value: uniqueSources, helper: "How diverse the current idea pool is.", tone: uniqueSources > 1 ? "good" : "warning" },
            { label: "Still active", value: ideas.filter((idea) => idea.status === "ACTIVE").length, helper: "Active ideas available for drafting.", tone: "default" }
          ]}
        />

        {ideas.length === 0 ? (
          <EmptyState
            title="No ideas yet"
            body="Run a weekly batch after ingesting sources. The strongest ideas usually appear only after fresh snapshots are in place."
            actions={<JobTriggerButton job="weekly-batch" label="Run weekly batch" />}
          />
        ) : (
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
        )}
      </div>
    </Panel>
  );
}
