import type { Metadata } from "next";
import { Suspense } from "react";
import { FormularioLogin } from "@/components/admin/formulario-login";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Entrar",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-navy px-5 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="mx-auto flex size-14 items-center justify-center rounded-full border border-gold/40 font-display text-lg leading-none text-gold-soft">
            LG
          </span>
          <h1 className="mt-5 font-display text-2xl tracking-tight text-white">
            Painel administrativo
          </h1>
          <p className="mt-1.5 text-sm text-white/50">{site.razao}</p>
        </div>

        <div className="rounded-card border border-white/10 bg-white p-7">
          {/* O formulário lê ?de= para voltar à página pedida; useSearchParams
              exige limite de Suspense na pré-renderização. */}
          <Suspense fallback={<div className="h-64" />}>
            <FormularioLogin />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
