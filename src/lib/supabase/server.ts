import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { supabaseConfigurado, supabaseKey, supabaseUrl } from "./config";

/**
 * Cliente para Server Components, Route Handlers e Server Actions.
 * Retorna `null` quando o projeto ainda não foi conectado, para que as camadas
 * de consulta possam cair no conteúdo local sem estourar exceção.
 */
export async function criarClienteServidor() {
  if (!supabaseConfigurado) return null;

  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesParaDefinir) {
        try {
          for (const { name, value, options } of cookiesParaDefinir) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Chamado de um Server Component: a renovação de sessão fica a cargo
          // do middleware. Ignorar aqui é o comportamento recomendado.
        }
      },
    },
  });
}
