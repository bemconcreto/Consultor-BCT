import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentCorretor } from "@/lib/session";

export async function GET() {
  try {
    const session = await getCurrentCorretor();
    if (!session) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    // IMPORTANTE: Seu banco usa consultorId, não corretorId!
    const consultorId = session.corretorId;

    // 1️⃣ Buscar as indicações do consultor
    const indicacoes = await prisma.indicacao.findMany({
      where: { consultorId },
      orderBy: { createdAt: "desc" },
    });

    const indicacaoIds = indicacoes.map((i) => i.id);

    // 2️⃣ Buscar vendas associadas às indicações
const vendas = await prisma.venda.findMany({
  where: {
    corretorId: session.corretorId,
  },
  orderBy: { dataVenda: "desc" },
});

    return NextResponse.json({
      indicacoes,
      vendas,
    });
  } catch (err: any) {
    console.error("Erro API /indicacoes:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}