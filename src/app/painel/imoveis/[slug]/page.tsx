export const dynamic = "force-dynamic";

import { listaImoveis } from "../data";

type PageProps = {
  params: {
    slug: string;
  };
};

export default function Page({ params }: PageProps) {
  const slug = params.slug;

  console.log("SLUG RECEBIDO:", slug);

  const imovel = listaImoveis.find((i) => i.slug === slug);

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