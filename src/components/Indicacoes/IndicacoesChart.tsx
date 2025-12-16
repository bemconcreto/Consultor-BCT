export default function IndicacoesChart({ indicacoes }) {
  const porDia: Record<string, number> = {};

  indicacoes.forEach((i) => {
    const day = new Date(i.createdAt).toLocaleDateString("pt-BR");
    porDia[day] = (porDia[day] ?? 0) + 1;
  });

  const dias = Object.keys(porDia);
  const valores = Object.values(porDia);

  return (
    <div className="chart-box">
      <h3>Indicações por Dia</h3>

      <div className="chart-bar-container">
        {dias.map((d, index) => (
          <div key={d} className="chart-bar">
            <div
              className="chart-bar-fill"
              style={{ height: valores[index] * 12 }}
            />
            <span className="chart-bar-label">{d}</span>
          </div>
        ))}
      </div>
    </div>
  );
}