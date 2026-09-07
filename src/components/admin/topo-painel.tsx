"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ListaNavegacao, MarcaPainel } from "@/components/admin/sidebar";
import { BotaoSair } from "@/components/admin/botao-sair";
import { site } from "@/lib/site";

/**
 * Cabeçalho do painel com a gaveta de navegação do celular.
 *
 * A barra lateral é `hidden lg:flex`; sem esta gaveta, não havia como sair do
 * Dashboard num aparelho pequeno.
 */
export function TopoPainel({ email }: { email: string }) {
  const [aberto, setAberto] = useState(false);
  const pathname = usePathname();
  const [rotaAberta, setRotaAberta] = useState(pathname);

  // Fecha ao mudar de rota (inclusive pelo botão voltar). Comparar durante a
  // renderização evita o efeito que fechava a gaveta já na montagem.
  if (pathname !== rotaAberta) {
    setRotaAberta(pathname);
    if (aberto) setAberto(false);
  }

  // Trava a rolagem do fundo enquanto a gaveta está aberta.
  useEffect(() => {
    document.body.style.overflow = aberto ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [aberto]);

  useEffect(() => {
    if (!aberto) return;
    const aoTeclar = (e: KeyboardEvent) => e.key === "Escape" && setAberto(false);
    window.addEventListener("keydown", aoTeclar);
    return () => window.removeEventListener("keydown", aoTeclar);
  }, [aberto]);

  return (
    <>
      <header className="flex h-16 items-center justify-between gap-3 border-b border-sand bg-white px-4 sm:px-6">
        <button
          type="button"
          onClick={() => setAberto(true)}
          aria-label="Abrir menu"
          aria-expanded={aberto}
          className="-ml-1 flex size-10 shrink-0 flex-col items-center justify-center gap-[5px] rounded-lg text-navy transition-colors hover:bg-offwhite lg:hidden"
        >
          <span className="block h-px w-5 bg-current" />
          <span className="block h-px w-5 bg-current" />
          <span className="block h-px w-5 bg-current" />
        </button>

        <p className="hidden truncate text-sm text-muted lg:block">{site.razao}</p>

        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <span className="hidden min-w-0 text-right text-xs leading-tight sm:block">
            <span className="block truncate font-semibold text-graphite">{email}</span>
            <span className="block text-muted">{site.creci}</span>
          </span>
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-navy font-display text-xs leading-none text-gold-soft">
            LG
          </span>
          <BotaoSair />
        </div>
      </header>

      {/* Gaveta */}
      <div
        className={`fixed inset-0 z-50 lg:hidden ${aberto ? "" : "pointer-events-none"}`}
        aria-hidden={!aberto}
      >
        <button
          type="button"
          tabIndex={-1}
          aria-label="Fechar menu"
          onClick={() => setAberto(false)}
          className={`absolute inset-0 bg-navy-950/60 transition-opacity duration-300 ${
            aberto ? "opacity-100" : "opacity-0"
          }`}
        />

        <div
          role="dialog"
          aria-label="Navegação do painel"
          className={`absolute inset-y-0 left-0 flex w-64 max-w-[80vw] flex-col bg-navy shadow-2xl transition-transform duration-300 ease-[var(--ease-out-soft)] ${
            aberto ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <MarcaPainel aoNavegar={() => setAberto(false)} />
            </div>
            <button
              type="button"
              onClick={() => setAberto(false)}
              aria-label="Fechar menu"
              className="p-4 text-white/50 transition-colors hover:text-white"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <ListaNavegacao aoNavegar={() => setAberto(false)} />
          </div>

          <div className="border-t border-white/10 p-4">
            <p className="truncate px-3 pb-3 text-[0.6875rem] text-white/40">{email}</p>
            <Link
              href="/"
              onClick={() => setAberto(false)}
              className="block rounded-lg px-3 py-2.5 text-sm text-white/60 transition-colors hover:bg-white/5 hover:text-white"
            >
              ← Ver o site
            </Link>
          </div>
        </div>
      </div>

    </>
  );
}
