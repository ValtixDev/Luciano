import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Assistente } from "@/components/assistente";

/** Chrome do site público. O /admin fica fora deste grupo, sem header nem footer. */
export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <SiteHeader />
      {/* bg-offwhite: em páginas curtas o main cresce por flex-1, e sem fundo
          próprio ele exporia o branco do body como uma faixa antes do rodapé. */}
      <main className="flex-1 bg-offwhite">{children}</main>
      <SiteFooter />
      <Assistente />
    </>
  );
}
