/** Blocos de carregamento. `animate-pulse` sem conteúdo evita salto de layout. */
export function Bloco({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-sand ${className}`} />;
}

export function EsqueletoPagina({ cards = 5, linhas = 6 }: { cards?: number; linhas?: number }) {
  return (
    <div aria-busy="true" aria-label="Carregando">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div className="space-y-3">
          <Bloco className="h-8 w-56" />
          <Bloco className="h-4 w-80" />
        </div>
        <Bloco className="h-10 w-36" />
      </div>

      {cards > 0 && (
        <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {Array.from({ length: cards }).map((_, i) => (
            <div key={i} className="rounded-card border border-sand bg-white px-5 py-5">
              <Bloco className="h-3 w-24" />
              <Bloco className="mt-3 h-8 w-16" />
              <Bloco className="mt-3 h-3 w-28" />
            </div>
          ))}
        </div>
      )}

      <div className="overflow-hidden rounded-card border border-sand bg-white">
        <div className="border-b border-sand bg-offwhite px-4 py-3">
          <Bloco className="h-3 w-40" />
        </div>
        <div className="divide-y divide-sand">
          {Array.from({ length: linhas }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-4 py-4">
              <Bloco className="size-12 shrink-0 rounded-xl" />
              <div className="flex-1 space-y-2">
                <Bloco className="h-4 w-1/3" />
                <Bloco className="h-3 w-1/4" />
              </div>
              <Bloco className="h-6 w-20 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
