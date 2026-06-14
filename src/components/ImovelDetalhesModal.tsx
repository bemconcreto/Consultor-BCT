"use client";

import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import type { Imovel } from "@/app/painel/imoveis/data";

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
          <DialogDescription>{truncate(imovel.descricaoLonga, 140)}</DialogDescription>
        </DialogHeader>

        <div className="relative h-48 w-full rounded-lg overflow-hidden bg-muted">
          <Image src={imovel.imagemCapa} alt={imovel.nome} fill className="object-cover" />
        </div>

        <div className="space-y-1.5 text-sm text-[#101820]">
          <p>
            <span className="font-medium">Cidade:</span> {imovel.cidade}
          </p>
          <p>
            <span className="font-medium">Status:</span> {imovel.status}
          </p>
          <p>
            <span className="font-medium">Total tokenizado:</span> {imovel.tokenTotal}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
