// src/app/api/siwe/nonce/route.ts
import { NextResponse } from "next/server";
import { generateNonce } from "siwe";

export async function GET() {
  try {
    const nonce = generateNonce();
    // opcional: você pode armazenar o nonce ligado a algum id em cache/DB para validação anti-replay
    // por ora retornamos o nonce ao cliente — a verificação (verificar e invalidar) será feita no endpoint /verify
    return NextResponse.json({ nonce });
  } catch (err) {
    return new NextResponse("Erro ao gerar nonce", { status: 500 });
  }
}