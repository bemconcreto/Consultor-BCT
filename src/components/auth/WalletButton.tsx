"use client";

export default function WalletButton() {
  return (
    <button
      type="button"
      className="w-full py-3 rounded-lg bg-black text-white font-semibold hover:opacity-90 transition"
      onClick={() => alert("Login com carteira em breve")}
    >
      Entrar com carteira
    </button>
  );
}