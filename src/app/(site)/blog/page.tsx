import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { PostCover } from "@/components/post-cover";
import { Reveal } from "@/components/reveal";
import { listarPosts } from "@/lib/posts";
import { formatData } from "@/lib/format";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Conteúdo sobre o mercado imobiliário de Maceió: análises de bairro, investimento, financiamento e decisões de compra.",
  alternates: { canonical: "/blog" },
};

const categorias = ["Mercado", "Investimentos", "Maceió", "Dicas"] as const;

export const revalidate = 60;

export default async function BlogPage() {
  const posts = await listarPosts();
  return (
    <>
      <PageHero
        eyebrow="Blog"
        titulo={
          <>
            Informação para tomar melhores
            <br className="hidden sm:block" /> decisões imobiliárias.
          </>
        }
      >
        <div className="flex flex-wrap gap-2">
          {categorias.map((c) => (
            <span
              key={c}
              className="rounded-full border border-white/20 px-4 py-2 text-xs font-medium text-white/70 transition-colors duration-300 hover:border-gold hover:text-gold-soft"
            >
              {c}
            </span>
          ))}
        </div>
      </PageHero>

      <section className="bg-offwhite py-16 sm:py-20 lg:py-24">
        <div className="container-page grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => (
            <Reveal key={post.slug} delay={(i % 3) * 130}>
              <Link
                href={`/blog/${post.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-card border border-sand bg-white transition-[border-color,box-shadow,transform] duration-500 ease-[var(--ease-out-soft)] hover:-translate-y-1.5 hover:border-sand-dark hover:shadow-[0_24px_60px_-32px] hover:shadow-navy/50"
              >
                <div className="aspect-16/10 overflow-hidden">
                  <PostCover
                    post={post}
                    seed={i}
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="h-full w-full transition-transform duration-[900ms] ease-[var(--ease-out-soft)] group-hover:scale-[1.06]"
                  />
                </div>
                <div className="flex flex-1 flex-col p-7">
                  <p className="eyebrow text-[0.5625rem] text-gold-dim">{post.categoria}</p>
                  <h2 className="display-3 mt-3.5 text-navy">{post.titulo}</h2>
                  <p className="mt-3.5 text-sm leading-relaxed text-muted">{post.resumo}</p>
                  <p className="mt-auto pt-6 text-xs text-muted">
                    {formatData(post.publicadoEm)} · {post.tempoLeitura} min de leitura
                  </p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
