export const dynamic = "force-dynamic";

import Link from "next/link";
import ImovelCard from "@/components/ImovelCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getImoveis } from "@/lib/cerebro";

export default async function ImoveisPage() {
  const imoveis = await getImoveis();

  return (
    <div className="flex flex-col gap-8">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-[#101820] tracking-tight">Imóveis</h1>
        <p className="text-sm text-[#6B7280] mt-1">
          Projetos tokenizados disponíveis para indicação.
        </p>
      </div>

      {imoveis.length === 0 ? (
        <Card>
          <CardContent>
            <p className="text-sm text-muted-foreground">Nenhum imóvel disponível no momento.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {imoveis.map((imovel) => (
            <div key={imovel.id} className="flex flex-col gap-3">
              <ImovelCard imovel={imovel} />

              <Button asChild className="bg-gradient-to-r from-[#8D6E63] to-[#8D6E63]/85">
                <Link href={`/painel/imoveis/${imovel.slug}`}>Mais detalhes</Link>
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
