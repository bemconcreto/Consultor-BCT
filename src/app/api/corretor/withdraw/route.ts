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

    const corretorCheck = await prisma.corretor.findUnique({ where: { userId: session.userId } });
    if (!corretorCheck) {
      return NextResponse.json({ ok: false, error: "Corretor não encontrado" }, { status: 404 });
    }
    if (!corretorCheck.chavePix) {
      return NextResponse.json({ ok: false, error: "Cadastre sua chave PIX antes de solicitar saque" }, { status: 400 });
    }

    let saque;
    try {
      saque = await prisma.$transaction(async (tx) => {
        const corretor = await tx.corretor.findUnique({ where: { userId: session.userId } });
        if (!corretor || valor > corretor.saldoDisponivel) {
          throw new Error("saldo_insuficiente");
        }
        const novoSaque = await tx.saque.create({
          data: {
            corretorId: corretor.id,
            valor,
            dadosBancarios: { chavePix: corretor.chavePix },
            status: "pendente",
          },
        });
        await tx.corretor.update({
          where: { id: corretor.id },
          data: {
            saldoDisponivel: { decrement: valor },
            saldoPendente: { increment: valor },
          },
        });
        return novoSaque;
      });
    } catch (txErr) {
      if (String(txErr).includes("saldo_insuficiente")) {
        return NextResponse.json({ ok: false, error: "Saldo insuficiente" }, { status: 400 });
      }
      throw txErr;
    }

    return NextResponse.json({ ok: true, saque });
  } catch (err) {
    console.error("ERRO SAQUE:", err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
