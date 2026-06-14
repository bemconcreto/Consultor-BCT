import type { ComponentType } from "react";
import { Building2, FileText, PieChart, Wallet, DollarSign, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  getImovelBySlug,
  DOCUMENTO_CATEGORIA_LABELS,
  type DocumentosImovel,
} from "@/lib/cerebro";

export default async function ImovelDetalhes({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const imovel = await getImovelBySlug(slug);

  if (!imovel) {
    return <p className="text-sm text-muted-foreground">Imóvel não encontrado.</p>;
  }

  const documentoCategorias = (Object.keys(DOCUMENTO_CATEGORIA_LABELS) as Array<
    keyof DocumentosImovel
  >).filter((categoria) => (imovel.documentos?.[categoria]?.length ?? 0) > 0);

  return (
    <div className="flex flex-col gap-8">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-[#101820] tracking-tight">{imovel.nome}</h1>
        <p className="text-sm text-[#6B7280] mt-1">{imovel.localizacao}</p>

        <div className="flex gap-2 mt-3">
          <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700">
            Disponível
          </Badge>
        </div>
      </div>

      {/* IMAGEM DE CAPA */}
      <div className="relative h-64 md:h-80 rounded-xl overflow-hidden bg-muted">
        {imovel.imagemUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imovel.imagemUrl} alt={imovel.nome} className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
            <Building2 className="w-12 h-12" />
          </div>
        )}
      </div>

      {/* DADOS FINANCEIROS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          icon={PieChart}
          title="Participação na Pool"
          value={`${imovel.percentualPool.toFixed(2)}% do total`}
        />
        <KpiCard
          icon={Wallet}
          title="Valor Pago"
          value={`R$ ${imovel.valorCompra.toLocaleString("pt-BR")}`}
        />
        <KpiCard
          icon={DollarSign}
          title="Valor de Mercado"
          value={`R$ ${imovel.valorMercado.toLocaleString("pt-BR")}`}
        />
        <KpiCard
          icon={TrendingUp}
          title="Valorização"
          value={`${(imovel.valorizacaoAcumulada * 100).toFixed(1)}%`}
        />
      </div>

      {/* DESCRIÇÃO */}
      <Card>
        <CardHeader>
          <CardTitle>Sobre o empreendimento</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-[#6B7280] leading-relaxed">
            {imovel.descricao || "Sem descrição disponível."}
          </p>
        </CardContent>
      </Card>

      {/* DOCUMENTOS */}
      {documentoCategorias.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Documentos</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {documentoCategorias.map((categoria) => (
              <div key={categoria}>
                <h3 className="text-sm font-medium text-[#101820] mb-2">
                  {DOCUMENTO_CATEGORIA_LABELS[categoria]}
                </h3>
                <div className="flex flex-wrap gap-3">
                  {imovel.documentos?.[categoria]?.map((doc, i) => (
                    <a
                      key={i}
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-muted/50 text-sm text-[#101820] hover:bg-muted transition-colors"
                    >
                      <FileText className="w-4 h-4 text-primary" />
                      {doc.nome}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
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
