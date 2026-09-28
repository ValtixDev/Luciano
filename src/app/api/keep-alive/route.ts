import { clientePublico } from "@/lib/supabase/publico";

/**
 * O plano gratuito do Supabase pausa o projeto após 7 dias sem atividade.
 * O cron da Vercel (vercel.json) chama esta rota uma vez por dia e faz uma
 * leitura mínima — o bastante para contar como uso do banco.
 */
export const dynamic = "force-dynamic";

export async function GET() {
  const sb = clientePublico();
  if (!sb) return Response.json({ ok: false, motivo: "supabase não configurado" }, { status: 500 });

  const { error } = await sb.from("imoveis").select("id", { head: true, count: "exact" }).limit(1);
  if (error) return Response.json({ ok: false, motivo: error.message }, { status: 500 });

  return Response.json({ ok: true, em: new Date().toISOString() });
}
