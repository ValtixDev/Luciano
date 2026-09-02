import type { ReactNode } from "react";

/** Cabeçalho padrão das páginas internas. */
export function PageHero({
  eyebrow,
  titulo,
  texto,
  children,
}: {
  eyebrow: string;
  /** Aceita JSX para permitir quebra de linha controlada. */
  titulo: ReactNode;
  texto?: string;
  children?: ReactNode;
}) {
  return (
    <section className="grain relative overflow-hidden bg-navy pb-16 pt-32 text-white sm:pb-24 sm:pt-40">
      <div className="absolute inset-0 bg-[radial-gradient(100%_120%_at_80%_0%,#16437f_0%,#081f4c_50%,#040f28_100%)]" />
      <div className="absolute -left-24 bottom-0 hidden size-[26rem] rounded-full border border-white/[0.06] lg:block" />
      {/* Fecha o hero exatamente em navy-950, que é onde a rampa da próxima
          seção começa — sem isso sobra um fio de emenda. */}
      <div className="container-page relative max-w-5xl">
        <p className="eyebrow animate-fade-in text-gold">{eyebrow}</p>
        <span
          className="rule-gold animate-line mt-5"
          style={{ animationDelay: "160ms" }}
        />
        <h1
          className="display-pagina animate-fade-up mt-7"
          style={{ animationDelay: "120ms" }}
        >
          {titulo}
        </h1>
        {texto && (
          <p
            className="lead animate-fade-up mt-7 max-w-xl text-white/65"
            style={{ animationDelay: "260ms" }}
          >
            {texto}
          </p>
        )}
        {children && (
          <div className="animate-fade-up mt-10" style={{ animationDelay: "380ms" }}>
            {children}
          </div>
        )}
      </div>
    </section>
  );
}
