"use client";

import { useState } from "react";

export default function WithdrawForm({
  corretorId,
  saldoDisponivel
}: {
  corretorId: number;
  saldoDisponivel: number;
}) {
  const [valor, setValor] = useState("");

  async function solicitar() {
    const v = Number(valor);

    if (v <= 0 || v > saldoDisponivel) {
      alert("Valor inválido");
      return;
    }

    await fetch("/api/corretor/withdraw", {
      method: "POST",
      body: JSON.stringify({ valor: v, corretorId })
    });

    alert("Solicitação enviada!");
  }

  return (
    <div style={{ marginTop: 12 }}>
      <input
        type="number"
        value={valor}
        onChange={(e) => setValor(e.target.value)}
        placeholder="Valor para saque"
        style={{ padding: 8, width: "100%", marginBottom: 8 }}
      />

      <button
        onClick={solicitar}
        style={{
          padding: "10px 16px",
          background: "#008f39",
          color: "white",
          borderRadius: 6,
          border: "none",
          cursor: "pointer"
        }}
      >
        Solicitar saque
      </button>
    </div>
  );
}