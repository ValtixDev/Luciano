import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PropertyCard } from "@/components/property-card";
import { Reveal } from "@/components/reveal";
import { Monogram, PropertyPhoto } from "@/components/property-photo";
import { estiloBotao, Seta } from "@/components/ui/button";
import { formatArea, formatPreco } from "@/lib/format";
import {
  buscarPorSlug,
  estagioLabel,
  relacionados,
  tipoLabel,
  todosSlugs,
} from "@/lib/imoveis";
import { site, whatsappUrl } from "@/lib/site";

// Slugs novos passam a renderizar sob demanda, sem esperar novo build.
export const revalidate = 60;
export const dynamicParams = true;

export async function generateStaticParams() {
  return todosSlugs();
}

export async function generateMetadata({
  params,
}: PageProps<"/imovel/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const imovel = await buscarPorSlug(slug);
  if (!imovel) return { title: "Imóvel não encontrado" };

  const acao = imovel.finalidade.includes("venda") ? "à venda" : "para alugar";
  const title = `${tipoLabel[imovel.tipo]}${
    imovel.quartos ? ` ${imovel.quartos} quartos` : ""
  } ${acao} ${imovel.bairro ? `no ${imovel.bairro}` : ""}`.replace(/\s+/g, " ").trim();

  return {
    title,
    description: imovel.descricaoCurta,
    alternates: { canonical: `/imovel/${imovel.slug}` },
    openGraph: {
      type: "website",
      title: `${title} | ${site.nome}`,
      description: imovel.descricaoCurta,
    },
  };
}

function Spec({ valor, rotulo }: { valor: string; rotulo: string }) {
  return (
    <div className="rounded-card border border-sand bg-white px-5 py-4">
      <p className="num font-display text-2xl tracking-tight text-navy">{valor}</p>
      <p className="mt-1 text-[0.625rem] uppercase tracking-[0.14em] text-muted">
        {rotulo}
      </p>
    </div>
  );
}

