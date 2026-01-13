"use client";

import { signIn } from "next-auth/react";

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#ECE9E6] px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6 text-center">

        <h1 className="text-2xl font-semibold text-gray-900">
          Consultor BCT
        </h1>

        <button
          onClick={() => signIn("google", { callbackUrl: "/painel" })}
          className="w-full py-3 rounded-lg bg-black text-white font-medium"
        >
          Entrar com Google
        </button>

      </div>
    </div>
  );
}