"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { criarClienteServidor } from "@/lib/supabase/server";

export type EstadoFormulario = { erro?: string };

const texto = (f: FormData, campo: string) => {
  const v = f.get(campo);
  return typeof v === "string" ? v.trim() : "";
};

const numero = (f: FormData, campo: string) => {
  const v = texto(f, campo);
  if (!v) return null;
  const n = Number(v.replace(",", "."));
  return Number.isFinite(n) ? n : null;
};

const inteiro = (f: FormData, campo: string) => numero(f, campo) ?? 0;
const marcado = (f: FormData, campo: string) => f.get(campo) === "on";

/** Fallback de slug a partir do título, quando o campo vem vazio. */
function gerarSlug(valor: string) {
  return valor
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function salvarImovel(
  _anterior: EstadoFormulario,
  formData: FormData,
): Promise<EstadoFormulario> {
  const sb = await criarClienteServidor();
  if (!sb) return { erro: "Supabase não configurado." };

  const titulo = texto(formData, "titulo");
  const codigo = texto(formData, "codigo");
  if (!titulo) return { erro: "O título é obrigatório." };
  if (!codigo) return { erro: "O código interno é obrigatório." };

  const finalidade = [
    marcado(formData, "finalidadeVenda") ? "venda" : null,
    marcado(formData, "finalidadeAluguel") ? "aluguel" : null,
  ].filter(Boolean) as string[];

  if (finalidade.length === 0) {
    return { erro: "Marque ao menos uma finalidade: venda ou aluguel." };
  }

  const sobConsulta = marcado(formData, "precoSobConsulta");
  const preco = numero(formData, "preco");
  if (!sobConsulta && preco === null) {
    return { erro: "Informe o valor ou marque “Valor sob consulta”." };
  }

  const registro = {
    codigo,
    slug: texto(formData, "slug") || gerarSlug(titulo),
    titulo,
    descricao_curta: texto(formData, "descricaoCurta"),
    descricao: texto(formData, "descricao"),
    finalidade,
    tipo: texto(formData, "tipo"),
    status: texto(formData, "status"),
    estagio: texto(formData, "estagio"),
    preco: sobConsulta ? null : preco,
    preco_sob_consulta: sobConsulta,
    condominio: numero(formData, "condominio"),
    iptu: numero(formData, "iptu"),
    estado: texto(formData, "estado") || "AL",
    cidade: texto(formData, "cidade") || "Maceió",
    bairro: texto(formData, "bairro"),
    regiao: texto(formData, "regiao") || "Maceió",
    rua: texto(formData, "rua") || null,
    numero: texto(formData, "numero") || null,
    cep: texto(formData, "cep") || null,
    latitude: numero(formData, "latitude"),
    longitude: numero(formData, "longitude"),
    ocultar_endereco: marcado(formData, "ocultarEndereco"),
    area_util: numero(formData, "areaUtil"),
    area_total: numero(formData, "areaTotal"),
    quartos: inteiro(formData, "quartos"),
    suites: inteiro(formData, "suites"),
    banheiros: inteiro(formData, "banheiros"),
    vagas: inteiro(formData, "vagas"),
    diferenciais: formData.getAll("diferenciais").map(String),
    destaque: marcado(formData, "destaque"),
    publicar_site: marcado(formData, "publicarSite"),
    publicar_olx: marcado(formData, "publicarOlx"),
    publicar_zap: marcado(formData, "publicarZap"),
    seo_title: texto(formData, "seoTitle") || null,
    seo_description: texto(formData, "seoDescription") || null,
    is_placeholder: marcado(formData, "isPlaceholder"),
  };

  const id = texto(formData, "id");
  const { error } = id
    ? await sb.from("imoveis").update(registro).eq("id", id)
    : await sb.from("imoveis").insert(registro);

  if (error) {
    if (error.code === "23505") {
      return { erro: "Já existe um imóvel com esse código ou slug." };
    }
    // 42501 = RLS recusou: a conta não está em `admins`.
    if (error.code === "42501") {
      return { erro: "Sua conta não tem permissão de escrita. Confira a tabela `admins`." };
    }
    return { erro: `Não foi possível salvar: ${error.message}` };
  }

  revalidatePath("/admin/imoveis");
  revalidatePath("/imoveis");
  revalidatePath("/");
  redirect("/admin/imoveis");
}

export async function excluirImovel(formData: FormData) {
  const sb = await criarClienteServidor();
  if (!sb) return;

  const id = texto(formData, "id");
  if (!id) return;

  await sb.from("imoveis").delete().eq("id", id);

  revalidatePath("/admin/imoveis");
  revalidatePath("/imoveis");
  redirect("/admin/imoveis");
}
