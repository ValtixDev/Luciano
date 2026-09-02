"use client";

import {
  useEffect,
  useRef,
  useState,
  type ElementType,
  type ReactNode,
} from "react";

/**
 * Um único IntersectionObserver serve todos os Reveal da página.
 * A home tem mais de trinta deles; criar um observer por elemento custa
 * memória e trabalho de layout à toa.
 */
let observador: IntersectionObserver | null = null;
const inscritos = new Map<Element, (visivel: boolean) => void>();

function obterObservador() {
  if (!observador && typeof window !== "undefined") {
    observador = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          inscritos.get(entrada.target)?.(entrada.isIntersecting);
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -6% 0px" },
    );
  }
  return observador;
}

/**
 * Revela o conteúdo ao entrar na viewport e o dissolve ao sair.
 * Em `prefers-reduced-motion` a regra do globals.css deixa tudo visível.
 */
export function Reveal({
  children,
  delay = 0,
  as: Tag = "div",
  className = "",
}: {
  children: ReactNode;
  /** Atraso em ms, para escalonar itens de uma mesma linha. */
  delay?: number;
  as?: ElementType;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    const el = ref.current;
    const obs = obterObservador();
    if (!el || !obs) return;

    inscritos.set(el, setVisivel);
    obs.observe(el);
    return () => {
      obs.unobserve(el);
      inscritos.delete(el);
    };
  }, []);

  return (
    <Tag
      ref={ref}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={`reveal h-full ${visivel ? "is-visible" : ""} ${className}`}
    >
      {children}
    </Tag>
  );
}
