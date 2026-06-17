"use client";

import { useState, useRef } from "react";
import { Camera, UserCircle } from "lucide-react";

export default function EditProfileForm({ initialCorretor }: { initialCorretor: any }) {
  const [nome, setNome] = useState(initialCorretor.nome ?? "");
  const [cpf, setCpf] = useState(initialCorretor.cpf ?? "");
  const [creci, setCreci] = useState(initialCorretor.creci ?? "");
  const [instagramHandle, setInstagramHandle] = useState(initialCorretor.instagramHandle ?? "");
  const [chavePix, setChavePix] = useState(initialCorretor.chavePix ?? "");
  const [fotoUrl, setFotoUrl] = useState(initialCorretor.fotoUrl ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploadingFoto, setUploadingFoto] = useState(false);
  const [fotoError, setFotoError] = useState("");
  const fotoInputRef = useRef<HTMLInputElement>(null);

  function normalizeInstagram(value: string) {
    return value.toLowerCase().replace("@", "").replace(/\s/g, "");
  }

  async function handleFotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setFotoError("");
    setUploadingFoto(true);

    const fd = new FormData();
    fd.append("file", file);

    try {
      const res = await fetch("/api/corretor/upload-foto", { method: "POST", body: fd });
      const json = await res.json();
      if (json.ok) {
        setFotoUrl(json.url);
      } else {
        setFotoError(json.error ?? "Erro ao enviar foto.");
      }
    } catch {
      setFotoError("Erro de conexão ao enviar foto.");
    } finally {
      setUploadingFoto(false);
      if (fotoInputRef.current) fotoInputRef.current.value = "";
    }
  }

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    await fetch("/api/corretor/update", {
      method: "POST",
      body: JSON.stringify({
        nome,
        cpf,
        creci,
        instagramHandle: normalizeInstagram(instagramHandle),
        chavePix: chavePix.trim(),
        fotoUrl: fotoUrl || undefined,
      }),
      headers: { "Content-Type": "application/json" },
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  const inputClass =
    "w-full px-4 py-2.5 rounded-xl border border-[#E5E7EB] bg-white text-sm text-[#101820] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#CBA35C]/40 focus:border-[#CBA35C] transition";

  const labelClass = "block text-xs font-semibold text-[#6B7280] mb-1.5 uppercase tracking-wide";

  return (
    <div className="flex flex-col gap-6">
      {/* FOTO DE PERFIL */}
      <div className="flex items-center gap-5 pb-6 border-b border-[#E5E7EB]">
        <div
          className="relative group cursor-pointer shrink-0"
          onClick={() => fotoInputRef.current?.click()}
        >
          {fotoUrl ? (
            <img
              src={fotoUrl}
              alt="Foto de perfil"
              className="w-20 h-20 rounded-full object-cover border-2 border-[#CBA35C]/40 shadow-sm"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-[#F7F8F9] border-2 border-dashed border-[#CBA35C]/40 flex items-center justify-center">
              <UserCircle className="w-10 h-10 text-[#CBA35C]/40" />
            </div>
          )}

          <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Camera className="w-5 h-5 text-white" />
          </div>

          {uploadingFoto && (
            <div className="absolute inset-0 rounded-full bg-black/60 flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            </div>
          )}
        </div>

        <div>
          <p className="text-sm font-semibold text-[#101820]">Foto profissional</p>
          <p className="text-xs text-[#9CA3AF] mt-0.5">JPG, PNG ou WebP — máx. 5MB</p>
          <button
            type="button"
            onClick={() => fotoInputRef.current?.click()}
            disabled={uploadingFoto}
            className="mt-2 text-xs font-bold text-[#CBA35C] hover:underline disabled:opacity-50"
          >
            {uploadingFoto ? "Enviando..." : fotoUrl ? "Trocar foto" : "Adicionar foto"}
          </button>
          {fotoError && <p className="mt-1 text-xs text-red-600">{fotoError}</p>}
        </div>

        <input
          ref={fotoInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleFotoUpload}
        />
      </div>

      {/* CAMPOS DO FORMULÁRIO */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Nome completo</label>
          <input className={inputClass} value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Seu nome" />
        </div>
        <div>
          <label className={labelClass}>CPF</label>
          <input className={inputClass} value={cpf} onChange={(e) => setCpf(e.target.value)} placeholder="000.000.000-00" />
        </div>
        <div>
          <label className={labelClass}>CRECI (opcional)</label>
          <input className={inputClass} value={creci} onChange={(e) => setCreci(e.target.value)} placeholder="Número do CRECI" />
        </div>
        <div>
          <label className={labelClass}>Instagram</label>
          <input className={inputClass} value={instagramHandle} onChange={(e) => setInstagramHandle(e.target.value)} placeholder="@seuinstagram" />
        </div>
      </div>

      {/* CHAVE PIX */}
      <div className="rounded-2xl border border-[#CBA35C]/30 bg-[#CBA35C]/5 p-4">
        <label className="block text-xs font-bold text-[#CBA35C] mb-1.5 uppercase tracking-wide">
          Chave PIX para receber comissões
        </label>
        <input
          className="w-full px-4 py-2.5 rounded-xl border border-[#CBA35C]/40 bg-white text-sm text-[#101820] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#CBA35C]/40 focus:border-[#CBA35C] transition"
          value={chavePix}
          onChange={(e) => setChavePix(e.target.value)}
          placeholder="CPF, e-mail, celular ou chave aleatória"
        />
        <p className="text-[11px] text-[#9CA3AF] mt-1.5">
          Informe a chave PIX da sua conta bancária. Ela será usada para receber o pagamento das suas comissões.
        </p>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="self-start flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#CBA35C] to-[#E8C96A] text-[#101820] text-sm font-bold shadow-md shadow-[#CBA35C]/20 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {saving ? "Salvando..." : saved ? "✓ Salvo!" : "Salvar dados"}
      </button>
    </div>
  );
}
