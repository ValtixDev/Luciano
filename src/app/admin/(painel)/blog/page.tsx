import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  AdminLinkButton,
  Badge,
  Card,
  EmptyState,
  PageHeader,
} from "@/components/admin/ui";
import { listarPostsAdmin } from "@/lib/supabase/painel";
import { formatData } from "@/lib/format";

export const metadata: Metadata = { title: "Blog" };

const th = "px-4 py-3 text-left text-[0.6875rem] font-semibold uppercase tracking-wider text-muted";
const td = "px-4 py-3.5 align-middle";

export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
  const lista = await listarPostsAdmin();

  return (
    <>
      <PageHeader
        titulo="Blog"
        descricao="Publique artigos sem depender de ninguém — cada post gera URL própria e entra no sitemap."
        acao={
          <AdminLinkButton href="/admin/blog/novo">+ Novo artigo</AdminLinkButton>
        }
      />

      {lista.length === 0 ? (
        <EmptyState
          titulo="Nenhum artigo ainda"
          texto="O primeiro artigo já entra no sitemap e passa a ser rastreado pelo Google."
          acao={
            <AdminLinkButton href="/admin/blog/novo">+ Novo artigo</AdminLinkButton>
          }
        />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[52rem] border-collapse text-sm">
              <thead className="border-b border-sand bg-offwhite">
                <tr>
                  <th className={th}>Artigo</th>
                  <th className={th}>Categoria</th>
                  <th className={th}>Autor</th>
                  <th className={th}>Publicado</th>
                  <th className={th}>Status</th>
                  <th className={`${th} text-right`}>Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand">
                {lista.map((p) => (
                  <tr key={p.slug} className="transition-colors hover:bg-offwhite/60">
                    <td className={td}>
                      <div className="flex items-center gap-3">
                        {p.capa ? (
                          <Image
                            src={p.capa.src}
                            alt=""
                            width={160}
                            height={100}
                            sizes="80px"
                            className="h-12 w-20 shrink-0 rounded-lg object-cover"
                          />
                        ) : (
                          <span className="flex h-12 w-20 shrink-0 items-center justify-center rounded-lg border border-dashed border-sand-dark text-[0.5625rem] text-muted">
                            sem capa
                          </span>
                        )}
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-graphite">{p.titulo}</p>
                          <p className="mt-0.5 truncate font-mono text-xs text-muted">/blog/{p.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className={`${td} text-muted`}>{p.categoria}</td>
                    <td className={`${td} text-muted`}>{p.autor}</td>
                    <td className={`${td} whitespace-nowrap text-xs text-muted`}>
                      {formatData(p.publicadoEm)}
                    </td>
                    <td className={td}>
                      <Badge
                        cor={
                          p.status === "publicado"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-neutral-200 text-neutral-600"
                        }
                      >
                        {p.status === "publicado" ? "Publicado" : "Rascunho"}
                      </Badge>
                    </td>
                    <td className={`${td} whitespace-nowrap text-right`}>
                      <Link
                        href={`/admin/blog/${p.slug}`}
                        className="text-xs font-semibold text-navy hover:text-gold"
                      >
                        Editar
                      </Link>
                      <span className="px-2 text-sand">|</span>
                      <Link
                        href={`/blog/${p.slug}`}
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
      )}
    </>
  );
}
