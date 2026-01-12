import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentCorretor } from "@/lib/session";

export async function GET() {
  try {
    const session = await getCurrentCorretor();

    if (!session) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 }
      );
    }

    // 🔑 BUSCAR O CORRETOR PELO userId DA SESSÃO
    const corretor = await prisma.corretor.findUnique({
      where: { userId: session.userId },
    });

    if (!corretor) {
      return NextResponse.json(
        { error: "Corretor não encontrado" },
        { status: 404 }
      );
    }

    // 1️⃣ Buscar indicações DO CORRETOR
    const indicacoes = await prisma.indicacao.findMany({
      where: { consultorId: corretor.id },
      orderBy: { createdAt: "desc" },
    });

    // 2️⃣ Buscar vendas DO CORRETOR
    const vendas = await prisma.venda.findMany({
      where: { corretorId: corretor.id },
      orderBy: { dataVenda: "desc" },
    });

    return NextResponse.json({
      indicacoes,
      vendas,
    });

  } catch (err: any) {
    console.error("Erro API /indicacoes:", err);
    return NextResponse.json(
      { error: "Erro interno" },
      { status: 500 }
    );
  }
}