import Link from "next/link";
import {
  AdminLinkButton,
  Badge,
  Card,
  PageHeader,
  StatCard,
} from "@/components/admin/ui";
import { formatPreco } from "@/lib/format";
import {
  formatDataHora,
  origemLabel,
  statusLeadCor,
  statusLeadLabel,
} from "@/lib/admin";
import type { Lead } from "@/types";
import { listarImoveisAdmin, listarLeadsAdmin, metricasPainel } from "@/lib/supabase/painel";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [m, leads, imoveis] = await Promise.all([
    metricasPainel(),
    listarLeadsAdmin(),
    listarImoveisAdmin(4),
  ]);

  const recentes = leads.slice(0, 5);
  const serie = serieLeadsPorMes(leads);
  const maxLeads = Math.max(1, ...serie.map((s) => s.total));
  const ultimosImoveis = imoveis.slice(0, 4);

  return (
    <>
      <PageHeader
        titulo="Dashboard"
        descricao="Visão geral da operação: acervo, leads e desempenho do site."
        acao={
          <AdminLinkButton href="/admin/imoveis/novo">
            + Novo imóvel
          </AdminLinkButton>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard rotulo="Imóveis ativos" valor={m.imoveisAtivos} nota="Publicados no site" />
        <StatCard rotulo="Em destaque" valor={m.emDestaque} nota="Aparecem na home" />
        <StatCard
          rotulo="Leads recebidos"
          valor={m.leadsRecebidos}
          nota={`${m.leadsNovos} aguardando retorno`}
        />
        <StatCard
          rotulo="Artigos publicados"
          valor={m.postsPublicados}
          nota="Visíveis no blog"
        />
        <StatCard rotulo="Portais conectados" valor="0/3" nota="Feeds ainda não publicados" />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        {/* GRÁFICO */}
        <Card className="p-6">
          <div className="mb-7 flex items-baseline justify-between">
            <h2 className="font-display text-xl text-navy">Leads por mês</h2>
            <p className="text-xs text-muted">Últimos 6 meses</p>
          </div>

          {/* items-stretch + flex-1 dão altura definida às colunas: sem isso as
              barras com altura percentual colapsam para zero. */}
          <div className="relative flex h-56 items-stretch gap-4">
            <div className="pointer-events-none absolute inset-x-0 inset-y-0 flex flex-col justify-between">
              {[0, 1, 2, 3].map((l) => (
                <span key={l} className="h-px w-full bg-sand" />
              ))}
            </div>

            {serie.map((s, i) => (
              <div key={s.chave} className="relative flex flex-1 flex-col gap-2.5">
                <div className="flex flex-1 items-end justify-center">
                  <div
                    className="w-2/3 origin-bottom rounded-t-[5px] bg-navy animate-[bar-grow_0.9s_var(--ease-out-soft)_both]"
                    style={{
                      height: `${(s.total / maxLeads) * 100}%`,
                      animationDelay: `${i * 90}ms`,
                    }}
                    title={`${s.total} ${s.total === 1 ? "lead" : "leads"}`}
                  />
                </div>
                <span className="text-center text-[0.6875rem] text-muted">{s.mes}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* LEADS RECENTES */}
        <Card className="flex flex-col p-6">
          <div className="mb-5 flex items-baseline justify-between">
            <h2 className="font-display text-xl text-navy">Leads recentes</h2>
            <Link
              href="/admin/leads"
              className="text-xs font-semibold text-navy hover:text-gold"
            >
              Ver todos
            </Link>
          </div>

          <ul className="divide-y divide-sand">
            {recentes.map((lead) => (
              <li key={lead.id} className="flex items-start justify-between gap-3 py-3.5">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-graphite">
                    {lead.nome}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-muted">
                    {origemLabel[lead.origem]} · {formatDataHora(lead.criadoEm)}
                  </p>
                </div>
                <Badge cor={statusLeadCor[lead.status]}>
                  {statusLeadLabel[lead.status]}
                </Badge>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* IMÓVEIS RECENTES */}
      <Card className="mt-6 p-6">
        <div className="mb-5 flex items-baseline justify-between">
          <h2 className="font-display text-xl text-navy">
            Atualizados recentemente
          </h2>
          <Link
            href="/admin/imoveis"
            className="text-xs font-semibold text-navy hover:text-gold"
          >
            Ver acervo
          </Link>
        </div>

        <ul className="divide-y divide-sand">
          {ultimosImoveis.map((i) => (
            <li key={i.id} className="flex items-center justify-between gap-4 py-3.5">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-graphite">
                  {i.titulo}
                </p>
                <p className="mt-0.5 text-xs text-muted">
                  {i.codigo} · {i.bairro}, {i.cidade}
                </p>
              </div>
              <span className="shrink-0 text-sm font-semibold text-navy">
                {formatPreco(i.preco, i.precoSobConsulta)}
              </span>
            </li>
          ))}
        </ul>
      </Card>
    </>
  );
}

const MESES = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

/** Contagem de leads nos últimos seis meses, incluindo os meses sem nenhum. */
function serieLeadsPorMes(leads: Lead[]) {
  const hoje = new Date();
  const baldes = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(hoje.getFullYear(), hoje.getMonth() - (5 - i), 1);
    return {
      chave: `${d.getFullYear()}-${d.getMonth()}`,
      mes: MESES[d.getMonth()],
      total: 0,
    };
  });

  for (const lead of leads) {
    const d = new Date(lead.criadoEm);
    const balde = baldes.find((b) => b.chave === `${d.getFullYear()}-${d.getMonth()}`);
    if (balde) balde.total += 1;
  }

  return baldes;
}
