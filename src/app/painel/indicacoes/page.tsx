"use client";

import { useEffect, useState } from "react";
import { ArrowUp, ArrowDown, Minus, Users, ShoppingCart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

type Indicacao = {
  id: number;
  nome?: string;
  instagram?: string;
};

type Venda = {
  id: number;
  indicacaoId: number;
  valor: number;
  status: string;
};

export default function IndicacoesPage() {
  const [indicacoes, setIndicacoes] = useState<Indicacao[]>([]);
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);

    const res = await fetch("/api/indicacoes");
    const data = await res.json();

    // Aqui vem: data.indicacoes e data.vendas
    setIndicacoes(data.indicacoes || []);
    setVendas(data.vendas || []);

    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const totalIndicacoes = indicacoes.length;
  const totalVendas = vendas.length;

  // --- EVOLUÇÃO ---
  // Lógica simples por enquanto: se vendas > 0 está subindo.
  let EvolucaoIcon = Minus;
  let evolucaoTexto = "Estável";
  let evolucaoColor = "text-amber-500";

  if (totalVendas > 0) {
    EvolucaoIcon = ArrowUp;
    evolucaoTexto = "Crescendo";
    evolucaoColor = "text-emerald-500";
  }

  if (totalVendas === 0 && totalIndicacoes > 0) {
    EvolucaoIcon = ArrowDown;
    evolucaoTexto = "Caindo";
    evolucaoColor = "text-red-500";
  }

  return (
    <div className="flex flex-col gap-8">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-[#101820] tracking-tight">Minhas Indicações</h1>
        <p className="text-sm text-[#6B7280] mt-1">
          Acompanhe suas indicações, vendas e desempenho.
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-sm text-muted-foreground truncate">Total de Indicações</p>
              <p className="text-2xl font-bold text-[#101820] truncate">{totalIndicacoes}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-sm text-muted-foreground truncate">Total de Vendas</p>
              <p className="text-2xl font-bold text-[#101820] truncate">{totalVendas}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4">
            <div className={cn("w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0", evolucaoColor)}>
              <EvolucaoIcon className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-sm text-muted-foreground truncate">Evolução</p>
              <p className="text-2xl font-bold text-[#101820] truncate">{evolucaoTexto}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* TABELA */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Indicações</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Instagram</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-muted-foreground">
                    Carregando indicações...
                  </TableCell>
                </TableRow>
              ) : indicacoes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-muted-foreground">
                    Nenhuma indicação encontrada.
                  </TableCell>
                </TableRow>
              ) : (
                indicacoes.map((ind) => {
                  const venda = vendas.find((v) => v.indicacaoId === ind.id);

                  return (
                    <TableRow key={ind.id}>
                      <TableCell>{ind.nome || "-"}</TableCell>
                      <TableCell>@{ind.instagram || "-"}</TableCell>
                      <TableCell>
                        {venda ? `R$ ${venda.valor.toFixed(2)}` : "—"}
                      </TableCell>
                      <TableCell>
                        {venda ? (
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
                        ) : (
                          <Badge variant="outline" className="border-border bg-muted text-muted-foreground">
                            Não comprou
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
