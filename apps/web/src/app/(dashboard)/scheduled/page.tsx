import { EmptyState, Panel, StatusPill, SummaryStrip, Table, TableCell } from "@/components/dashboard";
import { JobTriggerButton } from "@/components/job-trigger-button";
import { formatDashboardDate, getScheduledPageData } from "@/lib/data";

export default async function ScheduledPage() {
  const slots = await getScheduledPageData();
  const openSlots = slots.filter((slot) => slot.status === "OPEN").length;
  const reservedSlots = slots.filter((slot) => slot.status === "RESERVED").length;
  const postedSlots = slots.filter((slot) => slot.status === "POSTED").length;

  return (
    <Panel
      title="Scheduled posts"
      kicker="Posting calendar"
      description="This view is the bridge between approved drafts and live publishing. On mobile, it should be easy to see whether you have open capacity or a full calendar."
      actions={<JobTriggerButton job="publish-post" label="Run publish check" />}
    >
      <div className="space-y-5">
        <SummaryStrip
          items={[
            { label: "Open slots", value: openSlots, helper: "Capacity waiting for approved drafts.", tone: openSlots > 0 ? "warning" : "default" },
            { label: "Reserved", value: reservedSlots, helper: "Slots already paired with drafts.", tone: reservedSlots > 0 ? "good" : "default" },
            { label: "Posted", value: postedSlots, helper: "Slots that have already gone live.", tone: postedSlots > 0 ? "good" : "default" },
            { label: "Experimental", value: slots.filter((slot) => slot.isExperimental).length, helper: "Higher-risk test windows.", tone: "default" }
          ]}
        />

        {slots.length === 0 ? (
          <EmptyState
            title="No schedule slots visible"
            body="Once upcoming slots are available, they will appear here with their draft assignment and publishing state."
          />
        ) : (
          <Table headers={[
            { label: "Slot", className: "tech-column" },
            { label: "Draft" },
            { label: "Pillar", className: "tech-column" },
            { label: "Exp.", className: "tech-column" },
            { label: "Status", className: "tech-column" }
          ]}>
            {slots.map((slot) => (
              <tr key={slot.id}>
                <TableCell label="Slot" className="tech-column text-xs font-mono">{formatDashboardDate(slot.slotAt)}</TableCell>
                <TableCell label="Draft">
                  {slot.draft ? (
                    <>
                      <p className="text-white font-medium line-clamp-2">{slot.draft.text}</p>
                      <p className="mt-1 text-xs text-slate-500 truncate max-w-sm">{slot.draft.idea.hook}</p>
                    </>
                  ) : (
                    <span className="text-slate-500 uppercase tracking-widest text-[10px]">Open slot</span>
                  )}
                </TableCell>
                <TableCell label="Pillar" className="tech-column text-xs">{slot.draft?.idea.pillar ?? "—"}</TableCell>
                <TableCell label="Exp." className="tech-column text-xs uppercase tracking-widest">{slot.isExperimental ? "Yes" : "No"}</TableCell>
                <TableCell label="Status" className="tech-column">
                  <StatusPill tone={slot.status === "POSTED" ? "good" : slot.status === "OPEN" ? "warning" : "neutral"}>
                    {slot.status}
                  </StatusPill>
                </TableCell>
              </tr>
            ))}
          </Table>
        )}
      </div>
    </Panel>
  );
}
