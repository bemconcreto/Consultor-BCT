"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

export default function Page() {
  const searchParams = useSearchParams();

  // 🔑 Se vier callbackUrl, respeita. Senão, painel.
  const callbackUrl =
    searchParams.get("callbackUrl") || "/painel";

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#ECE9E6] px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6 text-center">

        <h1 className="text-2xl font-semibold text-gray-900">
          Consultor BCT
        </h1>

        <p className="text-sm text-gray-600">
          Acesse com sua conta Google para continuar.
        </p>

        <button
          onClick={() =>
            signIn("google", { callbackUrl })
          }
          className="w-full py-3 rounded-lg bg-black text-white font-medium"
        >
          Entrar com Google
        </button>

      </div>
    </div>
  );
}