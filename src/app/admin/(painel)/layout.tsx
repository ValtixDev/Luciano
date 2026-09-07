import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/sidebar";
import { TopoPainel } from "@/components/admin/topo-painel";
import { exigirAdmin } from "@/lib/supabase/admin";

export default async function PainelLayout({ children }: LayoutProps<"/admin">) {
  const sessao = await exigirAdmin();
  if (sessao.estado === "sem-sessao") redirect("/admin/login");

  return (
    <div className="flex min-h-screen bg-offwhite">
      <AdminSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        {sessao.estado === "nao-autorizado" && (
          <div className="flex items-start gap-2 bg-red-50 px-4 py-2 text-xs text-red-700 sm:px-6">
            <span className="size-1.5 rounded-full bg-red-500" />
            Sua conta está autenticada mas não consta em `admins`. As escrituras
            serão recusadas pelo banco.
          </div>
        )}

        <TopoPainel email={sessao.email} />

        <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8">{children}</main>
      </div>
    </div>
  );
}
