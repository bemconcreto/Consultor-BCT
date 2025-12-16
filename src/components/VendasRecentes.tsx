"use client";

import { useEffect, useState } from "react";

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

  return (
    <div
      className="
        mt-14 p-8 rounded-2xl shadow-lg backdrop-blur-md
        border border-white/10
        bg-[#2b1f1a]/60
        text-white
      "
    >
      {/* Tabela */}
      {loading ? (
        <p className="text-white/70">Carregando vendas...</p>
      ) : vendas.length === 0 ? (
        <p className="text-white/70">Nenhuma venda encontrada.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-white/10 text-white/70">
                <th className="pb-3">Data</th>
                <th className="pb-3">Valor</th>
                <th className="pb-3">Comissão</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>

            <tbody>
              {vendas.map((venda) => (
                <tr
                  key={venda.id}
                  className="border-b border-white/10 last:border-none"
                >
                  <td className="py-3">{formatDate(venda.dataVenda)}</td>

                  <td className="py-3 font-medium">
                    R$ {venda.valor.toFixed(2)}
                  </td>

                  <td className="py-3 font-medium">
                    R$ {venda.comissao.toFixed(2)}
                  </td>

                  <td className="py-3">
                    <span
                      className={`
                        px-3 py-1 rounded-full text-xs text-white
                        ${
                          venda.status === "paga"
                            ? "bg-emerald-600"
                            : "bg-yellow-600"
                        }
                      `}
                    >
                      {venda.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}