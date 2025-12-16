export default function IndicacoesKPIs({ indicacoes = [], loading }) {
  if (loading) return <p>Carregando...</p>;

  // Garantir SEMPRE array
  const lista = Array.isArray(indicacoes) ? indicacoes : [];

  const total = lista.length;
  const pendentes = lista.filter((i) => i.status === "pendente").length;
  const convertidos = lista.filter((i) => i.status === "comprado").length;

  return (
    <div className="kpi-grid">
      <div className="kpi-card">
        <h3>Total de Indicações</h3>
        <p>{total}</p>
      </div>

      <div className="kpi-card">
        <h3>Pendentes</h3>
        <p>{pendentes}</p>
      </div>

      <div className="kpi-card">
        <h3>Convertidos</h3>
        <p>{convertidos}</p>
      </div>
    </div>
  );
}