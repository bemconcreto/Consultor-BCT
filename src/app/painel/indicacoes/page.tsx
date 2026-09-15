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
import { formatBRL } from "@/lib/format";

// Campos alinhados ao schema Prisma real (models Indicacao e Venda).
// Hoje não existe vínculo individual indicação <-> venda: ambas só
// compartilham o mesmo corretorId. Por isso são exibidas como duas
// listas separadas, em vez de tentar casar uma venda a uma indicação.
type Indicacao = {
  id: number;
  accountId: string;
  status: string;
  createdAt: string;
};

type Venda = {
  id: number;
  vendaId: string;
  valor: number;
  comissao: number;
  status: string;
  dataVenda: string | null;
};

function formatDate(dateString: string | null | undefined) {
  if (!dateString) return "-";
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "-";
    return d.toLocaleDateString("pt-BR", { timeZone: "UTC" });
  } catch {
    return "-";
  }
}

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

      {/* TABELA DE INDICAÇÕES */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Indicações</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente (ID)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-muted-foreground">
                    Carregando indicações...
                  </TableCell>
                </TableRow>
              ) : indicacoes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-muted-foreground">
                    Nenhuma indicação encontrada.
                  </TableCell>
                </TableRow>
              ) : (
                indicacoes.map((ind) => (
                  <TableRow key={ind.id}>
                    <TableCell className="font-mono text-xs">{ind.accountId}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          ind.status === "comprado"
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : "border-amber-200 bg-amber-50 text-amber-700"
                        )}
                      >
                        {ind.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(ind.createdAt)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* TABELA DE VENDAS */}
      <Card>
        <CardHeader>
          <CardTitle>Vendas Registradas</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-[#9CA3AF] mb-4">
            Hoje ainda não é possível vincular uma venda a uma indicação específica —
            as duas listas mostram os registros da sua carteira de forma independente.
          </p>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Venda</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Comissão</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-muted-foreground">
                    Carregando vendas...
                  </TableCell>
                </TableRow>
              ) : vendas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-muted-foreground">
                    Nenhuma venda encontrada.
                  </TableCell>
                </TableRow>
              ) : (
                vendas.map((venda) => (
                  <TableRow key={venda.id}>
                    <TableCell className="font-mono text-xs">{venda.vendaId}</TableCell>
                    <TableCell>{formatBRL(venda.valor)}</TableCell>
                    <TableCell>{formatBRL(venda.comissao)}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          venda.status === "confirmada"
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : "border-amber-200 bg-amber-50 text-amber-700"
                        )}
                      >
                        {venda.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(venda.dataVenda)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
