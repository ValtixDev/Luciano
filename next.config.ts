import type { NextConfig } from "next";

const UM_MES = 60 * 60 * 24 * 30;

/**
 * Sem as variáveis do Supabase o build passa e o site sobe vazio — catálogo e
 * blog sem nada, sem um único erro. Falhar aqui troca uma investigação de horas
 * por uma mensagem no log do deploy.
 */
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const chave =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !chave) {
  const faltando = [
    !url && "NEXT_PUBLIC_SUPABASE_URL",
    !chave && "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
  ].filter(Boolean);

  const recado = `Variáveis do Supabase ausentes: ${faltando.join(", ")}`;

  if (process.env.VERCEL_ENV === "production") {
    throw new Error(
      `${recado}\n\nDefina em Settings → Environment Variables, marcando o ambiente ` +
        `Production, e refaça o deploy sem cache. Sem elas o site sobe sem imóveis e sem artigos.`,
    );
  }

  console.warn(`\n⚠  ${recado} — o site vai rodar sem dados.\n`);
}

const nextConfig: NextConfig = {
  // Não anuncia a stack em todo cabeçalho de resposta.
  poweredByHeader: false,

  images: {
    // AVIF primeiro: costuma render 20–30% a menos que WebP no mesmo alvo visual.
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: UM_MES,
    // Sem isto, toda foto vinda do Storage é recusada pelo otimizador.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },

  async headers() {
    return [
      {
        // Arquivos de /public não recebem hash de build, então o Next os serve
        // sem cache por padrão. Vídeos e o logo raramente mudam.
        source: "/videos/:arquivo*",
        headers: [
          { key: "Cache-Control", value: `public, max-age=${UM_MES}, stale-while-revalidate=86400` },
        ],
      },
      {
        source: "/logo-luciano-gois.webp",
        headers: [
          { key: "Cache-Control", value: `public, max-age=${UM_MES}, stale-while-revalidate=86400` },
        ],
      },
    ];
  },
};

export default nextConfig;
