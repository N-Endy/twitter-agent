function uniqueLines(values: Array<string | null | undefined>) {
  const seen = new Set<string>();
  const lines: string[] = [];

  for (const value of values) {
    const normalized = value?.replace(/\s+/g, " ").trim();

    if (!normalized) {
      continue;
    }

    const key = normalized.toLowerCase();

    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    lines.push(normalized);
  }

  return lines;
}

export function buildSourceGuidance(
  source: {
    title: string;
    kind: string;
    notes?: string | null;
    allowlistHandle?: string | null;
  },
  accountVoiceGuide?: string | null,
  snapshot?: {
    title?: string;
    pillarCandidates?: string[];
    hookIdeas?: string[];
  }
) {
  return uniqueLines([
    `Source: ${source.title}`,
    source.allowlistHandle ? `Handle: @${source.allowlistHandle.replace(/^@/, "")}` : null,
    `Type: ${source.kind}`,
    source.notes ? `Notes: ${source.notes}` : null,
    accountVoiceGuide ? `Account voice guide: ${accountVoiceGuide}` : null,
    snapshot?.title ? `Current material: ${snapshot.title}` : null,
    snapshot?.pillarCandidates?.length ? `Themes: ${snapshot.pillarCandidates.slice(0, 4).join(", ")}` : null,
    snapshot?.hookIdeas?.length ? `Natural angles: ${snapshot.hookIdeas.slice(0, 3).join(" | ")}` : null,
    "Stay inside this source's actual world. Do not drift into generic tech, AI, or builder content unless the source itself is about that."
  ]).join("\n");
}

export function buildVoiceRules(
  source: {
    title: string;
    notes?: string | null;
    allowlistHandle?: string | null;
  },
  accountVoiceGuide?: string | null,
  snapshot?: {
    pillarCandidates?: string[];
  }
) {
  return uniqueLines([
    "Voice: source-led, clear, human, specific, plain English, no empty hype, no spammy calls to action.",
    accountVoiceGuide ? `Master voice: ${accountVoiceGuide}` : null,
    `Match the lane of ${source.title}.`,
    source.allowlistHandle ? `Preserve the tone signaled by @${source.allowlistHandle.replace(/^@/, "")}.` : null,
    source.notes ? `Operator notes: ${source.notes}` : null,
    snapshot?.pillarCandidates?.length ? `Likely themes: ${snapshot.pillarCandidates.slice(0, 4).join(", ")}` : null,
    "Reject any draft that sounds like generic internet advice or technical-builder content when the source does not support it."
  ]).join(" ");
}
