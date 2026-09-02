"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { criarClienteNavegador } from "@/lib/supabase/client";

export function BotaoSair() {
  const router = useRouter();
  const [saindo, setSaindo] = useState(false);

  return (
    <button
      type="button"
      disabled={saindo}
      onClick={async () => {
        setSaindo(true);
        await criarClienteNavegador()?.auth.signOut();
        router.replace("/admin/login");
        router.refresh();
      }}
      className="rounded-lg px-3 py-1.5 text-xs font-semibold text-muted transition-colors hover:bg-offwhite hover:text-navy disabled:opacity-50"
    >
      {saindo ? "Saindo…" : "Sair"}
    </button>
  );
}
