import { NextResponse, type NextRequest } from "next/server";

/**
 * Portaria barata: só verifica se existe cookie de sessão, sem falar com o
 * Supabase. Uma chamada de rede aqui custava ~400ms em toda navegação do painel.
 *
 * A validação de verdade fica no layout do painel, que chama `getUser()` — se o
 * cookie for forjado ou estiver expirado, o redirecionamento acontece lá.
 * Aqui o objetivo é apenas evitar renderizar o painel para quem nem entrou.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ehLogin = pathname === "/admin/login";

  // O supabase-ssr grava o token em cookies com prefixo sb-<ref>-auth-token.
  const temCookie = request.cookies
    .getAll()
    .some((c) => c.name.startsWith("sb-") && c.name.includes("auth-token"));

  if (!ehLogin && !temCookie) {
    const destino = request.nextUrl.clone();
    destino.pathname = "/admin/login";
    destino.searchParams.set("de", pathname);
    return NextResponse.redirect(destino);
  }

  if (ehLogin && temCookie) {
    const destino = request.nextUrl.clone();
    destino.pathname = "/admin";
    destino.search = "";
    return NextResponse.redirect(destino);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
