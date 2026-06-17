"use client";

import { useState } from "react";
import { ArrowDownToLine } from "lucide-react";

export default function WithdrawForm({
  saldoDisponivel,
  chavePix,
}: {
  saldoDisponivel: number;
  chavePix: string | null;
}) {
  const [valor, setValor] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ tipo: "ok" | "erro"; texto: string } | null>(null);

  function fmt(v: number) {
    return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }

  async function solicitar() {
    const v = parseFloat(valor.replace(",", "."));
    if (!v || v <= 0) {
      setMsg({ tipo: "erro", texto: "Informe um valor válido." });
      return;
    }
    if (v > saldoDisponivel) {
      setMsg({ tipo: "erro", texto: "Valor maior que o saldo disponível." });
      return;
    }
    if (!chavePix) {
      setMsg({ tipo: "erro", texto: "Cadastre sua chave PIX no perfil antes de solicitar saque." });
      return;
    }

    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch("/api/corretor/withdraw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ valor: v }),
      });
      const json = await res.json();
      if (json.ok) {
        setMsg({ tipo: "ok", texto: "Solicitação enviada! Você receberá o PIX em até 3 dias úteis." });
        setValor("");
      } else {
        setMsg({ tipo: "erro", texto: json.error ?? "Erro ao solicitar saque." });
      }
    } catch {
      setMsg({ tipo: "erro", texto: "Erro de conexão. Tente novamente." });
    }
    setLoading(false);
  }

  const semSaldo = saldoDisponivel <= 0;

  return (
    <div className="flex flex-col gap-4">
      {!chavePix && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          Você ainda não cadastrou sua <strong>chave PIX</strong>. Acesse{" "}
          <a href="/painel/perfil" className="underline font-semibold">seu perfil</a> para adicionar.
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#9CA3AF] font-medium">R$</span>
          <input
            type="number"
            min="0"
            step="0.01"
            max={saldoDisponivel}
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            placeholder="0,00"
            disabled={semSaldo || !chavePix}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E5E7EB] bg-white text-sm text-[#101820] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#CBA35C]/40 focus:border-[#CBA35C] disabled:opacity-50 disabled:cursor-not-allowed transition"
          />
        </div>

        <button
          onClick={solicitar}
          disabled={loading || semSaldo || !chavePix}
          className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#CBA35C] to-[#E8C96A] text-[#101820] text-sm font-bold shadow-md shadow-[#CBA35C]/20 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
        >
          <ArrowDownToLine className="w-4 h-4" />
          {loading ? "Enviando..." : "Solicitar saque"}
        </button>
      </div>

      {!semSaldo && chavePix && (
        <p className="text-xs text-[#9CA3AF]">
          Disponível: <strong className="text-[#101820]">{fmt(saldoDisponivel)}</strong> · PIX para:{" "}
          <strong className="text-[#101820] font-mono">{chavePix}</strong>
        </p>
      )}

      {semSaldo && (
        <p className="text-xs text-[#9CA3AF]">Você não tem saldo disponível para saque no momento.</p>
      )}

      {msg && (
        <div className={`rounded-xl border px-4 py-3 text-sm font-medium ${
          msg.tipo === "ok"
            ? "bg-emerald-50 border-emerald-200 text-emerald-700"
            : "bg-red-50 border-red-200 text-red-700"
        }`}>
          {msg.texto}
        </div>
      )}
    </div>
  );
}
