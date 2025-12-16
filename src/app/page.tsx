"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    await signIn("credentials", {
      email,
      password: senha,
      callbackUrl: "/painel",
    });

    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#ECE9E6] px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6">

        {/* TÍTULO */}
        <h1 className="text-2xl font-semibold text-center text-gray-900">
          Entrar
        </h1>

        {/* LOGIN EMAIL */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">E-mail</label>
            <input
              type="email"
              placeholder="email@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-bc-brown"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Senha</label>
            <input
              type="password"
              placeholder="Sua senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-bc-brown"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-black text-white font-medium hover:opacity-90 transition"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        {/* DIVISOR */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">ou</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* GOOGLE */}
        <button
          onClick={() => signIn("google", { callbackUrl: "/painel" })}
          className="w-full py-3 rounded-lg border border-gray-300 flex items-center justify-center gap-2 hover:bg-gray-50 transition"
        >
          <img src="/icons/google.svg" alt="Google" className="h-5" />
          <span className="font-medium text-gray-700">
            Entrar com Google
          </span>
        </button>

        {/* CARTEIRA */}
        <button
          onClick={() => signIn("wallet", { callbackUrl: "/painel" })}
          className="w-full py-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition font-medium text-gray-700"
        >
          Entrar com carteira
        </button>

        {/* AÇÕES */}
        <div className="pt-4 space-y-3 text-center text-sm">
          <Link
            href="/verificar-email"
            className="block text-gray-500 hover:underline"
          >
            Reenviar e-mail de verificação
          </Link>

          <a
            href="https://certificacao.bemconcreto.com/cadastro"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-3 rounded-lg bg-bc-brown text-white font-medium hover:opacity-90 transition"
          >
            Criar conta
          </a>
        </div>

      </div>
    </div>
  );
}