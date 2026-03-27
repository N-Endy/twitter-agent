import { MutationButton } from "@/components/mutation-button";

export function JobTriggerButton({
  job,
  label,
  body,
  confirmText,
  tone = "neutral"
}: {
  job: "source-ingest" | "weekly-batch" | "draft-qa" | "publish-post" | "mention-poll" | "reply-draft" | "metrics-sync" | "cleanup";
  label: string;
  body?: Record<string, unknown>;
  confirmText?: string;
  tone?: "success" | "warning" | "danger" | "neutral";
}) {
  return (
    <MutationButton
      url={`/api/admin/jobs/${job}`}
      label={label}
      body={body}
      confirmText={confirmText}
      tone={tone}
    />
  );
}
