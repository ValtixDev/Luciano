type Torre = { x: number; w: number; h: number };

/** Três skylines determinísticas — evita repetição visível numa grade de cards. */
const CENAS: Torre[][] = [
  [
    { x: 30, w: 118, h: 236 },
    { x: 162, w: 92, h: 368 },
    { x: 268, w: 146, h: 292 },
    { x: 428, w: 100, h: 428 },
    { x: 542, w: 130, h: 258 },
    { x: 686, w: 86, h: 340 },
    { x: 786, w: 106, h: 214 },
  ],
  [
    { x: 18, w: 148, h: 322 },
    { x: 180, w: 84, h: 206 },
    { x: 278, w: 116, h: 396 },
    { x: 408, w: 164, h: 240 },
    { x: 586, w: 94, h: 352 },
    { x: 694, w: 118, h: 282 },
    { x: 826, w: 78, h: 200 },
  ],
  [
    { x: 26, w: 90, h: 404 },
    { x: 130, w: 138, h: 254 },
    { x: 282, w: 98, h: 336 },
    { x: 394, w: 124, h: 218 },
    { x: 532, w: 86, h: 388 },
    { x: 632, w: 150, h: 288 },
    { x: 796, w: 92, h: 232 },
  ],
];

const BASE = 600;
const PITCH = 20; // distância vertical entre fileiras de janelas
const ALTURA = 8; // altura da janela
const GAP = 6;

function Janelas({ torre, seed }: { torre: Torre; seed: number }) {
  const pad = 11;
  const util = torre.w - pad * 2;
  const cols = Math.max(2, Math.round(util / 24));
  const lw = (util - GAP * (cols - 1)) / cols;
  const linhas = Math.floor((torre.h - pad * 2) / PITCH);
  const topo = BASE - torre.h + pad;

  return (
    <>
      {Array.from({ length: linhas }).map((_, linha) =>
        Array.from({ length: cols }).map((__, col) => {
          // pseudoaleatório estável: servidor e cliente renderizam idêntico
          const n = (linha * 17 + col * 31 + seed * 43 + torre.x * 7) % 23;
          const apagada = n < 4;
          const acesa = n > 18;
          return (
            <rect
              key={`${linha}-${col}`}
              x={torre.x + pad + col * (lw + GAP)}
              y={topo + linha * PITCH}
              width={lw}
              height={ALTURA}
              fill={acesa ? "#e0cd9a" : "#ffffff"}
              opacity={acesa ? 0.3 : apagada ? 0.03 : 0.09}
            />
          );
        }),
      )}
    </>
  );
}

/**
 * Placeholder fotográfico com direção de arte própria — skyline em traço fino
 * sobre gradiente da marca. Substituir por <Image> quando as fotos reais
 * entrarem no Supabase Storage.
 */
export function PropertyPhoto({
  seed = 0,
  className = "",
  rotulo,
}: {
  seed?: number;
  className?: string;
  rotulo?: string;
}) {
  const cena = CENAS[seed % CENAS.length];
  const id = `ph${seed % CENAS.length}`;

  return (
    <div
      className={`relative overflow-hidden bg-navy ${className}`}
      role="img"
      aria-label={rotulo ?? "Imagem do imóvel em breve"}
    >
      <svg
        viewBox="0 0 880 600"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={`${id}-ceu`} x1="0" y1="0" x2="0.35" y2="1">
            <stop offset="0%" stopColor="#0b2a63" />
            <stop offset="52%" stopColor="#081f4c" />
            <stop offset="100%" stopColor="#040f28" />
          </linearGradient>
          <radialGradient id={`${id}-brilho`} cx="0.74" cy="0.2" r="0.5">
            <stop offset="0%" stopColor="#c2a24c" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#c2a24c" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`${id}-vinheta`} x1="0" y1="0.3" x2="0" y2="1">
            <stop offset="0%" stopColor="#040f28" stopOpacity="0" />
            <stop offset="100%" stopColor="#040f28" stopOpacity="0.8" />
          </linearGradient>
        </defs>

        <rect width="880" height="600" fill={`url(#${id}-ceu)`} />
        <rect width="880" height="600" fill={`url(#${id}-brilho)`} />

        <line x1="0" y1={BASE} x2="880" y2={BASE} stroke="#c2a24c" strokeOpacity="0.3" />

        {cena.map((torre, i) => (
          <g key={torre.x}>
            <rect
              x={torre.x}
              y={BASE - torre.h}
              width={torre.w}
              height={torre.h}
              fill="#0a1f45"
              fillOpacity={0.55 + (i % 3) * 0.12}
              stroke="#e0cd9a"
              strokeOpacity="0.12"
              strokeWidth="1"
            />
            <Janelas torre={torre} seed={seed + i} />
          </g>
        ))}

        <rect width="880" height="600" fill={`url(#${id}-vinheta)`} />
      </svg>

      <span className="absolute bottom-3 right-3 font-display text-[0.625rem] uppercase tracking-[0.2em] text-white/20">
        LG
      </span>
    </div>
  );
}

/** Marca circular usada onde uma foto de pessoa entraria. */
export function Monogram({ className = "" }: { className?: string }) {
  return (
    <span
      className={`flex items-center justify-center rounded-full border border-gold/40 bg-navy font-display leading-none tracking-tight text-gold-soft ${className}`}
      aria-hidden="true"
    >
      LG
    </span>
  );
}
