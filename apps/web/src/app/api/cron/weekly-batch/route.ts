import { NextRequest, NextResponse } from "next/server";

import { getQueue, queueNames } from "@twitter-agent/core";
import { verifyCronSecret } from "@/lib/guards";

export async function POST(request: NextRequest) {
  const invalid = verifyCronSecret(request);

  if (invalid) {
    return invalid;
  }

  const job = await getQueue(queueNames.weeklyBatch).add("cron", {
    triggeredAt: new Date().toISOString()
  });

  return NextResponse.json({ ok: true, queue: queueNames.weeklyBatch, jobId: job.id });
}
