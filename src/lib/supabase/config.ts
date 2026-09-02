/**
 * Credenciais do Supabase. Enquanto não estiverem definidas, o site continua
 * lendo os dados locais de `src/data/` — nada quebra por falta de banco.
 */
export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  "";

/** Fonte da verdade sobre qual camada de dados usar. */
export const supabaseConfigurado = Boolean(supabaseUrl && supabaseKey);
