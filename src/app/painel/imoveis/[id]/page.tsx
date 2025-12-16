import { getImovelById } from "../data";

export default function ImovelDetalhes({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  const imovel = getImovelById(id);

  if (!imovel) {
    return (
      <div style={{ color: "white", padding: 40 }}>
        Imóvel não encontrado.
      </div>
    );
  }

  return (
    <div style={{ color: "white", padding: 40 }}>
      <h1>{imovel.nome}</h1>
      <p>{imovel.cidade}</p>
    </div>
  );
}