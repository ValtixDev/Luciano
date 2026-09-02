"use client";

import { createBrowserClient } from "@supabase/ssr";
import { supabaseConfigurado, supabaseKey, supabaseUrl } from "./config";

/** Cliente para componentes de navegador (login do painel, uploads). */
export function criarClienteNavegador() {
  if (!supabaseConfigurado) return null;
  return createBrowserClient(supabaseUrl, supabaseKey);
}
