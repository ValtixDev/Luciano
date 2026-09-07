import type { Metadata } from "next";
import { FormularioConfiguracoes } from "@/components/admin/formulario-configuracoes";
import { PageHeader } from "@/components/admin/ui";
import { obterConfig } from "@/lib/configuracoes";

export const metadata: Metadata = { title: "Configurações" };
export const dynamic = "force-dynamic";

export default async function ConfiguracoesPage() {
  const config = await obterConfig();

  return (
    <>
      <PageHeader
        titulo="Configurações"
        descricao="Dados que alimentam o site inteiro: rodapé, contato, assistente e a marca."
      />
      <FormularioConfiguracoes config={config} />
    </>
  );
}
