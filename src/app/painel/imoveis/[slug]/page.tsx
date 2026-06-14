"use client";

import type { ComponentType } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { FileText, PieChart, Wallet, DollarSign, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { listaImoveis } from "../data";

export default function ImovelDetalhes() {
  const params = useParams();
  const slug = params?.slug as string;

  const imovel = listaImoveis.find((i) => i.slug === slug);

  if (!imovel) {
    return <p className="text-sm text-muted-foreground">Imóvel não encontrado.</p>;
  }

  // Pool total (soma do valor de mercado de todos os imóveis)
  const poolTotal = listaImoveis.reduce(
    (total, im) => total + im.valorMercadoHoje,
    0
  );

  const percentualPool = (imovel.valorMercadoHoje / poolTotal) * 100;

  const valorizacao =
    ((imovel.valorMercadoHoje - imovel.valorPago) / imovel.valorPago) * 100;

  return (
    <div className="flex flex-col gap-8">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-[#101820] tracking-tight">{imovel.nome}</h1>
        <p className="text-sm text-[#6B7280] mt-1">{imovel.cidade}</p>

        <div className="flex gap-2 mt-3">
          <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700">
            {imovel.status}
          </Badge>
          <Badge variant="outline">{imovel.categoria}</Badge>
        </div>
      </div>

      {/* GALERIA */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 relative h-64 md:h-80 rounded-xl overflow-hidden bg-muted">
          <Image src={imovel.imagemCapa} alt={imovel.nome} fill className="object-cover" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {imovel.imagens.map((img, i) => (
            <div key={i} className="relative h-32 md:h-[9.5rem] rounded-lg overflow-hidden bg-muted">
              <Image src={img} alt={`${imovel.nome} ${i + 1}`} fill className="object-cover" />
            </div>
          ))}
        </div>
      </div>

      {/* DADOS FINANCEIROS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          icon={PieChart}
          title="Participação na Pool"
          value={`${percentualPool.toFixed(2)}% do total`}
        />
        <KpiCard
          icon={Wallet}
          title="Valor Pago"
          value={`R$ ${imovel.valorPago.toLocaleString("pt-BR")}`}
        />
        <KpiCard
          icon={DollarSign}
          title="Valor de Mercado"
          value={`R$ ${imovel.valorMercadoHoje.toLocaleString("pt-BR")}`}
        />
        <KpiCard
          icon={TrendingUp}
          title="Valorização"
          value={`${valorizacao.toFixed(1)}%`}
        />
      </div>

      {/* DESCRIÇÃO */}
      <Card>
        <CardHeader>
          <CardTitle>Sobre o empreendimento</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-[#6B7280] leading-relaxed">{imovel.descricaoLonga}</p>
        </CardContent>
      </Card>

      {/* DOCUMENTOS */}
      <Card>
        <CardHeader>
          <CardTitle>Documentos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {imovel.documentos.map((doc, i) => (
              <a
                key={i}
                href={doc.arquivo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-muted/50 text-sm text-[#101820] hover:bg-muted transition-colors"
              >
                <FileText className="w-4 h-4 text-primary" />
                {doc.nome}
              </a>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function KpiCard({
  icon: Icon,
  title,
  value,
}: {
  icon: ComponentType<{ className?: string }>;
  title: string;
  value: string;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground truncate">{title}</p>
          <p className="text-2xl font-bold text-[#101820] truncate">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
