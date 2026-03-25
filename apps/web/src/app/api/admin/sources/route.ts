import { NextResponse } from "next/server";

import { getPrismaClient } from "@twitter-agent/core";
import { requireApiSession } from "@/lib/guards";
import { createAuditLog } from "@/lib/operator";

const prisma = getPrismaClient();

export async function POST(request: Request) {
  const session = await requireApiSession();

  if (session instanceof NextResponse) {
    return session;
  }

  const body = await request.json();
  const { title, uri, kind, notes } = body;

  if (!title || !uri || !kind) {
    return NextResponse.json(
      { error: "title, uri, and kind are required." },
      { status: 400 }
    );
  }

  const validKinds = ["URL", "RSS", "X_POST", "X_ACCOUNT"];
  if (!validKinds.includes(kind)) {
    return NextResponse.json(
      { error: `kind must be one of: ${validKinds.join(", ")}` },
      { status: 400 }
    );
  }

  const existing = await prisma.sourceItem.findUnique({ where: { uri } });
  if (existing) {
    return NextResponse.json(
      { error: "A source with this URI already exists." },
      { status: 409 }
    );
  }

  const source = await prisma.sourceItem.create({
    data: {
      title,
      uri,
      kind,
      notes: notes || null
    }
  });

  await createAuditLog({
    actor: session.user.email ?? "owner",
    action: "source.created",
    entityType: "sourceItem",
    entityId: source.id,
    details: { title, uri, kind }
  });

  return NextResponse.json({ ok: true, source }, { status: 201 });
}
