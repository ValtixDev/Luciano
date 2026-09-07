import Link from "next/link";
import { FotoImovel } from "@/components/foto-imovel";
import { formatArea, formatPreco } from "@/lib/format";
import { estagioLabel, tipoLabel } from "@/lib/imoveis";
import type { Imovel } from "@/types";

function Spec({ valor, rotulo }: { valor: string; rotulo: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="num text-sm font-semibold text-graphite">{valor}</span>
      <span className="text-[0.625rem] uppercase tracking-[0.12em] text-muted">
        {rotulo}
      </span>
    </div>
  );
}

export function PropertyCard({
  imovel,
  seed = 0,
}: {
  imovel: Imovel;
  seed?: number;
}) {
  const finalidade = imovel.finalidade.includes("venda") ? "Venda" : "Aluguel";

  return (
    <Link
      href={`/imovel/${imovel.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-card border border-sand bg-white transition-[border-color,box-shadow,transform] duration-500 ease-[var(--ease-out-soft)] hover:-translate-y-1.5 hover:border-sand-dark hover:shadow-[0_24px_60px_-32px] hover:shadow-navy/50"
    >
      <div className="relative aspect-4/3 overflow-hidden">
        {/* O zoom de hover fica no contêiner: a escala da foto já é usada
            pelo enquadramento definido no painel. */}
        <div className="h-full w-full transition-transform duration-[900ms] ease-[var(--ease-out-soft)] group-hover:scale-[1.06]">
          <FotoImovel
            foto={imovel.fotos[0]}
            alt={imovel.titulo}
            seed={seed}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="h-full w-full"
          />
        </div>

        <div className="absolute left-4 top-4 flex flex-wrap gap-1.5">
          <span className="eyebrow rounded-full bg-white/95 px-3 py-1.5 text-[0.5625rem] text-navy backdrop-blur-sm">
            {finalidade}
          </span>
          {imovel.tipo === "lancamento" && (
            <span className="eyebrow rounded-full bg-gold px-3 py-1.5 text-[0.5625rem] text-navy-950">
              Lançamento
            </span>
          )}
        </div>

        {/* Preço sobre a imagem: hierarquia mais forte que num rodapé de card. */}
        <div className="absolute inset-x-0 bottom-0 translate-y-0 p-5">
          <p className="num font-display text-2xl text-white drop-shadow-sm">
            {formatPreco(imovel.preco, imovel.precoSobConsulta)}
          </p>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-6">
        <div className="space-y-2">
          <p className="eyebrow text-[0.5625rem] text-gold-dim">
            {tipoLabel[imovel.tipo]} · {estagioLabel[imovel.estagio]}
          </p>
          <h3 className="display-3 texto-quebravel text-navy transition-colors duration-300 group-hover:text-navy-500">
            {imovel.titulo}
          </h3>
          <p className="text-sm text-muted">
            {imovel.bairro}, {imovel.cidade}
          </p>
        </div>

        <div className="mt-auto grid grid-cols-4 gap-3 border-t border-sand pt-5">
          <Spec valor={String(imovel.quartos)} rotulo="quartos" />
          <Spec valor={String(imovel.suites)} rotulo="suítes" />
          <Spec valor={String(imovel.vagas)} rotulo="vagas" />
          <Spec valor={formatArea(imovel.areaUtil ?? imovel.areaTotal)} rotulo="área" />
        </div>

        <span className="flex items-center gap-2 text-xs font-semibold text-navy">
          <span className="relative overflow-hidden">
            Ver imóvel
            <span className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-gold transition-transform duration-400 ease-[var(--ease-out-soft)] group-hover:scale-x-100" />
          </span>
          <span className="transition-transform duration-400 ease-[var(--ease-out-soft)] group-hover:translate-x-1.5">
            →
          </span>
        </span>
      </div>
    </Link>
  );
}
