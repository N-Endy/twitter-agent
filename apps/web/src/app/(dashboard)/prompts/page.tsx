import { BrandVoiceEditor } from "@/components/brand-voice-editor";
import { MutationButton } from "@/components/mutation-button";
import { EmptyState, InfoNotice, Panel, StatusPill, SummaryStrip, Table, TableCell } from "@/components/dashboard";
import { formatDashboardDate, getPromptsPageData } from "@/lib/data";

export default async function PromptsPage() {
  const { prompts, brandVoiceGuide, voiceExamples, voiceExampleStats } = await getPromptsPageData();
  const activePrompts = prompts.filter((prompt) => prompt.isActive).length;

  return (
    <>
      <Panel
        title="Account voice"
        kicker="Global language control"
        description="Paste the account-wide voice guide here. This sits above individual source notes and helps every draft feel like the same account."
      >
        <div className="space-y-5">
          <SummaryStrip
            items={[
              {
                label: "Status",
                value: brandVoiceGuide ? "Configured" : "Missing",
                helper: brandVoiceGuide ? "The worker will apply this guide to new generation runs." : "No account-wide brand voice has been saved yet.",
                tone: brandVoiceGuide ? "good" : "warning"
              },
              {
                label: "Length",
                value: brandVoiceGuide?.length ?? 0,
                helper: "Character count for the saved guide.",
                tone: "default"
              },
              {
                label: "Best use",
                value: "Consistency",
                helper: "Use this for the account's overall voice, not source-specific style notes.",
                tone: "default"
              },
              {
                label: "Source notes",
                value: "Still active",
                helper: "Sources still determine the lane, tone, and mechanics of each content type.",
                tone: "default"
              }
            ]}
          />

          <InfoNotice title="How to use this">
            Put the master voice here once. Keep source notes focused on the specific kind of content each source
            should teach the system.
          </InfoNotice>

          <BrandVoiceEditor initialValue={brandVoiceGuide} />
        </div>
      </Panel>

      <Panel title="Prompt versions" kicker="Prompt governance" description="Prompt controls are low-frequency but high-impact, so the mobile version needs to stay calm and easy to scan.">
        <div className="space-y-5">
          <SummaryStrip
            items={[
              { label: "Prompt rows", value: prompts.length, helper: "Versions available in the system.", tone: prompts.length > 0 ? "default" : "warning" },
              { label: "Active", value: activePrompts, helper: "Live prompt versions currently in use.", tone: activePrompts > 0 ? "good" : "warning" },
              {
                label: "Inactive",
                value: prompts.length - activePrompts,
                helper: "Available alternatives you can switch to.",
                tone: "default"
              },
              {
                label: "Prompt kinds",
                value: new Set(prompts.map((prompt) => prompt.kind)).size,
                helper: "Distinct workflow stages represented here.",
                tone: "default"
              }
            ]}
          />

          {prompts.length === 0 ? (
            <EmptyState
              title="No prompt versions found"
              body="Prompt versions will appear here once they are seeded or created in the system."
            />
          ) : (
            <Table headers={[
              { label: "Kind", className: "tech-column" },
              { label: "Version", className: "tech-column" },
              { label: "Name" },
              { label: "Status", className: "tech-column" },
              { label: "Activated", className: "tech-column" },
              { label: "Action", className: "tech-column" }
            ]}>
              {prompts.map((prompt) => (
                <tr key={prompt.id}>
                  <TableCell label="Kind" className="tech-column text-[10px] uppercase tracking-widest text-slate-500 font-bold">{prompt.kind}</TableCell>
                  <TableCell label="Version" className="tech-column text-xs font-mono">v{prompt.version}</TableCell>
                  <TableCell label="Name" className="font-medium text-white">{prompt.name}</TableCell>
                  <TableCell label="Status" className="tech-column">
                    <StatusPill tone={prompt.isActive ? "good" : "warning"}>
                      {prompt.isActive ? "ACTIVE" : "INACTIVE"}
                    </StatusPill>
                  </TableCell>
                  <TableCell label="Activated" className="tech-column text-xs font-mono">{formatDashboardDate(prompt.activatedAt)}</TableCell>
                  <TableCell label="Action" className="tech-column">
                    {!prompt.isActive ? (
                      <MutationButton
                        url={`/api/admin/prompts/${prompt.id}/activate`}
                        label="Activate"
                        confirmText="Make this the active prompt version?"
                      />
                    ) : (
                      <span className="text-[9px] uppercase tracking-widest text-[var(--accent)] font-black">Live</span>
                    )}
                  </TableCell>
                </tr>
              ))}
            </Table>
          )}
        </div>
      </Panel>

      <Panel
        title="Voice examples"
        kicker="Curated training memory"
        description="These are the before/after pairs you explicitly taught to the system. Active examples shape future writing and QA. Archive weak examples instead of deleting history."
      >
        <div className="space-y-5">
          <SummaryStrip
            items={[
              {
                label: "Active examples",
                value: voiceExampleStats.active,
                helper: "Examples currently influencing generation.",
                tone: voiceExampleStats.active > 0 ? "good" : "warning"
              },
              {
                label: "Added this week",
                value: voiceExampleStats.thisWeek,
                helper: "Recent training activity.",
                tone: voiceExampleStats.thisWeek > 0 ? "good" : "default"
              },
              {
                label: "Source-backed",
                value: voiceExampleStats.bySource,
                helper: "Examples tied to a specific source lane.",
                tone: voiceExampleStats.bySource > 0 ? "good" : "warning"
              },
              {
                label: "Rows loaded",
                value: voiceExamples.length,
                helper: "Most recent examples visible here.",
                tone: voiceExamples.length > 0 ? "default" : "warning"
              }
            ]}
          />

          {voiceExamples.length === 0 ? (
            <EmptyState
              title="No voice examples yet"
              body="Teach strong before/after draft pairs from the draft workshop. They will show up here once you explicitly save them as voice examples."
            />
          ) : (
            <Table
              headers={[
                { label: "Draft pair" },
                { label: "Source", className: "tech-column" },
                { label: "Tags", className: "tech-column" },
                { label: "Status", className: "tech-column" },
                { label: "Updated", className: "tech-column" },
                { label: "Action", className: "tech-column" }
              ]}
            >
              {voiceExamples.map((example) => (
                <tr key={example.id}>
                  <TableCell label="Draft pair">
                    <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-500">Original AI</p>
                    <p className="mt-2 text-xs leading-6 text-slate-300 max-w-md line-clamp-4 break-words">{example.sourceRevision.text}</p>
                    <p className="mt-4 text-[10px] font-black uppercase tracking-[0.24em] text-slate-500">Preferred rewrite</p>
                    <p className="mt-2 text-xs leading-6 text-white max-w-md line-clamp-4 break-words">{example.preferredRevision.text}</p>
                    {example.operatorNote ? (
                      <p className="mt-3 border-l border-white/10 pl-3 text-xs leading-6 text-slate-400">{example.operatorNote}</p>
                    ) : null}
                  </TableCell>
                  <TableCell label="Source" className="tech-column">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-300">
                      {example.sourceItem?.title ?? example.draft.idea.pillar}
                    </p>
                    <p className="mt-2 text-[9px] uppercase tracking-[0.2em] text-slate-500">
                      {example.draft.hookTag ?? example.draft.idea.hook.slice(0, 40)}
                    </p>
                  </TableCell>
                  <TableCell label="Tags" className="tech-column">
                    <div className="flex flex-wrap gap-2">
                      {example.feedbackTags.length > 0 ? (
                        example.feedbackTags.map((tag) => (
                          <span
                            key={`${example.id}-${tag}`}
                            className="inline-flex border border-white/10 bg-white/[0.04] px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-slate-300"
                          >
                            {tag.replaceAll("_", " ")}
                          </span>
                        ))
                      ) : (
                        <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500">No tags</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell label="Status" className="tech-column">
                    <StatusPill tone={example.status === "ACTIVE" ? "good" : "warning"}>
                      {example.status}
                    </StatusPill>
                  </TableCell>
                  <TableCell label="Updated" className="tech-column text-[10px] uppercase tracking-wide text-slate-500">
                    {formatDashboardDate(example.updatedAt)}
                  </TableCell>
                  <TableCell label="Action" className="tech-column">
                    <MutationButton
                      url={`/api/admin/voice-examples/${example.id}/archive`}
                      label={example.status === "ACTIVE" ? "Archive" : "Restore"}
                      body={{ action: example.status === "ACTIVE" ? "archive" : "restore" }}
                      tone={example.status === "ACTIVE" ? "warning" : "success"}
                    />
                  </TableCell>
                </tr>
              ))}
            </Table>
          )}
        </div>
      </Panel>
    </>
  );
}
