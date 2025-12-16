import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * ROTA PARA REGISTRAR UMA VENDA
 * Esta rota será chamada pelo APP-BCT futuramente.
 * Ela recebe:
 *  - accountId (wallet ou email do cliente)
 *  - valor da compra
 *  - imovelId (opcional)
 * 
 * A rota:
 *  1. identifica qual corretor indicou o cliente
 *  2. calcula automaticamente a comissão (4% com CRECI, 2% sem CRECI)
 *  3. cria a venda no banco
 *  4. adiciona a comissão ao saldo Disponível do corretor
 */

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { accountId, valor, imovelId } = body;

    if (!accountId || !valor) {
      return NextResponse.json(
        { ok: false, error: "Dados incompletos" },
        { status: 400 }
      );
    }

    // 1️⃣ Buscar o consultor que indicou o cliente
    const indicacao = await prisma.indicacao.findUnique({
      where: { accountId },
      include: { corretor: true },
    });

    if (!indicacao) {
      return NextResponse.json(
        { ok: false, error: "Nenhum consultor indicado para este cliente." },
        { status: 404 }
      );
    }

    const corretor = indicacao.corretor;

    // 2️⃣ Calcular comissão automaticamente
    const possuiCreci = !!corretor.creci;
    const porcentagem = possuiCreci ? 0.04 : 0.02;
    const comissao = Number(valor) * porcentagem;

    // 3️⃣ Criar ID único da venda
    const vendaId = `VENDA-${Date.now()}-${Math.floor(Math.random() * 9999)}`;

    // 4️⃣ Registrar venda
    const venda = await prisma.venda.create({
      data: {
        vendaId,
        corretorId: corretor.id,
        valor: Number(valor),
        comissao,
        imovelId: imovelId ?? null,
        status: "confirmada",
        dataVenda: new Date(),
      },
    });

    // 5️⃣ Atualizar saldo disponível do corretor
    await prisma.corretor.update({
      where: { id: corretor.id },
      data: {
        saldoDisponivel: corretor.saldoDisponivel + comissao,
      },
    });

    return NextResponse.json({ ok: true, venda });
  } catch (error) {
    console.error("ERRO REGISTRO VENDA:", error);
    return NextResponse.json(
      { ok: false, error: "Erro interno", details: String(error) },
      { status: 500 }
    );
  }
}