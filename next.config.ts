import type { NextConfig } from "next";

const UM_MES = 60 * 60 * 24 * 30;

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
