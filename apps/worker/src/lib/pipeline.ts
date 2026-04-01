import {
  analyzePostTiming,
  buildSourceGuidance,
  buildVoiceRules,
  compareXIds,
  createPost,
  createThread,
  ensureInitialDraftRevision,
  ensureUpcomingScheduleSlots,
  extractTweetIdFromUrl,
  formatVoiceExamplesForPrompt,
  getEnv,
  getMentions,
  getPost,
  getPrismaClient,
  getQueue,
  getRelevantVoiceExamples,
  getStyleOnlyReferenceText,
  getValidXAccessToken,
  ingestRssSource,
  ingestUrlSource,
  ingestXAccountSource,
  ingestXPostSource,
  isXApiError,
  isXIntegrationPaused,
  markXIntegrationFailure,
  markXIntegrationHealthy,
  moderateDraft,
  moderateMention,
  pickNextUnscheduledSlot,
  Prisma,
  queueNames,
  readBrandVoiceProfile,
  readMentionCursor,
  readXIntegrationState,
  saveMentionCursor
} from "@twitter-agent/core";

import {
  analyzePerformance,
  classifyHookPattern,
  classifyMention,
  draftReply,
  extractResearch,
  generateIdeas,
  reviewDraft,
  writeDraft,
  writeThread
} from "./ai";

const prisma = getPrismaClient();
const X_BILLING_BLOCKED_SKIP = "x-billing-blocked";

function stringify(value: unknown) {
  return JSON.stringify(value, null, 2);
}

function extractXFailureReason(error: { bodyJson?: Record<string, unknown> | null; bodyText?: string; message: string }) {
  const errors = error.bodyJson?.errors;

  if (Array.isArray(errors)) {
    const firstMessage = errors.find(
      (entry): entry is { message: string } =>
        typeof entry === "object" && entry !== null && "message" in entry && typeof entry.message === "string"
    );

    if (firstMessage?.message) {
      return firstMessage.message;
    }
  }

  const detail = error.bodyJson?.detail;

  if (typeof detail === "string" && detail.trim()) {
    return detail;
  }

  return error.bodyText || error.message;
}

async function registerXFailure(error: unknown) {
  if (!isXApiError(error)) {
    return false;
  }

  await markXIntegrationFailure({
    billingRequired: error.billingRequired,
    reason: extractXFailureReason(error),
    statusCode: error.status
  });

  return error.billingRequired;
}

async function getOperationalXTokens() {
  try {
    return await getValidXAccessToken();
  } catch (error) {
    const billingRequired = await registerXFailure(error);

    if (billingRequired) {
      return null;
    }

    throw error;
  }
}

async function shouldSkipXWork() {
  const state = await readXIntegrationState();
  return isXIntegrationPaused(state) ? state : null;
}

function isXSourceKind(kind: string) {
  return kind === "X_POST" || kind === "X_ACCOUNT";
}

function mergeVoiceRulesWithStyleReferences(voiceRules: string, styleReferenceText: string) {
  return styleReferenceText && styleReferenceText !== "No style-only references configured."
    ? `${voiceRules}\n\nStyle-only references:\n${styleReferenceText}`
    : voiceRules;
}

function extractReferencedTweetId(value: unknown) {
  if (!Array.isArray(value)) {
    return null;
  }

  const firstReference = value.find(
    (entry): entry is { id?: string | number } => typeof entry === "object" && entry !== null && "id" in entry
  );

  return firstReference?.id ? String(firstReference.id) : null;
}

function parseStoredSourcePostId(value: string | null) {
  if (!value) {
    return null;
  }

  if (/^\d+$/.test(value)) {
    return value;
  }

  try {
    return extractReferencedTweetId(JSON.parse(value));
  } catch {
    return null;
  }
}

function buildConversationContext(params: { conversationId: string | null; referencedPostText?: string | null }) {
  const parts: string[] = [];

  if (params.referencedPostText) {
    parts.push(`Referenced post: ${params.referencedPostText}`);
  }

  if (params.conversationId) {
    parts.push(`Conversation ID: ${params.conversationId}`);
  }

  return parts.join("\n") || "No extra context";
}

