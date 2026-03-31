import { getPrismaClient } from "./db";
import { buildStyleReferenceText } from "./voice-guidance";

export async function getStyleOnlyReferenceText(limit = 3) {
  const prisma = getPrismaClient();
  const sources = await prisma.sourceItem.findMany({
    where: {
      isActive: true,
      mode: "STYLE_ONLY"
    },
    orderBy: {
      updatedAt: "desc"
    },
    take: limit,
    include: {
      researchSnapshots: {
        orderBy: {
          createdAt: "desc"
        },
        take: 1
      }
    }
  });

  return buildStyleReferenceText(sources);
}
