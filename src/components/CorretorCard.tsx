export default function CorretorCard({ corretor }: { corretor: any }) {
  return (
    <div
      style={{
        background: "#fff",
        padding: 16,
        borderRadius: 8,
        boxShadow: "0 1px 6px rgba(0,0,0,0.06)"
      }}
    >
      <h2>Informações do Corretor</h2>

      <p><strong>ID:</strong> {corretor.corretorId}</p>
      <p><strong>Nome:</strong> {corretor.nome ?? "-"}</p>
      <p><strong>CPF:</strong> {corretor.cpf ?? "-"}</p>
      <p><strong>Creci:</strong> {corretor.creci ?? "-"}</p>
    </div>
  );
}