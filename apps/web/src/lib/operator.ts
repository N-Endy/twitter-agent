import { Prisma, getPrismaClient } from "@twitter-agent/core";

export async function createAuditLog(params: {
  actor: string;
  action: string;
  entityType: string;
  entityId: string;
  details?: Record<string, unknown>;
}) {
  return getPrismaClient().auditLog.create({
    data: {
      actor: params.actor,
      action: params.action,
      entityType: params.entityType,
      entityId: params.entityId,
      details: (params.details ?? {}) as Prisma.InputJsonValue
    }
  });
}