async function getVoiceExamplePromptText(params: {
  sourceItemId?: string | null;
  pillarTag?: string | null;
  hookTag?: string | null;
  excludeDraftId?: string | null;
}) {
  const examples = await getRelevantVoiceExamples({
    sourceItemId: params.sourceItemId,
    pillarTag: params.pillarTag,
    hookTag: params.hookTag,
    excludeDraftId: params.excludeDraftId,
    limit: 3
  });

  return formatVoiceExamplesForPrompt(examples);
}

export async function runSourceIngestJob() {
  const accountVoiceGuide = await readBrandVoiceProfile();
  const sources = await prisma.sourceItem.findMany({
    where: { isActive: true },
    orderBy: { updatedAt: "desc" }
  });

  let created = 0;
  let skippedXSources = 0;
  let xWorkPaused = Boolean(await shouldSkipXWork());

  for (const source of sources) {
    let items: Array<{ title: string; rawText: string; metadata: Record<string, unknown> }> = [];

    if (xWorkPaused && isXSourceKind(source.kind)) {
      skippedXSources += 1;
      continue;
    }

    try {
      if (source.kind === "URL") {
        items = await ingestUrlSource(source.uri);
      } else if (source.kind === "RSS") {
        items = await ingestRssSource(source.uri);
      } else if (source.kind === "X_POST") {
        items = await ingestXPostSource(source.uri);
        await markXIntegrationHealthy();
      } else if (source.kind === "X_ACCOUNT") {
        const username = source.allowlistHandle ?? source.uri.split("/").filter(Boolean).pop() ?? source.uri;
        items = await ingestXAccountSource(username.replace("@", ""));
        await markXIntegrationHealthy();
      }
    } catch (error) {
      const billingRequired = await registerXFailure(error);

      if (billingRequired && isXSourceKind(source.kind)) {
        xWorkPaused = true;
        skippedXSources += 1;
        continue;
      }

      throw error;
    }

    for (const item of items) {
      const existing = await prisma.researchSnapshot.findFirst({
        where: {
          sourceItemId: source.id,
          title: item.title
        },
        orderBy: { createdAt: "desc" }
      });

      if (existing?.rawText === item.rawText) {
        continue;
      }

      const extracted = await extractResearch(
        item.rawText,
        item.title,
        source.kind,
        buildSourceGuidance(source, accountVoiceGuide, {
          title: item.title
        })
      );

      await prisma.researchSnapshot.create({
        data: {
          sourceItemId: source.id,
          title: item.title,
          rawText: item.rawText,
          summary: extracted.summary,
          keyFacts: extracted.keyFacts,
          quoteCandidates: extracted.quoteCandidates,
          hookIdeas: extracted.hookIdeas,
          pillarCandidates: extracted.pillarCandidates,
          safetyFlags: extracted.safetyFlags,
          metadata: item.metadata as Prisma.InputJsonValue
        }
      });

      created += 1;
    }
  }

  return { created, skippedXSources };
}

