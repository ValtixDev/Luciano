"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { AdminButton } from "@/components/admin/ui";
import { Field, Input } from "@/components/admin/fields";
import { criarClienteNavegador } from "@/lib/supabase/client";

export function FormularioLogin() {
  const router = useRouter();
  const params = useSearchParams();
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

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
        <Input name="senha" type="password" required autoComplete="current-password" />
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
