import { clientePublico } from "@/lib/supabase/publico";
import { CAMPOS_IMOVEL, mapearImovel, type LinhaImovel } from "@/lib/supabase/mapeadores";
import type { Imovel, TipoImovel } from "@/types";

export const tipoLabel: Record<TipoImovel, string> = {
  apartamento: "Apartamento",
  casa: "Casa",
  terreno: "Terreno",
  comercial: "Comercial",
  lancamento: "Lançamento",
};

export const estagioLabel = {
  pronto: "Pronto para morar",
  em_construcao: "Em construção",
  na_planta: "Na planta",
} as const;

export const statusLabel = {
  disponivel: "Disponível",
  reservado: "Reservado",
  vendido: "Vendido",
  alugado: "Alugado",
  inativo: "Inativo",
} as const;

export const ordenacoes = {
  recentes: "Mais recentes",
  destaque: "Em destaque",
  maior_preco: "Maior preço",
  menor_preco: "Menor preço",
} as const;

export type Ordenacao = keyof typeof ordenacoes;

export type FiltroImoveis = {
  q?: string;
  finalidade?: string;
  tipo?: string;
  bairro?: string;
  quartos?: string;
  vagas?: string;
  precoMin?: string;
  precoMax?: string;
  estagio?: string;
  ordem?: string;
};

const num = (v?: string) => {
  const n = Number(v);
  return v && Number.isFinite(n) ? n : null;
};

/**
 * Recorte público: espelha exatamente a policy de RLS do anônimo.
 * Mantê-los idênticos evita a classe de bug em que a consulta pede algo que o
 * banco silenciosamente recusa e a página aparece vazia sem explicação.
 */
function consultaPublica(sb: NonNullable<ReturnType<typeof clientePublico>>) {
  return sb
    .from("imoveis")
    .select(CAMPOS_IMOVEL)
    .eq("status", "disponivel")
    .eq("publicar_site", true)
    .eq("is_placeholder", false);
}

export async function destaques(limite = 3): Promise<Imovel[]> {
  const sb = clientePublico();
  if (!sb) return [];

  const { data } = await consultaPublica(sb)
    .eq("destaque", true)
    .order("atualizado_em", { ascending: false })
    .limit(limite);

  return (data as LinhaImovel[] | null)?.map(mapearImovel) ?? [];
}

export async function buscarPorSlug(slug: string): Promise<Imovel | null> {
  const sb = clientePublico();
  if (!sb) return null;

  const { data } = await consultaPublica(sb).eq("slug", slug).maybeSingle();
  return data ? mapearImovel(data as LinhaImovel) : null;
}

export async function relacionados(imovel: Imovel, limite = 3): Promise<Imovel[]> {
  const sb = clientePublico();
  if (!sb) return [];

  // Mesmo bairro primeiro; completa com o mesmo tipo se faltar.
  const { data: mesmoBairro } = await consultaPublica(sb)
    .eq("bairro", imovel.bairro)
    .neq("id", imovel.id)
    .limit(limite);

  const lista = ((mesmoBairro as LinhaImovel[] | null) ?? []).map(mapearImovel);
  if (lista.length >= limite) return lista.slice(0, limite);

  const jaTem = [imovel.id, ...lista.map((i) => i.id)];
  const { data: mesmoTipo } = await consultaPublica(sb)
    .eq("tipo", imovel.tipo)
    .not("id", "in", `(${jaTem.join(",")})`)
    .limit(limite - lista.length);

  return [...lista, ...((mesmoTipo as LinhaImovel[] | null) ?? []).map(mapearImovel)];
}

export async function listarBairros(): Promise<string[]> {
  const sb = clientePublico();
  if (!sb) return [];

  const { data } = await sb
    .from("imoveis")
    .select("bairro")
    .eq("status", "disponivel")
    .eq("publicar_site", true)
    .eq("is_placeholder", false);

  const bairros = (data as { bairro: string }[] | null)?.map((l) => l.bairro) ?? [];
  return [...new Set(bairros)].sort((a, b) => a.localeCompare(b, "pt-BR"));
}

export async function todosSlugs(): Promise<{ slug: string }[]> {
  const sb = clientePublico();
  if (!sb) return [];

  const { data } = await sb
    .from("imoveis")
    .select("slug")
    .eq("status", "disponivel")
    .eq("publicar_site", true)
    .eq("is_placeholder", false);

  return (data as { slug: string }[] | null) ?? [];
}

export async function filtrar(filtro: FiltroImoveis): Promise<Imovel[]> {
  const sb = clientePublico();
  if (!sb) return [];

  let consulta = consultaPublica(sb);

  // Vírgula e parênteses são separadores na sintaxe do PostgREST.
  const termo = filtro.q?.trim().replace(/[,()]/g, " ");
  if (termo) {
    const alvo = `%${termo}%`;
    consulta = consulta.or(
      `titulo.ilike.${alvo},bairro.ilike.${alvo},cidade.ilike.${alvo},codigo.ilike.${alvo},descricao_curta.ilike.${alvo}`,
    );
  }

  if (filtro.finalidade) consulta = consulta.contains("finalidade", [filtro.finalidade]);
  if (filtro.tipo) consulta = consulta.eq("tipo", filtro.tipo);
  if (filtro.bairro) consulta = consulta.eq("bairro", filtro.bairro);
  if (filtro.estagio) consulta = consulta.eq("estagio", filtro.estagio);

  const quartos = num(filtro.quartos);
  if (quartos !== null) consulta = consulta.gte("quartos", quartos);

  const vagas = num(filtro.vagas);
  if (vagas !== null) consulta = consulta.gte("vagas", vagas);

  const precoMin = num(filtro.precoMin);
  const precoMax = num(filtro.precoMax);
  if (precoMin !== null || precoMax !== null) {
    // "Sob consulta" não tem preço; some quando o visitante define faixa.
    consulta = consulta.not("preco", "is", null);
    if (precoMin !== null) consulta = consulta.gte("preco", precoMin);
    if (precoMax !== null) consulta = consulta.lte("preco", precoMax);
  }

  const ordem = (filtro.ordem ?? "recentes") as Ordenacao;
  if (ordem === "maior_preco") {
    consulta = consulta.order("preco", { ascending: false, nullsFirst: false });
  } else if (ordem === "menor_preco") {
    consulta = consulta.order("preco", { ascending: true, nullsFirst: false });
  } else if (ordem === "destaque") {
    consulta = consulta
      .order("destaque", { ascending: false })
      .order("atualizado_em", { ascending: false });
  } else {
    consulta = consulta.order("atualizado_em", { ascending: false });
  }

  const { data } = await consulta;
  return (data as LinhaImovel[] | null)?.map(mapearImovel) ?? [];
}
