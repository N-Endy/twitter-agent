import { formatDistanceToNow } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";

import { requireSession } from "@/lib/guards";
import {
  getEnv,
  getPrismaClient,
  isXIntegrationPaused,
  readBrandVoiceProfile,
  readSystemState,
  readWeeklyBatchState,
  readXIntegrationState,
  readXTokens,
  VOICE_FEEDBACK_TAGS
} from "@twitter-agent/core";

const prisma = getPrismaClient();

async function requireDashboardAccess() {
  await requireSession();
}

function getXStatusSummary(params: {
  tokens: Awaited<ReturnType<typeof readXTokens>>;
  integration: Awaited<ReturnType<typeof readXIntegrationState>>;
}) {
  if (isXIntegrationPaused(params.integration)) {
    return {
      label: "Billing blocked",
      tone: "bad" as const,
      detail: params.integration?.reason ?? "X credits are required before publish, mention polling, and metrics sync can continue.",
      timestamp: params.integration?.lastFailureAt ?? null
    };
  }

  if (params.integration?.status === "ERROR") {
    return {
      label: "Error",
      tone: "bad" as const,
      detail: params.integration.reason ?? "X calls are failing even though credentials exist. Reconnect X and check the worker logs for the latest failure.",
      timestamp: params.integration.lastFailureAt ?? null
    };
  }

  if (params.tokens?.accessToken) {
    return {
      label: "Connected",
      tone: "good" as const,
      detail: params.integration?.lastSuccessAt ? "Recent X calls are succeeding." : "Owner account connected.",
      timestamp: params.integration?.lastSuccessAt ?? null
    };
  }

  return {
    label: "Missing",
    tone: "warning" as const,
    detail: "Connect the owner X account to publish, poll mentions, and send replies.",
    timestamp: null
  };
}

export async function getDashboardMetrics() {
  await requireDashboardAccess();

  const [sources, drafts, published, mentions, prompts, incidents, xTokens, xIntegration] = await Promise.all([
    prisma.sourceItem.count({ where: { isActive: true } }),
    prisma.draft.count({
      where: {
        status: {
          in: ["NEEDS_REVIEW", "APPROVED", "SCHEDULED", "PUBLISHING"]
        }
      }
    }),
    prisma.publishedPost.count(),
    prisma.mention.count({
      where: {
        status: {
          in: ["NEW", "DRAFTED", "APPROVED", "SENDING", "ESCALATED"]
        }
      }
    }),
    prisma.promptVersion.count({ where: { isActive: true } }),
    prisma.moderationEvent.count({
      where: {
        decision: {
          in: ["BLOCK", "ESCALATE"]
        }
      }
    }),
    readXTokens(),
    readXIntegrationState()
  ]);
  const xStatus = getXStatusSummary({ tokens: xTokens, integration: xIntegration });

  return {
    sources,
    drafts,
    published,
    mentions,
    prompts,
    incidents,
    xConnected: Boolean(xTokens?.accessToken),
    xStatus
  };
}

export async function getOverviewFeed() {
  await requireDashboardAccess();

  const [
    recentDrafts,
    recentMentions,
    nextSlots,
    activePrompts,
    lastCursor,
    xTokens,
    xIntegration,
    brandVoiceGuide,
    weeklyBatch
  ] = await Promise.all([
    prisma.draft.findMany({
      orderBy: { updatedAt: "desc" },
      take: 6,
      include: {
        idea: true
      }
    }),
    prisma.mention.findMany({
      orderBy: { receivedAt: "desc" },
      take: 6
    }),
    prisma.scheduleSlot.findMany({
      where: {
        slotAt: { gt: new Date() }
      },
      orderBy: { slotAt: "asc" },
      take: 6,
      include: {
        draft: true
      }
    }),
    prisma.promptVersion.findMany({
      where: { isActive: true },
      orderBy: [{ kind: "asc" }]
    }),
    readSystemState<{ value?: string | null }>("lastMentionSinceId"),
    readXTokens(),
    readXIntegrationState(),
    readBrandVoiceProfile(),
    readWeeklyBatchState()
  ]);

  return {
    recentDrafts,
    recentMentions,
    nextSlots,
    activePrompts,
    lastCursor: lastCursor?.value ?? null,
    xStatus: getXStatusSummary({ tokens: xTokens, integration: xIntegration }),
    brandVoiceGuide,
    weeklyBatch
  };
}

export async function getSourcesPageData() {
  await requireDashboardAccess();

  return prisma.sourceItem.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      _count: {
        select: {
          researchSnapshots: true,
          contentIdeas: true
        }
      }
    }
  });
}

export async function getIdeasPageData() {
  await requireDashboardAccess();

  const [ideas, weeklyBatch] = await Promise.all([
    prisma.contentIdea.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      include: {
        sourceItem: true,
        drafts: {
          take: 3,
          orderBy: { updatedAt: "desc" }
        }
      }
    }),
    readWeeklyBatchState()
  ]);

  return {
    ideas,
    weeklyBatch
  };
}

