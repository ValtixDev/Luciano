import Image from "next/image";
import Link from "next/link";
import { PropertyCard } from "@/components/property-card";
import { PostCover } from "@/components/post-cover";
import { PropertyPhoto } from "@/components/property-photo";
import { Reveal } from "@/components/reveal";
import { LINK_MAPS, Mapa } from "@/components/mapa";
import { SearchPanel } from "@/components/search-panel";
import { VideoVertical } from "@/components/video-vertical";
import { BotaoLink, Seta } from "@/components/ui/button";
import { listarPosts } from "@/lib/posts";
import { postsInstagram } from "@/data/instagram";
import { regioes } from "@/data/regioes";
import { videos } from "@/data/videos";
import { formatData } from "@/lib/format";
import { destaques } from "@/lib/imoveis";
import { linkWhatsapp, obterConfig } from "@/lib/configuracoes";

/** Cabeçalho de seção — eyebrow, régua dourada e título. */
function TituloSecao({
  eyebrow,
  titulo,
  texto,
  claro = false,
}: {
  eyebrow: string;
  titulo: string;
  texto?: string;
  claro?: boolean;
}) {
  return (
    <div className="max-w-xl">
      <p className={`eyebrow ${claro ? "text-gold" : "text-gold-dim"}`}>{eyebrow}</p>
      <span className="rule-gold mt-4" />
      <h2 className={`display-1 mt-6 ${claro ? "text-white" : "text-navy"}`}>{titulo}</h2>
      {texto && (
        <p className={`lead mt-5 ${claro ? "text-white/65" : "text-muted"}`}>{texto}</p>
      )}
    </div>
  );
}

export const revalidate = 60;

