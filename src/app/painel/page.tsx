// src/app/painel/page.tsx
import { prisma } from "@/lib/prisma";
import { getCurrentCorretor } from "@/lib/session";
import { redirect } from "next/navigation";
import React from "react";
import VendasRecentesWrapper from "@/components/VendasRecentesWrapper";

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
    <div className="space-y-10 text-white">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-semibold">Painel</h1>
        <p className="text-white/80 mt-1">
          Acompanhe o desempenho da sua atividade como consultor.
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white/6 p-6 border border-white/10 rounded-2xl">
          <p className="text-white/80 text-sm">Saldo Disponível</p>
          <p className="text-3xl font-semibold mt-2 text-white">
            {formatBRL(corretor.saldoDisponivel)}
          </p>
        </div>

        <div className="bg-white/6 p-6 border border-white/10 rounded-2xl">
          <p className="text-white/80 text-sm">Total já recebido</p>
          <p className="text-3xl font-semibold mt-2 text-white">
            {formatBRL(totalRecebido)}
          </p>
        </div>

        <div className="bg-white/6 p-6 border border-white/10 rounded-2xl">
          <p className="text-white/80 text-sm">Total de Indicações</p>
          <p className="text-3xl font-semibold mt-2 text-white">—</p>
        </div>

        <div className="bg-white/6 p-6 border border-white/10 rounded-2xl">
          <p className="text-white/80 text-sm">Total de Vendas</p>
          <p className="text-3xl font-semibold mt-2 text-white">—</p>
        </div>
      </div>

      {/* VENDAS (componente cliente) */}
      <section className="bg-white/6 border border-white/10 p-6 rounded-2xl">
        <h2 className="text-2xl font-semibold text-white">VENDAS</h2>
        <p className="text-white/80 mt-1 mb-4">
          Últimas vendas e comissões.
        </p>

        {/* componente cliente faz polling à API e exibe vendas */}
        <VendasRecentesWrapper corretorId={corretor.id} />
      </section>

      {/* Próximos passos / Certificação */}
      <section className="bg-white/6 border border-white/10 p-6 rounded-2xl">
        <h2 className="text-2xl font-semibold text-white">Próximos Passos</h2>

        {corretor.statusCertificacao === "certificado" ? (
          <div className="mt-4 text-white/90">
            <p className="text-xl font-semibold">Parabéns! Você é um consultor certificado.</p>
            <p className="mt-3 text-white/80">
              Boas práticas:
            </p>
            <ul className="list-disc ml-5 mt-2 text-white/80 space-y-1">
              <li>Mantenha seus dados atualizados.</li>
              <li>Use o painel diariamente para acompanhar resultados.</li>
              <li>Acompanhe suas indicações e prioridades com clientes.</li>
              <li>Responda rapidamente aos leads para aumentar conversões.</li>
            </ul>
          </div>
        ) : (
          <div className="mt-4 text-white/90">
            <p className="text-lg font-semibold">Torne-se um Consultor Certificado</p>
            <p className="mt-3 text-white/80">
              A certificação garante: maior credibilidade, acesso a oportunidades
              exclusivas, remuneração melhor e melhor ranqueamento no sistema.
            </p>
            <a
              href="https://certificacao.bemconcreto.com"
              target="_blank"
              rel="noreferrer"
              className="inline-block mt-4 px-5 py-3 bg-[#C7A58B] text-black rounded-lg font-semibold hover:brightness-95"
            >
              Ir para certificação
            </a>
          </div>
        )}
      </section>
    </div>
  );
}