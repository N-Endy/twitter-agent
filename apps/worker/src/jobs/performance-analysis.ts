import { getPrismaClient, queueNames, readBrandVoiceProfile } from "@twitter-agent/core";
import { type Job } from "bullmq";

import { analyzePerformance } from "../lib/ai";

const prisma = getPrismaClient();

export async function handlePerformanceAnalysis(job: Job) {
  job.log("Starting performance analysis job...");

  const recentMetrics = await prisma.postMetric.findMany({
    include: {
      publishedPost: true
    },
    orderBy: { capturedAt: "desc" },
    take: 50
  });

  if (recentMetrics.length < 10) {
    job.log("Not enough metrics for performance analysis.");
    return { status: "skipped", reason: "insufficient_data" };
  }

  const allLikes = recentMetrics
    .map((m) => m.likes ?? 0)
    .sort((a, b) => a - b);
  const medianLikes = allLikes[Math.floor(allLikes.length / 2)] ?? 0;
  const winnerThreshold = Math.max(Math.round(medianLikes * 1.5), 5); // At least 5 likes to be considered a winner if median is very low

  const winners = recentMetrics
    .filter((m) => (m.likes ?? 0) >= winnerThreshold)
    .map((m) => m.publishedPost.text)
    .slice(0, 10);

  const losers = recentMetrics
    .filter((m) => (m.likes ?? 0) < winnerThreshold)
    .map((m) => m.publishedPost.text)
    .slice(0, 10);

  if (winners.length === 0 || losers.length === 0) {
    job.log("Not enough contrasting data for performance analysis.");
    return { status: "skipped", reason: "no_contrast" };
  }

  const voiceGuide = await readBrandVoiceProfile();

  const previousLearning = await prisma.performanceLearning.findFirst({
    orderBy: { createdAt: "desc" }
  });

  const previousLearningsText = previousLearning
    ? `Previously identified patterns: ${previousLearning.patterns.join(", ")}\nPreviously identified anti-patterns: ${previousLearning.antiPatterns.join(", ")}`
    : "No previous learnings.";

  const analysisOutput = await analyzePerformance({
    winners,
    losers,
    voiceGuide: voiceGuide ?? "",
    previousLearnings: previousLearningsText
  });

  await prisma.performanceLearning.create({
    data: {
      analysis: analysisOutput.analysis,
      patterns: analysisOutput.patterns,
      antiPatterns: analysisOutput.antiPatterns,
      recommendations: analysisOutput.recommendations,
      sampleSize: recentMetrics.length,
      medianLikes,
      winnerThreshold
    }
  });

  job.log("Performance analysis completed.");
  return { status: "success", analyzed: recentMetrics.length, winners: winners.length, losers: losers.length };
}