export default async function Home() {
  const [emDestaque, posts, config] = await Promise.all([
    destaques(3),
    listarPosts(3),
    obterConfig(),
  ]);

  return (
    <>
      {/* ---------------------------------------------------------- HERO */}
      <section className="hero-cheio grain relative flex items-center overflow-hidden bg-navy text-white">
        <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_78%_18%,#16437f_0%,#081f4c_45%,#040f28_100%)]" />
        {/* Fecha o hero exatamente em navy-950, que é onde a rampa da próxima
            seção começa — sem isso sobra um fio de emenda. */}
        <div className="container-page relative grid items-center gap-12 pb-20 pt-32 sm:gap-16 sm:py-32 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="max-w-2xl">
            <p
              className="eyebrow animate-fade-in text-gold"
              style={{ animationDelay: "80ms" }}
            >
              Negócios Imobiliários · Maceió/AL
            </p>

            <h1
              className="display-hero animate-fade-up mt-7"
              style={{ animationDelay: "180ms" }}
            >
              Mais de 20 anos encontrando o{" "}
              <em className="not-italic text-gold-soft">imóvel certo</em> para cada
              momento.
            </h1>

            <p
              className="lead animate-fade-up mt-8 max-w-lg text-white/65"
              style={{ animationDelay: "320ms" }}
            >
              Compra, venda e investimentos imobiliários em Maceió e regiões
              circunvizinhas, com experiência, segurança e atendimento próximo.
            </p>

            <div
              className="animate-fade-up mt-10 flex flex-col gap-3 sm:mt-11 sm:flex-row sm:flex-wrap"
              style={{ animationDelay: "440ms" }}
            >
              <BotaoLink href="/imoveis" variante="ouro" tamanho="lg" className="w-full sm:w-auto">
                Explorar imóveis <Seta />
              </BotaoLink>
              <a
                href={linkWhatsapp(
                  config,
                  "Olá Luciano, vim pelo site e gostaria de falar sobre imóveis.",
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="group/btn inline-flex h-14 w-full items-center justify-center gap-2.5 rounded-full border border-white/25 px-9 text-sm font-semibold tracking-[0.02em] transition-colors duration-300 hover:border-gold hover:bg-white/[0.06] sm:w-auto"
              >
                Falar com Luciano
              </a>
            </div>

            <p
              className="animate-fade-in mt-10 inline-flex items-center gap-2.5 text-[0.6875rem] uppercase tracking-[0.2em] text-white/40"
              style={{ animationDelay: "600ms" }}
            >
              <span className="size-1 rounded-full bg-gold" />
              {config.creci}
            </p>
          </div>

          <div
            className="animate-fade-up relative hidden lg:block"
            style={{ animationDelay: "380ms" }}
          >
            <div className="absolute -inset-8 rounded-[2.75rem] border border-white/[0.08]" />
            <div className="absolute -left-4 top-1/2 h-24 w-px -translate-y-1/2 bg-gradient-to-b from-transparent via-gold/50 to-transparent" />
            <div className="aspect-4/5 overflow-hidden rounded-card">
              <Image
                src={config.retratoHero}
                alt={`${config.nome}, corretor de imóveis em Maceió`}
                width={1086}
                height={1448}
                sizes="(min-width: 1024px) 45vw, 100vw"
                priority
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- BUSCADOR */}
      <section className="bg-offwhite pb-24 pt-20">
        <div className="container-page">
          <Reveal className="mb-10">
            <p className="eyebrow text-gold-dim">Busca</p>
            <span className="rule-gold mt-4" />
            <h2 className="display-1 mt-6 max-w-lg text-navy">
              O que você está procurando?
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <SearchPanel />
          </Reveal>
        </div>
      </section>

      {/* ---------------------------------------------------------- DESTAQUES */}
      <section className="py-16 sm:py-24 lg:py-28">
        <div className="container-page">
          <Reveal className="mb-14 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
            <TituloSecao
              eyebrow="Seleção"
              titulo="Oportunidades selecionadas"
              texto="Imóveis escolhidos para diferentes momentos, objetivos e perfis de investimento."
            />
            <BotaoLink href="/imoveis" variante="secundaria" className="shrink-0">
              Ver todos <Seta />
            </BotaoLink>
          </Reveal>

          <div className="grid items-stretch gap-8 md:grid-cols-2 lg:grid-cols-3">
            {emDestaque.map((imovel, i) => (
              <Reveal key={imovel.id} delay={i * 130}>
                <PropertyCard imovel={imovel} seed={i} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- SOBRE */}
      <section className="bg-offwhite py-16 sm:py-24 lg:py-28">
        <div className="container-page grid items-center gap-16 lg:grid-cols-2">
          <Reveal className="relative">
            <div className="absolute -inset-6 rounded-[3rem] border border-sand-dark" />
            {/* Sem max-w: a foto preenche a coluna inteira, ganhando largura à
                direita e altura por consequência do 4:5. */}
            <div className="aspect-4/5 overflow-hidden rounded-card">
              <Image
                src={config.retratoSobre}
                alt={`${config.nome} no escritório em Maceió`}
                width={1122}
                height={1402}
                sizes="(min-width: 1024px) 48vw, 100vw"
                className="h-full w-full object-cover"
              />
            </div>
          </Reveal>

          <Reveal delay={140}>
            <TituloSecao
              eyebrow="Sobre"
              titulo="Mais de duas décadas no mercado imobiliário alagoano."
            />

            <div className="mt-7 space-y-5 text-base leading-[1.75] text-muted">
              <p>
                São mais de 20 anos atuando no mercado imobiliário de Alagoas,
                com foco em Maceió, no Litoral Norte e na região metropolitana.
                O escritório fica na Jatiúca, e o atendimento é conduzido
                pessoalmente — do primeiro contato até a assinatura do contrato.
              </p>
              <p>
                O trabalho começa por entender o objetivo antes de apresentar
                imóveis. Morar, investir ou formar patrimônio pedem critérios
                diferentes, e tratar os três da mesma forma é o que costuma levar
                a uma escolha ruim. A partir daí, a seleção é reduzida ao que
                realmente faz sentido para o seu momento.
              </p>
            </div>

            <div className="mt-10 grid gap-px overflow-hidden rounded-card border border-sand bg-sand sm:grid-cols-3">
              {[
                { t: "+20 anos", s: "de mercado" },
                { t: "CRECI/AL", s: "1983/5946J" },
                { t: "Maceió", s: "e região" },
              ].map((c) => (
                <div key={c.t} className="bg-white px-6 py-5">
                  <p className="font-display text-xl tracking-tight text-navy">{c.t}</p>
                  <p className="mt-1 text-xs text-muted">{c.s}</p>
                </div>
              ))}
            </div>

            <BotaoLink href="/sobre" variante="secundaria" className="mt-9">
              Conheça minha trajetória <Seta />
            </BotaoLink>
          </Reveal>
        </div>
      </section>

      {/* ---------------------------------------------------------- REGIÕES */}
      <section className="py-16 sm:py-24 lg:py-28">
        <div className="container-page">
          <Reveal className="mb-14">
            <TituloSecao eyebrow="Atuação" titulo="Onde atuamos" />
          </Reveal>

          <div className="grid gap-6 md:grid-cols-3">
            {regioes.map((r, i) => (
              <Reveal key={r.nome} delay={i * 130}>
                <Link
                  href={`/imoveis?q=${encodeURIComponent(r.busca)}`}
                  className="group relative block aspect-3/4 overflow-hidden rounded-card"
                >
                  {r.imagem ? (
                    <Image
                      src={r.imagem.src}
                      alt={r.imagem.alt}
                      width={r.imagem.largura}
                      height={r.imagem.altura}
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className="h-full w-full object-cover transition-transform duration-[900ms] ease-[var(--ease-out-soft)] group-hover:scale-[1.06]"
                    />
                  ) : (
                    <PropertyPhoto
                      seed={i}
                      className="h-full w-full transition-transform duration-[900ms] ease-[var(--ease-out-soft)] group-hover:scale-[1.06]"
                      rotulo={r.nome}
                    />
                  )}
                  {/* Escurece a base o bastante para o texto branco passar em contraste. */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(4,15,40,0.95)_0%,rgba(4,15,40,0.82)_24%,rgba(4,15,40,0.38)_48%,rgba(4,15,40,0.04)_78%)]" />

                  <div className="absolute inset-x-0 bottom-0 p-8">
                    <span className="rule-gold origin-left scale-x-0 transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:scale-x-100" />
                    <h3 className="display-2 mt-4 text-white">{r.nome}</h3>
                    <p className="mt-2 max-w-xs text-sm leading-relaxed text-white/60">
                      {r.texto}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-gold-soft opacity-0 transition-[opacity,transform] duration-500 ease-[var(--ease-out-soft)] group-hover:translate-x-0 group-hover:opacity-100 -translate-x-2">
                      Ver imóveis →
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- VÍDEOS */}
      <section id="videos" className="bg-offwhite scroll-mt-24 py-16 sm:py-24 lg:py-28">
        <div className="container-page">
          <Reveal className="mb-14">
            <TituloSecao
              eyebrow="Vídeos"
              titulo="Conteúdos"
              texto="Leitura de mercado, bastidores de visita e análise de bairro em formato curto."
            />
          </Reveal>

          {/* Três verticais sempre na mesma linha, ocupando a largura toda. */}
          <div className="grid grid-cols-3 gap-3 sm:gap-6 lg:gap-8 [&>*]:min-w-0">
            {videos.map((video, i) => (
              <Reveal key={video.id} delay={i * 130}>
                <VideoVertical video={video} seed={i} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- BLOG */}
      <section className="py-16 sm:py-24 lg:py-28">
        <div className="container-page">
          <Reveal className="mb-14 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
            <TituloSecao eyebrow="Conteúdo" titulo="Conteúdo imobiliário" />
            <BotaoLink href="/blog" variante="secundaria" className="shrink-0">
              Ver todos <Seta />
            </BotaoLink>
          </Reveal>

          {/* Lista editorial: uma matéria por linha, com a imagem alternando
              de lado. Cada linha inteira é o link. */}
          <div className="border-y border-sand">
            {posts.map((post, i) => {
              const imagemDireita = i % 2 === 1;
              return (
                <Reveal key={post.slug} className="border-b border-sand last:border-0">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group grid items-center gap-8 py-10 sm:gap-10 sm:py-12 lg:grid-cols-2 lg:gap-16 lg:py-16"
                  >
                    <div
                      className={`relative overflow-hidden rounded-card ${
                        imagemDireita ? "lg:order-2" : ""
                      }`}
                    >
                      <div className="aspect-4/3 overflow-hidden">
                        <PostCover
                          post={post}
                          seed={i + 1}
                          sizes="(min-width: 1024px) 50vw, 100vw"
                          className="h-full w-full transition-transform duration-[1100ms] ease-[var(--ease-out-soft)] group-hover:scale-[1.05]"
                        />
                      </div>
                      <span className="eyebrow absolute left-5 top-5 rounded-full bg-white/95 px-3.5 py-1.5 text-[0.5625rem] text-navy backdrop-blur-sm">
                        {post.categoria}
                      </span>
                    </div>

                    <div className={imagemDireita ? "lg:order-1" : ""}>
                      <div className="flex items-center gap-5">
                        <span className="num font-display text-[2.75rem] leading-none tracking-tight text-sand-dark transition-colors duration-500 group-hover:text-gold-marca">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="h-px flex-1 bg-sand" />
                      </div>

                      <h3 className="display-2 mt-6 text-navy transition-colors duration-300 group-hover:text-navy-500">
                        {post.titulo}
                      </h3>

                      <p className="lead mt-5 max-w-xl text-muted">{post.resumo}</p>

                      <div className="mt-8 flex flex-wrap items-center gap-4 text-xs text-muted">
                        <span>{formatData(post.publicadoEm)}</span>
                        <span className="h-px w-8 bg-sand-dark" />
                        <span>{post.tempoLeitura} min de leitura</span>
                      </div>

                      <span className="mt-8 inline-flex items-center gap-2.5 text-sm font-semibold text-navy">
                        <span className="relative">
                          Ler artigo
                          <span className="absolute inset-x-0 -bottom-1 h-px origin-left scale-x-0 bg-gold-marca transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:scale-x-100" />
                        </span>
                        <span className="transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:translate-x-1.5">
                          →
                        </span>
                      </span>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- ONDE ESTOU */}
      <section className="bg-offwhite py-16 sm:py-24 lg:py-28">
        <div className="container-page grid items-center gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <Reveal>
            <TituloSecao
              eyebrow="Escritório"
              titulo="Onde estou"
              texto="O atendimento começa aqui, na Jatiúca. Agende uma conversa ou passe para tomar um café."
            />

            <address className="mt-8 space-y-5 not-italic">
              <div>
                <p className="eyebrow text-[0.5625rem] text-muted">Endereço</p>
                <p className="mt-1.5 text-base leading-relaxed text-graphite">
                  {config.endereco.rua}
                  <br />
                  {config.endereco.bairro} · {config.endereco.cidade}/{config.endereco.estado}
                </p>
              </div>

              <div>
                <p className="eyebrow text-[0.5625rem] text-muted">WhatsApp</p>
                <a
                  href={linkWhatsapp(
                    config,
                    "Olá Luciano, gostaria de agendar uma visita ao escritório.",
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="num mt-1.5 inline-block text-base font-semibold text-navy transition-colors hover:text-gold-dim"
                >
                  {config.telefone}
                </a>
              </div>
            </address>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={LINK_MAPS}
                target="_blank"
                rel="noopener noreferrer"
                className="group/btn inline-flex h-12 items-center justify-center gap-2.5 rounded-full bg-navy px-7 text-[0.8125rem] font-semibold tracking-[0.02em] text-white transition-colors duration-300 hover:bg-navy-700"
              >
                Ver no Google Maps <Seta />
              </a>
              <BotaoLink href="/contato" variante="secundaria">
                Falar comigo
              </BotaoLink>
            </div>
          </Reveal>

          <Reveal delay={140}>
            <Mapa config={config} className="h-[20rem] w-full rounded-card border border-sand shadow-[0_24px_60px_-40px] shadow-navy/50 sm:h-[26rem] lg:h-[32rem]" />
          </Reveal>
        </div>
      </section>

      {/* ---------------------------------------------------------- INSTAGRAM */}
      <section className="py-16 sm:py-24 lg:py-28">
        <div className="container-page">
          <Reveal className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <TituloSecao eyebrow="Instagram" titulo="Acompanhe o mercado comigo" />
            <a
              href={config.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group shrink-0 text-sm font-semibold text-navy transition-colors hover:text-gold-dim"
            >
              <span className="relative">
                {config.instagram}
                <span className="absolute inset-x-0 -bottom-1 h-px origin-left scale-x-0 bg-gold transition-transform duration-400 ease-[var(--ease-out-soft)] group-hover:scale-x-100" />
              </span>{" "}
              →
            </a>
          </Reveal>

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {postsInstagram.map((post, i) => (
              <Reveal key={post.id} delay={i * 90}>
                <a
                  href={post.href ?? config.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block aspect-4/5 overflow-hidden rounded-card"
                >
                  {post.src ? (
                    <Image
                      src={post.src}
                      alt={post.alt}
                      width={post.largura}
                      height={post.altura}
                      sizes="(min-width: 1024px) 25vw, 50vw"
                      className="h-full w-full object-cover transition-transform duration-[900ms] ease-[var(--ease-out-soft)] group-hover:scale-[1.08]"
                    />
                  ) : (
                    <PropertyPhoto
                      seed={i}
                      className="h-full w-full transition-transform duration-[900ms] ease-[var(--ease-out-soft)] group-hover:scale-[1.08]"
                      rotulo={post.alt}
                    />
                  )}
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- CTA FINAL */}
      {/* Mesmo navy-950 chapado do rodapé: os dois blocos formam uma peça só. */}
      <section className="grain relative overflow-hidden bg-navy-950 py-20 text-white sm:py-28 lg:py-32">
        {/* Anéis concêntricos centralizados, para acompanhar o eixo do texto. */}
        <div className="absolute left-1/2 top-1/2 hidden size-[46rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.06] lg:block" />
        <div className="absolute left-1/2 top-1/2 hidden size-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold/[0.08] lg:block" />

        <div className="container-page relative max-w-3xl text-center">
          <Reveal>
            <p className="eyebrow text-gold">Vamos conversar</p>
            <span className="rule-gold mx-auto mt-4" />
            <h2 className="display-1 mt-6">
              Seu próximo imóvel pode começar por uma conversa.
            </h2>
            <p className="lead mx-auto mt-6 max-w-xl text-white/65">
              Conte o que você procura e vamos encontrar as melhores
              possibilidades para o seu momento.
            </p>
            <div className="mt-11 flex flex-wrap justify-center gap-3">
              <a
                href={linkWhatsapp(
                  config,
                  "Olá Luciano, vim pelo site e gostaria de conversar sobre imóveis.",
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="group/btn inline-flex h-14 items-center justify-center gap-2.5 rounded-full bg-gold px-9 text-sm font-semibold tracking-[0.02em] text-navy-950 transition-[background-color,box-shadow] duration-300 hover:bg-gold-soft hover:shadow-[0_12px_32px_-12px] hover:shadow-gold/70"
              >
                Falar com Luciano <Seta />
              </a>
              <BotaoLink href="/imoveis" variante="clara" tamanho="lg">
                Encontrar meu imóvel
              </BotaoLink>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
