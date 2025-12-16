import { listaImoveis, getImovelBySlug } from "../data";

export default function ImovelDetalhes({
  params,
}: {
  params: { slug: string };
}) {
  console.log("SLUG RECEBIDO:", params.slug);
  console.log("IMÓVEIS:", listaImoveis);

  const imovel = getImovelBySlug(params.slug);

  console.log("IMÓVEL ENCONTRADO:", imovel);

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