"use client";

import { useState } from "react";

export default function LinkDivulgacaoCard({
  corretorId,
  nome,
}: {
  corretorId: string;
  nome?: string | null;
}) {
  const link = `https://app.bemconcreto.com/comprar?ref=${corretorId}`;
  const [copied, setCopied] = useState(false);

  async function copiar() {
    try {
      await navigator.clipboard.writeText(link);
    } catch {
      const el = document.createElement("textarea");
      el.value = link;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  const primeiroNome = nome?.split(" ")[0] ?? "Consultor";
  const whatsappMsg = encodeURIComponent(
    `Oi! Invisto em imóveis tokenizados com o BEM e estou gostando muito dos resultados 🏠💰\n\nVocê pode começar a investir a partir de R$ 100. Usa o meu link exclusivo:\n\n${link}`
  );

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#CBA35C]/30 shadow-xl">
      {/* Fundo escuro degradê */}
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(135deg, #141420 0%, #1e1a10 60%, #1a1a2e 100%)" }}
      />
      {/* Brilho dourado topo */}
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#CBA35C]/70 to-transparent" />
      {/* Glows */}
      <div className="pointer-events-none absolute -top-12 -left-12 w-56 h-56 rounded-full bg-[#CBA35C]/10 blur-[60px]" />
      <div className="pointer-events-none absolute -bottom-12 -right-12 w-56 h-56 rounded-full bg-[#CBA35C]/10 blur-[60px]" />

      <div className="relative p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#CBA35C]/15 border border-[#CBA35C]/25 text-[#CBA35C] text-[10px] font-bold uppercase tracking-widest mb-2">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 015.656 0l1.1 1.1a4 4 0 01-5.656 5.656l-4-4a4 4 0 010-5.656" />
              </svg>
              Seu link de divulgação
            </span>
            <h2 className="text-xl font-extrabold text-white leading-tight">
              Compartilhe e <span className="text-[#CBA35C]">ganhe comissão</span>
            </h2>
            <p className="text-white/40 text-xs mt-1">
              Cada investidor que entrar pelo seu link gera comissão para você, {primeiroNome}.
            </p>
          </div>
          {/* Badge código */}
          <div className="shrink-0 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-center">
            <p className="text-[9px] text-white/30 font-bold uppercase tracking-widest mb-0.5">Seu código</p>
            <p className="text-sm font-extrabold text-[#CBA35C] font-mono">{corretorId}</p>
          </div>
        </div>

        {/* Link box */}
        <div className="flex items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10 mb-4">
          <svg className="w-4 h-4 text-white/30 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m1.9-5.556a4 4 0 015.656 0l1.1 1.1a4 4 0 01-5.656 5.656l-4-4a4 4 0 010-5.656" />
          </svg>
          <span className="flex-1 text-xs text-white/50 font-mono truncate">{link}</span>
        </div>

        {/* Botões */}
        <div className="flex flex-col sm:flex-row gap-2">
          {/* Copiar */}
          <button
            onClick={copiar}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-bold text-sm transition-all duration-300"
            style={{
              background: copied
                ? "linear-gradient(135deg, #16a34a, #15803d)"
                : "linear-gradient(135deg, #CBA35C, #E8C96A)",
              color: copied ? "white" : "#101820",
              boxShadow: copied ? "0 4px 20px rgba(22,163,74,0.25)" : "0 4px 20px rgba(203,163,92,0.30)",
            }}
          >
            {copied ? (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Link copiado!
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                Copiar link
              </>
            )}
          </button>

          {/* WhatsApp */}
          <a
            href={`https://wa.me/?text=${whatsappMsg}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-bold text-sm text-white bg-[#25D366]/15 border border-[#25D366]/30 hover:bg-[#25D366]/25 transition-all duration-300"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Compartilhar no WhatsApp
          </a>
        </div>

        {/* Nota comissão */}
        <p className="text-center text-[10px] text-white/20 mt-4">
          Consultor certificado recebe <strong className="text-white/35">4%</strong> de comissão · Não certificado recebe <strong className="text-white/35">2%</strong>
        </p>
      </div>
    </div>
  );
}
