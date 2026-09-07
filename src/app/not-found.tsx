import { SiteFooter } from "@/components/site-footer";
import { obterConfig } from "@/lib/configuracoes";
import { SiteHeader } from "@/components/site-header";
import { BotaoLink } from "@/components/ui/button";

export default async function NotFound() {
  const config = await obterConfig();

  return (
    <>
      <SiteHeader config={config} />
      <main className="flex flex-1 items-center bg-offwhite pt-18">
        <div className="container-page max-w-xl py-24 text-center">
          <p className="eyebrow text-gold-dim">Erro 404</p>
          <h1 className="display-1 mt-6 text-navy">
            Não encontramos esta página.
          </h1>
          <p className="mt-5 text-base leading-relaxed text-muted">
            O endereço pode ter mudado ou o imóvel já não está disponível no
            catálogo.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <BotaoLink href="/imoveis">Ver imóveis</BotaoLink>
            <BotaoLink href="/" variante="secundaria">
              Voltar ao início
            </BotaoLink>
          </div>
        </div>
      </main>
      <SiteFooter config={config} />
    </>
  );
}
