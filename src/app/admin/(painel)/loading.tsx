import { EsqueletoPagina } from "@/components/admin/esqueleto";

/**
 * O painel espera ~400ms por consulta ao Supabase. Sem este arquivo, a
 * navegação fica travada na tela anterior durante esse tempo e parece quebrada.
 */
export default function Loading() {
  return <EsqueletoPagina />;
}
