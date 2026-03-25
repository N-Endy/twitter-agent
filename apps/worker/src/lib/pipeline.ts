import {
  createPost,
  ensureUpcomingScheduleSlots,
  extractTweetIdFromUrl,
  getEnv,
  getMentions,
  getPost,
  getPrismaClient,
  getQueue,
  getValidXAccessToken,
  ingestRssSource,
  ingestUrlSource,
  ingestXAccountSource,
  ingestXPostSource,
  moderateDraft,
  moderateMention,
  Prisma,
  queueNames,
  readMentionCursor,
  saveMentionCursor
} from "@twitter-agent/core";

import {
  classifyMention,
  draftReply,
  extractResearch,
  generateIdeas,
  reviewDraft,
  writeDraft
} from "./ai";

const prisma = getPrismaClient();
const voiceRules =
  "Voice: sharp, practical, technical, credible, useful, plain English, no empty hype, no lazy motivation, no spammy calls to action.";

function stringify(value: unknown) {
  return JSON.stringify(value, null, 2);
}

export async function runSourceIngestJob() {
  const sources = await prisma.sourceItem.findMany({
    where: { isActive: true },
    orderBy: { updatedAt: "desc" }
  });

  let created = 0;

  for (const source of sources) {
    let items: Array<{ title: string; rawText: string; metadata: Record<string, unknown> }> = [];

    if (source.kind === "URL") {
      items = await ingestUrlSource(source.uri);
    } else if (source.kind === "RSS") {
      items = await ingestRssSource(source.uri);
    } else if (source.kind === "X_POST") {
      items = await ingestXPostSource(source.uri);
    } else if (source.kind === "X_ACCOUNT") {
      const username = source.allowlistHandle ?? source.uri.split("/").filter(Boolean).pop() ?? source.uri;
      items = await ingestXAccountSource(username.replace("@", ""));
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

      const extracted = await extractResearch(item.rawText, item.title, source.kind);

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

  return { created };
}

export async function runWeeklyBatchJob() {
  await ensureUpcomingScheduleSlots();

  const snapshots = await prisma.researchSnapshot.findMany({
    orderBy: { createdAt: "desc" },
    take: 8,
    include: {
      sourceItem: true
    }
  });

  if (snapshots.length === 0) {
    return { ideas: 0, drafts: 0 };
  }

  const recentMetrics = await prisma.postMetric.findMany({
    include: {
      publishedPost: true
    },
    orderBy: { capturedAt: "desc" },
    take: 20
  });

  const recentWinners = recentMetrics
    .filter((metric: (typeof recentMetrics)[number]) => (metric.likes ?? 0) >= 10)
    .map((metric: (typeof recentMetrics)[number]) => metric.publishedPost.text)
    .slice(0, 6);
  const recentLosers = recentMetrics
    .filter((metric: (typeof recentMetrics)[number]) => (metric.likes ?? 0) < 10)
    .map((metric: (typeof recentMetrics)[number]) => metric.publishedPost.text)
    .slice(0, 6);

  let ideasCreated = 0;
  let draftsCreated = 0;

  for (const snapshot of snapshots.slice(0, 4)) {
    const batch = await generateIdeas({
      summary: snapshot.summary,
      keyFacts: snapshot.keyFacts,
      recentWinners,
      recentLosers
    });

    for (const ideaOutput of batch.ideas.slice(0, 7)) {
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
          tags: ideaOutput.tags
        }
      });

      ideasCreated += 1;

      const draftOutput = await writeDraft({
        pillar: ideaOutput.pillar,
        hook: ideaOutput.hook,
        angle: ideaOutput.angle,
        audience: ideaOutput.audience,
        supportingEvidence: ideaOutput.supportingEvidence,
        voiceNotes: voiceRules
      });

      const draft = await prisma.draft.create({
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
          status: "PENDING_QA"
        }
      });

      draftsCreated += 1;

      await getQueue(queueNames.draftQa).add("draft", {
        draftId: draft.id
      });
    }
  }

  return {
    ideas: ideasCreated,
    drafts: draftsCreated
  };
}

export async function runDraftQaJob(draftId?: string) {
  const drafts = draftId
    ? await prisma.draft.findMany({
        where: { id: draftId },
        include: { idea: true }
      })
    : await prisma.draft.findMany({
        where: { status: "PENDING_QA" },
        include: { idea: true },
        take: 25
      });

  let processed = 0;

  for (const draft of drafts) {
    const review = await reviewDraft({
      draftText: draft.text,
      supportingEvidence: draft.evidenceUsed,
      voiceRules
    });
    const moderation = moderateDraft({
      text: review.rewrite || draft.text,
      sourceBacked: draft.sourceBacked,
      topical: draft.topical,
      mentionsThirdParty: /@\w+/.test(review.rewrite || draft.text)
    });

    const nextStatus =
      moderation.decision === "BLOCK" || !review.approvedForReview ? "REJECTED" : "NEEDS_REVIEW";

    await prisma.$transaction(async (tx: any) => {
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
          status: nextStatus
        }
      });

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
  const tokens = await getValidXAccessToken();

  if (!tokens?.accessToken) {
    return { published: 0, skipped: "x-not-connected" };
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
    include: {
      scheduleSlot: true
    }
  });

  let published = 0;

  for (const draft of dueDrafts) {
    const response = await createPost({
      accessToken: tokens.accessToken,
      text: draft.text
    });
    const xPostId = String((response.data.data as { id?: string } | undefined)?.id ?? "");

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
  const tokens = await getValidXAccessToken();
  const env = getEnv();

  if (!tokens?.accessToken && !env.X_BEARER_TOKEN) {
    return { created: 0, skipped: "x-not-connected" };
  }

  const ownerId = tokens?.userId ?? env.X_OWNER_USER_ID;

  if (!ownerId || !tokens?.accessToken) {
    return { created: 0, skipped: "owner-user-id-missing" };
  }

  const sinceId = await readMentionCursor();
  const response = await getMentions({
    accessToken: tokens.accessToken,
    userId: ownerId,
    sinceId: sinceId ?? undefined
  });

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
      latestSinceId = xMentionId > (latestSinceId ?? "") ? xMentionId : latestSinceId;
      continue;
    }

    const text = String(mention.text ?? "");
    const moderation = moderateMention(text);
    const createdMention = await prisma.mention.create({
      data: {
        xMentionId,
        conversationId: mention.conversation_id ? String(mention.conversation_id) : null,
        sourcePostId: mention.referenced_tweets ? stringify(mention.referenced_tweets) : null,
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

    latestSinceId = xMentionId > (latestSinceId ?? "") ? xMentionId : latestSinceId;
    created += 1;
  }

  await saveMentionCursor(latestSinceId ?? null);

  return { created };
}

export async function runReplyDraftJob(mentionId?: string) {
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

    const classification = await classifyMention({
      mentionText: mention.text,
      conversationContext: mention.conversationId ?? "No extra context"
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
      conversationContext: mention.conversationId ?? "No extra context",
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
  const authToken = (await getValidXAccessToken())?.accessToken ?? env.X_BEARER_TOKEN;

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
    const response = await getPost({
      authToken,
      tweetId: post.xPostId
    });
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