export async function runWeeklyBatchJob() {
  await ensureUpcomingScheduleSlots();

  const env = getEnv();
  const accountVoiceGuide = await readBrandVoiceProfile();
  const styleReferenceText = await getStyleOnlyReferenceText();

  const snapshots = await prisma.researchSnapshot.findMany({
    where: {
      sourceItem: {
        isActive: true,
        mode: "TOPIC_AND_STYLE"
      }
    },
    orderBy: { createdAt: "desc" },
    take: 8,
    include: {
      sourceItem: true
    }
  });

  if (snapshots.length === 0) {
    return { ideas: 0, drafts: 0, threads: 0 };
  }

  const recentMetrics = await prisma.postMetric.findMany({
    include: {
      publishedPost: true
    },
    orderBy: { capturedAt: "desc" },
    take: 40
  });

  const allLikes = recentMetrics
    .map((metric: (typeof recentMetrics)[number]) => metric.likes ?? 0)
    .sort((a: number, b: number) => a - b);
  const medianLikes = allLikes.length > 0
    ? allLikes[Math.floor(allLikes.length / 2)] ?? 0
    : 0;
  const winnerThreshold = Math.max(Math.round(medianLikes * 1.5), 5);

  const recentWinners = recentMetrics
    .filter((metric: (typeof recentMetrics)[number]) => (metric.likes ?? 0) >= winnerThreshold)
    .map((metric: (typeof recentMetrics)[number]) => metric.publishedPost.text)
    .slice(0, 6);
  const recentLosers = recentMetrics
    .filter((metric: (typeof recentMetrics)[number]) => (metric.likes ?? 0) < winnerThreshold)
    .map((metric: (typeof recentMetrics)[number]) => metric.publishedPost.text)
    .slice(0, 6);

  const latestLearning = await prisma.performanceLearning.findFirst({
    orderBy: { createdAt: "desc" }
  });
  const performanceInsights = latestLearning
    ? `${latestLearning.analysis}\nPatterns that work: ${latestLearning.patterns.join(", ")}\nPatterns to avoid: ${latestLearning.antiPatterns.join(", ")}\nRecommendations: ${latestLearning.recommendations.join("; ")}`
    : undefined;

  let ideasCreated = 0;
  let draftsCreated = 0;
  let threadsCreated = 0;

  for (const snapshot of snapshots.slice(0, 4)) {
    const batch = await generateIdeas({
      summary: snapshot.summary,
      keyFacts: snapshot.keyFacts,
      recentWinners,
      recentLosers,
      sourceName: snapshot.sourceItem.title,
      sourceGuidance: buildSourceGuidance(snapshot.sourceItem, accountVoiceGuide, snapshot),
      sourceHooks: snapshot.hookIdeas,
      sourcePillars: snapshot.pillarCandidates,
      performanceInsights
    });

    for (const ideaOutput of batch.ideas.slice(0, 7)) {
      const hookPattern = classifyHookPattern(ideaOutput.hook);
      const hasRichEvidence = ideaOutput.supportingEvidence.length >= 3;
      const ideaFormat = env.ENABLE_THREADS && hasRichEvidence ? "thread" : "tweet";

      const idea = await prisma.contentIdea.create({
        data: {
          sourceItemId: snapshot.sourceItemId,
          snapshotId: snapshot.id,
          pillar: ideaOutput.pillar,
          hook: ideaOutput.hook,
          angle: ideaOutput.angle,
          audience: ideaOutput.audience,
          rationale: ideaOutput.rationale,
          sourceBacked: true,
          topical: ideaOutput.topical,
          hookTags: [ideaOutput.hook.slice(0, 40)],
          pillarTags: [ideaOutput.pillar],
          tags: ideaOutput.tags,
          hookPattern,
          format: ideaFormat,
          variantCount: 1
        }
      });

      ideasCreated += 1;

      const voiceNotes = mergeVoiceRulesWithStyleReferences(
        buildVoiceRules(snapshot.sourceItem, accountVoiceGuide, snapshot),
        styleReferenceText
      );
      const voiceExamplesText = await getVoiceExamplePromptText({
        sourceItemId: snapshot.sourceItemId,
        pillarTag: ideaOutput.pillar,
        hookTag: ideaOutput.hook.slice(0, 40)
      });

      if (ideaFormat === "thread") {
        const threadOutput = await writeThread({
          pillar: ideaOutput.pillar,
          hook: ideaOutput.hook,
          angle: ideaOutput.angle,
          audience: ideaOutput.audience,
          supportingEvidence: ideaOutput.supportingEvidence,
          voiceNotes,
          sourceGuidance: buildSourceGuidance(snapshot.sourceItem, accountVoiceGuide, snapshot),
          voiceExamplesText,
          performanceInsights
        });

        const fullText = threadOutput.parts.join("\n\n---\n\n");

        const draft = await prisma.$transaction(async (tx) => {
          const createdDraft = await tx.draft.create({
            data: {
              ideaId: idea.id,
              text: fullText,
              rationale: threadOutput.rationale,
              sourceBacked: true,
              topical: ideaOutput.topical,
              characterCount: fullText.length,
              hookTag: threadOutput.hookTag,
              pillarTag: threadOutput.pillarTag,
              evidenceUsed: threadOutput.evidenceUsed,
              suggestedCta: threadOutput.ctaPart,
              confidence: threadOutput.confidence,
              format: "thread",
              threadParts: threadOutput.parts,
              status: "PENDING_QA"
            }
          });

          await ensureInitialDraftRevision(tx, {
            draftId: createdDraft.id,
            text: fullText,
            rationale: threadOutput.rationale
          });

          return createdDraft;
        });

        threadsCreated += 1;

        await getQueue(queueNames.draftQa).add("draft", {
          draftId: draft.id
        });
      } else {
        const draftOutput = await writeDraft({
          pillar: ideaOutput.pillar,
          hook: ideaOutput.hook,
          angle: ideaOutput.angle,
          audience: ideaOutput.audience,
          supportingEvidence: ideaOutput.supportingEvidence,
          voiceNotes,
          sourceGuidance: buildSourceGuidance(snapshot.sourceItem, accountVoiceGuide, snapshot),
          voiceExamplesText
        });

        const draft = await prisma.$transaction(async (tx) => {
          const createdDraft = await tx.draft.create({
            data: {
              ideaId: idea.id,
              text: draftOutput.text,
              rationale: draftOutput.rationale,
              sourceBacked: true,
              topical: ideaOutput.topical,
              characterCount: draftOutput.text.length,
              hookTag: draftOutput.hookTag,
              pillarTag: draftOutput.pillarTag,
              evidenceUsed: draftOutput.evidenceUsed,
              suggestedCta: draftOutput.suggestedCta,
              confidence: draftOutput.confidence,
              format: "tweet",
              status: "PENDING_QA"
            }
          });

          await ensureInitialDraftRevision(tx, {
            draftId: createdDraft.id,
            text: draftOutput.text,
            rationale: draftOutput.rationale
          });

          return createdDraft;
        });

        draftsCreated += 1;

        await getQueue(queueNames.draftQa).add("draft", {
          draftId: draft.id
        });

        if (draftOutput.confidence >= 0.75 && ideaOutput.supportingEvidence.length >= 2) {
          const variantOutput = await writeDraft({
            pillar: ideaOutput.pillar,
            hook: ideaOutput.hook,
            angle: `Alternative angle: ${ideaOutput.angle}. Try a different hook style or emotional register.`,
            audience: ideaOutput.audience,
            supportingEvidence: ideaOutput.supportingEvidence,
            voiceNotes,
            sourceGuidance: buildSourceGuidance(snapshot.sourceItem, accountVoiceGuide, snapshot),
            voiceExamplesText
          });

          const variantDraft = await prisma.$transaction(async (tx) => {
            const created = await tx.draft.create({
              data: {
                ideaId: idea.id,
                variantLabel: "B: Alt angle",
                text: variantOutput.text,
                rationale: variantOutput.rationale,
                sourceBacked: true,
                topical: ideaOutput.topical,
                characterCount: variantOutput.text.length,
                hookTag: variantOutput.hookTag,
                pillarTag: variantOutput.pillarTag,
                evidenceUsed: variantOutput.evidenceUsed,
                suggestedCta: variantOutput.suggestedCta,
                confidence: variantOutput.confidence,
                format: "tweet",
                status: "PENDING_QA"
              }
            });

            await ensureInitialDraftRevision(tx, {
              draftId: created.id,
              text: variantOutput.text,
              rationale: variantOutput.rationale
            });

            return created;
          });

          await prisma.contentIdea.update({
            where: { id: idea.id },
            data: { variantCount: 2 }
          });

          draftsCreated += 1;

          await getQueue(queueNames.draftQa).add("draft", {
            draftId: variantDraft.id
          });
        }
      }
    }
  }

  return {
    ideas: ideasCreated,
    drafts: draftsCreated,
    threads: threadsCreated
  };
}

