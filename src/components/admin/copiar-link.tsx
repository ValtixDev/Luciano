"use client";

import { useState } from "react";

export function CopiarLink({ url }: { url: string }) {
  const [copiado, setCopiado] = useState(false);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <code className="min-w-0 flex-1 truncate rounded-lg border border-white/15 bg-navy-950/50 px-3 py-2.5 font-mono text-xs text-gold-soft">
        {url}
      </code>
      <button
        type="button"
        onClick={async () => {
          await navigator.clipboard.writeText(url);
          setCopiado(true);
          setTimeout(() => setCopiado(false), 2000);
        }}
        className="h-10 shrink-0 rounded-lg bg-gold-marca px-4 text-xs font-semibold text-navy-950 transition-colors hover:bg-gold-marca-claro"
      >
        {copiado ? "Copiado" : "Copiar"}
      </button>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="h-10 shrink-0 rounded-lg border border-white/20 px-4 text-xs font-semibold leading-10 text-white/80 transition-colors hover:border-gold-marca hover:text-white"
      >
        Abrir
      </a>
    </div>
  );
}
