import { clientePublico } from "@/lib/supabase/publico";
import { CAMPOS_POST, mapearPost, type LinhaPost } from "@/lib/supabase/mapeadores";
import type { Post } from "@/types";

export async function listarPosts(limite?: number): Promise<Post[]> {
  const sb = clientePublico();
  if (!sb) return [];

  let consulta = sb
    .from("posts")
    .select(CAMPOS_POST)
    .eq("status", "publicado")
    .order("publicado_em", { ascending: false });

  if (limite) consulta = consulta.limit(limite);

  const { data } = await consulta;
  return (data as LinhaPost[] | null)?.map(mapearPost) ?? [];
}

export async function buscarPostPorSlug(slug: string): Promise<Post | null> {
  const sb = clientePublico();
  if (!sb) return null;

  const { data } = await sb
    .from("posts")
    .select(CAMPOS_POST)
    .eq("status", "publicado")
    .eq("slug", slug)
    .maybeSingle();

  return data ? mapearPost(data as LinhaPost) : null;
}
