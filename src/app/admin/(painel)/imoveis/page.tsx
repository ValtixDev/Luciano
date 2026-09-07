import type { Metadata } from "next";
import Link from "next/link";
import { FotoImovel } from "@/components/foto-imovel";
import {
  AdminLinkButton,
  Badge,
  Card,
  EmptyState,
  PageHeader,
} from "@/components/admin/ui";
import { listarImoveisAdmin } from "@/lib/supabase/painel";
import { statusImovelCor } from "@/lib/admin";
import { formatPreco } from "@/lib/format";
import { statusLabel, tipoLabel } from "@/lib/imoveis";

export const metadata: Metadata = { title: "Imóveis" };

const th = "px-4 py-3 text-left text-[0.6875rem] font-semibold uppercase tracking-wider text-muted";
const td = "px-4 py-3.5 align-middle";

function PortalTag({ ativo, nome }: { ativo: boolean; nome: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-[0.625rem] font-semibold ${
        ativo ? "bg-emerald-100 text-emerald-800" : "bg-neutral-100 text-neutral-400"
      }`}
      title={ativo ? `Publicado no ${nome}` : `Fora do ${nome}`}
    >
      {nome}
    </span>
  );
}

export const dynamic = "force-dynamic";

export default async function AdminImoveisPage() {
  const lista = await listarImoveisAdmin();

  return (
    <>
      <PageHeader
        titulo="Imóveis"
        descricao={`${lista.length} imóveis no acervo · cadastro único que alimenta site, catálogo e portais.`}
        acao={
          <AdminLinkButton href="/admin/imoveis/novo">
            + Novo imóvel
          </AdminLinkButton>
        }
      />

      {lista.length === 0 ? (
        <EmptyState
          titulo="Nenhum imóvel cadastrado"
          texto="Cadastre o primeiro imóvel para que ele apareça no catálogo e nos portais."
          acao={
            <AdminLinkButton href="/admin/imoveis/novo">
              + Novo imóvel
            </AdminLinkButton>
          }
        />
      ) : (
        <>
        {/* No celular a tabela vira lista: oito colunas em rolagem horizontal
            são inutilizáveis em tela pequena. */}
        <ul className="space-y-3 lg:hidden">
          {lista.map((i, idx) => (
            <li key={i.id}>
              <Card className="p-4">
                <div className="flex gap-3">
                  <div className="size-16 shrink-0 overflow-hidden rounded-xl">
                    <FotoImovel
                      foto={i.fotos[0]}
                      alt={i.titulo}
                      seed={idx}
                      sizes="64px"
                      className="h-full w-full"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-graphite">{i.titulo}</p>
                    <p className="mt-0.5 text-xs text-muted">
                      {tipoLabel[i.tipo]} · {i.bairro}, {i.cidade}
                    </p>
                    <p className="num mt-1.5 text-sm font-semibold text-navy">
                      {formatPreco(i.preco, i.precoSobConsulta)}
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-sand pt-3">
                  <Badge cor={statusImovelCor[i.status]}>{statusLabel[i.status]}</Badge>
                  <PortalTag ativo={i.publicarSite} nome="Site" />
                  <PortalTag ativo={i.publicarOlx} nome="OLX" />
                  <PortalTag ativo={i.publicarZap} nome="ZAP" />
                  {i.isPlaceholder && (
                    <span className="text-[0.625rem] text-muted">placeholder</span>
                  )}

                  <span className="ml-auto flex items-center gap-3">
                    <Link
                      href={`/admin/imoveis/${i.id}`}
                      className="text-xs font-semibold text-navy"
                    >
                      Editar
                    </Link>
                    <Link
                      href={`/imovel/${i.slug}`}
                      target="_blank"
                      className="text-xs font-semibold text-muted"
                    >
                      Ver
                    </Link>
                  </span>
                </div>
              </Card>
            </li>
          ))}
        </ul>

        <Card className="hidden overflow-hidden lg:block">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[68rem] border-collapse text-sm">
              <thead className="border-b border-sand bg-offwhite">
                <tr>
                  <th className={th}>Imóvel</th>
                  <th className={th}>Código</th>
                  <th className={th}>Localização</th>
                  <th className={th}>Valor</th>
                  <th className={th}>Status</th>
                  <th className={th}>Publicação</th>
                  <th className={th}>Atualizado</th>
                  <th className={`${th} text-right`}>Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand">
                {lista.map((i, idx) => (
                  <tr key={i.id} className="transition-colors hover:bg-offwhite/60">
                    <td className={td}>
                      <div className="flex items-center gap-3">
                        <div className="size-12 shrink-0 overflow-hidden rounded-xl">
                          <FotoImovel
                            foto={i.fotos[0]}
                            alt={i.titulo}
                            seed={idx}
                            sizes="48px"
                            className="h-full w-full"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-graphite">
                            {i.titulo}
                          </p>
                          <p className="mt-0.5 text-xs text-muted">
                            {tipoLabel[i.tipo]}
                            {i.destaque && " · em destaque"}
                            {i.isPlaceholder && " · placeholder"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className={`${td} font-mono text-xs text-muted`}>{i.codigo}</td>
                    <td className={`${td} text-muted`}>
                      {i.bairro}
                      <span className="block text-xs">{i.cidade}/{i.estado}</span>
                    </td>
                    <td className={`${td} font-semibold text-graphite`}>
                      {formatPreco(i.preco, i.precoSobConsulta)}
                    </td>
                    <td className={td}>
                      <Badge cor={statusImovelCor[i.status]}>
                        {statusLabel[i.status]}
                      </Badge>
                    </td>
                    <td className={td}>
                      <div className="flex gap-1">
                        <PortalTag ativo={i.publicarSite} nome="Site" />
                        <PortalTag ativo={i.publicarOlx} nome="OLX" />
                        <PortalTag ativo={i.publicarZap} nome="ZAP" />
                      </div>
                    </td>
                    <td className={`${td} text-xs text-muted`}>
                      {new Date(`${i.atualizadoEm}T12:00:00`).toLocaleDateString("pt-BR")}
                    </td>
                    <td className={`${td} text-right whitespace-nowrap`}>
                      <Link
                        href={`/admin/imoveis/${i.id}`}
                        className="text-xs font-semibold text-navy hover:text-gold"
                      >
                        Editar
                      </Link>
                      <span className="px-2 text-sand">|</span>
                      <Link
                        href={`/imovel/${i.slug}`}
                        target="_blank"
                        className="text-xs font-semibold text-muted hover:text-navy"
                      >
                        Ver
                      </Link>
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
