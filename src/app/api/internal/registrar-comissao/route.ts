import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Chamado pelo APP-BCT após pagamento confirmado para creditar comissão ao consultor
export async function POST(req: Request) {
  const secret = req.headers.get("x-internal-secret");
  if (!secret || secret !== process.env.INTERNAL_API_SECRET) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { corretorId, valor } = await req.json();
    if (!corretorId || !valor) {
      return NextResponse.json({ ok: false, error: "corretorId e valor obrigatórios" }, { status: 400 });
    }

    const corretor = await prisma.corretor.findUnique({ where: { corretorId } });
    if (!corretor) {
      return NextResponse.json({ ok: false, error: "Consultor não encontrado" }, { status: 404 });
    }

    const certificado = corretor.statusCertificacao === "certificado";
    const porcentagem = certificado ? 0.04 : 0.02;
    const comissao = Number(valor) * porcentagem;

    const vendaId = `BEMVND-${Date.now()}-${Math.floor(Math.random() * 9999)}`;

    await prisma.$transaction([
      prisma.venda.create({
        data: {
          vendaId,
          corretorId: corretor.id,
          valor: Number(valor),
          comissao,
          status: "confirmada",
          dataVenda: new Date(),
        },
      }),
      prisma.corretor.update({
        where: { id: corretor.id },
        data: { saldoDisponivel: { increment: comissao } },
      }),
    ]);

    return NextResponse.json({ ok: true, comissao, porcentagem });
  } catch (err) {
    console.error("ERRO REGISTRAR COMISSÃO:", err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
