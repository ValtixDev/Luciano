import { criarClienteServidor } from "@/lib/supabase/server";

const PREFIXO = "LG-";
const PADRAO = /^LG-(\d+)$/i;

/**
 * Próximo código interno na sequência LG-001, LG-002…
 * Parte do maior número já usado (inativos inclusive), sem preencher buracos.
 * Códigos fora do padrão são ignorados.
 */
export async function proximoCodigo(): Promise<string> {
  const sb = await criarClienteServidor();
  let maior = 0;

  if (sb) {
    const { data } = await sb.from("imoveis").select("codigo").ilike("codigo", `${PREFIXO}%`);
    for (const { codigo } of data ?? []) {
      const n = Number(PADRAO.exec(codigo)?.[1]);
      if (Number.isFinite(n) && n > maior) maior = n;
    }
  }

  return `${PREFIXO}${String(maior + 1).padStart(3, "0")}`;
}
