import { Panel, StatusPill, Table, TableCell } from "@/components/dashboard";
import { formatDashboardDate, getIncidentsPageData } from "@/lib/data";

export default async function IncidentsPage() {
  const incidents = await getIncidentsPageData();

  return (
    <Panel title="Moderation incidents" kicker="Safety ledger">
      <Table headers={["When", "Target", "Decision", "Risk", "Reasons"]}>
        {incidents.map((incident) => (
          <tr key={incident.id}>
            <TableCell>{formatDashboardDate(incident.createdAt)}</TableCell>
            <TableCell>
              <p className="text-white">{incident.targetType}</p>
              <p className="mt-1 text-xs text-slate-400">{incident.targetId}</p>
            </TableCell>
            <TableCell>
              <StatusPill tone={incident.decision === "ESCALATE" ? "warning" : "bad"}>{incident.decision}</StatusPill>
            </TableCell>
            <TableCell>{incident.riskLevel}</TableCell>
            <TableCell>{incident.reasons.join(", ")}</TableCell>
          </tr>
        ))}
      </Table>
    </Panel>
  );
}
