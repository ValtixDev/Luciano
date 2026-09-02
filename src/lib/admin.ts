import type { OrigemLead, StatusLead } from "@/types";

export const origemLabel: Record<OrigemLead, string> = {
  site: "Site",
  chat_ia: "Chat IA",
  whatsapp: "WhatsApp",
  imovel: "Página do imóvel",
};

export const statusLeadLabel: Record<StatusLead, string> = {
  novo: "Novo",
  em_atendimento: "Em atendimento",
  visita: "Visita",
  proposta: "Proposta",
  convertido: "Convertido",
  perdido: "Perdido",
};

export const statusLeadCor: Record<StatusLead, string> = {
  novo: "bg-navy/10 text-navy",
  em_atendimento: "bg-amber-100 text-amber-800",
  visita: "bg-sky-100 text-sky-800",
  proposta: "bg-violet-100 text-violet-800",
  convertido: "bg-emerald-100 text-emerald-800",
  perdido: "bg-neutral-200 text-neutral-600",
};

export const statusImovelCor = {
  disponivel: "bg-emerald-100 text-emerald-800",
  reservado: "bg-amber-100 text-amber-800",
  vendido: "bg-neutral-200 text-neutral-600",
  alugado: "bg-neutral-200 text-neutral-600",
  inativo: "bg-neutral-200 text-neutral-500",
} as const;

export function formatDataHora(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}