export default async function ImovelPage({ params }: PageProps<"/imovel/[slug]">) {
  const { slug } = await params;
  const imovel = await buscarPorSlug(slug);
  if (!imovel) notFound();

  const mensagem = `Olá Luciano, tenho interesse no imóvel ${imovel.titulo} (${imovel.codigo}).`;
  const similares = await relacionados(imovel);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: imovel.titulo,
    description: imovel.descricaoCurta,
    url: `${site.url}/imovel/${imovel.slug}`,
    ...(imovel.preco && !imovel.precoSobConsulta
      ? { offers: { "@type": "Offer", price: imovel.preco, priceCurrency: "BRL" } }
      : {}),
    address: {
      "@type": "PostalAddress",
      addressLocality: imovel.cidade,
      addressRegion: imovel.estado,
      addressCountry: "BR",
      ...(imovel.ocultarEndereco ? {} : { streetAddress: imovel.bairro }),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="bg-offwhite pt-32">
        <nav className="container-page py-5 text-xs text-muted" aria-label="Trilha">
          <Link href="/" className="hover:text-navy">
            Início
          </Link>
          <span className="px-2">/</span>
          <Link href="/imoveis" className="hover:text-navy">
            Imóveis
          </Link>
          <span className="px-2">/</span>
          <Link
            href={`/imoveis?tipo=${imovel.tipo}`}
            className="hover:text-navy"
          >
            {tipoLabel[imovel.tipo]}
          </Link>
          <span className="px-2">/</span>
          <span className="text-graphite">{imovel.bairro}</span>
        </nav>

        {/* GALERIA */}
        <div className="container-page pb-12">
          {/* Altura fixa pelo grid: as duas colunas terminam alinhadas. */}
          <div className="grid gap-3 lg:h-[32rem] lg:grid-cols-[2fr_1fr] lg:grid-rows-2">
            <PropertyPhoto
              seed={0}
              className="aspect-16/10 rounded-card lg:row-span-2 lg:aspect-auto lg:h-full"
              rotulo={imovel.titulo}
            />
            <div className="grid grid-cols-2 gap-3 lg:contents">
              <PropertyPhoto
                seed={1}
                className="aspect-4/3 rounded-card lg:aspect-auto lg:h-full"
              />
              <div className="group relative aspect-4/3 lg:aspect-auto lg:h-full">
                <PropertyPhoto seed={2} className="h-full rounded-card" />
                <div className="absolute inset-0 flex items-center justify-center rounded-card bg-navy-950/60 transition-colors duration-400 group-hover:bg-navy-950/45">
                  <span className="text-sm font-semibold text-white">
                    Ver todas as {imovel.totalFotos} fotos
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="py-12 sm:py-16">
        <div className="container-page grid gap-12 lg:grid-cols-[1fr_360px]">
          <div>
            <p className="eyebrow text-gold">
              {tipoLabel[imovel.tipo]} · {estagioLabel[imovel.estagio]} · {imovel.codigo}
            </p>
            <span className="rule-gold mt-5" />
            <h1 className="display-1 mt-6 text-navy">{imovel.titulo}</h1>
            <p className="mt-4 text-base text-muted">
              {imovel.bairro} · {imovel.cidade} · {imovel.estado}
            </p>
            <p className="num mt-8 font-display text-[2.75rem] leading-none tracking-tight text-graphite">
              {formatPreco(imovel.preco, imovel.precoSobConsulta)}
            </p>
            {(imovel.condominio || imovel.iptu) && (
              <p className="num mt-3 text-sm text-muted">
                {imovel.condominio && `Condomínio ${formatPreco(imovel.condominio)}`}
                {imovel.condominio && imovel.iptu && " · "}
                {imovel.iptu && `IPTU ${formatPreco(imovel.iptu)}`}
              </p>
            )}

            <div className="mt-9 grid grid-cols-2 gap-3 sm:grid-cols-5">
              <Spec valor={String(imovel.quartos)} rotulo="quartos" />
              <Spec valor={String(imovel.suites)} rotulo="suítes" />
              <Spec valor={String(imovel.banheiros)} rotulo="banheiros" />
              <Spec valor={String(imovel.vagas)} rotulo="vagas" />
              <Spec valor={formatArea(imovel.areaUtil ?? imovel.areaTotal)} rotulo="área" />
            </div>

            <div className="mt-12 border-t border-sand pt-10">
              <h2 className="display-2 text-navy">Sobre este imóvel</h2>
              <p className="mt-5 text-base leading-[1.75] text-muted">
                {imovel.descricao}
              </p>
            </div>

            <div className="mt-12 border-t border-sand pt-10">
              <h2 className="display-2 text-navy">Diferenciais</h2>
              <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
                {imovel.diferenciais.map((d) => (
                  <li key={d} className="flex items-center gap-3 border-b border-sand pb-2.5 text-sm text-graphite">
                    <span className="size-1.5 shrink-0 rounded-full bg-gold" />
                    {d}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-12 border-t border-sand pt-10">
              <h2 className="display-2 text-navy">Localização</h2>
              <p className="mt-3 text-sm text-muted">
                {imovel.ocultarEndereco
                  ? `Região aproximada: ${imovel.bairro}, ${imovel.cidade}/${imovel.estado}. O endereço exato é informado no atendimento.`
                  : `${imovel.bairro}, ${imovel.cidade}/${imovel.estado}.`}
              </p>
              <div className="mt-6 flex aspect-21/9 items-center justify-center rounded-card border border-dashed border-sand-dark bg-offwhite">
                <p className="eyebrow text-muted">Mapa — integração pendente</p>
              </div>
            </div>
          </div>

          {/* CTA STICKY */}
          <aside>
            <div className="sticky top-28 rounded-card border border-sand bg-offwhite p-8">
              <div className="flex items-center gap-4">
                <Monogram className="size-14 shrink-0 text-base" />
                <div className="leading-tight">
                  <p className="font-display text-xl tracking-tight text-navy">{site.nome}</p>
                  <p className="text-[0.6875rem] text-muted">{site.creci}</p>
                </div>
              </div>

              <h2 className="display-2 mt-7 text-navy">Interessado neste imóvel?</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                Fale diretamente com o Luciano para agendar uma visita ou receber
                mais informações sobre esta oportunidade.
              </p>

              <a
                href={whatsappUrl(mensagem)}
                target="_blank"
                rel="noopener noreferrer"
                className={`${estiloBotao("primaria", "lg")} mt-7 w-full`}
              >
                Falar com Luciano <Seta />
              </a>
              <Link href="/contato" className={`${estiloBotao("secundaria")} mt-3 w-full`}>
                Enviar mensagem
              </Link>

              <p className="mt-5 border-t border-sand pt-5 text-[0.6875rem] leading-relaxed text-muted">
                Valores e disponibilidade sujeitos a alteração sem aviso prévio.
              </p>
            </div>
          </aside>
        </div>
      </section>

      {similares.length > 0 && (
        <section className="bg-offwhite py-16 sm:py-20 lg:py-24">
          <div className="container-page">
            <h2 className="display-1 mb-12 text-navy">
              Imóveis semelhantes
            </h2>
            <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
              {similares.map((i, idx) => (
                <Reveal key={i.id} delay={idx * 130}>
                  <PropertyCard imovel={i} seed={idx} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
