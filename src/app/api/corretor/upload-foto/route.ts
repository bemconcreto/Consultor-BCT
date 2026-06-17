import { NextResponse } from "next/server";
import { getCurrentCorretor } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const BUCKET = "fotos-consultores";

export async function POST(req: Request) {
  const session = await getCurrentCorretor();
  if (!session) return NextResponse.json({ ok: false, error: "Não autenticado" }, { status: 401 });

  const corretor = await prisma.corretor.findUnique({ where: { userId: session.userId } });
  if (!corretor) return NextResponse.json({ ok: false, error: "Consultor não encontrado" }, { status: 404 });

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) return NextResponse.json({ ok: false, error: "Nenhum arquivo enviado" }, { status: 400 });
  if (!file.type.startsWith("image/")) return NextResponse.json({ ok: false, error: "Apenas imagens são aceitas" }, { status: 400 });
  if (file.size > 5 * 1024 * 1024) return NextResponse.json({ ok: false, error: "Arquivo muito grande (máx 5MB)" }, { status: 400 });

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const fileName = `${corretor.corretorId}-${Date.now()}.${ext}`;
  const arrayBuffer = await file.arrayBuffer();

  const supabaseUrl = process.env.SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  const uploadRes = await fetch(`${supabaseUrl}/storage/v1/object/${BUCKET}/${fileName}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": file.type,
      "x-upsert": "true",
    },
    body: arrayBuffer,
  });

  if (!uploadRes.ok) {
    const err = await uploadRes.text();
    console.error("Supabase Storage upload error:", err);
    return NextResponse.json({ ok: false, error: "Erro ao enviar imagem para o servidor" }, { status: 500 });
  }

  const publicUrl = `${supabaseUrl}/storage/v1/object/public/${BUCKET}/${fileName}`;

  await prisma.corretor.update({
    where: { userId: session.userId },
    data: { fotoUrl: publicUrl },
  });

  return NextResponse.json({ ok: true, url: publicUrl });
}
