"use client";

import { useState } from "react";

export default function EditProfileForm({ initialCorretor }: { initialCorretor: any }) {
  const [nome, setNome] = useState(initialCorretor.nome ?? "");
  const [cpf, setCpf] = useState(initialCorretor.cpf ?? "");
  const [creci, setCreci] = useState(initialCorretor.creci ?? "");
  const [instagramHandle, setInstagramHandle] = useState(initialCorretor.instagramHandle ?? "");

  function normalizeInstagram(value: string) {
    return value
      .toLowerCase()
      .replace("@", "")
      .replace(/\s/g, "");
  }

  async function handleSave() {
    await fetch("/api/corretor/update", {
      method: "POST",
      body: JSON.stringify({
        id: initialCorretor.id,
        nome,
        cpf,
        creci,
        instagramHandle: normalizeInstagram(instagramHandle)
      }),
      headers: {
        "Content-Type": "application/json",
      }
    });

    alert("Dados atualizados com sucesso!");
  }

  return (
    <div style={{ marginTop: 12 }}>
      <input
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        placeholder="Nome"
        style={{ padding: 8, width: "100%", marginBottom: 8 }}
      />

      <input
        value={cpf}
        onChange={(e) => setCpf(e.target.value)}
        placeholder="CPF"
        style={{ padding: 8, width: "100%", marginBottom: 8 }}
      />

      <input
        value={creci}
        onChange={(e) => setCreci(e.target.value)}
        placeholder="CRECI"
        style={{ padding: 8, width: "100%", marginBottom: 8 }}
      />

      <input
        value={instagramHandle}
        onChange={(e) => setInstagramHandle(e.target.value)}
        placeholder="@instagram"
        style={{ padding: 8, width: "100%", marginBottom: 8 }}
      />

      <button
        onClick={handleSave}
        style={{
          padding: "10px 16px",
          background: "#003c8f",
          color: "white",
          borderRadius: 6,
          border: "none",
          cursor: "pointer"
        }}
      >
        Salvar
      </button>
    </div>
  );
}