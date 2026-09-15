import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    // Rota interna — exige segredo compartilhado entre APP-BCT e CONSULTOR-BCT
    const internalSecret = process.env.INTERNAL_API_SECRET;
    const receivedSecret = req.headers.get("x-internal-secret");
    if (!internalSecret || receivedSecret !== internalSecret) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { accountId, valor, imovelId } = await req.json();

    if (!accountId || !valor) {
      return NextResponse.json(
        { error: "Campos obrigatórios faltando" },
        { status: 400 }
      );
    }

    // 1 — Verificar quem indicou esse cliente
    const indicacao = await prisma.indicacao.findFirst({
      where: { accountId },
      include: { corretor: true },
    });

    if (!indicacao) {
      return NextResponse.json(
        { error: "Nenhuma indicação encontrada para este cliente" },
        { status: 404 }
      );
    }

    const consultorId = indicacao.consultorId;

    // 2 — Comissão SEMPRE recalculada no servidor (nunca confiar em valor vindo do body)
    const certificado = indicacao.corretor.statusCertificacao === "certificado";
    const porcentagem = certificado ? 0.04 : 0.02;
    const comissaoCalculada = Number(valor) * porcentagem;

    // 3 — Registrar nova venda com id não sequencial (evita colisão sob concorrência)
    const vendaId = `BEMVND-${Date.now()}${Math.floor(Math.random() * 1000)}`;

    // 4 — Criar venda e atualizar saldo pendente do corretor atomicamente
    const [venda] = await prisma.$transaction([
      prisma.venda.create({
        data: {
          vendaId,
          corretorId: consultorId,
          imovelId: imovelId ?? null,
          valor: Number(valor),
          comissao: comissaoCalculada,
          status: "pendente",
        },
      }),
      prisma.corretor.update({
        where: { id: consultorId },
        data: {
          saldoPendente: { increment: comissaoCalculada },
        },
      }),
    ]);

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