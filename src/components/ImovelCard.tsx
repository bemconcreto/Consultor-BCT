"use client";

import { useState } from "react";
import { Building2 } from "lucide-react";
import ImovelDetalhesModal from "./ImovelDetalhesModal";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Imovel } from "@/lib/cerebro";

export default function ImovelCard({ imovel }: { imovel: Imovel }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Card
        className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow p-0 gap-0"
        onClick={() => setOpen(true)}
      >
        <div className="relative h-44 w-full bg-muted">
          {imovel.imagemUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imovel.imagemUrl} alt={imovel.nome} className="absolute inset-0 h-full w-full object-cover" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
              <Building2 className="w-10 h-10" />
            </div>
          )}
        </div>

        <CardContent className="p-4">
          <h2 className="text-lg font-semibold text-[#101820]">{imovel.nome}</h2>
          <p className="text-sm text-muted-foreground">{imovel.localizacao}</p>

          <div className="mt-3">
            <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700">
              Disponível
            </Badge>
          </div>
        </CardContent>
      </Card>

      {open && <ImovelDetalhesModal imovel={imovel} onClose={() => setOpen(false)} />}
    </>
  );
}
