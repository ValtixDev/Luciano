import Image from "next/image";
import { enderecoCompleto, type Configuracao } from "@/lib/configuracoes";

/** Link curto oficial fornecido pelo Luciano — destino de qualquer clique no mapa. */
export const LINK_MAPS = "https://maps.app.goo.gl/XZJbudExRGuLdwS69";

/**
 * Mapa estático clicável, no lugar do iframe do Google.
 * Troca o custo de um iframe (JS de terceiro, ~1 MB e várias conexões) por uma
 * imagem de 322 KB que o Next ainda serve em AVIF. O clique abre o mapa real.
 */
export function Mapa({
  config,
  className = "",
}: {
  config: Configuracao;
  className?: string;
}) {
  const endereco = enderecoCompleto(config);

  return (
    <a
      href={LINK_MAPS}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Abrir no Google Maps: ${endereco}`}
      className={`group relative block overflow-hidden ${className}`}
    >
      <Image
        src="/mapa-escritorio.webp"
        alt={`Mapa da Jatiúca com o escritório de Luciano Góis marcado, em ${endereco}`}
        width={1398}
        height={1192}
        sizes="(min-width: 1024px) 55vw, 100vw"
        className="h-full w-full object-cover transition-transform duration-[900ms] ease-[var(--ease-out-soft)] group-hover:scale-[1.04]"
      />

      {/* Deixa claro que o mapa é clicável, sem cobrir o marcador. */}
      <span className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 bg-gradient-to-t from-navy-950/85 to-navy-950/0 px-5 pb-5 pt-12">
        <span className="text-xs font-semibold text-white">
          {config.endereco.rua}
        </span>
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold-marca">
          Abrir no Maps
          <span className="transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:translate-x-1">
            →
          </span>
        </span>
      </span>
    </a>
  );
}
