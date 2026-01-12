"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#ECE9E6]" />}>
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/painel";

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    await signIn("credentials", {
      email,
      password: senha,
      callbackUrl,
    });

    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#ECE9E6] px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6">

        <h1 className="text-2xl font-semibold text-center text-gray-900">
          Entrar
        </h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Senha</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-black text-white font-medium"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">ou</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <button
          onClick={() => signIn("google", { callbackUrl })}
          className="w-full py-3 rounded-lg border border-gray-300"
        >
          Entrar com Google
        </button>

        <button
          onClick={() => signIn("wallet", { callbackUrl })}
          className="w-full py-3 rounded-lg border border-gray-300"
        >
          Entrar com carteira
        </button>

        <div className="pt-4 space-y-3 text-center text-sm">
          <Link href="/verificar-email" className="block text-gray-500">
            Reenviar e-mail de verificação
          </Link>

          <a
            href="https://certificacao.bemconcreto.com/cadastro"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-3 rounded-lg bg-[#8D6E63] text-white font-medium"
          >
            Criar conta
          </a>
        </div>

      </div>
    </div>
  );
}