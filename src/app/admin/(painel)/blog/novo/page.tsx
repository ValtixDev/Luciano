import type { Metadata } from "next";
import { FormularioPost } from "@/components/admin/formulario-post";
import { PageHeader } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Novo artigo" };

export default function NovoArtigoPage() {
  return (
    <>
      <PageHeader
        titulo="Novo artigo"
        descricao="O artigo publicado entra no blog, na home e no sitemap automaticamente."
      />
      <FormularioPost />
    </>
  );
}
