import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PropertyForm } from "@/components/admin/property-form";
import { AdminButton, PageHeader } from "@/components/admin/ui";
import { buscarImovelAdmin } from "@/lib/supabase/painel";
import { excluirImovel } from "../acoes";

export const metadata: Metadata = { title: "Editar imóvel" };

export const dynamic = "force-dynamic";

export default async function EditarImovelPage({
  params,
}: PageProps<"/admin/imoveis/[id]">) {
  const { id } = await params;
  const imovel = await buscarImovelAdmin(id);
  if (!imovel) notFound();

  return (
    <>
      <PageHeader
        titulo={imovel.titulo}
        descricao={`${imovel.codigo} · atualizado em ${new Date(`${imovel.atualizadoEm}T12:00:00`).toLocaleDateString("pt-BR")}`}
      />
      <PropertyForm imovel={imovel} />

      {/* Fora do formulário principal: HTML não permite <form> aninhado. */}
      <form action={excluirImovel} className="mt-8 border-t border-sand pt-6">
        <input type="hidden" name="id" value={imovel.id} />
        <p className="max-w-xl text-sm text-muted">
          Excluir remove o imóvel e suas fotos definitivamente. Para tirá-lo do
          ar sem perder o cadastro, mude o status para “Inativo”.
        </p>
        <AdminButton variante="perigo" type="submit" className="mt-4">
          Excluir imóvel
        </AdminButton>
      </form>
    </>
  );
}
