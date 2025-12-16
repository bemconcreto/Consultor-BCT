// src/app/api/corretor/me/route.ts
import { NextResponse } from "next/server";
import { getCurrentCorretor } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getCurrentCorretor();
  if (!session) return NextResponse.json({ ok: false, error: "Not authenticated" }, { status: 401 });

  const corretor = await prisma.corretor.findUnique({ where: { userId: session.userId } });
  return NextResponse.json({ ok: true, corretor });
}