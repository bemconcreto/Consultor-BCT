import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Chamado pela CERTIFICACAO-BCT após o consultor concluir a certificação
export async function POST(req: Request) {
  const secret = req.headers.get("x-internal-secret");
  if (!secret || secret !== process.env.INTERNAL_API_SECRET) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ ok: false, error: "email obrigatório" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ ok: false, error: "Usuário não encontrado" }, { status: 404 });
    }

    const corretor = await prisma.corretor.findUnique({ where: { userId: user.id } });
    if (!corretor) {
      return NextResponse.json({ ok: false, error: "Corretor não encontrado" }, { status: 404 });
    }

    await prisma.corretor.update({
      where: { id: corretor.id },
      data: { statusCertificacao: "certificado" },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("ERRO CERTIFICAR CONSULTOR:", err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
