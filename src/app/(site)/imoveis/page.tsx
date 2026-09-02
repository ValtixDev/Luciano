import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { PropertyCard } from "@/components/property-card";
import { Reveal } from "@/components/reveal";
import { estiloBotao, Seta } from "@/components/ui/button";
import {
  estagioLabel,
  filtrar,
  listarBairros,
  ordenacoes,
  tipoLabel,
  type FiltroImoveis,
  type Ordenacao,
} from "@/lib/imoveis";
import type { EstagioObra, TipoImovel } from "@/types";

// Conteúdo vem do banco: revalida a cada minuto em vez de congelar no build.
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Imóveis à venda em Maceió e região",
  description:
    "Catálogo de apartamentos, casas, terrenos, salas comerciais e lançamentos em Maceió, Litoral Norte e região metropolitana.",
  alternates: { canonical: "/imoveis" },
};

const campo =
  "h-11 w-full appearance-none rounded-lg border border-sand bg-white px-3 text-sm text-graphite focus:border-navy focus:outline-none";
const rotulo = "eyebrow mb-2 block text-muted";

const primeiro = (v: string | string[] | undefined) =>
  (Array.isArray(v) ? v[0] : v) ?? "";

export default async function ImoveisPage({
  searchParams,
}: PageProps<"/imoveis">) {
  const sp = await searchParams;

  // O painel da home envia a faixa de preço como "min:max" num único select.
  const [faixaMin = "", faixaMax = ""] = primeiro(sp.faixa).split(":");

  const filtro: FiltroImoveis = {
    q: primeiro(sp.q),
    finalidade: primeiro(sp.finalidade),
    tipo: primeiro(sp.tipo),
    bairro: primeiro(sp.bairro),
    quartos: primeiro(sp.quartos),
    vagas: primeiro(sp.vagas),
    estagio: primeiro(sp.estagio),
    precoMin: primeiro(sp.precoMin) || faixaMin,
    precoMax: primeiro(sp.precoMax) || faixaMax,
    ordem: primeiro(sp.ordem) || "recentes",
  };

  const [resultados, bairros] = await Promise.all([filtrar(filtro), listarBairros()]);
  const temFiltro = Object.entries(filtro).some(
    ([chave, valor]) => chave !== "ordem" && valor,
  );

  return (
    <>
      <PageHero
        eyebrow="Catálogo"
        titulo="Meu catálogo"
        texto="Encontre imóveis disponíveis em Maceió e região."
      />

      <section className="bg-offwhite py-10 sm:py-14">
        <div className="container-page grid gap-10 lg:grid-cols-[280px_1fr]">
          {/* FILTROS */}
          <aside>
            {/* No celular os filtros ocupariam a tela inteira antes do primeiro
                resultado, então viram um bloco recolhível. A partir de lg o CSS
                força a abertura e esconde o resumo (ver globals.css). */}
            <details className="filtros sticky top-24 rounded-card border border-sand bg-white">
              <summary className="flex cursor-pointer list-none items-center justify-between p-5 lg:hidden">
                <span className="text-sm font-semibold text-navy">Filtrar imóveis</span>
                <span className="text-xs text-muted">Abrir</span>
              </summary>

              <form
                action="/imoveis"
                method="get"
                className="space-y-5 px-5 pb-5 lg:p-6"
              >
              <div>
                <label className={rotulo} htmlFor="q">
                  Busca
                </label>
                <input
                  id="q"
                  name="q"
                  type="search"
                  defaultValue={filtro.q}
                  placeholder="Bairro, código ou palavra-chave"
                  className={campo}
                />
              </div>

              <div>
                <label className={rotulo} htmlFor="finalidade">
                  Finalidade
                </label>
                <select
                  id="finalidade"
                  name="finalidade"
                  defaultValue={filtro.finalidade}
                  className={campo}
                >
                  <option value="">Comprar ou alugar</option>
                  <option value="venda">Comprar</option>
                  <option value="aluguel">Alugar</option>
                </select>
              </div>

              <div>
                <label className={rotulo} htmlFor="tipo">
                  Tipo
                </label>
                <select id="tipo" name="tipo" defaultValue={filtro.tipo} className={campo}>
                  <option value="">Todos os tipos</option>
                  {(Object.keys(tipoLabel) as TipoImovel[]).map((t) => (
                    <option key={t} value={t}>
                      {tipoLabel[t]}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={rotulo} htmlFor="bairro">
                  Bairro
                </label>
                <select
                  id="bairro"
                  name="bairro"
                  defaultValue={filtro.bairro}
                  className={campo}
                >
                  <option value="">Todos os bairros</option>
                  {bairros.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={rotulo} htmlFor="quartos">
                    Quartos
                  </label>
                  <select
                    id="quartos"
                    name="quartos"
                    defaultValue={filtro.quartos}
                    className={campo}
                  >
                    <option value="">Todos</option>
                    {[1, 2, 3, 4].map((n) => (
                      <option key={n} value={n}>
                        {n}+
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={rotulo} htmlFor="vagas">
                    Vagas
                  </label>
                  <select
                    id="vagas"
                    name="vagas"
                    defaultValue={filtro.vagas}
                    className={campo}
                  >
                    <option value="">Todas</option>
                    {[1, 2, 3].map((n) => (
                      <option key={n} value={n}>
                        {n}+
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={rotulo} htmlFor="precoMin">
                    Preço mín.
                  </label>
                  <input
                    id="precoMin"
                    name="precoMin"
                    type="number"
                    min={0}
                    step={10000}
                    defaultValue={filtro.precoMin}
                    placeholder="0"
                    className={campo}
                  />
                </div>
                <div>
                  <label className={rotulo} htmlFor="precoMax">
                    Preço máx.
                  </label>
                  <input
                    id="precoMax"
                    name="precoMax"
                    type="number"
                    min={0}
                    step={10000}
                    defaultValue={filtro.precoMax}
                    placeholder="Sem limite"
                    className={campo}
                  />
                </div>
              </div>

              <div>
                <label className={rotulo} htmlFor="estagio">
                  Estágio
                </label>
                <select
                  id="estagio"
                  name="estagio"
                  defaultValue={filtro.estagio}
                  className={campo}
                >
                  <option value="">Qualquer</option>
                  {(Object.keys(estagioLabel) as EstagioObra[]).map((e) => (
                    <option key={e} value={e}>
                      {estagioLabel[e]}
                    </option>
                  ))}
                </select>
              </div>

              <input type="hidden" name="ordem" value={filtro.ordem} />

              <div className="space-y-2 pt-1">
                <button type="submit" className={`${estiloBotao("primaria")} w-full`}>
                  Aplicar filtros
                </button>
                {temFiltro && (
                  <Link
                    href="/imoveis"
                    className={`${estiloBotao("secundaria")} w-full`}
                  >
                    Limpar
                  </Link>
                )}
              </div>
              </form>
            </details>
          </aside>

          {/* RESULTADOS */}
          <div>
            <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
              <p className="text-sm text-muted">
                <strong className="font-semibold text-graphite">
                  {resultados.length}
                </strong>{" "}
                {resultados.length === 1
                  ? "imóvel encontrado"
                  : "imóveis encontrados"}
              </p>

              <div className="flex flex-wrap gap-1.5">
                {(Object.keys(ordenacoes) as Ordenacao[]).map((o) => {
                  const params = new URLSearchParams(
                    Object.entries(filtro).filter(
                      ([chave, valor]) => valor && chave !== "ordem",
                    ) as [string, string][],
                  );
                  params.set("ordem", o);
                  const ativo = filtro.ordem === o;
                  return (
                    <Link
                      key={o}
                      href={`/imoveis?${params.toString()}`}
                      className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                        ativo
                          ? "border-navy bg-navy text-white"
                          : "border-sand bg-white text-muted hover:border-navy/30 hover:text-navy"
                      }`}
                    >
                      {ordenacoes[o]}
                    </Link>
                  );
                })}
              </div>
            </div>

            {resultados.length > 0 ? (
              <div className="grid gap-7 sm:grid-cols-2 xl:grid-cols-3">
                {resultados.map((imovel, i) => (
                  <Reveal key={imovel.id} delay={(i % 3) * 120}>
                    <PropertyCard imovel={imovel} seed={i} />
                  </Reveal>
                ))}
              </div>
            ) : (
              <div className="rounded-card border border-dashed border-navy/20 bg-white px-8 py-20 text-center">
                <h2 className="display-2 text-navy">
                  Nenhum imóvel com esses critérios
                </h2>
                <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
                  Ajuste os filtros ou fale com o Luciano — muitos imóveis são
                  apresentados de forma reservada, fora do catálogo público.
                </p>
                <Link href="/contato" className={`${estiloBotao("primaria")} mt-8`}>
                  Falar com Luciano <Seta />
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
