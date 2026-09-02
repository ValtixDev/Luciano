import type { ComponentProps, ReactNode } from "react";

export const inputCls =
  "h-10 w-full rounded-lg border border-sand bg-white px-3 text-sm text-graphite placeholder:text-muted/60 focus:border-navy focus:outline-none";

export function Field({
  label,
  hint,
  children,
  className = "",
}: {
  label: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-xs font-semibold text-graphite">
        {label}
      </span>
      {children}
      {hint && <span className="mt-1.5 block text-xs text-muted">{hint}</span>}
    </label>
  );
}

export function Input(props: ComponentProps<"input">) {
  return <input {...props} className={`${inputCls} ${props.className ?? ""}`} />;
}

export function Textarea(props: ComponentProps<"textarea">) {
  return (
    <textarea
      {...props}
      className={`w-full rounded-lg border border-sand bg-white p-3 text-sm text-graphite placeholder:text-muted/60 focus:border-navy focus:outline-none ${props.className ?? ""}`}
    />
  );
}

export function Select(props: ComponentProps<"select">) {
  return (
    <select
      {...props}
      className={`${inputCls} appearance-none ${props.className ?? ""}`}
    />
  );
}

export function Check({
  label,
  hint,
  ...props
}: { label: string; hint?: string } & ComponentProps<"input">) {
  return (
    <label className="flex cursor-pointer items-start gap-2.5 rounded-lg border border-sand bg-white px-3 py-2.5 transition-colors hover:border-navy/30">
      <input
        type="checkbox"
        {...props}
        className="mt-0.5 size-4 shrink-0 accent-navy"
      />
      <span className="leading-tight">
        <span className="block text-sm text-graphite">{label}</span>
        {hint && <span className="mt-0.5 block text-xs text-muted">{hint}</span>}
      </span>
    </label>
  );
}

export function Fieldset({
  titulo,
  descricao,
  children,
}: {
  titulo: string;
  descricao?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-card border border-sand bg-white p-6">
      <div className="mb-5">
        <h2 className="font-display text-xl tracking-tight text-navy">{titulo}</h2>
        {descricao && <p className="mt-1 text-xs text-muted">{descricao}</p>}
      </div>
      {children}
    </section>
  );
}
