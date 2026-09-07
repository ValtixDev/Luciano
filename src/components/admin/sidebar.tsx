"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { icones } from "@/components/admin/icones";
import { estaAtivo, grupos } from "@/components/admin/navegacao";
import { site } from "@/lib/site";

/**
 * Menu compartilhado pelo trilho e pela gaveta.
 * `compacto` esconde os rótulos até o trilho ser expandido pelo ponteiro.
 */
export function ListaNavegacao({
  compacto = false,
  aoNavegar,
}: {
  compacto?: boolean;
  aoNavegar?: () => void;
}) {
  const pathname = usePathname();

  return (
    <nav className="flex-1 space-y-6 py-6">
      {grupos.map((grupo, indice) => (
        <div key={grupo.titulo}>
          {/* Altura fixa: o rótulo some no trilho recolhido, mas o espaço
              permanece, senão os ícones saltariam ao expandir. No lugar dele
              entra um fio, que separa os grupos sem depender do texto. */}
          <div className="relative mb-2 h-3.5">
            <span
              className={`eyebrow absolute inset-x-5 top-0 text-[0.5rem] text-white/30 transition-opacity duration-200 ${
                compacto ? "opacity-0 group-hover/trilho:opacity-100" : "opacity-100"
              }`}
            >
              {grupo.titulo}
            </span>
            {compacto && indice > 0 && (
              <span
                aria-hidden="true"
                className="absolute inset-x-6 top-1/2 h-px bg-white/[0.08] transition-opacity duration-200 group-hover/trilho:opacity-0"
              />
            )}
          </div>

          <ul className="space-y-1 px-3">
            {grupo.itens.map((item) => {
              const ativo = estaAtivo(pathname, item.href, item.exato);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={aoNavegar}
                    aria-current={ativo ? "page" : undefined}
                    title={compacto ? item.label : undefined}
                    className={`group/item relative flex items-center gap-3 rounded-xl py-2.5 pl-3 pr-3 transition-colors duration-200 ${
                      ativo
                        ? "bg-white/[0.09] text-white"
                        : "text-white/55 hover:bg-white/[0.05] hover:text-white"
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full bg-gold-marca transition-transform duration-300 ease-[var(--ease-out-soft)] ${
                        ativo ? "scale-y-100" : "scale-y-0"
                      }`}
                    />

                    <span
                      className={`grid size-6 shrink-0 place-items-center transition-colors duration-200 ${
                        ativo ? "text-gold-marca" : "text-current"
                      }`}
                    >
                      {icones[item.icone]("size-[1.15rem]")}
                    </span>

                    <span
                      className={`whitespace-nowrap text-sm font-medium transition-opacity duration-200 ${
                        compacto ? "opacity-0 group-hover/trilho:opacity-100" : "opacity-100"
                      }`}
                    >
                      {item.label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

export function MarcaPainel({
  compacto = false,
  aoNavegar,
}: {
  compacto?: boolean;
  aoNavegar?: () => void;
}) {
  return (
    <Link
      href="/admin"
      onClick={aoNavegar}
      className="flex h-16 shrink-0 items-center gap-3 border-b border-white/[0.08] px-4"
    >
      <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-gold-marca/30 bg-gold-marca/10 font-display text-sm leading-none text-gold-marca">
        LG
      </span>
      <span
        className={`min-w-0 transition-opacity duration-200 ${
          compacto ? "opacity-0 group-hover/trilho:opacity-100" : "opacity-100"
        }`}
      >
        <Image
          src="/logo-luciano-gois.webp"
          alt={site.razao}
          width={866}
          height={288}
          className="h-5 w-auto max-w-none"
        />
      </span>
    </Link>
  );
}

/**
 * Trilho de 4,5rem que abre para 15rem ao passar o ponteiro.
 *
 * O espaçador mantém a largura recolhida no fluxo e o painel flutua por cima:
 * assim a expansão não empurra o conteúdo da página a cada passagem do mouse.
 */
export function AdminSidebar() {
  return (
    <div className="hidden w-[4.5rem] shrink-0 lg:block">
      <aside className="group/trilho fixed inset-y-0 left-0 z-40 flex w-[4.5rem] flex-col overflow-hidden border-r border-white/[0.06] bg-[linear-gradient(180deg,#0a2559_0%,#081f4c_55%,#040f28_100%)] transition-[width,box-shadow] duration-300 ease-[var(--ease-out-soft)] hover:w-60 hover:shadow-[0_0_60px_-12px] hover:shadow-navy-950">
        <MarcaPainel compacto />
        <ListaNavegacao compacto />

        <div className="border-t border-white/[0.08] p-3">
          <Link
            href="/"
            title="Ver o site"
            className="flex items-center gap-3 rounded-xl py-2.5 pl-3 pr-3 text-white/55 transition-colors duration-200 hover:bg-white/[0.05] hover:text-white"
          >
            <span className="grid size-6 shrink-0 place-items-center">
              {icones.site("size-[1.15rem]")}
            </span>
            <span className="whitespace-nowrap text-sm font-medium opacity-0 transition-opacity duration-200 group-hover/trilho:opacity-100">
              Ver o site
            </span>
          </Link>
        </div>
      </aside>
    </div>
  );
}