export async function runDraftQaJob(draftId?: string) {
  const accountVoiceGuide = await readBrandVoiceProfile();
  const styleReferenceText = await getStyleOnlyReferenceText();
  const drafts = draftId
    ? await prisma.draft.findMany({
        where: { id: draftId },
        include: { idea: { include: { sourceItem: true, snapshot: true } } }
      })
    : await prisma.draft.findMany({
        where: { status: "PENDING_QA" },
        include: { idea: { include: { sourceItem: true, snapshot: true } } },
        take: 25
      });

  let processed = 0;

  for (const draft of drafts) {
    const voiceExamplesText = await getVoiceExamplePromptText({
      sourceItemId: draft.idea.sourceItem.id,
      pillarTag: draft.pillarTag ?? draft.idea.pillar,
      hookTag: draft.hookTag ?? draft.idea.hook.slice(0, 40),
      excludeDraftId: draft.id
    });
    const review = await reviewDraft({
      draftText: draft.text,
      supportingEvidence: draft.evidenceUsed,
      voiceRules: mergeVoiceRulesWithStyleReferences(
        buildVoiceRules(draft.idea.sourceItem, accountVoiceGuide, draft.idea.snapshot ?? undefined),
        styleReferenceText
      ),
      voiceExamplesText
    });
    const moderation = moderateDraft({
      text: review.rewrite || draft.text,
      sourceBacked: draft.sourceBacked,
      topical: draft.topical,
      mentionsThirdParty: /@\w+/.test(review.rewrite || draft.text)
    });

    let nextStatus =
      moderation.decision === "BLOCK" || !review.approvedForReview ? "REJECTED" : "NEEDS_REVIEW";

    let scheduleSlotId: string | undefined = undefined;
    let autoApproved = false;

    if (
      getEnv().ENABLE_AUTOPILOT &&
      (draft.confidence ?? 0) >= getEnv().AUTOPILOT_CONFIDENCE_THRESHOLD &&
      nextStatus === "NEEDS_REVIEW" &&
      moderation.decision === "ALLOW" &&
      review.voiceScore >= 7 &&
      review.clarityScore >= 7 &&
      review.noveltyScore >= 7 &&
      review.safetyScore >= 7 &&
      review.sourceConfidenceScore >= 7
    ) {
      const openSlot = await prisma.scheduleSlot.findFirst({
        where: {
          draft: null,
          slotAt: { gt: new Date() },
          status: "OPEN"
        },
        orderBy: { slotAt: "asc" }
      });

      if (openSlot) {
        scheduleSlotId = openSlot.id;
        nextStatus = "SCHEDULED";
      } else {
        nextStatus = "APPROVED";
      }
      autoApproved = true;
    }

    await prisma.$transaction(async (tx: any) => {
      await ensureInitialDraftRevision(tx, {
        draftId: draft.id,
        text: draft.text,
        rationale: draft.rationale,
        createdAt: draft.createdAt
      });

      await tx.draft.update({
        where: { id: draft.id },
        data: {
          text: review.rewrite || draft.text,
          characterCount: (review.rewrite || draft.text).length,
          qualitySummary: review.issues.join(" ") || "Passed QA review.",
          score:
            review.voiceScore +
            review.clarityScore +
            review.noveltyScore +
            review.safetyScore +
            review.sourceConfidenceScore,
          status: nextStatus,
          autoApproved,
          scheduleSlotId,
          ...(autoApproved ? { approvedAt: new Date() } : {})
        }
      });

      if (scheduleSlotId) {
        await tx.scheduleSlot.update({
          where: { id: scheduleSlotId },
          data: { status: "FILLED" }
        });
      }

      await tx.draftReview.create({
        data: {
          draftId: draft.id,
          reviewer: "ai-editor",
          status: review.approvedForReview ? "PASS" : "REWRITE",
          notes: review.issues.join(" ") || "Draft reviewed.",
          issues: review.issues,
          rewrite: review.rewrite,
          voiceScore: review.voiceScore,
          clarityScore: review.clarityScore,
          noveltyScore: review.noveltyScore,
          safetyScore: review.safetyScore,
          sourceConfidenceScore: review.sourceConfidenceScore,
          triggeredRules: moderation.reasons
        }
      });

      await tx.draftRevision.create({
        data: {
          draftId: draft.id,
          kind: "QA_REWRITE",
          text: review.rewrite || draft.text,
          rationale: "AI QA rewrite candidate.",
          note: review.issues.join(" ") || null,
          feedbackTags: [],
          createdBy: "ai-editor"
        }
      });

      if (moderation.decision !== "ALLOW") {
        await tx.moderationEvent.create({
          data: {
            targetType: "draft",
            targetId: draft.id,
            decision: moderation.decision,
            riskLevel: moderation.riskLevel,
            reasons: moderation.reasons,
            metadata: {
              draftText: review.rewrite || draft.text
            }
          }
        });
      }
    });

    processed += 1;
  }

  return { processed };
}

