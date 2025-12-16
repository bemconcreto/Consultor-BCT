"use client";

export default function EmailPasswordForm() {
  return (
    <form className="space-y-4">
      <div>
        <label className="block text-sm text-gray-700 mb-1">
          E-mail
        </label>
        <input
          type="email"
          placeholder="seu@email.com"
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-bc-brown"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-700 mb-1">
          Senha
        </label>
        <input
          type="password"
          placeholder="••••••••"
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-bc-brown"
        />
      </div>

      <button
        type="submit"
        className="w-full py-3 rounded-lg bg-bc-brown text-white font-semibold hover:bg-bc-brown2 transition"
      >
        Entrar
      </button>
    </form>
  );
}