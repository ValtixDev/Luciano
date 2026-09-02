import { criarClienteServidor } from "./server";
import {
  CAMPOS_IMOVEL,
  CAMPOS_IMOVEL_RESUMO,
  mapearImovel,
  type LinhaImovel,
} from "./mapeadores";
import type { Imovel, Lead, Post } from "@/types";

/**
 * Consultas do painel. Usam o cliente com sessão, então enxergam tudo o que as
 * policies de admin permitem — inclusive imóveis marcados como placeholder,
 * que o site público não mostra.
 */

export async function listarImoveisAdmin(limite?: number): Promise<Imovel[]> {
  const sb = await criarClienteServidor();
  if (!sb) return [];

  const { data } = await sb
    .from("imoveis")
    .select(CAMPOS_IMOVEL_RESUMO)
    .order("atualizado_em", { ascending: false })
    .limit(limite ?? 200);

  return (data as LinhaImovel[] | null)?.map(mapearImovel) ?? [];
}

export async function buscarImovelAdmin(id: string): Promise<Imovel | null> {
  const sb = await criarClienteServidor();
  if (!sb) return null;

  const { data } = await sb.from("imoveis").select(CAMPOS_IMOVEL).eq("id", id).maybeSingle();
  return data ? mapearImovel(data as LinhaImovel) : null;
}

type LinhaLead = {
  id: string;
  nome: string;
  telefone: string | null;
  email: string | null;
  mensagem: string | null;
  origem: string;
  status: string;
  criado_em: string;
  imovel: { slug: string; titulo: string } | null;
};

export async function listarLeadsAdmin(status?: string): Promise<Lead[]> {
  const sb = await criarClienteServidor();
  if (!sb) return [];

  let consulta = sb
    .from("leads")
    .select("id, nome, telefone, email, mensagem, origem, status, criado_em, imovel:imoveis(slug, titulo)")
    .order("criado_em", { ascending: false });

  if (status) consulta = consulta.eq("status", status);

  const { data } = await consulta;

  return ((data as unknown as LinhaLead[] | null) ?? []).map((l) => ({
    id: l.id,
    nome: l.nome,
    telefone: l.telefone ?? "",
    email: l.email,
    mensagem: l.mensagem ?? "",
    imovelSlug: l.imovel?.slug ?? null,
    imovelTitulo: l.imovel?.titulo ?? null,
    origem: l.origem as Lead["origem"],
    status: l.status as Lead["status"],
    criadoEm: l.criado_em,
  }));
}

export async function listarPostsAdmin(): Promise<(Post & { status: string })[]> {
  const sb = await criarClienteServidor();
  if (!sb) return [];

  const { data } = await sb
    .from("posts")
    .select("slug, titulo, resumo, capa_path, categoria, autor, status, publicado_em")
    .order("publicado_em", { ascending: false, nullsFirst: false });

  return (
    (data as
      | {
          slug: string;
          titulo: string;
          resumo: string;
          capa_path: string | null;
          categoria: string;
          autor: string;
          status: string;
          publicado_em: string | null;
        }[]
      | null) ?? []
  ).map((p) => ({
    slug: p.slug,
    titulo: p.titulo,
    resumo: p.resumo,
    conteudo: [],
    capa: p.capa_path
      ? { src: p.capa_path, largura: 1600, altura: 1000, alt: p.titulo }
      : null,
    categoria: p.categoria as Post["categoria"],
    autor: p.autor,
    publicadoEm: (p.publicado_em ?? "").slice(0, 10),
    tempoLeitura: 0,
    isPlaceholder: false,
    status: p.status,
  }));
}

export async function metricasPainel() {
  const sb = await criarClienteServidor();
  if (!sb) {
    return { imoveisAtivos: 0, emDestaque: 0, leadsRecebidos: 0, leadsNovos: 0, postsPublicados: 0 };
  }

  // `head: true` traz só a contagem, sem transferir linha nenhuma.
  const contar = async (tabela: string, filtros: Record<string, unknown> = {}) => {
    let c = sb.from(tabela).select("*", { count: "exact", head: true });
    for (const [coluna, valor] of Object.entries(filtros)) c = c.eq(coluna, valor);
    const { count } = await c;
    return count ?? 0;
  };

  const [imoveisAtivos, emDestaque, leadsRecebidos, leadsNovos, postsPublicados] =
    await Promise.all([
      contar("imoveis", { status: "disponivel" }),
      contar("imoveis", { destaque: true }),
      contar("leads"),
      contar("leads", { status: "novo" }),
      contar("posts", { status: "publicado" }),
    ]);

  return { imoveisAtivos, emDestaque, leadsRecebidos, leadsNovos, postsPublicados };
}

export type PostAdmin = {
  slug: string;
  titulo: string;
  resumo: string;
  conteudo: string;
  capaPath: string | null;
  categoria: string;
  autor: string;
  status: string;
  publicadoEm: string;
  seoTitle: string;
  seoDescription: string;
};

export async function buscarPostAdmin(slug: string): Promise<PostAdmin | null> {
  const sb = await criarClienteServidor();
  if (!sb) return null;

  const { data } = await sb
    .from("posts")
    .select(
      "slug, titulo, resumo, conteudo, capa_path, categoria, autor, status, publicado_em, seo_title, seo_description",
    )
    .eq("slug", slug)
    .maybeSingle();

  if (!data) return null;

  const l = data as Record<string, string | null>;
  return {
    slug: l.slug ?? "",
    titulo: l.titulo ?? "",
    resumo: l.resumo ?? "",
    conteudo: l.conteudo ?? "",
    capaPath: l.capa_path,
    categoria: l.categoria ?? "Mercado",
    autor: l.autor ?? "Luciano Góis",
    status: l.status ?? "rascunho",
    publicadoEm: (l.publicado_em ?? "").slice(0, 10),
    seoTitle: l.seo_title ?? "",
    seoDescription: l.seo_description ?? "",
  };
}
