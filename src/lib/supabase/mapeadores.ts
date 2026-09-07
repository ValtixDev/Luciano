import { supabaseUrl } from "./config";
import type { Foto, Imovel, Post } from "@/types";

/** Linha de `imovel_fotos` com o caminho no bucket. */
type LinhaFoto = {
  id: string;
  storage_path: string;
  alt: string | null;
  ordem: number;
  capa: boolean;
  zoom: number | string | null;
  pos_x: number | string | null;
  pos_y: number | string | null;
};

export type LinhaImovel = {
  id: string;
  codigo: string;
  slug: string;
  titulo: string;
  descricao_curta: string;
  descricao?: string;
  finalidade: string[];
  tipo: string;
  status: string;
  estagio: string;
  preco: string | number | null;
  preco_sob_consulta: boolean;
  condominio: string | number | null;
  iptu: string | number | null;
  estado: string;
  cidade: string;
  bairro: string;
  regiao: string;
  latitude: number | null;
  longitude: number | null;
  ocultar_endereco: boolean;
  area_util: string | number | null;
  area_total: string | number | null;
  quartos: number;
  suites: number;
  banheiros: number;
  vagas: number;
  diferenciais: string[];
  destaque: boolean;
  publicar_site: boolean;
  publicar_olx: boolean;
  publicar_zap: boolean;
  is_placeholder: boolean;
  atualizado_em: string;
  imovel_fotos?: LinhaFoto[] | null;
};

/** `numeric` volta do PostgREST como string, para não perder precisão. */
const num = (v: string | number | null) => (v == null ? null : Number(v));

const urlPublica = (caminho: string) =>
  `${supabaseUrl}/storage/v1/object/public/imoveis/${caminho}`;

export function mapearImovel(linha: LinhaImovel): Imovel {
  const fotos: Foto[] = (linha.imovel_fotos ?? [])
    .slice()
    // Capa primeiro; o resto na ordem definida no painel.
    .sort((a, b) => Number(b.capa) - Number(a.capa) || a.ordem - b.ordem)
    .map((f) => ({
      id: f.id,
      caminho: f.storage_path,
      url: urlPublica(f.storage_path),
      alt: f.alt ?? linha.titulo,
      ordem: f.ordem,
      capa: f.capa,
      zoom: Number(f.zoom ?? 1),
      posX: Number(f.pos_x ?? 50),
      posY: Number(f.pos_y ?? 50),
    }));

  return {
    id: linha.id,
    codigo: linha.codigo,
    slug: linha.slug,
    titulo: linha.titulo,
    descricaoCurta: linha.descricao_curta,
    descricao: linha.descricao ?? "",
    finalidade: linha.finalidade as Imovel["finalidade"],
    tipo: linha.tipo as Imovel["tipo"],
    status: linha.status as Imovel["status"],
    estagio: linha.estagio as Imovel["estagio"],
    preco: num(linha.preco),
    precoSobConsulta: linha.preco_sob_consulta,
    condominio: num(linha.condominio),
    iptu: num(linha.iptu),
    estado: linha.estado,
    cidade: linha.cidade,
    bairro: linha.bairro,
    regiao: linha.regiao,
    latitude: linha.latitude,
    longitude: linha.longitude,
    ocultarEndereco: linha.ocultar_endereco,
    areaUtil: num(linha.area_util),
    areaTotal: num(linha.area_total),
    quartos: linha.quartos,
    suites: linha.suites,
    banheiros: linha.banheiros,
    vagas: linha.vagas,
    diferenciais: linha.diferenciais ?? [],
    destaque: linha.destaque,
    publicarSite: linha.publicar_site,
    publicarOlx: linha.publicar_olx,
    publicarZap: linha.publicar_zap,
    isPlaceholder: linha.is_placeholder,
    fotos,
    totalFotos: fotos.length,
    atualizadoEm: linha.atualizado_em.slice(0, 10),
  };
}

export type LinhaPost = {
  slug: string;
  titulo: string;
  resumo: string;
  conteudo: string;
  capa_path: string | null;
  categoria: string;
  autor: string;
  publicado_em: string | null;
};

export function mapearPost(linha: LinhaPost): Post {
  return {
    slug: linha.slug,
    titulo: linha.titulo,
    resumo: linha.resumo,
    // No banco o corpo é um texto só; a UI espera parágrafos separados.
    conteudo: linha.conteudo.split(/\n{2,}/).filter(Boolean),
    capa: linha.capa_path
      ? {
          src: linha.capa_path,
          largura: 1600,
          altura: 1000,
          alt: linha.titulo,
        }
      : null,
    categoria: linha.categoria as Post["categoria"],
    autor: linha.autor,
    publicadoEm: (linha.publicado_em ?? "").slice(0, 10),
    // Estimativa a partir do texto: ~200 palavras por minuto.
    tempoLeitura: Math.max(1, Math.round(linha.conteudo.split(/\s+/).length / 200)),
    isPlaceholder: false,
  };
}

export const CAMPOS_IMOVEL = `
  id, codigo, slug, titulo, descricao_curta, descricao,
  finalidade, tipo, status, estagio,
  preco, preco_sob_consulta, condominio, iptu,
  estado, cidade, bairro, regiao, latitude, longitude, ocultar_endereco,
  area_util, area_total, quartos, suites, banheiros, vagas,
  diferenciais, destaque, publicar_site, publicar_olx, publicar_zap,
  is_placeholder, atualizado_em,
  imovel_fotos ( id, storage_path, alt, ordem, capa, zoom, pos_x, pos_y )
`;

export const CAMPOS_POST = `
  slug, titulo, resumo, conteudo, capa_path, categoria, autor, publicado_em
`;

/**
 * Recorte leve para listagens do painel: sem `descricao` (texto longo) e sem a
 * galeria inteira — só a capa, que é o que a tabela mostra.
 */
export const CAMPOS_IMOVEL_RESUMO = `
  id, codigo, slug, titulo, descricao_curta,
  finalidade, tipo, status, estagio,
  preco, preco_sob_consulta, condominio, iptu,
  estado, cidade, bairro, regiao, latitude, longitude, ocultar_endereco,
  area_util, area_total, quartos, suites, banheiros, vagas,
  diferenciais, destaque, publicar_site, publicar_olx, publicar_zap,
  is_placeholder, atualizado_em,
  imovel_fotos ( id, storage_path, alt, ordem, capa, zoom, pos_x, pos_y )
`;
