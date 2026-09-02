import type { Metadata } from "next";
import { PropertyForm } from "@/components/admin/property-form";
import { PageHeader } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Novo imóvel" };

export default function NovoImovelPage() {
  return (
    <>
      <PageHeader
        titulo="Novo imóvel"
        descricao="Um cadastro alimenta o catálogo, a página própria, o SEO e o feed dos portais."
      />
      <PropertyForm />
    </>
  );
}