export async function runPublishPostJob() {
  if (await shouldSkipXWork()) {
    return { published: 0, skipped: X_BILLING_BLOCKED_SKIP };
  }

  const tokens = await getOperationalXTokens();

  if (!tokens?.accessToken) {
    return {
      published: 0,
      skipped: (await shouldSkipXWork()) ? X_BILLING_BLOCKED_SKIP : "x-not-connected"
    };
  }

  const dueDrafts = await prisma.draft.findMany({
    where: {
      status: "SCHEDULED",
      scheduleSlot: {
        slotAt: {
          lte: new Date()
        }
      }
    },
    select: {
      id: true
    }
  });

  let published = 0;

  for (const dueDraft of dueDrafts) {
    const claim = await prisma.draft.updateMany({
      where: {
        id: dueDraft.id,
        status: "SCHEDULED"
      },
      data: {
        status: "PUBLISHING"
      }
    });

    if (claim.count === 0) {
      continue;
    }

    const draft = await prisma.draft.findUnique({
      where: { id: dueDraft.id },
      include: {
        scheduleSlot: true
      }
    });

    if (!draft) {
      continue;
    }

    let response;

    try {
      if (draft.format === "thread" && draft.threadParts.length > 0) {
        response = await createThread({
          accessToken: tokens.accessToken,
          parts: draft.threadParts
        });
      } else {
        response = await createPost({
          accessToken: tokens.accessToken,
          text: draft.text
        });
      }
      await markXIntegrationHealthy();
    } catch (error) {
      const billingRequired = await registerXFailure(error);

      await prisma.draft.updateMany({
        where: {
          id: draft.id,
          status: "PUBLISHING"
        },
        data: {
          status: "SCHEDULED"
        }
      });

      if (billingRequired) {
        return { published, skipped: X_BILLING_BLOCKED_SKIP };
      }

      throw error;
    }

    const xPostId = draft.format === "thread" && draft.threadParts.length > 0
      ? String((response as { firstPostId: string }).firstPostId)
      : String(((response as any).data.data as { id?: string } | undefined)?.id ?? "");

    await prisma.$transaction(async (tx: any) => {
      await tx.publishedPost.create({
        data: {
          draftId: draft.id,
          scheduleSlotId: draft.scheduleSlotId ?? undefined,
          xPostId,
          text: draft.text,
          postedAt: new Date()
        }
      });

      await tx.draft.update({
        where: { id: draft.id },
        data: {
          status: "PUBLISHED"
        }
      });

      if (draft.scheduleSlotId) {
        await tx.scheduleSlot.update({
          where: { id: draft.scheduleSlotId },
          data: {
            status: "POSTED"
          }
        });
      }
    });

    published += 1;
  }

  return { published };
}

