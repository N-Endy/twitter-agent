import { EmptyState, InfoNotice, Panel, StatusPill, SummaryStrip, Table, TableCell } from "@/components/dashboard";
import { JobTriggerButton } from "@/components/job-trigger-button";
import { formatDashboardDate, getScheduledPageData } from "@/lib/data";

type ScheduledSlot = Awaited<ReturnType<typeof getScheduledPageData>>["upcomingSlots"][number];

function getSlotPresentation(slot: ScheduledSlot, isPastHistory = false) {
  if (!isPastHistory) {
    return {
      label: slot.status,
      tone:
        slot.status === "POSTED"
          ? ("good" as const)
          : slot.status === "OPEN"
            ? ("warning" as const)
            : slot.status === "SKIPPED"
              ? ("neutral" as const)
              : ("neutral" as const)
    };
  }

  if (slot.status === "POSTED") {
    return { label: "POSTED", tone: "good" as const };
  }

  if (slot.status === "SKIPPED") {
    return { label: "SKIPPED", tone: "neutral" as const };
  }

  if (slot.status === "RESERVED") {
    return { label: "OVERDUE", tone: "bad" as const };
  }

  return { label: "UNUSED", tone: "warning" as const };
}

function ScheduleTable({
  slots,
  history = false
}: {
  slots: ScheduledSlot[];
  history?: boolean;
}) {
  return (
    <Table headers={[
      { label: "Slot", className: "tech-column" },
      { label: "Draft" },
      { label: "Pillar", className: "tech-column" },
      { label: "Exp.", className: "tech-column" },
      { label: "Status", className: "tech-column" }
    ]}>
      {slots.map((slot) => {
        const presentation = getSlotPresentation(slot, history);

        return (
          <tr key={slot.id}>
            <TableCell label="Slot" className="tech-column text-xs font-mono">{formatDashboardDate(slot.slotAt)}</TableCell>
            <TableCell label="Draft">
              {slot.draft ? (
                <>
                  <p className="font-medium text-white line-clamp-2">{slot.draft.text}</p>
                  <p className="mt-1 max-w-sm truncate text-xs text-slate-500">{slot.draft.idea.hook}</p>
                </>
              ) : (
                <span className="text-[10px] uppercase tracking-widest text-slate-500">
                  {history ? "No draft attached" : "Open slot"}
                </span>
              )}
            </TableCell>
            <TableCell label="Pillar" className="tech-column text-xs">{slot.draft?.idea.pillar ?? "—"}</TableCell>
            <TableCell label="Exp." className="tech-column text-xs uppercase tracking-widest">{slot.isExperimental ? "Yes" : "No"}</TableCell>
            <TableCell label="Status" className="tech-column">
              <StatusPill tone={presentation.tone}>{presentation.label}</StatusPill>
            </TableCell>
          </tr>
        );
      })}
    </Table>
  );
}

export default async function ScheduledPage() {
  const { upcomingSlots, pastSlots } = await getScheduledPageData();
  const openSlots = upcomingSlots.filter((slot) => slot.status === "OPEN").length;
  const reservedSlots = upcomingSlots.filter((slot) => slot.status === "RESERVED").length;
  const postedSlots = pastSlots.filter((slot) => slot.status === "POSTED").length;
  const overduePastSlots = pastSlots.filter((slot) => slot.status === "OPEN" || slot.status === "RESERVED").length;

  return (
    <Panel
      title="Scheduled posts"
      kicker="Posting calendar"
      description="This view should stay focused on what is still actionable. Today and future slots stay in the main calendar, while older slots move into history so the page does not feel stale."
      actions={<JobTriggerButton job="publish-post" label="Run publish check" />}
    >
      <div className="space-y-5">
        <SummaryStrip
          items={[
            { label: "Today onward", value: upcomingSlots.length, helper: "Only current and future slots stay in the main view.", tone: upcomingSlots.length > 0 ? "good" : "warning" },
            { label: "Open capacity", value: openSlots, helper: "Upcoming capacity waiting for approved drafts.", tone: openSlots > 0 ? "warning" : "default" },
            { label: "Reserved", value: reservedSlots, helper: "Upcoming slots already paired with drafts.", tone: reservedSlots > 0 ? "good" : "default" },
            { label: "Past attention", value: overduePastSlots, helper: "Older slots that were never posted or cleared.", tone: overduePastSlots > 0 ? "bad" : "default" }
          ]}
        />

        {overduePastSlots > 0 ? (
          <InfoNotice title="Past slots need cleanup" tone="warning">
            Some older slots are still open or reserved. They have been moved out of the main calendar and flagged in history so you can decide whether to reschedule or ignore them.
          </InfoNotice>
        ) : null}

        {upcomingSlots.length === 0 ? (
          <EmptyState
            title="No current or upcoming slots visible"
            body="Only today and future slots appear in the main calendar now. Older slots have been moved into the history section below."
          />
        ) : (
          <ScheduleTable slots={upcomingSlots} />
        )}

        {pastSlots.length > 0 ? (
          <details className="border border-white/10 bg-white/[0.02] p-4 sm:p-5">
            <summary className="cursor-pointer list-none text-sm font-bold uppercase tracking-[0.18em] text-white">
              Past slot history ({pastSlots.length})
            </summary>
            <p className="mt-3 text-xs uppercase tracking-wide text-slate-500">
              Older slots are hidden by default so the page stays focused on what is still actionable. Past open slots are shown as unused, and past reserved slots are shown as overdue.
            </p>
            <div className="mt-4">
              <ScheduleTable slots={pastSlots} history />
            </div>
            <p className="mt-4 text-xs uppercase tracking-wide text-slate-500">
              Posted history in view: {postedSlots}
            </p>
          </details>
        ) : null}
      </div>
    </Panel>
  );
}
