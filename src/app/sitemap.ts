import type { MetadataRoute } from "next";
import { listarPosts } from "@/lib/posts";
import { todosSlugs } from "@/lib/imoveis";
import { site } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [slugs, posts] = await Promise.all([todosSlugs(), listarPosts()]);
  const fixas = ["", "/imoveis", "/sobre", "/blog", "/contato"].map((p) => ({
    url: `${site.url}${p}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: p === "" ? 1 : 0.8,
  }));

  const imoveis = slugs.map(({ slug }) => ({
    url: `${site.url}/imovel/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  const artigos = posts.map((p) => ({
    url: `${site.url}/blog/${p.slug}`,
    lastModified: new Date(`${p.publicadoEm}T12:00:00`),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...fixas, ...imoveis, ...artigos];
}
