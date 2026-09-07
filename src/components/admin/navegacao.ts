/** Estrutura do menu do painel, compartilhada pela barra lateral e pela gaveta. */
export const grupos = [
  {
    titulo: "Operação",
    itens: [
      { href: "/admin", label: "Dashboard", exato: true },
      { href: "/admin/imoveis", label: "Imóveis" },
      { href: "/admin/leads", label: "Leads" },
    ],
  },
  {
    titulo: "Conteúdo",
    itens: [{ href: "/admin/blog", label: "Blog" }],
  },
  {
    titulo: "Sistema",
    itens: [
      { href: "/admin/integracoes", label: "Integrações" },
      { href: "/admin/configuracoes", label: "Configurações" },
    ],
  },
] as const;

export function estaAtivo(pathname: string, href: string, exato?: boolean) {
  return exato ? pathname === href : pathname.startsWith(href);
}
