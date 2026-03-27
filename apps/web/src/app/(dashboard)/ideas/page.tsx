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
          <Table headers={[
            { label: "Idea" },
            { label: "Source", className: "tech-column" },
            { label: "Tags", className: "tech-column" },
            { label: "Drafts", className: "tech-column" },
            { label: "Created", className: "tech-column" },
            { label: "State", className: "tech-column" }
          ]}>
            {ideas.map((idea) => (
              <tr key={idea.id}>
                <TableCell label="Idea">
                  <p className="font-bold text-white uppercase tracking-tight text-xs">{idea.hook}</p>
                  <p className="mt-2 text-xs leading-5 text-slate-400">{idea.angle}</p>
                </TableCell>
                <TableCell label="Source" className="tech-column">
                  <p className="font-bold text-white uppercase tracking-tight text-[10px]">{idea.sourceItem.title}</p>
                  <p className="mt-1 text-[9px] text-slate-500 font-mono tracking-tighter uppercase">{idea.pillar}</p>
                </TableCell>
                <TableCell label="Tags" className="tech-column text-[10px] uppercase tracking-wide text-slate-500 max-w-[140px] truncate">
                  {idea.tags.join(", ") || "No tags"}
                </TableCell>
                <TableCell label="Drafts" className="tech-column text-xs font-mono">{idea.drafts.length}</TableCell>
                <TableCell label="Created" className="tech-column text-[10px] uppercase tracking-wide text-slate-500">
                  {formatRelative(idea.createdAt)}
                </TableCell>
                <TableCell label="State" className="tech-column">
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
