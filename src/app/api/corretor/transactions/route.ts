// src/app/api/corretor/transactions/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("consultor_session");

    if (!token) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    let session: { userId: number };
    try {
      session = JSON.parse(token.value);
    } catch {
      return NextResponse.json({ error: "Sessão inválida" }, { status: 401 });
    }

    const corretor = await prisma.corretor.findUnique({
      where: { userId: session.userId },
    });

    if (!corretor) {
      return NextResponse.json({ error: "Corretor não encontrado" }, { status: 404 });
    }

    const txs = await prisma.venda.findMany({
      where: { corretorId: corretor.id },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json({ transactions: txs });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ transactions: [] }, { status: 500 });
  }
}
