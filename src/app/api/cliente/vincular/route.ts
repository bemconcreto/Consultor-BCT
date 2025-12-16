import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { accountId, consultorCodigo } = await req.json();

    if (!accountId || !consultorCodigo) {
      return NextResponse.json(
        { ok: false, error: "Dados inválidos." },
        { status: 400 }
      );
    }

    // 1. Verificar se cliente já está vinculado
const existente = await prisma.indicacao.findFirst({
  where: { accountId }
});

    if (existente) {
      return NextResponse.json({
        ok: true,
        message: "Cliente já vinculado anteriormente.",
        consultorId: existente.consultorId
      });
    }

    // 2. Procurar consultor por ID OU Instagram
    const consultor = await prisma.corretor.findFirst({
      where: {
        OR: [
          { corretorId: consultorCodigo },
          { instagramHandle: consultorCodigo.toLowerCase() }
        ]
      }
    });

    if (!consultor) {
      return NextResponse.json(
        { ok: false, error: "Consultor não encontrado." },
        { status: 404 }
      );
    }

    // 3. Criar vínculo definitivo
    await prisma.indicacao.create({
      data: {
        accountId,
        consultorId: consultor.id,
      }
    });

    return NextResponse.json({
      ok: true,
      message: "Cliente vinculado com sucesso!",
      consultorId: consultor.id
    });

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { ok: false, error: "Erro interno", details: String(err) },
      { status: 500 }
    );
  }
}