export async function runMentionPollJob() {
  if (await shouldSkipXWork()) {
    return { created: 0, skipped: X_BILLING_BLOCKED_SKIP };
  }

  const tokens = await getOperationalXTokens();
  const env = getEnv();

  if (!tokens?.accessToken) {
    return {
      created: 0,
      skipped: (await shouldSkipXWork()) ? X_BILLING_BLOCKED_SKIP : "x-not-connected"
    };
  }

  const ownerId = tokens?.userId ?? env.X_OWNER_USER_ID;

  if (!ownerId || !tokens?.accessToken) {
    return { created: 0, skipped: "owner-user-id-missing" };
  }

  const sinceId = await readMentionCursor();
  let response;

  try {
    response = await getMentions({
      accessToken: tokens.accessToken,
      userId: ownerId,
      sinceId: sinceId ?? undefined
    });
    await markXIntegrationHealthy();
  } catch (error) {
    const billingRequired = await registerXFailure(error);

    if (billingRequired) {
      return { created: 0, skipped: X_BILLING_BLOCKED_SKIP };
    }

    throw error;
  }

  const payload = response.data;
  const mentions = (payload.data as Array<Record<string, unknown>> | undefined) ?? [];
  const includes = (payload.includes as { users?: Array<{ id: string; username?: string }> } | undefined) ?? {};
  const usersById = new Map((includes.users ?? []).map((user) => [user.id, user]));

  let created = 0;
  let latestSinceId = sinceId;

  for (const mention of mentions) {
    const xMentionId = String(mention.id ?? "");
    const authorId = String(mention.author_id ?? "");
    const existing = await prisma.mention.findUnique({
      where: { xMentionId }
    });

    if (existing) {
      latestSinceId = compareXIds(xMentionId, latestSinceId) > 0 ? xMentionId : latestSinceId;
      continue;
    }

    const text = String(mention.text ?? "");
    const moderation = moderateMention(text);
    const createdMention = await prisma.mention.create({
      data: {
        xMentionId,
        conversationId: mention.conversation_id ? String(mention.conversation_id) : null,
        sourcePostId: extractReferencedTweetId(mention.referenced_tweets) ?? null,
        authorId,
        authorUsername: usersById.get(authorId)?.username ?? authorId,
        text,
        status:
          moderation.decision === "ALLOW"
            ? "NEW"
            : moderation.decision === "IGNORE"
              ? "IGNORED"
              : moderation.decision === "ESCALATE"
                ? "ESCALATED"
                : "BLOCKED",
        rawPayload: mention as Prisma.InputJsonValue,
        receivedAt: mention.created_at ? new Date(String(mention.created_at)) : new Date()
      }
    });

    if (moderation.decision !== "ALLOW") {
      await prisma.moderationEvent.create({
        data: {
          targetType: "mention",
          targetId: createdMention.id,
          decision: moderation.decision,
          riskLevel: moderation.riskLevel,
          reasons: moderation.reasons,
          metadata: { mentionText: text }
        }
      });
    } else {
      await getQueue(queueNames.replyDraft).add("mention", {
        mentionId: createdMention.id
      });
    }

    latestSinceId = compareXIds(xMentionId, latestSinceId) > 0 ? xMentionId : latestSinceId;
    created += 1;
  }

  await saveMentionCursor(latestSinceId ?? null);

  return { created };
}

