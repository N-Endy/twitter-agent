import { EmptyState, Panel, StatusPill, SummaryStrip, Table, TableCell } from "@/components/dashboard";
import { formatDashboardDate, getIncidentsPageData } from "@/lib/data";

export default async function IncidentsPage() {
  const incidents = await getIncidentsPageData();
  const escalations = incidents.filter((incident) => incident.decision === "ESCALATE").length;
  const blocks = incidents.filter((incident) => incident.decision === "BLOCK").length;

  return (
    <Panel title="Moderation incidents" kicker="Safety ledger" description="This page should stay readable even on a phone because safety review often happens in a hurry.">
      <div className="space-y-5">
        <SummaryStrip
          items={[
            { label: "Incidents", value: incidents.length, helper: "Recent moderation events in view.", tone: incidents.length > 0 ? "warning" : "default" },
            { label: "Escalations", value: escalations, helper: "Items routed to human handling.", tone: escalations > 0 ? "warning" : "default" },
            { label: "Blocks", value: blocks, helper: "Items blocked by policy or risk checks.", tone: blocks > 0 ? "bad" : "default" },
            {
              label: "Critical risk",
              value: incidents.filter((incident) => incident.riskLevel === "CRITICAL").length,
              helper: "Highest-risk events in the current list.",
              tone: incidents.some((incident) => incident.riskLevel === "CRITICAL") ? "bad" : "default"
            }
          ]}
        />

        {incidents.length === 0 ? (
          <EmptyState
            title="No incidents in the current window"
            body="Blocked and escalated moderation events will appear here once the safety layer has something to report."
          />
        ) : (
          <Table headers={[
            { label: "When", className: "tech-column" },
            { label: "Target", className: "tech-column" },
            { label: "Decision", className: "tech-column" },
            { label: "Risk", className: "tech-column" },
            { label: "Reasons" }
          ]}>
            {incidents.map((incident) => (
              <tr key={incident.id}>
                <TableCell label="When" className="tech-column text-xs font-mono">{formatDashboardDate(incident.createdAt)}</TableCell>
                <TableCell label="Target" className="tech-column">
                  <p className="text-white font-bold text-[10px] uppercase tracking-tight">{incident.targetType}</p>
                  <p className="mt-1 text-[9px] text-slate-500 font-mono tracking-tighter">{incident.targetId}</p>
                </TableCell>
                <TableCell label="Decision" className="tech-column">
                  <StatusPill tone={incident.decision === "ESCALATE" ? "warning" : "bad"}>{incident.decision}</StatusPill>
                </TableCell>
                <TableCell label="Risk" className="tech-column text-xs uppercase font-black tracking-widest">{incident.riskLevel}</TableCell>
                <TableCell label="Reasons" className="text-xs text-slate-400 uppercase tracking-wide leading-5">{incident.reasons.join(", ")}</TableCell>
              </tr>
            ))}
          </Table>
        )}
      </div>
    </Panel>
  );
}
