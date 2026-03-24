import { PrismaClient, PromptKind, SourceKind } from "../packages/core/src/generated/prisma/client";

import { promptCatalog } from "../packages/core/src/prompts/catalog";
import { buildWeeklySlots, parseSlotWindows } from "../packages/core/src/scheduling";

const prisma = new PrismaClient();

async function main() {
  await prisma.sourceItem.upsert({
    where: {
      uri: "https://openai.com/index/introducing-gpt-5/"
    },
    update: {},
    create: {
      kind: SourceKind.URL,
      title: "OpenAI launch posts",
      uri: "https://openai.com/index/introducing-gpt-5/",
      notes: "Example curated source for AI builder commentary."
    }
  });

  for (const prompt of Object.values(promptCatalog)) {
    await prisma.promptVersion.upsert({
      where: {
        kind_version: {
          kind: prompt.kind as PromptKind,
          version: 1
        }
      },
      update: {
        systemPrompt: prompt.systemPrompt,
        userTemplate: prompt.userTemplate,
        schemaName: prompt.schemaName
      },
      create: {
        kind: prompt.kind as PromptKind,
        version: 1,
        name: prompt.name,
        systemPrompt: prompt.systemPrompt,
        userTemplate: prompt.userTemplate,
        schemaName: prompt.schemaName,
        isActive: true,
        activatedAt: new Date()
      }
    });
  }

  const slots = buildWeeklySlots({
    timezone: "Africa/Lagos",
    windows: parseSlotWindows("12:30,16:30,20:30,23:00", true)
  });

  for (const slot of slots) {
    await prisma.scheduleSlot.upsert({
      where: { slotAt: slot.slotAt },
      update: {
        timezone: slot.timezone,
        isExperimental: slot.isExperimental
      },
      create: {
        slotAt: slot.slotAt,
        timezone: slot.timezone,
        isExperimental: slot.isExperimental
      }
    });
  }

  await prisma.systemState.upsert({
    where: { key: "lastMentionSinceId" },
    update: {},
    create: {
      key: "lastMentionSinceId",
      value: { value: null }
    }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
