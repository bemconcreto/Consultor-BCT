"use client";

import { useEffect, useState } from "react";
import { ArrowUp, ArrowDown, Minus } from "lucide-react";

export default function IndicacoesPage() {
  const [indicacoes, setIndicacoes] = useState([]);
  const [vendas, setVendas] = useState([]);
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
  let evolucaoIcon = <Minus size={26} className="text-yellow-400" />;
  let evolucaoTexto = "Estável";

  if (totalVendas > 0) {
    evolucaoIcon = <ArrowUp size={26} className="text-emerald-400" />;
    evolucaoTexto = "Crescendo";
  }

  if (totalVendas === 0 && totalIndicacoes > 0) {
    evolucaoIcon = <ArrowDown size={26} className="text-red-400" />;
    evolucaoTexto = "Caindo";
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-white mb-2">
        Minhas Indicações
      </h1>
      <p className="text-white/60 mb-10">
        Acompanhe suas indicações, vendas e desempenho.
      </p>

      {/* CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        <Card titulo="Total de Indicações" valor={totalIndicacoes} />

        <Card titulo="Total de Vendas" valor={totalVendas} />

        <div className="rounded-2xl p-6 bg-[#2b1f1a]/60 border border-white/10 backdrop-blur-md shadow-lg flex flex-col">
          <p className="text-white/60 text-sm">Evolução</p>
          <div className="flex items-center gap-3 mt-2">
            {evolucaoIcon}
            <span className="text-xl font-semibold text-white">{evolucaoTexto}</span>
          </div>
        </div>

      </div>

      {/* TABELA */}
      <div
        className="
          mt-12 p-8 rounded-2xl shadow-lg backdrop-blur-md
          bg-[#2b1f1a]/60 border border-white/10 text-white
        "
      >
        <h3 className="text-xl font-semibold mb-4">Lista de Indicações</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-white/70 border-b border-white/10">
                <th className="pb-3">Cliente</th>
                <th className="pb-3">Instagram</th>
                <th className="pb-3">Valor</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>

            <tbody>
              {indicacoes.length === 0 && (
                <tr>
                  <td className="py-4 text-white/60" colSpan={4}>
                    Nenhuma indicação encontrada.
                  </td>
                </tr>
              )}

              {indicacoes.map((ind) => {
                const venda = vendas.find(v => v.indicacaoId === ind.id);

                return (
                  <tr key={ind.id} className="border-b border-white/10">
                    <td className="py-3">{ind.nome || "-"}</td>
                    <td className="py-3">@{ind.instagram || "-"}</td>

                    <td className="py-3">
                      {venda ? `R$ ${venda.valor.toFixed(2)}` : "—"}
                    </td>

                    <td className="py-3">
                      {venda ? (
                        <span className={`
                          px-3 py-1 rounded-full text-xs text-white
                          ${venda.status === "paga" ? "bg-emerald-600" : "bg-yellow-600"}
                        `}>
                          {venda.status}
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-xs bg-gray-600 text-white">
                          Não comprou
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

function Card({ titulo, valor }) {
  return (
    <div
      className="
        rounded-2xl p-6 bg-[#2b1f1a]/60 border border-white/10
        backdrop-blur-md shadow-lg
      "
    >
      <p className="text-white/60 text-sm">{titulo}</p>
      <p className="text-3xl font-bold text-white mt-1">{valor}</p>
    </div>
  );
}