"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { estaAtivo, grupos } from "@/components/admin/navegacao";
import { site } from "@/lib/site";

/** Menu compartilhado pela barra lateral fixa e pela gaveta do celular. */
export function ListaNavegacao({ aoNavegar }: { aoNavegar?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex-1 space-y-7 px-4 py-7">
      {grupos.map((grupo) => (
        <div key={grupo.titulo}>
          <p className="eyebrow px-3 pb-2.5 text-[0.5625rem] text-white/35">
            {grupo.titulo}
          </p>
          <ul className="space-y-0.5">
            {grupo.itens.map((item) => {
              const ativo = estaAtivo(pathname, item.href, "exato" in item ? item.exato : false);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={aoNavegar}
                    aria-current={ativo ? "page" : undefined}
                    className={`relative block rounded-lg py-3 pl-4 pr-3 text-sm transition-[background-color,color] duration-200 lg:py-2.5 ${
                      ativo
                        ? "bg-white/10 font-semibold text-white"
                        : "text-white/60 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <span
                      className={`absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-gold-marca transition-transform duration-300 ease-[var(--ease-out-soft)] ${
                        ativo ? "scale-y-100" : "scale-y-0"
                      }`}
                    />
                    {item.label}
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

export function MarcaPainel({ aoNavegar }: { aoNavegar?: () => void }) {
  return (
    <Link
      href="/admin"
      onClick={aoNavegar}
      className="flex flex-col gap-3 border-b border-white/10 px-6 py-5"
    >
      <Image
        src="/logo-luciano-gois.webp"
        alt={site.razao}
        width={866}
        height={288}
        className="h-7 w-auto"
      />
      <span className="eyebrow text-[0.5625rem] text-white/40">Painel</span>
    </Link>
  );
}

/** Barra lateral fixa — só a partir de lg. No celular, ver `TopoPainel`. */
export function AdminSidebar() {
  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-navy-700/40 bg-navy lg:flex">
      <MarcaPainel />
      <ListaNavegacao />
      <div className="border-t border-white/10 p-4">
        <Link
          href="/"
          className="block rounded-lg px-3 py-2.5 text-sm text-white/60 transition-colors hover:bg-white/5 hover:text-white"
        >
          ← Ver o site
        </Link>
      </div>
    </aside>
  );
}
