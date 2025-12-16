"use client";

import { useState } from "react";
import Link from "next/link";
import ImovelCard from "@/components/ImovelCard";
import { listaImoveis } from "./data";

const categorias = ["Todos", "Incorporação", "SCP", "Pronto", "Leilão"];

export default function ImoveisPage() {
  const [filtro, setFiltro] = useState("Todos");

  const filtrados =
    filtro === "Todos"
      ? listaImoveis
      : listaImoveis.filter((i) => i.categoria === filtro);

  return (
    <div className="p-8 space-y-10">
      <div>
        <h1 className="text-3xl font-semibold text-bc-light">Imóveis</h1>
        <p className="text-bc-light/70">
          Projetos tokenizados disponíveis para indicação.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        {categorias.map((cat) => (
          <button
            key={cat}
            onClick={() => setFiltro(cat)}
            className={
              filtro === cat
                ? "bg-bc-brown text-white border-bc-brown px-5 py-2 rounded-full"
                : "bg-white/10 text-bc-light border-white/20 px-5 py-2 rounded-full"
            }
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {filtrados.map((imovel) => (
          <div
            key={imovel.id}
            className="space-y-4 bg-white/5 border border-white/10 rounded-xl p-4"
          >
            <ImovelCard imovel={imovel} />

            <Link
              href={`/painel/imoveis/${imovel.id}`}
              className="block text-center px-4 py-2 rounded-lg bg-bc-brown text-white"
            >
              Mais detalhes
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}