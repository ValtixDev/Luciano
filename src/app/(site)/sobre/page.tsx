import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { BotaoLink, Seta } from "@/components/ui/button";
import { site, whatsappUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Sobre Luciano Góis",
  description:
    "Mais de 20 anos de atuação no mercado imobiliário de Maceió e região, com atendimento pessoal do primeiro contato à negociação.",
  alternates: { canonical: "/sobre" },
};

const pilares = [
  {
    titulo: "Leitura de mercado",
    texto:
      "Acompanhamento próximo de preço, oferta e valorização em cada região de Maceió e do Litoral Norte.",
  },
  {
    titulo: "Atendimento pessoal",
    texto:
      "Do primeiro contato à assinatura do contrato, sempre com interlocução direta — sem intermediários.",
  },
  {
    titulo: "Seleção criteriosa",
    texto:
      "Imóveis apresentados por adequação ao objetivo do cliente, seja moradia, investimento ou patrimônio.",
  },
];

export default function SobrePage() {
  return (
    <>
      <PageHero
        eyebrow="Sobre"
        titulo={
          <>
            Mais de duas décadas no
            <br className="hidden sm:block" /> mercado imobiliário alagoano.
          </>
        }
        texto={site.descricao}
      />

      <section className="py-16 sm:py-24 lg:py-28">
        <div className="container-page grid items-start gap-16 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal className="relative">
            <div className="absolute -inset-6 rounded-[3rem] border border-sand-dark" />
            <div className="aspect-4/5 overflow-hidden rounded-card">
              <Image
                src={site.fotos.sobre.src}
                alt={site.fotos.sobre.alt}
                width={site.fotos.sobre.largura}
                height={site.fotos.sobre.altura}
                sizes="(min-width: 1024px) 42vw, 100vw"
                priority
                className="h-full w-full object-cover"
              />
            </div>
          </Reveal>
          <Reveal delay={140} className="space-y-5 text-base leading-[1.75] text-muted">
            <p className="display-2 text-navy">
              Vinte anos no mesmo mercado ensinam a ouvir antes de mostrar.
            </p>
            <p>
              Luciano Góis atua no mercado imobiliário de Alagoas há mais de duas
              décadas, com atuação concentrada em Maceió, no Litoral Norte e na
              região metropolitana. O escritório fica na Jatiúca, e é de lá que
              sai cada atendimento — sem equipe intermediária entre o cliente e o
              corretor.
            </p>
            <p>
              Esse tempo de estrada produziu uma convicção simples: imóvel bom não
              é o mais bonito nem o mais barato, é o que resolve o problema de
              quem compra. Por isso a conversa começa pelo objetivo. Quem procura
              moradia decide pela rotina — trajeto, escola, o que existe a pé.
              Quem investe decide por liquidez e pelo que sobra depois do
              condomínio e do IPTU. São critérios distintos, e misturá-los é o
              erro mais comum do mercado.
            </p>
            <p>
              A partir do objetivo, a lista encolhe. Em vez de apresentar tudo o
              que está disponível, o trabalho é descartar o que não serve e
              explicar por quê. Cada opção que sobra vem acompanhada da leitura da
              região, do estágio da obra, da situação documental e das condições
              reais de negociação — inclusive quando a conclusão honesta é que
              aquele não é o momento de comprar.
            </p>
            <p>
              O acompanhamento vai até o fim. Visita, proposta, análise de crédito,
              documentação e assinatura acontecem com a mesma pessoa do outro
              lado. Uma parte relevante dos imóveis é apresentada de forma
              reservada, fora do catálogo público, a pedido dos proprietários —
              esses só chegam por conversa.
            </p>

            <div className="grid gap-4 pt-6 sm:grid-cols-3">
              {[
                { t: "+20 anos", s: "de mercado" },
                { t: "CRECI/AL", s: "1983/5946J" },
                { t: "Maceió", s: "e região" },
              ].map((c) => (
                <div key={c.t} className="rounded-card border border-sand px-5 py-4">
                  <p className="font-display text-xl tracking-tight text-navy">{c.t}</p>
                  <p className="mt-0.5 text-xs text-muted">{c.s}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 pt-5">
              <a
                href={whatsappUrl("Olá Luciano, vim pela página Sobre do site.")}
                target="_blank"
                rel="noopener noreferrer"
                className="group/btn inline-flex h-12 items-center justify-center gap-2.5 rounded-full bg-navy px-7 text-[0.8125rem] font-semibold tracking-[0.02em] text-white transition-colors duration-300 hover:bg-navy-700"
              >
                Falar com Luciano <Seta />
              </a>
              <BotaoLink href="/imoveis" variante="secundaria">
                Ver imóveis <Seta />
              </BotaoLink>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-offwhite py-16 sm:py-24 lg:py-28">
        <div className="container-page">
          <h2 className="display-1 mb-14 max-w-lg text-navy">
            Como conduzo cada negociação
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {pilares.map((p, i) => (
              <Reveal
                key={p.titulo}
                delay={i * 130}
                className="rounded-card border border-sand bg-white p-9 transition-[border-color,box-shadow,transform] duration-500 ease-[var(--ease-out-soft)] hover:-translate-y-1.5 hover:border-sand-dark hover:shadow-[0_24px_60px_-32px] hover:shadow-navy/50"
              >
                <p className="font-display text-3xl tracking-tight text-gold">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="display-3 mt-5 text-navy">{p.titulo}</h3>
                <p className="mt-3.5 text-sm leading-relaxed text-muted">{p.texto}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
