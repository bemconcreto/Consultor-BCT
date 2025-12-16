"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import { listaImoveis } from "../data";

export default function ImovelDetalhes() {
  const params = useParams();
  const slug = params?.slug as string;

  const imovel = listaImoveis.find((i) => i.slug === slug);

  if (!imovel) {
    return (
      <div className="p-10 text-white">
        Imóvel não encontrado.
      </div>
    );
  }

  const valorizacao =
    ((imovel.valorMercadoHoje - imovel.valorPago) / imovel.valorPago) * 100;

  return (
    <div className="p-8 space-y-10 text-white">

      {/* HEADER */}
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">{imovel.nome}</h1>
        <p className="text-white/70">{imovel.cidade}</p>

        <div className="flex gap-3 text-sm">
          <span className="px-3 py-1 rounded-full bg-white/10">
            {imovel.status}
          </span>
          <span className="px-3 py-1 rounded-full bg-white/10">
            {imovel.categoria}
          </span>
        </div>
      </div>

      {/* GALERIA */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Image
            src={imovel.imagemCapa}
            alt={imovel.nome}
            width={1200}
            height={700}
            className="rounded-xl object-cover"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {imovel.imagens.map((img, i) => (
            <Image
              key={i}
              src={img}
              alt={`${imovel.nome} ${i}`}
              width={400}
              height={300}
              className="rounded-lg object-cover"
            />
          ))}
        </div>
      </div>

      {/* DADOS FINANCEIROS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <InfoCard title="Total de Tokens" value={imovel.tokenTotal} />
        <InfoCard
          title="Valor Pago"
          value={`R$ ${imovel.valorPago.toLocaleString("pt-BR")}`}
        />
        <InfoCard
          title="Valor de Mercado"
          value={`R$ ${imovel.valorMercadoHoje.toLocaleString("pt-BR")}`}
        />
        <InfoCard
          title="Valorização"
          value={`${valorizacao.toFixed(1)}%`}
        />
      </div>

      {/* DESCRIÇÃO */}
      <div className="space-y-4 max-w-4xl">
        <h2 className="text-2xl font-semibold">Sobre o empreendimento</h2>
        <p className="text-white/80 leading-relaxed">
          {imovel.descricaoLonga}
        </p>
      </div>

      {/* DOCUMENTOS */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Documentos</h2>

        <div className="flex flex-wrap gap-4">
          {imovel.documentos.map((doc, i) => (
            <a
              key={i}
              href={doc.arquivo}
              target="_blank"
              className="px-5 py-3 rounded-lg bg-white/10 hover:bg-white/20 transition"
            >
              📄 {doc.nome}
            </a>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="pt-6">
        <button className="px-8 py-4 rounded-xl bg-bc-brown text-white text-lg hover:opacity-90 transition">
          Indicar este imóvel
        </button>
      </div>

    </div>
  );
}

/* COMPONENTE AUXILIAR */
function InfoCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="p-5 rounded-xl bg-white/5 border border-white/10">
      <p className="text-sm text-white/60">{title}</p>
      <p className="text-xl font-semibold mt-1">{value}</p>
    </div>
  );
}