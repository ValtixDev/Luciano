import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";
import { FormularioLogin } from "@/components/admin/formulario-login";
import { Ondas } from "@/components/ondas";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Entrar",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <div className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-navy-950 px-5 py-16">
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_0%,#16437f_0%,#081f4c_45%,#040f28_100%)]" />
      <Ondas />

      <div className="relative w-full max-w-sm">
        <div className="mb-8 text-center">
          <Image
            src="/logo-luciano-gois.webp"
            alt={site.razao}
            width={866}
            height={288}
            priority
            className="mx-auto h-11 w-auto"
          />
          <h1 className="mt-6 font-display text-2xl tracking-tight text-white">
            Painel administrativo
          </h1>
        </div>

        <div className="rounded-card border border-white/15 bg-white/95 p-7 shadow-[0_32px_80px_-24px] shadow-navy-950/80 backdrop-blur-sm">
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
