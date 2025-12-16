export type Imovel = {
  id: number;
  nome: string;
  cidade: string;
  status: string;
  categoria: string;
  imagemCapa: string;
  imagens: string[];
  tokenTotal: string;
  descricaoLonga: string;
  documentos: { nome: string; arquivo: string }[];
  valorPago: number;
  valorMercadoHoje: number;
};

export const listaImoveis: Imovel[] = [
  {
    id: 1,
    nome: "Vitta Premium Mogi",
    cidade: "Mogi das Cruzes - SP",
    status: "Tokenizando",
    categoria: "Incorporação",
    imagemCapa: "/imoveis/vitta-premium.jpg",
    imagens: [
      "/imoveis/vitta-premium.jpg",
      "/imoveis/vitta-premium-2.jpg",
      "/imoveis/vitta-premium-3.jpg",
    ],
    tokenTotal: "1.000.000 BCT",
    descricaoLonga: "O Vitta Premium Mogi é um loteamento moderno...",
    documentos: [
      { nome: "Planta do Loteamento", arquivo: "/docs/vitta-planta.pdf" },
      { nome: "Memorial Descritivo", arquivo: "/docs/vitta-memorial.pdf" },
    ],
    valorPago: 3500000,
    valorMercadoHoje: 5200000,
  },
  {
    id: 2,
    nome: "The One Saúde — 10 Unidades",
    cidade: "São Paulo - SP",
    status: "Em breve",
    categoria: "Pronto",
    imagemCapa: "/imoveis/the-one.jpg",
    imagens: [
      "/imoveis/the-one.jpg",
      "/imoveis/the-one-2.jpg",
      "/imoveis/the-one-3.jpg",
    ],
    tokenTotal: "1.000.000 BCT",
    descricaoLonga: "Unidades comerciais premium...",
    documentos: [
      { nome: "Planta Baixa", arquivo: "/docs/theone-planta.pdf" },
      { nome: "Memorial do Empreendimento", arquivo: "/docs/theone-memorial.pdf" },
    ],
    valorPago: 1600000,
    valorMercadoHoje: 2100000,
  },
];

export function getImovelById(id: number) {
  return listaImoveis.find((i) => i.id === id) ?? null;
}