export async function runReplyDraftJob(mentionId?: string) {
  const env = getEnv();
  const xPauseState = await shouldSkipXWork();
  let contextAuthToken = env.X_BEARER_TOKEN || null;
  let allowXContextLookups = !xPauseState;

  if (allowXContextLookups) {
    const tokens = await getOperationalXTokens();
    const billingBlocked = await shouldSkipXWork();

    if (billingBlocked) {
      contextAuthToken = null;
      allowXContextLookups = false;
    } else {
      contextAuthToken = tokens?.accessToken ?? env.X_BEARER_TOKEN ?? null;
      allowXContextLookups = Boolean(contextAuthToken);
    }
  }

  const mentions = mentionId
    ? await prisma.mention.findMany({ where: { id: mentionId } })
    : await prisma.mention.findMany({
        where: {
          status: "NEW"
        },
        take: 25
      });

  let drafted = 0;

  for (const mention of mentions) {
    const moderation = moderateMention(mention.text);

    if (moderation.decision !== "ALLOW") {
      await prisma.mention.update({
        where: { id: mention.id },
        data: {
          status:
            moderation.decision === "IGNORE"
              ? "IGNORED"
              : moderation.decision === "ESCALATE"
                ? "ESCALATED"
                : "BLOCKED"
        }
      });
      continue;
    }

    let conversationContext = buildConversationContext({
      conversationId: mention.conversationId
    });
    const sourcePostId = parseStoredSourcePostId(mention.sourcePostId);

    if (allowXContextLookups && contextAuthToken && sourcePostId) {
      try {
        const response = await getPost({
          authToken: contextAuthToken,
          tweetId: sourcePostId
        });
        await markXIntegrationHealthy();
        const post = response.data.data as { text?: string } | undefined;

        conversationContext = buildConversationContext({
          conversationId: mention.conversationId,
          referencedPostText: post?.text ?? null
        });
      } catch (error) {
        const billingRequired = await registerXFailure(error);

        if (billingRequired) {
          allowXContextLookups = false;
        }
      }
    }

    const classification = await classifyMention({
      mentionText: mention.text,
      conversationContext
    });

    if (!classification.shouldRespond || classification.requiresEscalation) {
      await prisma.mention.update({
        where: { id: mention.id },
        data: {
          status: classification.requiresEscalation ? "ESCALATED" : "IGNORED",
          classification: classification.category,
          riskLevel: classification.riskLevel,
          shouldRespond: classification.shouldRespond
        }
      });
      continue;
    }

    const supportingEvidence = await prisma.researchSnapshot.findMany({
      orderBy: { createdAt: "desc" },
      take: 3
    });

    const suggestion = await draftReply({
      mentionText: mention.text,
      classification: stringify(classification),
      conversationContext,
      supportingEvidence: supportingEvidence.flatMap((item: (typeof supportingEvidence)[number]) => item.keyFacts).slice(0, 5)
    });

    await prisma.$transaction(async (tx: any) => {
      await tx.replySuggestion.create({
        data: {
          mentionId: mention.id,
          draftText: suggestion.suggestedReply,
          rationale: suggestion.rationale,
          confidence: suggestion.confidence,
          toneChecklist: suggestion.toneChecklist,
          safetyNotes: suggestion.safetyNotes
        }
      });

      await tx.mention.update({
        where: { id: mention.id },
        data: {
          status: "DRAFTED",
          classification: classification.category,
          riskLevel: classification.riskLevel,
          shouldRespond: classification.shouldRespond
        }
      });
    });

    drafted += 1;
  }

  return { drafted };
}

