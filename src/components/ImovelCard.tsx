"use client";

import { useState } from "react";
import Image from "next/image";
import ImovelDetalhesModal from "./ImovelDetalhesModal";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Imovel } from "@/app/painel/imoveis/data";

export default function ImovelCard({ imovel }: { imovel: Imovel }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Card
        className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow p-0 gap-0"
        onClick={() => setOpen(true)}
      >
        <div className="relative h-44 w-full bg-muted">
          <Image src={imovel.imagemCapa} alt={imovel.nome} fill className="object-cover" />
        </div>

        <CardContent className="p-4">
          <h2 className="text-lg font-semibold text-[#101820]">{imovel.nome}</h2>
          <p className="text-sm text-muted-foreground">{imovel.cidade}</p>

          <div className="mt-3">
            <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700">
              {imovel.status}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {open && <ImovelDetalhesModal imovel={imovel} onClose={() => setOpen(false)} />}
    </>
  );
}
