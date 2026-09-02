export type PostInstagram = {
  id: string;
  /** Caminho em /public. `null` mantém o espaço reservado. */
  src: string | null;
  /** Dimensões reais do arquivo — o Next usa para reservar espaço e otimizar. */
  largura: number;
  altura: number;
  alt: string;
  /** Link da publicação. Sem ele, o card aponta para o perfil. */
  href: string | null;
};

/**
 * Grade da seção "Acompanhe o mercado comigo".
 * Artes originais em PNG (1,2–3,8 MB) foram reduzidas para 1240px de altura
 * e convertidas em JPEG q82 antes de entrar em /public.
 */
export const postsInstagram: PostInstagram[] = [
  {
    id: "ig1",
    src: "/instagram/port-ville-ponta-verde.webp",
    largura: 998,
    altura: 1240,
    alt: "Port Ville: investimento rentável na Ponta Verde, unidades a partir de R$ 330.000",
    href: null,
  },
  {
    id: "ig2",
    src: "/instagram/voce-paga-aluguel.webp",
    largura: 929,
    altura: 1240,
    alt: "Você paga aluguel? Parcelas a partir de R$ 699 para garantir o seu apartamento, com descontos de até R$ 55 mil e zero ITBI",
    href: null,
  },
  {
    id: "ig3",
    src: "/instagram/investir-litoral-alagoas.webp",
    largura: 968,
    altura: 1240,
    alt: "Investir no litoral de Alagoas é garantir valorização real do seu dinheiro",
    href: null,
  },
  {
    id: "ig4",
    src: "/instagram/onde-estamos-localizados.webp",
    largura: 931,
    altura: 1240,
    alt: "Onde estamos localizados: Rua José Cabral Acioli, sala 12, Jatiúca, Maceió/AL",
    href: null,
  },
];
