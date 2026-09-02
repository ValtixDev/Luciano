import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PostCover } from "@/components/post-cover";
import { estiloBotao } from "@/components/ui/button";
import { buscarPostPorSlug, listarPosts } from "@/lib/posts";
import { formatData } from "@/lib/format";
import { site } from "@/lib/site";

export const revalidate = 60;
export const dynamicParams = true;

export async function generateStaticParams() {
  return (await listarPosts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = await buscarPostPorSlug(slug);
  if (!post) return { title: "Artigo não encontrado" };

  return {
    title: post.titulo,
    description: post.resumo,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.titulo,
      description: post.resumo,
      publishedTime: post.publicadoEm,
      authors: [post.autor],
      // A capa é o que aparece quando o link é colado no WhatsApp.
      ...(post.capa ? { images: [{ url: post.capa.src, alt: post.capa.alt }] } : {}),
    },
  };
}

export default async function PostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = await buscarPostPorSlug(slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.titulo,
    description: post.resumo,
    datePublished: post.publicadoEm,
    author: { "@type": "Person", name: post.autor },
    publisher: { "@type": "Organization", name: site.razao },
    mainEntityOfPage: `${site.url}/blog/${post.slug}`,
    // O Google usa a imagem para o resultado enriquecido do artigo.
    ...(post.capa ? { image: [`${site.url}${post.capa.src}`] } : {}),
  };

  const outros = (await listarPosts()).filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article>
        <header className="bg-offwhite pb-16 pt-36">
          <div className="container-page max-w-3xl">
            <nav className="text-xs text-muted" aria-label="Trilha">
              <Link href="/" className="hover:text-navy">
                Início
              </Link>
              <span className="px-2">/</span>
              <Link href="/blog" className="hover:text-navy">
                Blog
              </Link>
              <span className="px-2">/</span>
              <span className="text-graphite">{post.categoria}</span>
            </nav>

            <p className="eyebrow mt-10 text-gold-dim">{post.categoria}</p>
            <span className="rule-gold mt-4" />
            <h1 className="display-1 mt-6 text-navy">{post.titulo}</h1>
            <p className="lead mt-6 text-muted">{post.resumo}</p>
            <p className="mt-7 text-xs text-muted">
              Por {post.autor} · {formatData(post.publicadoEm)} · {post.tempoLeitura} min
              de leitura
            </p>
          </div>
        </header>

        <div className="container-page max-w-3xl py-16">
          <div className="aspect-16/9 overflow-hidden rounded-card">
            <PostCover
              post={post}
              sizes="(min-width: 768px) 768px, 100vw"
              className="h-full w-full"
              priority
            />
          </div>
          <div className="mt-14 space-y-7 text-[1.0625rem] leading-[1.8] text-graphite">
            {post.conteudo.map((paragrafo, i) => (
              <p key={i}>{paragrafo}</p>
            ))}
          </div>

          <div className="mt-16 rounded-card border border-sand bg-offwhite p-9">
            <h2 className="display-2 text-navy">
              Quer avaliar uma oportunidade específica?
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Fale com o Luciano e receba uma análise sobre o imóvel ou a região
              que você está considerando.
            </p>
            <Link href="/contato" className={`${estiloBotao("primaria")} mt-6`}>
              Falar com Luciano
            </Link>
          </div>
        </div>
      </article>

      {outros.length > 0 && (
        <section className="bg-offwhite py-14 sm:py-20">
          <div className="container-page max-w-3xl">
            <h2 className="display-2 mb-9 text-navy">Continue lendo</h2>
            <div className="grid gap-5 sm:grid-cols-2">
              {outros.map((p) => (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  className="rounded-card border border-sand bg-white p-7 transition-[border-color,box-shadow,transform] duration-500 ease-[var(--ease-out-soft)] hover:-translate-y-1 hover:border-sand-dark hover:shadow-[0_24px_60px_-32px] hover:shadow-navy/50"
                >
                  <p className="eyebrow text-[0.5625rem] text-gold-dim">{p.categoria}</p>
                  <h3 className="display-3 mt-3 text-navy">
                    {p.titulo}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
