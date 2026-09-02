import { cache } from "react";
import { criarClienteServidor } from "./server";

export type Sessao =
  | { estado: "sem-sessao" }
  | { estado: "nao-autorizado"; email: string }
  | { estado: "ok"; email: string };

/**
 * Cache curto de quem é admin.
 *
 * A tabela `admins` muda uma vez por ano; consultá-la a cada navegação custava
 * uma ida ao banco (~400ms) para sempre receber a mesma resposta. Isto é só
 * conveniência de leitura — a autorização de escrita continua na RLS, que não
 * consulta este mapa.
 */
const VALIDADE_MS = 60_000;
const memoria = new Map<string, { admin: boolean; expira: number }>();

async function ehAdmin(
  sb: NonNullable<Awaited<ReturnType<typeof criarClienteServidor>>>,
  userId: string,
) {
  const guardado = memoria.get(userId);
  if (guardado && guardado.expira > Date.now()) return guardado.admin;

  const { data } = await sb.from("admins").select("id").eq("id", userId).maybeSingle();
  const admin = Boolean(data);
  memoria.set(userId, { admin, expira: Date.now() + VALIDADE_MS });
  return admin;
}

/**
 * Estado da sessão no painel. `cache` do React garante uma única execução por
 * requisição, mesmo que layout e página peçam ao mesmo tempo.
 */
export const exigirAdmin = cache(async (): Promise<Sessao> => {
  const sb = await criarClienteServidor();
  if (!sb) return { estado: "sem-sessao" };

  // getClaims verifica a assinatura do JWT localmente, com a chave pública do
  // projeto em cache. getUser faria uma ida ao servidor de auth (~200–450ms)
  // em cada navegação do painel só para repetir o que o token já diz.
  let userId = "";
  let email = "";

  try {
    const { data } = await sb.auth.getClaims();
    const claims = data?.claims as { sub?: string; email?: string } | undefined;
    userId = claims?.sub ?? "";
    email = claims?.email ?? "";
  } catch {
    // Projetos com segredo simétrico antigo não permitem verificação local.
  }

  if (!userId) {
    const {
      data: { user },
    } = await sb.auth.getUser();
    if (!user) return { estado: "sem-sessao" };
    userId = user.id;
    email = user.email ?? "";
  }

  return (await ehAdmin(sb, userId))
    ? { estado: "ok", email }
    : { estado: "nao-autorizado", email };
});
