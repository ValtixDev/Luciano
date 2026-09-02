export const site = {
  nome: "Luciano Góis",
  razao: "Luciano Góis Negócios Imobiliários",
  creci: "CRECI/AL 1983/5946J",
  telefoneExibicao: "(82) 98147-8085",
  whatsapp: "5582981478085",
  instagram: "@lucianogoisimoveis",
  instagramUrl: "https://instagram.com/lucianogoisimoveis",
  endereco: {
    rua: "Rua José Cabral Acioli, Sala 12",
    bairro: "Jatiúca",
    cidade: "Maceió",
    estado: "AL",
  },
  // TODO: trocar pelo domínio definitivo antes do deploy
  url: "https://lucianogois.com.br",
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
