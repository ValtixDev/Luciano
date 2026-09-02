"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { criarClienteServidor } from "@/lib/supabase/server";

export type EstadoPost = { erro?: string };

const texto = (f: FormData, campo: string) => {
  const v = f.get(campo);
  return typeof v === "string" ? v.trim() : "";
};

function gerarSlug(valor: string) {
  return valor
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function salvarPost(
  _anterior: EstadoPost,
  formData: FormData,
): Promise<EstadoPost> {
  const sb = await criarClienteServidor();
  if (!sb) return { erro: "Supabase não configurado." };

  const titulo = texto(formData, "titulo");
  if (!titulo) return { erro: "O título é obrigatório." };

  const status = texto(formData, "status") || "rascunho";
  const publicadoEm = texto(formData, "publicadoEm");

  const registro = {
    slug: texto(formData, "slug") || gerarSlug(titulo),
    titulo,
    resumo: texto(formData, "resumo"),
    conteudo: texto(formData, "conteudo"),
    capa_path: texto(formData, "capaPath") || null,
    categoria: texto(formData, "categoria") || "Mercado",
    autor: texto(formData, "autor") || "Luciano Góis",
    seo_title: texto(formData, "seoTitle") || null,
    seo_description: texto(formData, "seoDescription") || null,
    status,
    // Publicar sem data deixaria o artigo fora da ordenação do blog.
    publicado_em:
      publicadoEm || (status === "publicado" ? new Date().toISOString().slice(0, 10) : null),
  };

  const slugOriginal = texto(formData, "slugOriginal");
  const { error } = slugOriginal
    ? await sb.from("posts").update(registro).eq("slug", slugOriginal)
    : await sb.from("posts").insert(registro);

  if (error) {
    if (error.code === "23505") return { erro: "Já existe um artigo com esse slug." };
    if (error.code === "42501") {
      return { erro: "Sua conta não tem permissão de escrita. Confira a tabela `admins`." };
    }
    return { erro: `Não foi possível salvar: ${error.message}` };
  }

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  revalidatePath("/");
  redirect("/admin/blog");
}

export async function excluirPost(formData: FormData) {
  const sb = await criarClienteServidor();
  if (!sb) return;

  const slug = String(formData.get("slug") ?? "");
  if (!slug) return;

  await sb.from("posts").delete().eq("slug", slug);
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  redirect("/admin/blog");
}
