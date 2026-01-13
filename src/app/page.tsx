"use client";

import { Suspense } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

/**
 * Página principal (wrapper)
 * ⚠️ Obrigatório usar Suspense aqui
 */
export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <LoginContent />
    </Suspense>
  );
}

/**
 * Componente de loading simples
 */
function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#ECE9E6]">
      <p className="text-gray-600">Carregando…</p>
    </div>
  );
}

/**
 * Conteúdo real da página
 * ✅ Aqui pode usar useSearchParams
 */
function LoginContent() {
  const searchParams = useSearchParams();

  const callbackUrl =
    searchParams.get("callbackUrl") || "/painel";

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#ECE9E6] px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6 text-center">

        <h1 className="text-2xl font-semibold text-gray-900">
          Consultor BCT
        </h1>

        <p className="text-sm text-gray-600">
          Comece hoje mesmo a gerar renda extra de forma passiva.
          Compartilhe seu link e acompanhe sua evolução como consultor BCT.
        </p>

        <button
          onClick={() => signIn("google", { callbackUrl })}
          className="w-full py-3 rounded-lg bg-black text-white font-medium"
        >
          Entrar com Google
        </button>

        <p className="text-xs text-[#8D6E63] font-semibold">
          ⚠️ Não esqueça de se certificar — isso dobra a sua comissão!
        </p>

      </div>
    </div>
  );
}