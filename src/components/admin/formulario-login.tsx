"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { AdminButton } from "@/components/admin/ui";
import { Field, Input, inputCls } from "@/components/admin/fields";
import { criarClienteNavegador } from "@/lib/supabase/client";

export function FormularioLogin() {
  const router = useRouter();
  const params = useSearchParams();
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);

  async function entrar(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setErro(null);
    setEnviando(true);

    const dados = new FormData(evento.currentTarget);
    const supabase = criarClienteNavegador();

    if (!supabase) {
      setErro("Supabase não configurado neste ambiente.");
      setEnviando(false);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: String(dados.get("email")),
      password: String(dados.get("senha")),
    });

    if (error) {
      // Credencial errada fica genérica de propósito, para não revelar se o
      // e-mail existe. Os demais casos precisam ser explícitos: sem isso, um
      // e-mail não confirmado parece senha errada e não há como diagnosticar.
      const codigo = error.code ?? "";
      const mensagens: Record<string, string> = {
        email_not_confirmed:
          "E-mail ainda não confirmado. No painel do Supabase, em Authentication → Users, confirme a conta.",
        over_request_rate_limit:
          "Muitas tentativas seguidas. Aguarde um minuto e tente de novo.",
        user_banned: "Esta conta está bloqueada no Supabase.",
        signup_disabled: "Cadastro desabilitado no projeto.",
      };
      setErro(
        mensagens[codigo] ??
          (codigo === "invalid_credentials"
            ? "E-mail ou senha incorretos."
            : `Falha ao entrar (${codigo || error.message}).`),
      );
      setEnviando(false);
      return;
    }

    router.replace(params.get("de") ?? "/admin");
    router.refresh();
  }

  return (
    <form onSubmit={entrar} className="space-y-4">
      <Field label="E-mail">
        <Input name="email" type="email" required autoComplete="email" autoFocus />
      </Field>

      <Field label="Senha">
        <div className="relative">
          <Input
            name="senha"
            type={mostrarSenha ? "text" : "password"}
            required
            autoComplete="current-password"
            className={`${inputCls} pr-11`}
          />
          <button
            type="button"
            onClick={() => setMostrarSenha((v) => !v)}
            aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
            aria-pressed={mostrarSenha}
            className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-lg text-muted transition-colors hover:text-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          >
            {mostrarSenha ? <OlhoFechado /> : <Olho />}
          </button>
        </div>
      </Field>

      {erro && (
        <p
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700"
        >
          {erro}
        </p>
      )}

      <AdminButton type="submit" className="w-full" disabled={enviando}>
        {enviando ? "Entrando…" : "Entrar"}
      </AdminButton>
    </form>
  );
}

function Olho() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function OlhoFechado() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
      <path d="M4 4.5 19.5 20" />
      <path d="M9.9 6.2A9.8 9.8 0 0 1 12 5.5c6.4 0 10 6.5 10 6.5a17 17 0 0 1-3.3 4.1" />
      <path d="M6.5 8.1A16.6 16.6 0 0 0 2 12s3.6 6.5 10 6.5c1.4 0 2.6-.2 3.7-.6" />
      <path d="M9.9 10a3 3 0 0 0 4.2 4.2" />
    </svg>
  );
}
