import type { Metadata } from "next";
import Link from "next/link";
import { Badge, Card, EmptyState, PageHeader } from "@/components/admin/ui";
import { Select } from "@/components/admin/fields";
import { listarLeadsAdmin } from "@/lib/supabase/painel";
import { atualizarStatusLead } from "./acoes";
import {
  formatDataHora,
  origemLabel,
  statusLeadCor,
  statusLeadLabel,
} from "@/lib/admin";
import type { StatusLead } from "@/types";

export const metadata: Metadata = { title: "Leads" };

const th = "px-4 py-3 text-left text-[0.6875rem] font-semibold uppercase tracking-wider text-muted";
const td = "px-4 py-3.5 align-top";

const statusOrdem: StatusLead[] = [
  "novo",
  "em_atendimento",
  "visita",
  "proposta",
  "convertido",
  "perdido",
];

export default async function AdminLeadsPage({
  searchParams,
}: PageProps<"/admin/leads">) {
  const sp = await searchParams;
  const filtro = (Array.isArray(sp.status) ? sp.status[0] : sp.status) ?? "";

  // Uma ida ao banco só: o filtro roda em memória, sobre a mesma lista que já
  // alimenta as contagens dos chips.
  const todos = await listarLeadsAdmin();
  const lista = filtro ? todos.filter((l) => l.status === filtro) : todos;

  const contagem = (s: StatusLead) => todos.filter((l) => l.status === s).length;

  return (
    <>
      <PageHeader
        titulo="Leads"
        descricao="Contatos recebidos pelo site, pela página do imóvel e pelo assistente de IA."
      />

      <div className="mb-5 flex flex-wrap gap-2">
        <Link
          href="/admin/leads"
          className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
            !filtro
              ? "border-navy bg-navy text-white"
              : "border-sand bg-white text-muted hover:border-navy/30 hover:text-navy"
          }`}
        >
          Todos ({todos.length})
        </Link>
        {statusOrdem.map((s) => (
          <Link
            key={s}
            href={`/admin/leads?status=${s}`}
            className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
              filtro === s
                ? "border-navy bg-navy text-white"
                : "border-sand bg-white text-muted hover:border-navy/30 hover:text-navy"
            }`}
          >
            {statusLeadLabel[s]} ({contagem(s)})
          </Link>
        ))}
      </div>

      {lista.length === 0 ? (
        <EmptyState
          titulo="Nenhum lead neste status"
          texto="Assim que um contato chegar pelo site ou pelo assistente, ele aparece aqui."
        />
      ) : (
        <>
        <ul className="space-y-3 lg:hidden">
          {lista.map((lead) => (
            <li key={lead.id}>
              <Card className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-graphite">{lead.nome}</p>
                    <a
                      href={`https://wa.me/55${lead.telefone.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="num mt-0.5 block text-xs text-navy"
                    >
                      {lead.telefone}
                    </a>
                  </div>
                  <Badge cor={statusLeadCor[lead.status]}>
                    {statusLeadLabel[lead.status]}
                  </Badge>
                </div>

                {lead.mensagem && (
                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted">
                    {lead.mensagem}
                  </p>
                )}

                <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.6875rem] text-muted">
                  <span>{origemLabel[lead.origem]}</span>
                  <span className="h-px w-4 bg-sand-dark" />
                  <span>{formatDataHora(lead.criadoEm)}</span>
                  {lead.imovelSlug && (
                    <Link
                      href={`/imovel/${lead.imovelSlug}`}
                      target="_blank"
                      className="w-full truncate text-navy"
                    >
                      {lead.imovelTitulo}
                    </Link>
                  )}
                </div>

                <form action={atualizarStatusLead} className="mt-3 flex gap-2 border-t border-sand pt-3">
                  <input type="hidden" name="id" value={lead.id} />
                  <Select name="status" defaultValue={lead.status} className="h-9 flex-1 text-xs">
                    {statusOrdem.map((st) => (
                      <option key={st} value={st}>
                        {statusLeadLabel[st]}
                      </option>
                    ))}
                  </Select>
                  <button
                    type="submit"
                    className="h-9 shrink-0 rounded-lg bg-navy px-4 text-xs font-semibold text-white"
                  >
                    Salvar
                  </button>
                </form>
              </Card>
            </li>
          ))}
        </ul>

        <Card className="hidden overflow-hidden lg:block">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[64rem] border-collapse text-sm">
              <thead className="border-b border-sand bg-offwhite">
                <tr>
                  <th className={th}>Contato</th>
                  <th className={th}>Mensagem</th>
                  <th className={th}>Imóvel</th>
                  <th className={th}>Origem</th>
                  <th className={th}>Recebido</th>
                  <th className={th}>Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand">
                {lista.map((lead) => (
                  <tr key={lead.id} className="transition-colors hover:bg-offwhite/60">
                    <td className={td}>
                      <p className="font-semibold text-graphite">{lead.nome}</p>
                      <a
                        href={`https://wa.me/55${lead.telefone.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-0.5 block text-xs text-navy hover:text-gold"
                      >
                        {lead.telefone}
                      </a>
                      {lead.email && (
                        <span className="mt-0.5 block text-xs text-muted">
                          {lead.email}
                        </span>
                      )}
                    </td>
                    <td className={`${td} max-w-sm text-muted`}>
                      <p className="line-clamp-3 leading-relaxed">{lead.mensagem}</p>
                    </td>
                    <td className={`${td} max-w-48 text-xs`}>
                      {lead.imovelSlug ? (
                        <Link
                          href={`/imovel/${lead.imovelSlug}`}
                          target="_blank"
                          className="text-navy hover:text-gold"
                        >
                          {lead.imovelTitulo}
                        </Link>
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </td>
                    <td className={`${td} text-xs text-muted`}>
                      {origemLabel[lead.origem]}
                    </td>
                    <td className={`${td} whitespace-nowrap text-xs text-muted`}>
                      {formatDataHora(lead.criadoEm)}
                    </td>
                    <td className={td}>
                      <Badge cor={statusLeadCor[lead.status]}>
                        {statusLeadLabel[lead.status]}
                      </Badge>
                      <form action={atualizarStatusLead} className="mt-2">
                        <input type="hidden" name="id" value={lead.id} />
                        <Select
                          name="status"
                          defaultValue={lead.status}
                          aria-label={`Alterar status de ${lead.nome}`}
                          className="h-8 text-xs"
                        >
                          {statusOrdem.map((s) => (
                            <option key={s} value={s}>
                              {statusLeadLabel[s]}
                            </option>
                          ))}
                        </Select>
                        <button
                          type="submit"
                          className="mt-1.5 text-[0.6875rem] font-semibold text-navy hover:text-gold-dim"
                        >
                          Salvar
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        </>
      )}
    </>
  );
}
