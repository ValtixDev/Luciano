import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { supabaseConfigurado, supabaseKey, supabaseUrl } from "./config";

let cliente: SupabaseClient | null = null;

/**
 * Cliente anônimo, sem cookies.
 *
 * Duas razões para não usar o cliente de sessão nas leituras públicas:
 * 1. `generateStaticParams` e o sitemap rodam sem requisição HTTP — ler cookies
 *    ali quebra o build.
 * 2. Sem sessão, o banco responde sempre pelo papel `anon`. O que o visitante
 *    vê passa a ser garantido pela RLS, não por acerto da consulta.
 */
export function clientePublico() {
  if (!supabaseConfigurado) return null;
  cliente ??= createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cliente;
}
