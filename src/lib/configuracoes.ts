import { cache } from "react";
import { clientePublico } from "@/lib/supabase/publico";
import { site } from "@/lib/site";

export type Configuracao = {
  nome: string;
  razao: string;
  creci: string;
  telefone: string;
  whatsapp: string;
  whatsappMensagem: string;
  email: string | null;
  instagram: string;
  instagramUrl: string;
  endereco: { rua: string; bairro: string; cidade: string; estado: string };
  textoInstitucional: string;
  logo: string;
  retratoHero: string;
  retratoSobre: string;
};

/** Valores do código, usados quando o banco não responde ou o campo está vazio. */
const PADRAO: Configuracao = {
  nome: site.nome,
  razao: site.razao,
  creci: site.creci,
  telefone: site.telefoneExibicao,
  whatsapp: site.whatsapp,
  whatsappMensagem: "Olá Luciano, vim pelo site e gostaria de conversar.",
  email: null,
  instagram: site.instagram,
  instagramUrl: site.instagramUrl,
  endereco: { ...site.endereco },
  textoInstitucional: site.descricao,
  logo: "/logo-luciano-gois.webp",
  retratoHero: site.fotos.hero.src,
  retratoSobre: site.fotos.sobre.src,
};

const texto = (v: unknown, alternativa: string) =>
  typeof v === "string" && v.trim() ? v.trim() : alternativa;

/**
 * Configuração vigente do site.
 *
 * `cache` do React garante uma consulta por requisição, mesmo com layout,
 * página e metadata pedindo ao mesmo tempo. Todo campo cai no padrão do código
 * se vier vazio — o site nunca fica sem identidade por falha de banco.
 */
export const obterConfig = cache(async (): Promise<Configuracao> => {
  const sb = clientePublico();
  if (!sb) return PADRAO;

  const { data } = await sb
    .from("configuracoes")
    .select(
      "nome, razao, creci, telefone, whatsapp, whatsapp_mensagem, email, instagram, endereco_rua, endereco_bairro, endereco_cidade, endereco_estado, texto_institucional, logo_path, retrato_hero_path, retrato_sobre_path",
    )
    .maybeSingle();

  if (!data) return PADRAO;

  const l = data as Record<string, string | null>;
  const instagram = texto(l.instagram, PADRAO.instagram);

  return {
    nome: texto(l.nome, PADRAO.nome),
    razao: texto(l.razao, PADRAO.razao),
    creci: texto(l.creci, PADRAO.creci),
    telefone: texto(l.telefone, PADRAO.telefone),
    whatsapp: texto(l.whatsapp, PADRAO.whatsapp),
    whatsappMensagem: texto(l.whatsapp_mensagem, PADRAO.whatsappMensagem),
    email: l.email?.trim() || null,
    instagram,
    instagramUrl: `https://instagram.com/${instagram.replace(/^@/, "")}`,
    endereco: {
      rua: texto(l.endereco_rua, PADRAO.endereco.rua),
      bairro: texto(l.endereco_bairro, PADRAO.endereco.bairro),
      cidade: texto(l.endereco_cidade, PADRAO.endereco.cidade),
      estado: texto(l.endereco_estado, PADRAO.endereco.estado),
    },
    textoInstitucional: texto(l.texto_institucional, PADRAO.textoInstitucional),
    logo: texto(l.logo_path, PADRAO.logo),
    retratoHero: texto(l.retrato_hero_path, PADRAO.retratoHero),
    retratoSobre: texto(l.retrato_sobre_path, PADRAO.retratoSobre),
  };
});

/** Monta o link do WhatsApp com o número vigente. */
export function linkWhatsapp(config: Configuracao, mensagem?: string) {
  const base = `https://wa.me/${config.whatsapp}`;
  return `${base}?text=${encodeURIComponent(mensagem ?? config.whatsappMensagem)}`;
}

export function enderecoCompleto(config: Configuracao) {
  const e = config.endereco;
  return `${e.rua}, ${e.bairro}, ${e.cidade} - ${e.estado}`;
}
