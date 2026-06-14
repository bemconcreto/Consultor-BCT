"use client";

import { Building2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import type { Imovel } from "@/lib/cerebro";

function truncate(text: string, length: number) {
  return text.length > length ? `${text.slice(0, length).trim()}...` : text;
}

export default function ImovelDetalhesModal({
  imovel,
  onClose,
}: {
  imovel: Imovel;
  onClose: () => void;
}) {
  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{imovel.nome}</DialogTitle>
          <DialogDescription>{truncate(imovel.descricao ?? "", 140)}</DialogDescription>
        </DialogHeader>

        <div className="relative h-48 w-full rounded-lg overflow-hidden bg-muted">
          {imovel.imagemUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imovel.imagemUrl} alt={imovel.nome} className="absolute inset-0 h-full w-full object-cover" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
              <Building2 className="w-10 h-10" />
            </div>
          )}
        </div>

        <div className="space-y-1.5 text-sm text-[#101820]">
          <p>
            <span className="font-medium">Localização:</span> {imovel.localizacao}
          </p>
          <p>
            <span className="font-medium">Status:</span> Disponível
          </p>
          <p>
            <span className="font-medium">Participação na Pool:</span>{" "}
            {imovel.percentualPool.toFixed(2)}%
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
