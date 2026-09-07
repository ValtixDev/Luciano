import type { Metadata } from "next";
import Link from "next/link";
import { AdminLinkButton, Badge, Card, PageHeader } from "@/components/admin/ui";
import { CopiarLink } from "@/components/admin/copiar-link";
import { imoveisParaPortais } from "@/lib/feeds";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Integrações" };
export const dynamic = "force-dynamic";

const PORTAIS = [
  { nome: "VivaReal", flag: "publicarZap" as const },
  { nome: "ZAP Imóveis", flag: "publicarZap" as const },
  { nome: "OLX", flag: "publicarOlx" as const },
];

export default async function IntegracoesPage() {
  const itens = await imoveisParaPortais();
  const prontos = itens.filter((i) => i.pendencias.length === 0);
  const bloqueados = itens.filter((i) => i.pendencias.length > 0);
  const urlFeed = `${site.url}/feed/vrsync.xml`;

  return (
    <>
      <PageHeader
        titulo="Integrações"
        descricao="Os portais leem um arquivo XML gerado por este painel. Nada é postado por automação de navegador."
      />

      <Card className="mb-6 border-navy/15 bg-navy p-6 text-white">
        <p className="eyebrow text-gold-marca">Endereço do feed</p>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/75">
          Informe este endereço ao integrador de cada portal. VivaReal, ZAP e OLX
          pertencem ao mesmo grupo e leem o mesmo padrão — um arquivo atende os três.
        </p>

        <div className="mt-4">
          <CopiarLink url={urlFeed} />
        </div>

        <p className="mt-3 text-xs text-white/50">
          Regenerado a cada meia hora e a cada alteração de imóvel.
        </p>
      </Card>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <Card className="px-5 py-5">
          <p className="eyebrow text-muted">No feed agora</p>
          <p className="num mt-2 font-display text-2xl leading-none text-navy sm:text-[2rem]">
            {prontos.length}
          </p>
          <p className="mt-2 text-xs text-muted">Anúncios válidos</p>
        </Card>
        <Card className="px-5 py-5">
          <p className="eyebrow text-muted">Com pendência</p>
          <p
            className={`num mt-2 font-display text-2xl leading-none sm:text-[2rem] ${
              bloqueados.length > 0 ? "text-amber-700" : "text-navy"
            }`}
          >
            {bloqueados.length}
          </p>
          <p className="mt-2 text-xs text-muted">Marcados, mas fora do feed</p>
        </Card>
        {PORTAIS.filter((p) => p.nome !== "ZAP Imóveis").map((portal) => (
          <Card key={portal.nome} className="px-5 py-5">
            <p className="eyebrow text-muted">{portal.nome}</p>
            <p className="num mt-2 font-display text-2xl leading-none text-navy sm:text-[2rem]">
              {prontos.filter((i) => i.imovel[portal.flag]).length}
            </p>
            <p className="mt-2 text-xs text-muted">Imóveis marcados</p>
          </Card>
        ))}
      </div>

      {bloqueados.length > 0 && (
        <Card className="mb-6 border-amber-200 p-6">
          <h2 className="font-display text-xl tracking-tight text-navy">
            Pendências que impedem a publicação
          </h2>
          <p className="mt-1.5 text-sm text-muted">
            Estes imóveis estão marcados para os portais, mas o anúncio seria
            recusado. Eles ficam fora do XML até serem corrigidos.
          </p>

          <ul className="mt-5 divide-y divide-sand">
            {bloqueados.map(({ imovel, pendencias }) => (
              <li key={imovel.id} className="py-4">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="font-semibold text-graphite">{imovel.titulo}</p>
                  <Link
                    href={`/admin/imoveis/${imovel.id}`}
                    className="text-xs font-semibold text-navy hover:text-gold-dim"
                  >
                    Corrigir →
                  </Link>
                </div>
                <ul className="mt-2 space-y-1">
                  {pendencias.map((p) => (
                    <li key={p.campo} className="flex gap-2 text-xs text-muted">
                      <span className="font-semibold text-amber-700">{p.campo}</span>
                      <span>{p.motivo}</span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <Card className="p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="font-display text-xl tracking-tight text-navy">
            Anúncios no feed
          </h2>
          <AdminLinkButton href="/admin/imoveis" variante="secundaria">
            Gerenciar imóveis
          </AdminLinkButton>
        </div>

        {prontos.length === 0 ? (
          <p className="mt-5 rounded-lg border border-dashed border-sand-dark bg-offwhite px-5 py-8 text-center text-sm text-muted">
            Nenhum imóvel marcado para os portais ainda. Na edição de um imóvel,
            ative “Publicar na OLX” ou “Publicar no ZAP / VivaReal”.
          </p>
        ) : (
          <ul className="mt-5 divide-y divide-sand">
            {prontos.map(({ imovel }) => (
              <li key={imovel.id} className="flex flex-wrap items-center gap-x-3 gap-y-2 py-3.5">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-graphite">{imovel.titulo}</p>
                  <p className="mt-0.5 font-mono text-xs text-muted">{imovel.codigo}</p>
                </div>
                {imovel.publicarZap && <Badge>ZAP · VivaReal</Badge>}
                {imovel.publicarOlx && <Badge>OLX</Badge>}
                <span className="text-xs text-muted">
                  {imovel.fotos.length} {imovel.fotos.length === 1 ? "foto" : "fotos"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  );
}
