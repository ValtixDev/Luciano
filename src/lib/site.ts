export const site = {
  nome: "Luciano Góis",
  razao: "Luciano Góis Negócios Imobiliários",
  creci: "CRECI/AL 1983/5946J",
  telefoneExibicao: "(82) 98874-3028",
  whatsapp: "5582988743028",
  instagram: "@lucianogoisimoveis",
  instagramUrl: "https://instagram.com/lucianogoisimoveis",
  endereco: {
    rua: "Rua José Cabral Acioli, Sala 12",
    bairro: "Jatiúca",
    cidade: "Maceió",
    estado: "AL",
  },
  /**
   * Alimenta canonical, Open Graph e sitemap. Em produção vem de
   * NEXT_PUBLIC_SITE_URL; o valor fixo é só o fallback do ambiente local.
   */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://lucianogois.com.br",
  descricao:
    "Compra, venda e investimentos imobiliários em Maceió e região, com mais de 20 anos de experiência no mercado alagoano.",
  fotos: {
    hero: {
      src: "/luciano-gois-retrato.webp",
      largura: 1086,
      altura: 1448,
      alt: "Luciano Góis, corretor de imóveis, sentado com as mãos entrelaçadas no lobby de um edifício em Maceió",
    },
    sobre: {
      src: "/luciano-gois-sobre.webp",
      largura: 1122,
      altura: 1402,
      alt: "Luciano Góis de terno azul-marinho, sorrindo, em um escritório com vista para a cidade",
    },
  },
} as const;

export function whatsappUrl(mensagem?: string) {
  const base = `https://wa.me/${site.whatsapp}`;
  return mensagem ? `${base}?text=${encodeURIComponent(mensagem)}` : base;
}

export const navLinks = [
  { href: "/", label: "Início" },
  { href: "/imoveis", label: "Imóveis" },
  { href: "/sobre", label: "Sobre" },
  { href: "/blog", label: "Blog" },
  { href: "/contato", label: "Contato" },
] as const;
