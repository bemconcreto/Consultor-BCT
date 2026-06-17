// src/app/painel/page.tsx
import { prisma } from "@/lib/prisma";
import { getCurrentCorretor } from "@/lib/session";
import { redirect } from "next/navigation";
import React from "react";
import { Wallet, DollarSign, Users, ShoppingCart, ArrowRight, ArrowDownToLine } from "lucide-react";
import VendasRecentesWrapper from "@/components/VendasRecentesWrapper";
import LinkDivulgacaoCard from "@/components/LinkDivulgacaoCard";
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

      {/* LINK DE DIVULGAÇÃO */}
      <LinkDivulgacaoCard corretorId={corretor.corretorId} nome={corretor.nome} />

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Saldo com botão de saque */}
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Wallet className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-muted-foreground truncate">Saldo Disponível</p>
              <p className="text-2xl font-bold text-[#101820] truncate">{formatBRL(corretor.saldoDisponivel)}</p>
              {corretor.saldoDisponivel > 0 && (
                <a
                  href="/painel/financeiro"
                  className="inline-flex items-center gap-1 mt-1 text-[11px] font-bold text-[#CBA35C] hover:underline"
                >
                  <ArrowDownToLine className="w-3 h-3" /> Solicitar saque
                </a>
              )}
            </div>
          </CardContent>
        </Card>
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

      {/* BANNER CROSS-SELL: COMPRAR BEM */}
      <a
        href="https://app.bemconcreto.com"
        target="_blank"
        rel="noreferrer"
        className="group relative flex items-center justify-between gap-6 rounded-2xl overflow-hidden px-7 py-6 cursor-pointer"
        style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #2d2410 60%, #1a1a2e 100%)" }}
      >
        <div className="pointer-events-none absolute -top-10 -left-10 w-48 h-48 rounded-full bg-[#CBA35C]/15 blur-[60px]" />
        <div className="pointer-events-none absolute -bottom-10 -right-10 w-48 h-48 rounded-full bg-[#CBA35C]/10 blur-[60px]" />
        <div className="pointer-events-none absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#CBA35C]/60 to-transparent" />

        <div className="relative flex-1 min-w-0">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#CBA35C]/15 border border-[#CBA35C]/25 text-[#CBA35C] text-[10px] font-bold uppercase tracking-widest mb-3">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            Invista também
          </span>
          <h3 className="text-lg font-extrabold text-white leading-snug mb-1">
            Ganhe dinheiro também <span className="text-[#CBA35C]">comprando BEM</span>
          </h3>
          <p className="text-white/40 text-xs leading-relaxed">
            Invista em tokens de imóveis reais a partir de <strong className="text-white/60">R$ 100</strong> e faça seu dinheiro trabalhar por você.
          </p>
        </div>

        <div className="relative shrink-0 flex items-center gap-3">
          <span className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#CBA35C] to-[#E8C96A] text-[#101820] text-sm font-extrabold shadow-lg shadow-[#CBA35C]/30 group-hover:shadow-[#CBA35C]/50 group-hover:-translate-y-0.5 transition-all duration-300">
            Quero investir
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </span>
          <ArrowRight className="sm:hidden w-8 h-8 text-[#CBA35C]" />
        </div>
      </a>

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
