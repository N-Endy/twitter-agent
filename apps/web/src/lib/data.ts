import { formatDistanceToNow } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";

import { getEnv, getPrismaClient, isXIntegrationPaused, readSystemState, readXIntegrationState, readXTokens } from "@twitter-agent/core";

const prisma = getPrismaClient();

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
  const [recentDrafts, recentMentions, nextSlots, activePrompts, lastCursor, xTokens, xIntegration] = await Promise.all([
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
    readXIntegrationState()
  ]);

  return {
    recentDrafts,
    recentMentions,
    nextSlots,
    activePrompts,
    lastCursor: lastCursor?.value ?? null,
    xStatus: getXStatusSummary({ tokens: xTokens, integration: xIntegration })
  };
}

export async function getSourcesPageData() {
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
  return prisma.contentIdea.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      sourceItem: true,
      drafts: {
        take: 3,
        orderBy: { updatedAt: "desc" }
      }
    }
  });
}

export async function getDraftsPageData() {
  const [drafts, availableSlots] = await Promise.all([
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
    })
  ]);

  return {
    drafts,
    availableSlots: availableSlots.map((slot) => ({
      id: slot.id,
      label: formatDashboardDate(slot.slotAt),
      isExperimental: slot.isExperimental
    }))
  };
}

export async function getScheduledPageData() {
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
  return prisma.promptVersion.findMany({
    orderBy: [{ kind: "asc" }, { version: "desc" }]
  });
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
