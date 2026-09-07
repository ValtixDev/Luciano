import { Assistente } from "@/components/assistente";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { obterConfig } from "@/lib/configuracoes";

/** Chrome do site público. O /admin fica fora deste grupo, sem header nem footer. */
export default async function SiteLayout({ children }: LayoutProps<"/">) {
  // Uma consulta por requisição: `obterConfig` é memorizada com cache do React.
  const config = await obterConfig();

  return (
    <>
      <SiteHeader config={config} />
      {/* bg-offwhite: em páginas curtas o main cresce por flex-1, e sem fundo
          próprio ele exporia o branco do body como uma faixa antes do rodapé. */}
      <main className="flex-1 bg-offwhite">{children}</main>
      <SiteFooter config={config} />
      <Assistente config={config} />
    </>
  );
}
