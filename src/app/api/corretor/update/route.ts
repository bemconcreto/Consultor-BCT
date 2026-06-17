// src/app/api/corretor/update/route.ts
import { NextResponse } from "next/server";
import { getCurrentCorretor } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getCurrentCorretor();
    if (!session) {
      return NextResponse.json(
        { ok: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    const body = await req.json();
    let { nome, cpf, creci, instagramHandle, chavePix } = body;

    // Normaliza Instagram
    if (instagramHandle) {
      instagramHandle = instagramHandle
        .toLowerCase()
        .replace("@", "")
        .replace(/\s/g, "");
    }

    const updated = await prisma.corretor.update({
      where: { userId: session.userId },
      data: {
        nome: nome ?? undefined,
        cpf: cpf ?? undefined,
        creci: creci ?? undefined,
        instagramHandle: instagramHandle ?? undefined,
        chavePix: chavePix ?? undefined,
      },
    });

    return NextResponse.json({ ok: true, corretor: updated });

  } catch (err) {
    console.error("ERRO UPDATE CORRETOR:", err);
    return NextResponse.json(
      {
        ok: false,
        error: "Server error",
        details: String(err),
      },
      { status: 500 }
    );
  }
}