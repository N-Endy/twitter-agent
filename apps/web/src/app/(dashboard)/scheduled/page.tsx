import { Panel, StatusPill, Table, TableCell } from "@/components/dashboard";
import { formatDashboardDate, getScheduledPageData } from "@/lib/data";

export default async function ScheduledPage() {
  const slots = await getScheduledPageData();

  return (
    <Panel title="Scheduled posts" kicker="Posting calendar">
      <Table headers={["Slot", "Draft", "Pillar", "Experimental", "Status"]}>
        {slots.map((slot) => (
          <tr key={slot.id}>
            <TableCell label="Slot">{formatDashboardDate(slot.slotAt)}</TableCell>
            <TableCell label="Draft">
              {slot.draft ? (
                <>
                  <p className="text-white">{slot.draft.text}</p>
                  <p className="mt-1 text-xs text-slate-400">{slot.draft.idea.hook}</p>
                </>
              ) : (
                <span className="text-slate-400">Open slot</span>
              )}
            </TableCell>
            <TableCell label="Pillar">{slot.draft?.idea.pillar ?? "—"}</TableCell>
            <TableCell label="Experimental">{slot.isExperimental ? "Yes" : "No"}</TableCell>
            <TableCell label="Status">
              <StatusPill tone={slot.status === "POSTED" ? "good" : slot.status === "OPEN" ? "warning" : "neutral"}>
                {slot.status}
              </StatusPill>
            </TableCell>
          </tr>
        ))}
      </Table>
    </Panel>
  );
}
