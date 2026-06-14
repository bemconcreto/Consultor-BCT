"use client";

import { useState } from "react";
import Link from "next/link";
import ImovelCard from "@/components/ImovelCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { listaImoveis } from "./data";

const categorias = ["Todos", "Incorporação", "SCP", "Pronto", "Leilão"];

export default function ImoveisPage() {
  const [filtro, setFiltro] = useState("Todos");

  const filtrados =
    filtro === "Todos"
      ? listaImoveis
      : listaImoveis.filter((i) => i.categoria === filtro);

  return (
    <div className="flex flex-col gap-8">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-[#101820] tracking-tight">Imóveis</h1>
        <p className="text-sm text-[#6B7280] mt-1">
          Projetos tokenizados disponíveis para indicação.
        </p>
      </div>

      {/* FILTROS */}
      <div className="flex flex-wrap gap-2">
        {categorias.map((cat) => (
          <Button
            key={cat}
            size="sm"
            variant={filtro === cat ? "default" : "outline"}
            className={cn(
              "rounded-full",
              filtro === cat && "bg-gradient-to-r from-[#8D6E63] to-[#8D6E63]/85"
            )}
            onClick={() => setFiltro(cat)}
          >
            {cat}
          </Button>
        ))}
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtrados.map((imovel) => (
          <div key={imovel.id} className="flex flex-col gap-3">
            <ImovelCard imovel={imovel} />

            <Button asChild className="bg-gradient-to-r from-[#8D6E63] to-[#8D6E63]/85">
              <Link href={`/painel/imoveis/${imovel.slug}`}>Mais detalhes</Link>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
