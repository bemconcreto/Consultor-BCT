// src/app/api/corretor/transactions/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const corretorId = url.searchParams.get("corretorId");
    if (!corretorId) return NextResponse.json({ transactions: [] });

    const txs = await prisma.venda.findMany({
      where: { corretorId: Number(corretorId) },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json({ transactions: txs });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ transactions: [] }, { status: 500 });
  }
}