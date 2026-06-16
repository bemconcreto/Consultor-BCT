// src/app/api/painel/vendas/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentCorretor } from "@/lib/session";

export async function GET(req: Request) {
  try {
    // tenta obter o corretor via sessão
    const session = await getCurrentCorretor();

    if (!session) {
      return NextResponse.json({ error: "Corretor não autenticado" }, { status: 401 });
    }

    const corretor = await prisma.corretor.findUnique({
      where: { userId: session.userId },
    });

    if (!corretor) {
      return NextResponse.json({ error: "Corretor não encontrado" }, { status: 404 });
    }

    const corretorId = corretor.id;

    const vendas = await prisma.venda.findMany({
      where: { corretorId },
      orderBy: { dataVenda: "desc" },
      take: 20,
      select: {
        id: true,
        vendaId: true,
        imovelId: true,
        valor: true,
        comissao: true,
        status: true,
        dataVenda: true,
      },
    });

    return NextResponse.json({ vendas });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}