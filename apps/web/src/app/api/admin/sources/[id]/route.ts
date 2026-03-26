import { NextResponse } from "next/server";

import { getPrismaClient } from "@twitter-agent/core";
import { requireApiSession } from "@/lib/guards";
import { createAuditLog } from "@/lib/operator";

const prisma = getPrismaClient();

type SourceActionBody =
  | {
      action?: "toggle";
    }
  | {
      action?: "edit";
      title?: string;
      notes?: string | null;
    };

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireApiSession();

  if (session instanceof NextResponse) {
    return session;
  }

  const { id } = await params;
  const body = (await request.json().catch(() => ({}))) as SourceActionBody;
  const source = await prisma.sourceItem.findUnique({
    where: { id }
  });

  if (!source) {
    return NextResponse.json({ error: "Source not found." }, { status: 404 });
  }

  if (body.action === "toggle") {
    const updated = await prisma.sourceItem.update({
      where: { id },
      data: {
        isActive: !source.isActive
      }
    });

    await createAuditLog({
      actor: session.user.email ?? "owner",
      action: updated.isActive ? "source.resumed" : "source.paused",
      entityType: "sourceItem",
      entityId: source.id,
      details: {
        previousState: source.isActive ? "ACTIVE" : "PAUSED",
        nextState: updated.isActive ? "ACTIVE" : "PAUSED"
      }
    });

    return NextResponse.json({ ok: true, source: updated });
  }

  if (body.action === "edit") {
    const title = String(body.title ?? "").trim();
    const notes = typeof body.notes === "string" ? body.notes.trim() : "";

    if (!title) {
      return NextResponse.json({ error: "Title is required." }, { status: 400 });
    }

    const updated = await prisma.sourceItem.update({
      where: { id },
      data: {
        title,
        notes: notes || null
      }
    });

    await createAuditLog({
      actor: session.user.email ?? "owner",
      action: "source.updated",
      entityType: "sourceItem",
      entityId: source.id,
      details: {
        previousTitle: source.title,
        nextTitle: updated.title
      }
    });

    return NextResponse.json({ ok: true, source: updated });
  }

  return NextResponse.json({ error: "Unsupported source action." }, { status: 400 });
}
