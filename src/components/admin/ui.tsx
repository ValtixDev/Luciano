import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

export function PageHeader({
  titulo,
  descricao,
  acao,
}: {
  titulo: string;
  descricao?: string;
  acao?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-display text-[2rem] leading-none tracking-tight text-navy">{titulo}</h1>
        {descricao && <p className="mt-1.5 text-sm text-muted">{descricao}</p>}
      </div>
      {acao}
    </div>
  );
}

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-card border border-sand bg-white ${className}`}
    >
      {children}
    </div>
  );
}

export function StatCard({
  rotulo,
  valor,
  nota,
}: {
  rotulo: string;
  valor: string | number;
  nota?: string;
}) {
  return (
    <Card className="px-5 py-5">
      <p className="eyebrow text-muted">{rotulo}</p>
      <p className="num mt-3 font-display text-[2rem] leading-none tracking-tight text-navy">{valor}</p>
      {nota && <p className="mt-2 text-xs text-muted">{nota}</p>}
    </Card>
  );
}

export function Badge({
  children,
  cor = "bg-navy/10 text-navy",
}: {
  children: ReactNode;
  cor?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-[0.6875rem] font-semibold ${cor}`}
    >
      {children}
    </span>
  );
}

export function AdminButton({
  children,
  variante = "primaria",
  className = "",
  ...props
}: {
  variante?: "primaria" | "secundaria" | "perigo";
  children: ReactNode;
} & ComponentProps<"button">) {
  const estilos = {
    primaria: "bg-navy text-white hover:bg-navy-700",
    secundaria: "border border-sand bg-white text-navy hover:bg-offwhite",
    perigo: "border border-red-200 bg-white text-red-700 hover:bg-red-50",
  };
  return (
    <button
      className={`inline-flex h-10 items-center justify-center rounded-lg px-4 text-sm font-semibold transition-colors ${estilos[variante]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function AdminLinkButton({
  children,
  variante = "primaria",
  className = "",
  ...props
}: {
  variante?: "primaria" | "secundaria";
  children: ReactNode;
  className?: string;
} & Omit<ComponentProps<typeof Link>, "className" | "children">) {
  const estilos = {
    primaria: "bg-navy text-white hover:bg-navy-700",
    secundaria: "border border-sand bg-white text-navy hover:bg-offwhite",
  };
  return (
    <Link
      className={`inline-flex h-10 items-center justify-center rounded-lg px-4 text-sm font-semibold transition-colors ${estilos[variante]} ${className}`}
      {...props}
    >
      {children}
    </Link>
  );
}

export function EmptyState({
  titulo,
  texto,
  acao,
}: {
  titulo: string;
  texto: string;
  acao?: ReactNode;
}) {
  return (
    <Card className="px-8 py-16 text-center">
      <h2 className="font-display text-xl tracking-tight text-navy">{titulo}</h2>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted">
        {texto}
      </p>
      {acao && <div className="mt-6">{acao}</div>}
    </Card>
  );
}
