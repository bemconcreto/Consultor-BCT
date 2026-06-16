import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.toLowerCase() || "";

  if (q.length < 2) {
    return NextResponse.json({ consultores: [] }); // só busca com 2+ letras
  }

  const consultores = await prisma.corretor.findMany({
    where: {
      OR: [
        { nome: { contains: q, mode: "insensitive" } },
        { creci: { contains: q, mode: "insensitive" } },
        { corretorId: { contains: q, mode: "insensitive" } },
        { cpf: { contains: q } }, // pode ser só números
      ],
    },
    select: {
      id: true,
      corretorId: true,
      nome: true,
    },
    take: 10,
  });

  return NextResponse.json({ consultores });
}