export default function LoginCard() {
  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 space-y-6">
      <h1 className="text-2xl font-semibold text-center">Entrar</h1>

      {/* Email + Senha */}
      <EmailPasswordForm />

      {/* Google */}
      <GoogleButton />

      {/* Wallet */}
      <WalletButton />

      <button className="w-full text-sm text-bc-brown hover:underline">
        Criar conta
      </button>
    </div>
  );
}