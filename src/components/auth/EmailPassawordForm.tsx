export function EmailPasswordForm() {
  return (
    <div className="space-y-4">
      <div>
        <label>Email</label>
        <input
          type="email"
          placeholder="email@exemplo.com"
          className="input"
        />
      </div>

      <div>
        <label>Senha</label>
        <input
          type="password"
          placeholder="Sua senha"
          className="input"
        />
      </div>

      <button className="w-full py-3 bg-black text-white rounded-xl">
        Entrar
      </button>
    </div>
  );
}