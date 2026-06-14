const CEREBRO_API_URL = process.env.CEREBRO_API_URL ?? "https://cerebro.bemconcreto.com";

export type DocumentoItem = { nome: string; url: string };

export type DocumentosImovel = {
  matricula?: DocumentoItem[];
  contratos?: DocumentoItem[];
  tokenizacao?: DocumentoItem[];
  relatorios?: DocumentoItem[];
  auditorias?: DocumentoItem[];
};

export const DOCUMENTO_CATEGORIA_LABELS: Record<keyof DocumentosImovel, string> = {
  matricula: "Matrícula",
  contratos: "Contratos",
  tokenizacao: "Tokenização",
  relatorios: "Relatórios",
  auditorias: "Auditorias",
};

export type Imovel = {
  id: number;
  slug: string;
  nome: string;
  localizacao: string;
  descricao: string | null;
  valorCompra: number;
  valorMercado: number;
  valorizacaoAcumulada: number;
  percentualPool: number;
  status: string;
  imagemUrl: string | null;
  documentos: DocumentosImovel | null;
};

export async function getImoveis(): Promise<Imovel[]> {
  try {
    const res = await fetch(`${CEREBRO_API_URL}/api/public/imoveis`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    console.error("Erro ao buscar imóveis do CEREBRO", err);
    return [];
  }
}

export async function getImovelBySlug(slug: string): Promise<Imovel | null> {
  try {
    const res = await fetch(`${CEREBRO_API_URL}/api/public/imoveis/${slug}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error("Erro ao buscar imóvel do CEREBRO", err);
    return null;
  }
}
