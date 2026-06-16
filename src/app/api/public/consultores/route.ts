import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const consultores = await prisma.corretor.findMany({
      where: { statusCertificacao: "certificado" },
      select: {
        corretorId: true,
        nome: true,
        endereco: true,
        instagramHandle: true,
      },
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json({ consultores });
  } catch (err) {
    console.error("Erro ao listar consultores:", err);
    return NextResponse.json({ consultores: [] });
  }
}
