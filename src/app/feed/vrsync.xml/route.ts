import { gerarVrsync, imoveisParaPortais } from "@/lib/feeds";
import { obterConfig } from "@/lib/configuracoes";
import { site } from "@/lib/site";

/** Os portais leem o feed algumas vezes por dia; meia hora de cache basta. */
export const revalidate = 1800;

export async function GET() {
  const [itens, config] = await Promise.all([imoveisParaPortais(), obterConfig()]);

  const xml = gerarVrsync({
    itens,
    base: site.url,
    contato: {
      nome: config.razao,
      email: config.email,
      telefone: config.telefone,
    },
  });

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=1800, stale-while-revalidate=3600",
    },
  });
}
