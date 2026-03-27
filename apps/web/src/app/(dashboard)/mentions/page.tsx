import { EmptyState, Panel, StatusPill, SummaryStrip, Table, TableCell } from "@/components/dashboard";
import { JobTriggerButton } from "@/components/job-trigger-button";
import { formatRelative, getMentionsPageData } from "@/lib/data";

export default async function MentionsPage() {
  const mentions = await getMentionsPageData();
  const newMentions = mentions.filter((mention) => mention.status === "NEW").length;
  const draftedMentions = mentions.filter((mention) => mention.status === "DRAFTED" || mention.status === "APPROVED").length;
  const escalatedMentions = mentions.filter((mention) => mention.status === "ESCALATED" || mention.status === "BLOCKED").length;
  const sentMentions = mentions.filter((mention) => mention.status === "SENT").length;

  return (
    <Panel
      title="Mentions queue"
      kicker="Inbound triage"
      description="This queue should tell you what came in, what is waiting for a reply draft, and what already needs a human decision."
      actions={
        <>
          <JobTriggerButton job="mention-poll" label="Poll mentions" />
          <JobTriggerButton job="reply-draft" label="Draft backlog" />
        </>
      }
    >
      <div className="space-y-5">
        <SummaryStrip
          items={[
            { label: "New", value: newMentions, helper: "Mentions without drafted replies yet.", tone: newMentions > 0 ? "warning" : "default" },
            { label: "Drafted", value: draftedMentions, helper: "Mentions ready for reply review.", tone: draftedMentions > 0 ? "good" : "default" },
            { label: "Escalated", value: escalatedMentions, helper: "Mentions that need extra care.", tone: escalatedMentions > 0 ? "bad" : "default" },
            { label: "Sent", value: sentMentions, helper: "Mentions already resolved with a send.", tone: sentMentions > 0 ? "good" : "default" }
          ]}
        />

        {mentions.length === 0 ? (
          <EmptyState
            title="No mentions yet"
            body="Poll X to ingest mentions. Once they arrive, this queue will tell you whether they need drafting, escalation, or no action."
            actions={<JobTriggerButton job="mention-poll" label="Poll mentions" />}
          />
        ) : (
          <Table headers={[
            { label: "Author", className: "tech-column" },
            { label: "Mention" },
            { label: "Status", className: "tech-column" },
            { label: "Suggestion", className: "tech-column" },
            { label: "Action", className: "tech-column" },
            { label: "Received", className: "tech-column" },
            { label: "Next step", className: "tech-column" }
          ]}>
            {mentions.map((mention) => (
              <tr key={mention.id}>
                <TableCell label="Author" className="tech-column">
                  <p className="font-bold text-white uppercase tracking-tight text-[10px]">@{mention.authorUsername}</p>
                  <p className="mt-1 text-[9px] text-slate-500 font-mono tracking-tighter">{mention.authorId}</p>
                </TableCell>
                <TableCell label="Mention">
                  <p className="text-xs leading-5 text-slate-300">{mention.text}</p>
                </TableCell>
                <TableCell label="Status" className="tech-column">
                  <StatusPill
                    tone={
                      mention.status === "SENT"
                        ? "good"
                        : mention.status === "ESCALATED" || mention.status === "BLOCKED"
                          ? "bad"
                          : "warning"
                    }
                  >
                    {mention.status}
                  </StatusPill>
                </TableCell>
                <TableCell label="Suggestion" className="tech-column text-[10px] uppercase tracking-wide text-slate-500">
                  {mention.replySuggestions[0]?.draftText ? (
                    <span className="text-slate-300">DRAFTED</span>
                  ) : (
                    "NONE"
                  )}
                </TableCell>
                <TableCell label="Action" className="tech-column text-[10px] uppercase tracking-wide text-slate-500">
                  {mention.replyActions[0]?.actionType ?? "NONE"}
                </TableCell>
                <TableCell label="Received" className="tech-column text-[10px] uppercase tracking-wide text-slate-500">
                  {formatRelative(mention.receivedAt)}
                </TableCell>
                <TableCell label="Next step" className="tech-column">
                  <div className="flex flex-col gap-2">
                    {mention.status === "NEW" ? (
                      <JobTriggerButton
                        job="reply-draft"
                        label="Draft"
                        body={{ mentionId: mention.id }}
                        tone="neutral"
                      />
                    ) : (
                      <span className="text-[9px] uppercase tracking-widest text-slate-500 font-bold">Processed</span>
                    )}
                  </div>
                </TableCell>
              </tr>
            ))}
          </Table>
        )}
      </div>
    </Panel>
  );
}
