import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { accountId, valor, imovelId, comissao } = await req.json();

    if (!accountId || !valor || !comissao) {
      return NextResponse.json(
        { error: "Campos obrigatórios faltando" },
        { status: 400 }
      );
    }

    // 1 — Verificar quem indicou esse cliente
    const indicacao = await prisma.indicacao.findUnique({
      where: { accountId },
    });

    if (!indicacao) {
      return NextResponse.json(
        { error: "Nenhuma indicação encontrada para este cliente" },
        { status: 404 }
      );
    }

    const consultorId = indicacao.consultorId;

    // 2 — Registrar nova venda
    const lastVenda = await prisma.venda.findMany({
      orderBy: { id: "desc" },
      take: 1,
    });

    const nextVendaId = (lastVenda[0]?.id ?? 0) + 1;
    const vendaId = `BCTVND-${String(nextVendaId).padStart(6, "0")}`;

    const venda = await prisma.venda.create({
      data: {
        vendaId,
        corretorId: consultorId,
        imovelId: imovelId ?? null,
        valor: Number(valor),
        comissao: Number(comissao),
        status: "pendente",
      },
    });

    // 3 — Atualizar saldo pendente ou disponível
    await prisma.corretor.update({
      where: { id: consultorId },
      data: {
        saldoPendente: {
          increment: Number(comissao),
        },
      },
    });

    return NextResponse.json({
      ok: true,
      message: "Compra registrada com sucesso",
      venda,
    });
  } catch (error: any) {
    console.error("ERRO EM /api/compras:", error);
    return NextResponse.json(
      { error: "Erro interno", details: error.message },
      { status: 500 }
    );
  }
}