export async function getDraftsPageData() {
  await requireDashboardAccess();

  const [drafts, availableSlots, weeklyBatch] = await Promise.all([
    prisma.draft.findMany({
      orderBy: { updatedAt: "desc" },
      take: 50,
      include: {
        idea: true,
        reviews: {
          orderBy: { createdAt: "desc" },
          take: 1
        },
        scheduleSlot: true
      }
    }),
    prisma.scheduleSlot.findMany({
      where: {
        status: "OPEN",
        slotAt: {
          gt: new Date()
        }
      },
      orderBy: { slotAt: "asc" },
      take: 12
    }),
    readWeeklyBatchState()
  ]);

  return {
    drafts,
    weeklyBatch,
    availableSlots: availableSlots.map((slot) => ({
      id: slot.id,
      label: formatDashboardDate(slot.slotAt),
      isExperimental: slot.isExperimental
    }))
  };
}

export async function getScheduledPageData() {
  await requireDashboardAccess();

  return prisma.scheduleSlot.findMany({
    orderBy: { slotAt: "asc" },
    take: 30,
    include: {
      draft: {
        include: {
          idea: true
        }
      }
    }
  });
}

export async function getPublishedPageData() {
  await requireDashboardAccess();

  return prisma.publishedPost.findMany({
    orderBy: { postedAt: "desc" },
    take: 30,
    include: {
      draft: {
        include: {
          idea: true
        }
      },
      metrics: true
    }
  });
}

export async function getMentionsPageData() {
  await requireDashboardAccess();

  return prisma.mention.findMany({
    orderBy: { receivedAt: "desc" },
    take: 50,
    include: {
      replySuggestions: {
        orderBy: { createdAt: "desc" },
        take: 1
      },
      replyActions: {
        orderBy: { createdAt: "desc" },
        take: 1
      }
    }
  });
}

export async function getRepliesPageData() {
  await requireDashboardAccess();

  return prisma.replySuggestion.findMany({
    orderBy: { updatedAt: "desc" },
    take: 50,
    include: {
      mention: true,
      replyActions: {
        orderBy: { createdAt: "desc" }
      }
    }
  });
}

export async function getIncidentsPageData() {
  await requireDashboardAccess();

  return prisma.moderationEvent.findMany({
    where: {
      decision: {
        in: ["BLOCK", "ESCALATE"]
      }
    },
    orderBy: { createdAt: "desc" },
    take: 50
  });
}

export async function getPromptsPageData() {
  await requireDashboardAccess();

  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const [prompts, brandVoiceGuide, voiceExamples, activeVoiceExamples, recentVoiceExamples, sourceBackedVoiceExamples] = await Promise.all([
    prisma.promptVersion.findMany({
      orderBy: [{ kind: "asc" }, { version: "desc" }]
    }),
    readBrandVoiceProfile(),
    prisma.voiceExample.findMany({
      orderBy: { updatedAt: "desc" },
      take: 30,
      include: {
        draft: {
          include: {
            idea: true
          }
        },
        sourceItem: true,
        sourceRevision: true,
        preferredRevision: true
      }
    }),
    prisma.voiceExample.count({
      where: {
        status: "ACTIVE"
      }
    }),
    prisma.voiceExample.count({
      where: {
        createdAt: {
          gte: weekAgo
        }
      }
    }),
    prisma.voiceExample.findMany({
      where: {
        sourceItemId: {
          not: null
        }
      },
      select: {
        sourceItemId: true
      }
    })
  ]);

  return {
    prompts,
    brandVoiceGuide,
    voiceExamples,
    voiceExampleStats: {
      active: activeVoiceExamples,
      thisWeek: recentVoiceExamples,
      bySource: new Set(sourceBackedVoiceExamples.map((example) => example.sourceItemId)).size
    }
  };
}

export async function getDraftWorkshopData(id: string) {
  await requireDashboardAccess();

  const [draft, brandVoiceGuide] = await Promise.all([
    prisma.draft.findUnique({
      where: { id },
      include: {
        idea: {
          include: {
            sourceItem: true,
            snapshot: true
          }
        },
        reviews: {
          orderBy: { createdAt: "desc" },
          take: 6
        },
        revisions: {
          orderBy: { createdAt: "desc" }
        },
        voiceExamples: {
          orderBy: { updatedAt: "desc" },
          include: {
            sourceItem: true,
            sourceRevision: true,
            preferredRevision: true
          }
        },
        scheduleSlot: true
      }
    }),
    readBrandVoiceProfile()
  ]);

  if (!draft) {
    return null;
  }

  return {
    draft,
    brandVoiceGuide,
    feedbackTagOptions: [...VOICE_FEEDBACK_TAGS]
  };
}

export function formatDashboardDate(date: Date | string | null | undefined) {
  if (!date) {
    return "Never";
  }

  return formatInTimeZone(date, getEnv().DEFAULT_TIMEZONE, "dd MMM yyyy, HH:mm zzz");
}

export function formatRelative(date: Date | string) {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}
