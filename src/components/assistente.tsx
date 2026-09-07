"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { arvore, type Opcao } from "@/data/assistente";
import { linkWhatsapp, type Configuracao } from "@/lib/configuracoes";

type Fala = { autor: "assistente" | "voce"; texto: string };

const ROTULOS: Record<string, string> = {
  finalidade: "finalidade",
  tipo: "tipo",
  precoMin: "a partir de",
  precoMax: "até",
  q: "região",
};

/** Frase que resume as escolhas, usada na mensagem do WhatsApp. */
function resumir(filtro: Record<string, string>) {
  const brl = (v: string) =>
    Number(v).toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

  return Object.entries(filtro)
    .map(([chave, valor]) =>
      chave === "precoMin" || chave === "precoMax"
        ? `${ROTULOS[chave]} ${brl(valor)}`
        : `${ROTULOS[chave] ?? chave}: ${valor}`,
    )
    .join(", ");
}

/** Pausa proporcional ao tamanho da resposta, entre 0,45s e 1,4s. */
function tempoDeDigitacao(texto: string) {
  return Math.min(1400, Math.max(450, texto.length * 13));
}

export function Assistente({ config }: { config: Configuracao }) {
  const [aberto, setAberto] = useState(false);
  const [noAtual, setNoAtual] = useState("inicio");
  const [filtro, setFiltro] = useState<Record<string, string>>({});
  const [falas, setFalas] = useState<Fala[]>([]);
  const [digitando, setDigitando] = useState(false);

  const fim = useRef<HTMLDivElement>(null);
  const painel = useRef<HTMLDivElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Fecha qualquer digitação pendente ao desmontar, para não escrever num
  // componente que já saiu da tela.
  useEffect(() => {
    const pendentes = timers.current;
    return () => pendentes.forEach(clearTimeout);
  }, []);

  const responder = useCallback((texto: string) => {
    const semMovimento =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (semMovimento) {
      setFalas((atuais) => [...atuais, { autor: "assistente", texto }]);
      return;
    }

    // Cancela digitação pendente: dois cliques rápidos não podem enfileirar
    // duas respostas para a mesma pergunta.
    timers.current.forEach(clearTimeout);
    timers.current = [];

    setDigitando(true);
    const timer = setTimeout(() => {
      setDigitando(false);
      setFalas((atuais) => [...atuais, { autor: "assistente", texto }]);
    }, tempoDeDigitacao(texto));
    timers.current.push(timer);
  }, []);

  // Mantém a conversa rolada para a última fala.
  useEffect(() => {
    fim.current?.scrollIntoView({ block: "end" });
  }, [falas, digitando]);

  // Esc fecha, como qualquer diálogo.
  useEffect(() => {
    if (!aberto) return;
    const aoTeclar = (e: KeyboardEvent) => e.key === "Escape" && setAberto(false);
    window.addEventListener("keydown", aoTeclar);
    return () => window.removeEventListener("keydown", aoTeclar);
  }, [aberto]);

  const no = arvore[noAtual];

  function escolher(opcao: Opcao) {
    if (digitando) return;

    setFalas((atuais) => [...atuais, { autor: "voce", texto: opcao.rotulo }]);

    if (opcao.whatsapp) {
      window.open(linkWhatsapp(config, opcao.whatsapp), "_blank", "noopener,noreferrer");
      responder("Abri o WhatsApp com essa mensagem pronta. É só enviar.");
      return;
    }

    if (opcao.resposta) {
      responder(opcao.resposta);
      setNoAtual("duvidas");
      return;
    }

    const proximo = opcao.proximo ?? "inicio";
    setFiltro((atual) => ({ ...atual, ...(opcao.filtro ?? {}) }));
    setNoAtual(proximo);
    responder(arvore[proximo].pergunta);
  }

  /**
   * A saudação é digitada na primeira abertura, não antes.
   *
   * O disparo fica FORA do updater do setAberto: o React invoca updaters duas
   * vezes em modo estrito para flagrar impureza, e um efeito colateral ali
   * dentro roda em duplicidade — era o que repetia o "Olá".
   */
  function alternar() {
    const abrindo = !aberto;
    setAberto(abrindo);
    if (abrindo && falas.length === 0) responder(arvore.inicio.pergunta);
  }

  function recomecar() {
    timers.current.forEach(clearTimeout);
    setDigitando(false);
    setNoAtual("inicio");
    setFiltro({});
    setFalas([]);
    responder(arvore.inicio.pergunta);
  }

  const resumo = resumir(filtro);
  const querystring = new URLSearchParams(filtro).toString();

  return (
    <>
      {/* Painel */}
      <div
        ref={painel}
        role="dialog"
        aria-label="Assistente de busca"
        aria-modal="false"
        className={`fixed bottom-24 right-4 z-50 flex w-[min(22rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-card border border-sand bg-white shadow-[0_32px_80px_-24px] shadow-navy/50 transition-[opacity,transform] duration-400 ease-[var(--ease-out-soft)] sm:right-6 ${
          aberto
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none translate-y-3 opacity-0"
        }`}
      >
        <header className="flex items-center gap-3 bg-navy px-5 py-4 text-white">
          <span className="flex size-9 items-center justify-center rounded-full border border-gold/40 font-display text-xs leading-none text-gold-soft">
            LG
          </span>
          <span className="leading-tight">
            <span className="block text-sm font-semibold">Assistente</span>
            <span className="block text-[0.6875rem] text-white/50">
              {config.nome} · respostas na hora
            </span>
          </span>
          <button
            type="button"
            onClick={() => setAberto(false)}
            aria-label="Fechar assistente"
            className="ml-auto text-white/60 transition-colors hover:text-white"
          >
            ✕
          </button>
        </header>

        <div
          aria-live="polite"
          className="max-h-72 space-y-3 overflow-y-auto bg-offwhite px-5 py-5"
        >
          {falas.map((fala, i) => (
            <p
              key={i}
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                fala.autor === "assistente"
                  ? "bg-white text-graphite shadow-sm"
                  : "ml-auto bg-navy text-white"
              }`}
            >
              {fala.texto}
            </p>
          ))}
          {digitando && (
            <p
              className="flex w-fit items-center gap-1 rounded-2xl bg-white px-4 py-3.5 shadow-sm"
              aria-label="Digitando"
            >
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="size-1.5 rounded-full bg-muted"
                  style={{
                    animation: "ponto-digitando 1.2s ease-in-out infinite",
                    animationDelay: `${i * 160}ms`,
                  }}
                />
              ))}
            </p>
          )}
          <div ref={fim} />
        </div>

        <div
          className={`space-y-2 border-t border-sand px-5 py-4 transition-opacity duration-300 ${
            digitando ? "pointer-events-none opacity-40" : "opacity-100"
          }`}
        >
          {no.final ? (
            <>
              {resumo && (
                <p className="pb-1 text-xs text-muted">
                  Procurando por: <span className="text-graphite">{resumo}</span>
                </p>
              )}
              <Link
                href={querystring ? `/imoveis?${querystring}` : "/imoveis"}
                onClick={() => setAberto(false)}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-navy text-[0.8125rem] font-semibold text-white transition-colors hover:bg-navy-700"
              >
                Ver imóveis que combinam →
              </Link>
              <a
                href={linkWhatsapp(
                  config,
                  `Olá Luciano, vim pelo site procurando imóvel${resumo ? ` — ${resumo}` : ""}. Pode me ajudar?`,
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 w-full items-center justify-center rounded-full bg-gold-marca text-[0.8125rem] font-semibold text-navy-950 transition-colors hover:bg-gold-marca-claro"
              >
                Falar com Luciano
              </a>
              <button
                type="button"
                onClick={recomecar}
                className="w-full pt-1 text-xs font-semibold text-muted transition-colors hover:text-navy"
              >
                Recomeçar
              </button>
            </>
          ) : (
            <>
              {no.opcoes.map((opcao) => (
                <button
                  key={opcao.rotulo}
                  type="button"
                  onClick={() => escolher(opcao)}
                  className="w-full rounded-full border border-sand px-4 py-2.5 text-left text-[0.8125rem] font-medium text-navy transition-colors duration-200 hover:border-navy hover:bg-navy hover:text-white"
                >
                  {opcao.rotulo}
                </button>
              ))}
              {noAtual !== "inicio" && (
                <button
                  type="button"
                  onClick={recomecar}
                  className="w-full pt-1 text-xs font-semibold text-muted transition-colors hover:text-navy"
                >
                  Recomeçar
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Botão flutuante */}
      <button
        type="button"
        onClick={alternar}
        aria-expanded={aberto}
        aria-label={aberto ? "Fechar assistente" : "Abrir assistente"}
        className="group fixed bottom-6 right-4 z-50 flex items-center gap-0 rounded-full bg-navy p-2.5 text-white shadow-[0_16px_40px_-12px] shadow-navy/70 transition-[gap,padding,background-color] duration-500 ease-[var(--ease-out-soft)] hover:gap-3 hover:bg-navy-700 hover:pr-6 sm:right-6"
      >
        <span className="flex size-11 items-center justify-center rounded-full border border-gold/40 font-display text-sm leading-none text-gold-soft transition-colors duration-500 group-hover:border-gold">
          LG
        </span>
        <span
          className={`grid transition-[grid-template-columns] duration-500 ease-[var(--ease-out-soft)] ${
            aberto ? "grid-cols-[0fr]" : "grid-cols-[0fr] group-hover:grid-cols-[1fr]"
          }`}
        >
          <span className="overflow-hidden whitespace-nowrap text-sm font-semibold">
            Como posso ajudar?
          </span>
        </span>
      </button>
    </>
  );
}
