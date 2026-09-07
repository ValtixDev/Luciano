import Link from "next/link";
import { AdminLinkButton, Badge, Card, PageHeader } from "@/components/admin/ui";
import { icones } from "@/components/admin/icones";
import { formatDataHora, origemLabel, statusLeadCor, statusLeadLabel } from "@/lib/admin";
import { formatPreco } from "@/lib/format";
import { listarImoveisAdmin, listarLeadsAdmin } from "@/lib/supabase/painel";
import { validarParaPortal } from "@/lib/feeds";
import type { Lead, OrigemLead } from "@/types";

export const dynamic = "force-dynamic";

const MESES = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

export default async function AdminDashboard() {
  const [leads, imoveis] = await Promise.all([listarLeadsAdmin(), listarImoveisAdmin(200)]);

  const ativos = imoveis.filter((i) => i.status === "disponivel" && !i.isPlaceholder);
  const semFoto = ativos.filter((i) => i.fotos.length === 0);
  const comPreco = ativos.filter((i) => i.preco !== null);
  const acervo = comPreco.reduce((soma, i) => soma + (i.preco ?? 0), 0);
  const ticket = comPreco.length ? acervo / comPreco.length : 0;

  const novos = leads.filter((l) => l.status === "novo");
  const convertidos = leads.filter((l) => l.status === "convertido");
  const conversao = leads.length ? Math.round((convertidos.length / leads.length) * 100) : 0;

  const nosPortais = imoveis.filter((i) => i.publicarOlx || i.publicarZap);
  const comPendencia = nosPortais.filter((i) => validarParaPortal(i).length > 0);

  const serie = serieLeadsPorMes(leads);
  const maxLeads = Math.max(1, ...serie.map((s) => s.total));
  const porOrigem = agruparPorOrigem(leads);

  return (
    <>
      <PageHeader
        titulo="Dashboard"
        descricao="Visão da operação: acervo, captação e o que precisa de atenção."
        acao={<AdminLinkButton href="/admin/imoveis/novo">+ Novo imóvel</AdminLinkButton>}
      />

      {/* Alertas primeiro: o painel deve dizer o que fazer, não só o que existe. */}
      {(semFoto.length > 0 || comPendencia.length > 0 || novos.length > 0) && (
        <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {novos.length > 0 && (
            <Alerta
              tom="navy"
              titulo={`${novos.length} ${novos.length === 1 ? "lead aguardando" : "leads aguardando"}`}
              texto="Contatos ainda sem retorno."
              href="/admin/leads?status=novo"
              acao="Atender"
            />
          )}
          {semFoto.length > 0 && (
            <Alerta
              tom="amber"
              titulo={`${semFoto.length} ${semFoto.length === 1 ? "imóvel sem foto" : "imóveis sem foto"}`}
              texto="Anúncio sem fotografia converte pouco e é recusado nos portais."
              href="/admin/imoveis"
              acao="Revisar"
            />
          )}
          {comPendencia.length > 0 && (
            <Alerta
              tom="amber"
              titulo={`${comPendencia.length} fora do feed`}
              texto="Marcados para os portais, mas com pendência que bloqueia."
              href="/admin/integracoes"
              acao="Ver pendências"
            />
          )}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <Indicador
          icone="imoveis"
          rotulo="Imóveis ativos"
          valor={String(ativos.length)}
          nota={`${ativos.filter((i) => i.destaque).length} em destaque`}
        />
        <Indicador
          icone="dashboard"
          rotulo="Valor do acervo"
          valor={formatPreco(acervo)}
          nota={comPreco.length < ativos.length ? `${ativos.length - comPreco.length} sob consulta` : "Soma dos anunciados"}
        />
        <Indicador
          icone="dashboard"
          rotulo="Ticket médio"
          valor={ticket ? formatPreco(ticket) : "—"}
          nota="Entre os com valor"
        />
        <Indicador
          icone="leads"
          rotulo="Conversão"
          valor={`${conversao}%`}
          nota={`${convertidos.length} de ${leads.length} leads`}
        />
      </div>

      <div className="mt-4 grid gap-4 sm:mt-5 xl:grid-cols-[1.35fr_1fr]">
        <Card className="p-6">
          <div className="mb-6 flex items-baseline justify-between">
            <h2 className="font-display text-xl tracking-tight text-navy">Leads por mês</h2>
            <p className="text-xs text-muted">Últimos 6 meses</p>
          </div>

          <div className="relative flex h-52 items-stretch gap-3">
            <div className="pointer-events-none absolute inset-0 flex flex-col justify-between">
              {[0, 1, 2, 3].map((l) => (
                <span key={l} className="h-px w-full bg-sand" />
              ))}
            </div>

            {serie.map((s, i) => (
              <div key={s.chave} className="group relative flex flex-1 flex-col gap-2.5">
                <div className="flex flex-1 items-end justify-center">
                  <div
                    className="w-2/3 origin-bottom rounded-t-[5px] bg-navy transition-colors duration-200 group-hover:bg-gold-marca animate-[bar-grow_0.9s_var(--ease-out-soft)_both]"
                    style={{
                      height: `${(s.total / maxLeads) * 100}%`,
                      animationDelay: `${i * 80}ms`,
                    }}
                  />
                </div>
                <span className="text-center text-[0.6875rem] text-muted">{s.mes}</span>
                <span className="num pointer-events-none absolute -top-1 left-1/2 -translate-x-1/2 text-xs font-semibold text-navy opacity-0 transition-opacity group-hover:opacity-100">
                  {s.total}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="mb-6 font-display text-xl tracking-tight text-navy">
            De onde vêm os leads
          </h2>

          {leads.length === 0 ? (
            <p className="text-sm text-muted">Nenhum contato recebido ainda.</p>
          ) : (
            <ul className="space-y-4">
              {porOrigem.map(({ origem, total }) => {
                const pct = Math.round((total / leads.length) * 100);
                return (
                  <li key={origem}>
                    <div className="flex items-baseline justify-between text-sm">
                      <span className="text-graphite">{origemLabel[origem]}</span>
                      <span className="num text-xs text-muted">
                        {total} · {pct}%
                      </span>
                    </div>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-sand">
                      <div
                        className="h-full rounded-full bg-navy transition-[width] duration-700 ease-[var(--ease-out-soft)]"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
      </div>

      <div className="mt-4 grid gap-4 sm:mt-5 xl:grid-cols-2">
        <Card className="p-6">
          <div className="mb-4 flex items-baseline justify-between">
            <h2 className="font-display text-xl tracking-tight text-navy">Leads recentes</h2>
            <Link href="/admin/leads" className="text-xs font-semibold text-navy hover:text-gold-dim">
              Ver todos
            </Link>
          </div>

          {leads.length === 0 ? (
            <Vazio texto="Os contatos do site aparecem aqui." />
          ) : (
            <ul className="divide-y divide-sand">
              {leads.slice(0, 5).map((lead) => (
                <li key={lead.id} className="flex items-start justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-graphite">{lead.nome}</p>
                    <p className="mt-0.5 truncate text-xs text-muted">
                      {origemLabel[lead.origem]} · {formatDataHora(lead.criadoEm)}
                    </p>
                  </div>
                  <Badge cor={statusLeadCor[lead.status]}>{statusLeadLabel[lead.status]}</Badge>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="p-6">
          <div className="mb-4 flex items-baseline justify-between">
            <h2 className="font-display text-xl tracking-tight text-navy">
              Atualizados recentemente
            </h2>
            <Link href="/admin/imoveis" className="text-xs font-semibold text-navy hover:text-gold-dim">
              Ver acervo
            </Link>
          </div>

          {imoveis.length === 0 ? (
            <Vazio texto="Cadastre o primeiro imóvel para começar." />
          ) : (
            <ul className="divide-y divide-sand">
              {imoveis.slice(0, 5).map((i) => (
                <li key={i.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-graphite">{i.titulo}</p>
                    <p className="mt-0.5 text-xs text-muted">
                      {i.codigo} · {i.bairro} · {i.fotos.length}{" "}
                      {i.fotos.length === 1 ? "foto" : "fotos"}
                    </p>
                  </div>
                  <span className="num shrink-0 text-sm font-semibold text-navy">
                    {formatPreco(i.preco, i.precoSobConsulta)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </>
  );
}

function Indicador({
  icone,
  rotulo,
  valor,
  nota,
}: {
  icone: "imoveis" | "leads" | "dashboard";
  rotulo: string;
  valor: string;
  nota: string;
}) {
  return (
    <Card className="group relative overflow-hidden px-5 py-5 transition-[border-color,box-shadow] duration-300 hover:border-sand-dark hover:shadow-[0_16px_40px_-28px] hover:shadow-navy/60">
      <span className="absolute right-4 top-4 text-sand-dark transition-colors duration-300 group-hover:text-gold-marca">
        {icones[icone]("size-5")}
      </span>
      <p className="eyebrow text-muted">{rotulo}</p>
      <p className="num mt-2 font-display text-xl leading-none tracking-tight text-navy sm:text-[1.75rem]">
        {valor}
      </p>
      <p className="mt-2 text-xs text-muted">{nota}</p>
    </Card>
  );
}

function Alerta({
  tom,
  titulo,
  texto,
  href,
  acao,
}: {
  tom: "navy" | "amber";
  titulo: string;
  texto: string;
  href: string;
  acao: string;
}) {
  const cores =
    tom === "amber"
      ? "border-amber-200 bg-amber-50 text-amber-900"
      : "border-navy/15 bg-navy text-white";

  return (
    <Link
      href={href}
      className={`group flex items-start gap-3 rounded-card border p-4 transition-transform duration-300 hover:-translate-y-0.5 ${cores}`}
    >
      <span
        className={`mt-1 size-2 shrink-0 rounded-full ${
          tom === "amber" ? "bg-amber-500" : "bg-gold-marca"
        }`}
      />
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold">{titulo}</span>
        <span className={`mt-0.5 block text-xs ${tom === "amber" ? "text-amber-800" : "text-white/60"}`}>
          {texto}
        </span>
      </span>
      <span className="shrink-0 text-xs font-semibold transition-transform duration-300 group-hover:translate-x-1">
        {acao} →
      </span>
    </Link>
  );
}

function Vazio({ texto }: { texto: string }) {
  return (
    <p className="rounded-lg border border-dashed border-sand-dark bg-offwhite px-5 py-8 text-center text-sm text-muted">
      {texto}
    </p>
  );
}

/** Contagem de leads nos últimos seis meses, incluindo os meses sem nenhum. */
function serieLeadsPorMes(leads: Lead[]) {
  const hoje = new Date();
  const baldes = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(hoje.getFullYear(), hoje.getMonth() - (5 - i), 1);
    return { chave: `${d.getFullYear()}-${d.getMonth()}`, mes: MESES[d.getMonth()], total: 0 };
  });

  for (const lead of leads) {
    const d = new Date(lead.criadoEm);
    const balde = baldes.find((b) => b.chave === `${d.getFullYear()}-${d.getMonth()}`);
    if (balde) balde.total += 1;
  }
  return baldes;
}

function agruparPorOrigem(leads: Lead[]) {
  const contagem = new Map<OrigemLead, number>();
  for (const lead of leads) contagem.set(lead.origem, (contagem.get(lead.origem) ?? 0) + 1);
  return [...contagem.entries()]
    .map(([origem, total]) => ({ origem, total }))
    .sort((a, b) => b.total - a.total);
}
