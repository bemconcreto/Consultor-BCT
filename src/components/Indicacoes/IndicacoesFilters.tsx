export default function IndicacoesFilters({ status, setStatus }) {
  return (
    <div className="filters">
      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="">Todos</option>
        <option value="pendente">Pendentes</option>
        <option value="comprado">Convertidos</option>
      </select>
    </div>
  );
}