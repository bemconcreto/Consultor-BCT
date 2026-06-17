import { NextResponse } from "next/server";
import { getCurrentCorretor } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getCurrentCorretor();
    if (!session) {
      return NextResponse.json({ ok: false, error: "Não autenticado" }, { status: 401 });
    }

    const { valor } = await req.json();
    if (!valor || typeof valor !== "number" || valor <= 0) {
      return NextResponse.json({ ok: false, error: "Valor inválido" }, { status: 400 });
    }

    const corretor = await prisma.corretor.findUnique({ where: { userId: session.userId } });
    if (!corretor) {
      return NextResponse.json({ ok: false, error: "Corretor não encontrado" }, { status: 404 });
    }

    if (!corretor.chavePix) {
      return NextResponse.json({ ok: false, error: "Cadastre sua chave PIX antes de solicitar saque" }, { status: 400 });
    }

    if (valor > corretor.saldoDisponivel) {
      return NextResponse.json({ ok: false, error: "Saldo insuficiente" }, { status: 400 });
    }

    const saque = await prisma.saque.create({
      data: {
        corretorId: corretor.id,
        valor,
        dadosBancarios: { chavePix: corretor.chavePix },
        status: "pendente",
      },
    });

    await prisma.corretor.update({
      where: { id: corretor.id },
      data: {
        saldoDisponivel: { decrement: valor },
        saldoPendente: { increment: valor },
      },
    });

    return NextResponse.json({ ok: true, saque });
  } catch (err) {
    console.error("ERRO SAQUE:", err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
