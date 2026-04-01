import { getPrismaClient } from "./db";

export async function analyzePostTiming() {
  const prisma = getPrismaClient();
  const posts = await prisma.publishedPost.findMany({
    where: {
      metrics: {
        some: {
          window: "D1"
        }
      }
    },
    include: {
      metrics: {
        where: { window: "D1" }
      }
    },
    orderBy: { postedAt: "desc" },
    take: 50
  });

  if (posts.length < 10) {
    return null;
  }

  const byHour: Record<number, { total: number; count: number }> = {};
  const byDay: Record<number, { total: number; count: number }> = {};

  for (const post of posts) {
    const metric = post.metrics[0];
    if (!metric) continue;

    const engagement = (metric.likes ?? 0) + (metric.replies ?? 0) + (metric.reposts ?? 0);
    const hour = post.postedAt.getUTCHours();
    const day = post.postedAt.getUTCDay();

    if (!byHour[hour]) byHour[hour] = { total: 0, count: 0 };
    byHour[hour].total += engagement;
    byHour[hour].count += 1;

    if (!byDay[day]) byDay[day] = { total: 0, count: 0 };
    byDay[day].total += engagement;
    byDay[day].count += 1;
  }

  const hourAvgs = Object.entries(byHour)
    .map(([hour, data]) => ({ hour: Number(hour), avg: data.total / data.count }))
    .sort((a, b) => b.avg - a.avg);

  const dayAvgs = Object.entries(byDay)
    .map(([day, data]) => ({ day: Number(day), avg: data.total / data.count }))
    .sort((a, b) => b.avg - a.avg);

  const bestHours = hourAvgs.slice(0, 4).map((h) => h.hour);
  const worstHours = hourAvgs.slice(-3).map((h) => h.hour);
  const bestDays = dayAvgs.slice(0, 3).map((d) => d.day);

  const analysis = await prisma.timingAnalysis.create({
    data: {
      bestHours,
      bestDays,
      worstHours,
      sampleSize: posts.length,
      avgEngagement: {
        byHour: Object.fromEntries(hourAvgs.map((h) => [h.hour, h.avg])),
        byDay: Object.fromEntries(dayAvgs.map((d) => [d.day, d.avg]))
      }
    }
  });

  return analysis;
}

export async function getLatestTimingAnalysis() {
  const prisma = getPrismaClient();
  return prisma.timingAnalysis.findFirst({
    orderBy: { createdAt: "desc" }
  });
}

export async function getOptimalSlotWindows() {
  const analysis = await getLatestTimingAnalysis();

  if (!analysis || analysis.bestHours.length === 0) {
    return null;
  }

  return analysis.bestHours.map((hour) => ({
    hour,
    minute: 30,
    isExperimental: false
  }));
}
