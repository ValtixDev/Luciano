"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { estiloBotao } from "@/components/ui/button";
import { navLinks } from "@/lib/site";
import type { Configuracao } from "@/lib/configuracoes";

export function SiteHeader({ config }: { config: Configuracao }) {
  const pathname = usePathname();
  const [rolou, setRolou] = useState(false);
  const [aberto, setAberto] = useState(false);

  const sobreposto = pathname === "/" && !rolou && !aberto;

  useEffect(() => {
    const onScroll = () => setRolou(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,box-shadow,backdrop-filter] duration-500 ease-[var(--ease-out-soft)] ${
        sobreposto
          ? "border-b border-white/0 bg-transparent"
          : "border-b border-sand bg-white/85 shadow-[0_1px_24px_-12px] shadow-navy/40 backdrop-blur-xl"
      }`}
    >
      <div
        className={`container-page flex items-center justify-between gap-8 transition-[height] duration-500 ease-[var(--ease-out-soft)] ${
          sobreposto ? "h-24" : "h-18"
        }`}
      >
        <Link href="/" className="flex shrink-0 items-center" aria-label={config.razao}>
          <Image
            src={config.logo}
            alt={config.razao}
            width={866}
            height={288}
            priority
            className={`w-auto transition-[height] duration-500 ease-[var(--ease-out-soft)] ${
              sobreposto ? "h-14" : "h-11"
            }`}
          />
        </Link>

        <nav className="hidden items-center gap-9 lg:flex">
          {navLinks.map((link) => {
            const ativo =
              link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`group relative py-1 text-[0.8125rem] font-medium transition-colors duration-300 ${
                  sobreposto
                    ? "text-white/75 hover:text-white"
                    : ativo
                      ? "text-navy"
                      : "text-muted hover:text-navy"
                }`}
              >
                {link.label}
                <span
                  className={`absolute inset-x-0 -bottom-0.5 h-px origin-left bg-gold transition-transform duration-400 ease-[var(--ease-out-soft)] ${
                    ativo ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center lg:flex">
          <Link href="/imoveis" className={estiloBotao("marca", "sm")}>
            Encontrar meu imóvel
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setAberto((v) => !v)}
          aria-expanded={aberto}
          aria-label={aberto ? "Fechar menu" : "Abrir menu"}
          className={`flex size-10 flex-col items-center justify-center gap-[5px] lg:hidden ${
            sobreposto ? "text-white" : "text-navy"
          }`}
        >
          <span
            className={`block h-px w-6 bg-current transition-transform duration-400 ease-[var(--ease-out-soft)] ${
              aberto ? "translate-y-[3px] rotate-45" : ""
            }`}
          />
          <span
            className={`block h-px w-6 bg-current transition-[transform,opacity] duration-400 ease-[var(--ease-out-soft)] ${
              aberto ? "-translate-y-[3px] -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      {/* Menu mobile */}
      <div
        className={`grid overflow-hidden border-sand bg-white transition-[grid-template-rows,border-width] duration-500 ease-[var(--ease-out-soft)] lg:hidden ${
          aberto ? "grid-rows-[1fr] border-t" : "grid-rows-[0fr] border-t-0"
        }`}
      >
        <nav className="min-h-0">
          <div className="container-page flex flex-col py-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setAberto(false)}
                className="border-b border-sand py-4 font-display text-xl text-navy last:border-0"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/imoveis"
              onClick={() => setAberto(false)}
              className={`${estiloBotao("marca")} my-5`}
            >
              Encontrar meu imóvel
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
