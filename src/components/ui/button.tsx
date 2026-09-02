import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variante = "primaria" | "secundaria" | "clara" | "ouro" | "marca" | "fantasma";

const base =
  "group/btn relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-full text-[0.8125rem] font-semibold tracking-[0.02em] transition-[background-color,border-color,color,box-shadow,transform] duration-300 ease-[var(--ease-out-soft)] active:scale-[0.98]";

const tamanhos = {
  sm: "h-10 px-5",
  md: "h-12 px-7",
  lg: "h-14 px-9 text-sm",
} as const;

const variantes: Record<Variante, string> = {
  primaria:
    "bg-navy text-white hover:bg-navy-700 hover:shadow-[0_12px_32px_-12px] hover:shadow-navy/60",
  secundaria:
    "border border-sand-dark bg-transparent text-navy hover:border-navy hover:bg-navy hover:text-white",
  clara:
    "border border-white/25 text-white hover:border-gold hover:bg-white/[0.06]",
  ouro:
    "bg-gold text-navy-950 hover:bg-gold-soft hover:shadow-[0_12px_32px_-12px] hover:shadow-gold/70",
  marca:
    "bg-gold-marca text-navy-950 hover:bg-gold-marca-claro hover:shadow-[0_12px_32px_-12px] hover:shadow-gold-marca/70",
  fantasma: "text-navy hover:text-gold",
};

/** Seta que desliza no hover — micro-interação padrão dos CTAs. */
export function Seta() {
  return (
    <span
      aria-hidden="true"
      className="inline-block transition-transform duration-300 ease-[var(--ease-out-soft)] group-hover/btn:translate-x-1"
    >
      →
    </span>
  );
}

type Props = {
  variante?: Variante;
  tamanho?: keyof typeof tamanhos;
  children: ReactNode;
  className?: string;
} & Omit<ComponentProps<typeof Link>, "className" | "children">;

export function BotaoLink({
  variante = "primaria",
  tamanho = "md",
  className = "",
  children,
  ...props
}: Props) {
  return (
    <Link
      className={`${base} ${tamanhos[tamanho]} ${variantes[variante]} ${className}`}
      {...props}
    >
      {children}
    </Link>
  );
}

export const estiloBotao = (
  variante: Variante = "primaria",
  tamanho: keyof typeof tamanhos = "md",
) => `${base} ${tamanhos[tamanho]} ${variantes[variante]}`;
