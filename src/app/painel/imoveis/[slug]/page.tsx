"use client";

import { useParams } from "next/navigation";
import { listaImoveis } from "../data";

export default function ImovelDetalhes() {
  const params = useParams();
  const slug = params?.slug as string;

  console.log("SLUG RECEBIDO:", slug);

  const imovel = listaImoveis.find((i) => i.slug === slug);

  if (!imovel) {
    return (
      <div style={{ color: "white", padding: 40 }}>
        Imóvel não encontrado.
      </div>
    );
  }

  return (
    <div style={{ color: "white", padding: 40 }}>
      <h1>{imovel.nome}</h1>
      <p>{imovel.cidade}</p>
    </div>
  );
}