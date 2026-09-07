/**
 * Fundo animado de ondas em gradiente.
 *
 * Cada `path` cobre dois períodos idênticos numa viewBox de 2880, e a animação
 * desloca metade da largura — ao completar, o desenho coincide com o início e o
 * laço não tem emenda. Camadas com velocidades diferentes criam a profundidade.
 *
 * Tudo em CSS: nenhum quadro é calculado em JavaScript, e a regra global de
 * `prefers-reduced-motion` congela o movimento para quem pediu.
 */

const CAMADAS = [
  { id: "a", d: 140, amplitude: 78, duracao: 22, opacidade: 0.5, de: "#2f6fc4", para: "#14407f" },
  { id: "b", d: 175, amplitude: 62, duracao: 31, opacidade: 0.65, de: "#16437f", para: "#0c2a63" },
  { id: "c", d: 215, amplitude: 46, duracao: 43, opacidade: 0.9, de: "#0c2a63", para: "#040f28" },
] as const;

/** Duas cristas por período, repetidas para o laço fechar. */
function traçado(base: number, amp: number) {
  const p = 720;
  const pontos: string[] = [`M0,${base}`];
  for (let i = 0; i < 4; i++) {
    const x0 = i * p;
    const sobe = i % 2 === 0 ? -amp : amp;
    pontos.push(
      `C${x0 + p * 0.33},${base + sobe} ${x0 + p * 0.66},${base - sobe} ${x0 + p},${base}`,
    );
  }
  pontos.push("L2880,400 L0,400 Z");
  return pontos.join(" ");
}

export function Ondas() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Brilho dourado ao fundo, pulsando devagar. */}
      <div
        className="absolute left-1/2 top-[18%] size-[44rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(235,153,18,0.34)_0%,rgba(47,111,196,0.18)_45%,transparent_70%)] blur-3xl"
        style={{ animation: "brilho-pulsa 9s ease-in-out infinite" }}
      />

      <div className="absolute inset-x-0 bottom-0 h-[62%]">
        {CAMADAS.map((camada, i) => (
          <div
            key={camada.id}
            className="absolute inset-x-0 bottom-0 h-full"
            style={{
              animation: `onda-sobe ${camada.duracao / 2}s ease-in-out infinite`,
              animationDelay: `${i * 1.4}s`,
            }}
          >
            <svg
              viewBox="0 0 2880 400"
              preserveAspectRatio="none"
              className="absolute bottom-0 left-0 h-full w-[200%]"
              style={{
                animation: `onda-desliza ${camada.duracao}s linear infinite`,
                opacity: camada.opacidade,
              }}
            >
              <defs>
                <linearGradient id={`onda-${camada.id}`} x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor={camada.de} />
                  <stop offset="50%" stopColor={camada.para} />
                  <stop offset="100%" stopColor={camada.de} />
                </linearGradient>
              </defs>
              <path d={traçado(camada.d, camada.amplitude)} fill={`url(#onda-${camada.id})`} />
            </svg>
          </div>
        ))}

        {/* Fio dourado acompanhando a crista mais alta. */}
        <svg
          viewBox="0 0 2880 400"
          preserveAspectRatio="none"
          className="absolute bottom-0 left-0 h-full w-[200%] opacity-50"
          style={{ animation: "onda-desliza 22s linear infinite" }}
        >
          <path
            d={traçado(140, 78)}
            fill="none"
            stroke="#eb9912"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>
    </div>
  );
}
