// src/app/painel/page.tsx
import { prisma } from "@/lib/prisma";
import { getCurrentCorretor } from "@/lib/session";
import { redirect } from "next/navigation";
import React from "react";
import { Wallet, DollarSign, Users, ShoppingCart, ArrowRight } from "lucide-react";
import VendasRecentesWrapper from "@/components/VendasRecentesWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function formatBRL(value: number | null | undefined) {
  const v = typeof value === "number" ? value : 0;
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default async function DashboardPage() {
  const session = await getCurrentCorretor();
  if (!session) redirect("/");

  const corretor = await prisma.corretor.findUnique({
    where: { userId: session.userId },
  });

  if (!corretor) redirect("/");

  // total já recebido = soma de comissao onde status = 'pago' para esse corretor
  const totalRecebidoAgg = await prisma.venda.aggregate({
    where: {
      corretorId: corretor.id,
      status: "pago",
    },
    _sum: {
      comissao: true,
    },
  });
  const totalRecebido = totalRecebidoAgg._sum.comissao ?? 0;

  return (
    <div className="flex flex-col gap-8">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-[#101820] tracking-tight">Painel</h1>
        <p className="text-sm text-[#6B7280] mt-1">
          Acompanhe o desempenho da sua atividade como consultor.
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard icon={Wallet} title="Saldo Disponível" value={formatBRL(corretor.saldoDisponivel)} />
        <KpiCard icon={DollarSign} title="Total já recebido" value={formatBRL(totalRecebido)} />
        <KpiCard icon={Users} title="Total de Indicações" value="—" />
        <KpiCard icon={ShoppingCart} title="Total de Vendas" value="—" />
      </div>

      {/* VENDAS */}
      <Card>
        <CardHeader>
          <CardTitle>Vendas Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <VendasRecentesWrapper corretorId={corretor.id} />
        </CardContent>
      </Card>

      {/* PRÓXIMOS PASSOS / CERTIFICAÇÃO */}
      <Card>
        <CardHeader>
          <CardTitle>Próximos Passos</CardTitle>
        </CardHeader>
        <CardContent>
          {corretor.statusCertificacao === "certificado" ? (
            <div className="text-[#101820]">
              <p className="text-base font-semibold">Parabéns! Você é um consultor certificado.</p>
              <p className="mt-3 text-sm text-[#6B7280]">Boas práticas:</p>
              <ul className="list-disc ml-5 mt-2 text-sm text-[#6B7280] space-y-1">
                <li>Mantenha seus dados atualizados.</li>
                <li>Use o painel diariamente para acompanhar resultados.</li>
                <li>Acompanhe suas indicações e prioridades com clientes.</li>
                <li>Responda rapidamente aos leads para aumentar conversões.</li>
              </ul>
            </div>
          ) : (
            <div className="text-[#101820]">
              <p className="text-base font-semibold">Torne-se um Consultor Certificado</p>
              <p className="mt-3 text-sm text-[#6B7280]">
                A certificação garante: maior credibilidade, acesso a oportunidades
                exclusivas, remuneração melhor e melhor ranqueamento no sistema.
              </p>
              <Button asChild className="mt-4 bg-gradient-to-r from-[#8D6E63] to-[#8D6E63]/85">
                <a href="https://certificacao.bemconcreto.com" target="_blank" rel="noreferrer">
                  Ir para certificação
                  <ArrowRight className="w-4 h-4" />
                </a>
              </Button>
            </div>
          )}
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
  icon: React.ComponentType<{ className?: string }>;
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
