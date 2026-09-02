import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/sidebar";
import { BotaoSair } from "@/components/admin/botao-sair";
import { exigirAdmin } from "@/lib/supabase/admin";
import { site } from "@/lib/site";

export default async function PainelLayout({ children }: LayoutProps<"/admin">) {
  const sessao = await exigirAdmin();
  if (sessao.estado === "sem-sessao") redirect("/admin/login");
  return (
    <div className="flex min-h-screen bg-offwhite">
      <AdminSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        {sessao.estado === "nao-autorizado" && (
          <div className="flex items-center gap-2 bg-red-50 px-6 py-2 text-xs text-red-700">
            <span className="size-1.5 rounded-full bg-red-500" />
            Sua conta está autenticada mas não consta em `admins`. As escrituras
            serão recusadas pelo banco.
          </div>
        )}

        <header className="flex h-16 items-center justify-between gap-4 border-b border-sand bg-white px-6">
          <Link
            href="/admin"
            className="flex items-center gap-2.5 lg:hidden"
            aria-label="Painel"
          >
            <span className="flex size-8 items-center justify-center rounded-full bg-navy font-display text-xs leading-none text-gold-soft">
              LG
            </span>
            <span className="font-display text-base text-navy">Painel</span>
          </Link>

          <p className="hidden text-sm text-muted lg:block">{site.razao}</p>

          <div className="flex items-center gap-3">
            <span className="hidden text-right text-xs leading-tight sm:block">
              <span className="block font-semibold text-graphite">
                {sessao.email}
              </span>
              <span className="block text-muted">{site.creci}</span>
            </span>
            <span className="flex size-9 items-center justify-center rounded-full bg-navy font-display text-xs leading-none text-gold-soft">
              LG
            </span>
            <BotaoSair />
          </div>
        </header>

        <main className="flex-1 px-6 py-8">{children}</main>
      </div>
    </div>
  );
}
