export type Regiao = {
  nome: string;
  /** Termo enviado ao catálogo ao clicar no card. */
  busca: string;
  texto: string;
  imagem: {
    src: string;
    largura: number;
    altura: number;
    alt: string;
  } | null;
};

export const regioes: Regiao[] = [
  {
    nome: "Maceió",
    busca: "Maceió",
    texto: "Orla, bairros consolidados e novos empreendimentos.",
    imagem: {
      src: "/regioes/maceio.webp",
      largura: 941,
      altura: 1400,
      alt: "Coqueiros na orla de Maceió com o mar calmo e a faixa de prédios da praia ao fundo",
    },
  },
  {
    nome: "Litoral Norte",
    busca: "Litoral Norte",
    texto: "Casas em condomínio, terrenos e imóveis de veraneio.",
    imagem: {
      src: "/regioes/litoral-norte.webp",
      largura: 812,
      altura: 1128,
      alt: "Praia deserta do litoral norte de Alagoas com coqueiros inclinados sobre a areia branca",
    },
  },
  {
    nome: "Região Metropolitana",
    busca: "Região Metropolitana",
    texto: "Custo-benefício para morar e investir.",
    imagem: {
      src: "/regioes/regiao-metropolitana.webp",
      largura: 828,
      altura: 1216,
      alt: "Avenida arborizada vista do alto à noite, cercada por edifícios residenciais iluminados",
    },
  },
];
