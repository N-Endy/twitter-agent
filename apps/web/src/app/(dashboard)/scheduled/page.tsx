import { Panel, StatusPill, Table, TableCell } from "@/components/dashboard";
import { formatDashboardDate, getScheduledPageData } from "@/lib/data";

export default async function ScheduledPage() {
  const slots = await getScheduledPageData();

  return (
    <Panel title="Scheduled posts" kicker="Posting calendar">
      <Table headers={["Slot", "Draft", "Pillar", "Experimental", "Status"]}>
        {slots.map((slot) => (
          <tr key={slot.id}>
            <TableCell>{formatDashboardDate(slot.slotAt)}</TableCell>
            <TableCell>
              {slot.draft ? (
                <>
                  <p className="text-white">{slot.draft.text}</p>
                  <p className="mt-1 text-xs text-slate-400">{slot.draft.idea.hook}</p>
                </>
              ) : (
                <span className="text-slate-400">Open slot</span>
              )}
            </TableCell>
            <TableCell>{slot.draft?.idea.pillar ?? "—"}</TableCell>
            <TableCell>{slot.isExperimental ? "Yes" : "No"}</TableCell>
            <TableCell>
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