export async function runMetricsSyncJob() {
  const env = getEnv();

  if (await shouldSkipXWork()) {
    return { synced: 0, skipped: X_BILLING_BLOCKED_SKIP };
  }

  const tokens = await getOperationalXTokens();
  if (!tokens?.accessToken && (await shouldSkipXWork())) {
    return { synced: 0, skipped: X_BILLING_BLOCKED_SKIP };
  }

  const authToken = tokens?.accessToken ?? env.X_BEARER_TOKEN;

  if (!authToken) {
    return { synced: 0, skipped: "x-not-connected" };
  }

  const publishedPosts = await prisma.publishedPost.findMany({
    orderBy: { postedAt: "desc" },
    take: 20,
    include: {
      metrics: true
    }
  });

  let synced = 0;

  for (const post of publishedPosts) {
    let response;

    try {
      response = await getPost({
        authToken,
        tweetId: post.xPostId
      });
      await markXIntegrationHealthy();
    } catch (error) {
      const billingRequired = await registerXFailure(error);

      if (billingRequired) {
        return { synced, skipped: X_BILLING_BLOCKED_SKIP };
      }

      throw error;
    }

    const data = response.data.data as { public_metrics?: Record<string, number> } | undefined;
    const metrics = data?.public_metrics ?? {};
    const ageHours = (Date.now() - post.postedAt.getTime()) / 3_600_000;
    const windows = [
      ageHours >= 1 ? "H1" : null,
      ageHours >= 24 ? "D1" : null,
      ageHours >= 24 * 7 ? "D7" : null
    ].filter(Boolean) as Array<"H1" | "D1" | "D7">;

    for (const window of windows) {
      await prisma.postMetric.upsert({
        where: {
          publishedPostId_window: {
            publishedPostId: post.id,
            window
          }
        },
        update: {
          impressions: metrics.impression_count ?? null,
          likes: metrics.like_count ?? null,
          replies: metrics.reply_count ?? null,
          reposts: metrics.retweet_count ?? null,
          bookmarks: metrics.bookmark_count ?? null
        },
        create: {
          publishedPostId: post.id,
          window,
          impressions: metrics.impression_count ?? null,
          likes: metrics.like_count ?? null,
          replies: metrics.reply_count ?? null,
          reposts: metrics.retweet_count ?? null,
          bookmarks: metrics.bookmark_count ?? null
        }
      });
    }

    await prisma.publishedPost.update({
      where: { id: post.id },
      data: {
        metricsSyncedAt: new Date()
      }
    });

    synced += 1;
  }

  return { synced };
}

export async function runCleanupJob() {
  const staleReservedSlots = await prisma.scheduleSlot.findMany({
    where: {
      status: "RESERVED",
      draft: null,
      updatedAt: {
        lt: new Date(Date.now() - 60 * 60 * 1000)
      }
    }
  });

  for (const slot of staleReservedSlots) {
    await prisma.scheduleSlot.update({
      where: { id: slot.id },
      data: {
        status: "OPEN"
      }
    });
  }

  return { reopened: staleReservedSlots.length };
}
