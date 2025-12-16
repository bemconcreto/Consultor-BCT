"use client";

import EmailPasswordForm from "./EmailPasswordForm";
import GoogleButton from "./GoogleButton";
import WalletButton from "./WalletButton";

export default function LoginCard() {
  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6">

      {/* Título */}
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-semibold text-bc-dark">
          Acesse o Painel do Consultor
        </h1>
        <p className="text-sm text-gray-500">
          Bem Concreto
        </p>
      </div>

      {/* Email + Senha (principal) */}
      <EmailPasswordForm />

      {/* Divisor */}
      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs text-gray-400 uppercase">ou</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {/* Google */}
      <GoogleButton />

      {/* Carteira */}
      <WalletButton />

      {/* Criar conta */}
      <div className="text-center pt-2">
        <a
          href="https://certificacao.bemconcreto.com/cadastro"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-bc-brown hover:underline font-medium"
        >
          Criar conta
        </a>
      </div>
    </div>
  );
}