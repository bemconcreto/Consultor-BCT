// src/app/api/painel/vendas/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentCorretor } from "@/lib/session";

export async function GET(req: Request) {
  try {
    // tenta obter o corretor via sessão
    const session = await getCurrentCorretor();

    let corretorId: number | null = null;
    if (session) {
      const corretor = await prisma.corretor.findUnique({
        where: { userId: session.userId },
      });
      if (corretor) corretorId = corretor.id;
    }

    // se query param for passado, usa ele (útil para debug)
    const url = new URL(req.url);
    const qCorretor = url.searchParams.get("corretorId");
    if (!corretorId && qCorretor) {
      const parsed = parseInt(qCorretor, 10);
      if (!Number.isNaN(parsed)) corretorId = parsed;
    }

    if (!corretorId) {
      return NextResponse.json({ error: "Corretor não autenticado" }, { status: 401 });
    }

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