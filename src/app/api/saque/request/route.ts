// src/app/api/saque/request/route.ts
import { NextResponse } from "next/server";
import { getCurrentCorretor } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getCurrentCorretor();
    if (!session) return NextResponse.json({ ok: false, error: "Not authenticated" }, { status: 401 });

    const body = await req.json();
    const { valor } = body;
    if (!valor || typeof valor !== "number") {
      return NextResponse.json({ ok: false, error: "Invalid value" }, { status: 400 });
    }

    // Cria registro de saque pendente
    const corretor = await prisma.corretor.findUnique({ where: { userId: session.userId } });
    if (!corretor) return NextResponse.json({ ok: false, error: "Corretor not found" }, { status: 404 });

    if (valor > corretor.saldoDisponivel) {
      return NextResponse.json({ ok: false, error: "Insufficient balance" }, { status: 400 });
    }

    const saque = await prisma.saque.create({
      data: {
        corretorId: corretor.id,
        valor,
        dadosBancarios: null,
        status: "pendente",
      },
    });

    // reduzir saldoDisponivel imediatamente (opcional) — mantém consistência
    await prisma.corretor.update({
      where: { id: corretor.id },
      data: {
        saldoDisponivel: { decrement: valor },
        saldoPendente: { increment: valor },
      },
    });

    return NextResponse.json({ ok: true, saque });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false, error: "Server error", details: String(err) }, { status: 500 });
  }
}