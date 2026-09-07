import type { NomeIcone } from "@/components/admin/icones";

export type ItemNav = {
  href: string;
  label: string;
  icone: NomeIcone;
  exato?: boolean;
};

/** Estrutura do menu, compartilhada pelo trilho e pela gaveta do celular. */
export const grupos: { titulo: string; itens: ItemNav[] }[] = [
  {
    titulo: "Operação",
    itens: [
      { href: "/admin", label: "Dashboard", icone: "dashboard", exato: true },
      { href: "/admin/imoveis", label: "Imóveis", icone: "imoveis" },
      { href: "/admin/leads", label: "Leads", icone: "leads" },
    ],
  },
  {
    titulo: "Conteúdo",
    itens: [{ href: "/admin/blog", label: "Blog", icone: "blog" }],
  },
  {
    titulo: "Sistema",
    itens: [
      { href: "/admin/integracoes", label: "Integrações", icone: "integracoes" },
      { href: "/admin/configuracoes", label: "Configurações", icone: "configuracoes" },
    ],
  },
];

export function estaAtivo(pathname: string, href: string, exato?: boolean) {
  return exato ? pathname === href : pathname.startsWith(href);
}
