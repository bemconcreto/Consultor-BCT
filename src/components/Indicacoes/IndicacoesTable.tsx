export default function IndicacoesTable({ indicacoes, loading, page, pages, setPage }) {
  if (loading) return <p>Carregando tabela...</p>;

  return (
    <div className="table-box">
      <table>
        <thead>
          <tr>
            <th>Conta</th>
            <th>Status</th>
            <th>Data</th>
          </tr>
        </thead>

        <tbody>
          {indicacoes.map((i) => (
            <tr key={i.id}>
              <td>{i.accountId}</td>
              <td>{i.status}</td>
              <td>{new Date(i.createdAt).toLocaleString("pt-BR")}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>
          ⬅️
        </button>

        <span>
          Página {page} de {pages}
        </span>

        <button disabled={page === pages} onClick={() => setPage(page + 1)}>
          ➡️
        </button>
      </div>
    </div>
  );
}