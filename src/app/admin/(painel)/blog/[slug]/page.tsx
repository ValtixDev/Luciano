import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FormularioPost } from "@/components/admin/formulario-post";
import { AdminButton, PageHeader } from "@/components/admin/ui";
import { buscarPostAdmin } from "@/lib/supabase/painel";
import { excluirPost } from "../acoes";

export const metadata: Metadata = { title: "Editar artigo" };
export const dynamic = "force-dynamic";

export default async function EditarPostPage({
  params,
}: PageProps<"/admin/blog/[slug]">) {
  const { slug } = await params;
  const post = await buscarPostAdmin(slug);
  if (!post) notFound();

  return (
    <>
      <PageHeader
        titulo={post.titulo}
        descricao={`/blog/${post.slug} · ${post.status === "publicado" ? "publicado" : "rascunho"}`}
      />

      <FormularioPost post={post} />

      <form action={excluirPost} className="mt-8 border-t border-sand pt-6">
        <input type="hidden" name="slug" value={post.slug} />
        <p className="max-w-xl text-sm text-muted">
          Excluir remove o artigo definitivamente. Para tirá-lo do ar sem perder
          o texto, mude o status para “Rascunho”.
        </p>
        <AdminButton variante="perigo" type="submit" className="mt-4">
          Excluir artigo
        </AdminButton>
      </form>
    </>
  );
}
