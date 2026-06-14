"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

function formatDate(dateString: any) {
  if (!dateString) return "-";

  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "-";

    return d.toLocaleDateString("pt-BR", { timeZone: "UTC" });
  } catch {
    return "-";
  }
}

export default function VendasRecentes({ corretorId }: { corretorId: number }) {
  const [vendas, setVendas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      setLoading(true);
      const res = await fetch(`/api/painel/vendas?corretorId=${corretorId}`, {
        cache: "no-store",
      });
      const data = await res.json();
      setVendas(data.vendas ?? []);
    } catch (err) {
      console.error("Erro ao buscar vendas", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return <p className="text-sm text-muted-foreground">Carregando vendas...</p>;
  }

  if (vendas.length === 0) {
    return <p className="text-sm text-muted-foreground">Nenhuma venda encontrada.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Data</TableHead>
          <TableHead>Valor</TableHead>
          <TableHead>Comissão</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {vendas.map((venda) => (
          <TableRow key={venda.id}>
            <TableCell>{formatDate(venda.dataVenda)}</TableCell>
            <TableCell className="font-medium">R$ {venda.valor.toFixed(2)}</TableCell>
            <TableCell className="font-medium">R$ {venda.comissao.toFixed(2)}</TableCell>
            <TableCell>
              <Badge
                variant="outline"
                className={cn(
                  venda.status === "paga"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-amber-200 bg-amber-50 text-amber-700"
                )}
              >
                {venda.status}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
