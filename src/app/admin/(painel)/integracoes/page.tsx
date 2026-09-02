import type { Metadata } from "next";
import { AdminButton, Badge, Card, PageHeader } from "@/components/admin/ui";
import { listarImoveisAdmin } from "@/lib/supabase/painel";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Integrações" };

type Portal = {
  nome: string;
  descricao: string;
  feed: string;
  estado: "conectado" | "pendente" | "desconectado";
  nota: string;
};

const portais: Portal[] = [
  {
    nome: "ZAP Imóveis",
    descricao: "Distribuição via feed XML no padrão VRSync.",
    feed: "/feed/vrsync.xml",
    estado: "conectado",
    nota: "Última leitura há 3 horas · 5 imóveis enviados",
  },
  {
    nome: "VivaReal",
    descricao: "Mesmo feed do ZAP — ambos pertencem ao grupo ZAP+.",
    feed: "/feed/vrsync.xml",
    estado: "conectado",
    nota: "Última leitura há 3 horas · 5 imóveis enviados",
  },
  {
    nome: "OLX",
    descricao: "Importação de anúncios por link XML informado no painel da OLX.",
    feed: "/feed/olx.xml",
    estado: "pendente",
    nota: "1 imóvel com pendência: fotografia abaixo da resolução mínima",
  },
];

const cores = {
  conectado: "bg-emerald-100 text-emerald-800",
  pendente: "bg-amber-100 text-amber-800",
  desconectado: "bg-neutral-200 text-neutral-600",
} as const;

const rotulos = {
  conectado: "Sincronizado",
  pendente: "Com pendência",
  desconectado: "Não conectado",
} as const;

export const dynamic = "force-dynamic";

export default async function IntegracoesPage() {
  const imoveis = await listarImoveisAdmin();
  const publicaveis = imoveis.filter(
    (i) => i.status === "disponivel" && !i.isPlaceholder,
  ).length;

  return (
    <>
      <PageHeader
        titulo="Integrações"
        descricao="Os portais leem um feed XML gerado pelo painel. Nada é postado por automação de navegador."
      />

      <Card className="mb-6 border-navy/15 bg-navy p-6 text-white">
        <p className="eyebrow text-gold">Como funciona</p>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/75">
          Cada imóvel é cadastrado uma única vez no painel. O sistema gera um
          feed XML público que os portais consultam periodicamente. Toda
          alteração no cadastro aparece no site imediatamente e chega aos
          portais na leitura seguinte.
        </p>
        <p className="mt-4 font-mono text-xs text-gold-soft">
          Painel → Banco → Feed XML → OLX · ZAP · VivaReal
        </p>
      </Card>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Card className="px-5 py-5">
          <p className="eyebrow text-muted">Imóveis publicáveis</p>
          <p className="mt-2.5 font-display text-3xl leading-none text-navy">
            {publicaveis}
          </p>
          <p className="mt-2 text-xs text-muted">Disponíveis e não placeholder</p>
        </Card>
        <Card className="px-5 py-5">
          <p className="eyebrow text-muted">Portais ativos</p>
          <p className="mt-2.5 font-display text-3xl leading-none text-navy">2/3</p>
          <p className="mt-2 text-xs text-muted">OLX aguardando correção</p>
        </Card>
        <Card className="px-5 py-5">
          <p className="eyebrow text-muted">Última geração do feed</p>
          <p className="mt-2.5 font-display text-3xl leading-none text-navy">3h</p>
          <p className="mt-2 text-xs text-muted">Regenerado a cada alteração</p>
        </Card>
      </div>

      <div className="space-y-4">
        {portais.map((p) => (
          <Card key={p.nome} className="p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="font-display text-xl text-navy">{p.nome}</h2>
                  <Badge cor={cores[p.estado]}>{rotulos[p.estado]}</Badge>
                </div>
                <p className="mt-1.5 text-sm text-muted">{p.descricao}</p>
                <p className="mt-3 font-mono text-xs break-all text-navy/70">
                  {site.url}
                  {p.feed}
                </p>
                <p
                  className={`mt-2 text-xs ${p.estado === "pendente" ? "text-amber-700" : "text-muted"}`}
                >
                  {p.nota}
                </p>
              </div>

              <div className="flex shrink-0 gap-2">
                <AdminButton variante="secundaria" type="button">
                  Copiar link do feed
                </AdminButton>
                <AdminButton variante="secundaria" type="button">
                  Regerar agora
                </AdminButton>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
