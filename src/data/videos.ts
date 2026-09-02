import type { VideoCurto } from "@/types";

/**
 * Vídeos verticais da seção "Conteúdos".
 * Os pôsteres são o primeiro quadro de cada arquivo — sem eles o navegador
 * precisaria baixar parte do .mp4 só para desenhar a capa.
 *
 * TODO: títulos e descrições foram escritos a partir do quadro inicial de cada
 * vídeo; conferir com o Luciano se descrevem o conteúdo completo.
 */
export const videos: VideoCurto[] = [
  {
    id: "v1",
    titulo: "Residencial Mirante do Sol",
    descricao: "Luciano apresenta o empreendimento no local.",
    url: "/videos/mirante-do-sol.mp4",
    poster: { src: "/videos/mirante-do-sol.webp", largura: 607, altura: 1080 },
    isPlaceholder: false,
  },
  {
    id: "v2",
    titulo: "Uma das melhores localizações de Maceió",
    descricao: "O que faz a região se destacar para morar e investir.",
    url: "/videos/localizacao-maceio.mp4",
    poster: { src: "/videos/localizacao-maceio.webp", largura: 360, altura: 640 },
    isPlaceholder: false,
  },
  {
    id: "v3",
    titulo: "Litoral de Alagoas",
    descricao: "O cenário por trás da valorização dos imóveis na região.",
    url: "/videos/litoral-alagoas.mp4",
    poster: { src: "/videos/litoral-alagoas.webp", largura: 607, altura: 1080 },
    isPlaceholder: false,
  },
];
