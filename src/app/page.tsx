"use client";

import { signIn } from "next-auth/react";

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#ECE9E6] px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-10 space-y-6 text-center">

        {/* TÍTULO */}
        <h1 className="text-2xl font-semibold text-gray-900">
          Consultor BCT
        </h1>

        {/* SUBTÍTULO */}
        <p className="text-sm text-gray-600 leading-relaxed">
          Comece hoje mesmo a ter renda extra de forma passiva.
          Compartilhe seu link e acompanhe o seu crescimento como
          consultor BCT.
        </p>

        {/* BOTÃO GOOGLE */}
        <button
          onClick={() => signIn("google", { callbackUrl: "/painel" })}
          className="w-full py-3 rounded-lg bg-black text-white font-medium hover:opacity-90 transition"
        >
          Entrar com Google
        </button>

        {/* ALERTA CERTIFICAÇÃO */}
        <p className="text-xs text-[#8D6E63] font-medium">
          ⚠️ Não esqueça de se certificar, isso dobra a sua comissão!
        </p>

      </div>
    </div>
  );
}