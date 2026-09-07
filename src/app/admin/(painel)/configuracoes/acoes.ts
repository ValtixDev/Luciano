"use server";

import { revalidatePath } from "next/cache";
import { criarClienteServidor } from "@/lib/supabase/server";

export type EstadoConfig = { erro?: string; salvo?: boolean };

const texto = (f: FormData, campo: string) => {
  const v = f.get(campo);
  return typeof v === "string" ? v.trim() : "";
};

export async function salvarConfiguracoes(
  _anterior: EstadoConfig,
  formData: FormData,
): Promise<EstadoConfig> {
  const sb = await criarClienteServidor();
  if (!sb) return { erro: "Supabase não configurado." };

  const nome = texto(formData, "nome");
  if (!nome) return { erro: "O nome é obrigatório." };

  // Só dígitos: o wa.me recusa parênteses, traços e espaços.
  const whatsapp = texto(formData, "whatsapp").replace(/\D/g, "");
  if (whatsapp.length < 12) {
    return { erro: "O WhatsApp precisa do DDI e do DDD, só números. Ex.: 5582981478085" };
  }

  const { error } = await sb
    .from("configuracoes")
    .update({
      nome,
      razao: texto(formData, "razao"),
      creci: texto(formData, "creci"),
      telefone: texto(formData, "telefone"),
      whatsapp,
      whatsapp_mensagem: texto(formData, "whatsappMensagem"),
      email: texto(formData, "email") || null,
      instagram: texto(formData, "instagram"),
      endereco_rua: texto(formData, "enderecoRua"),
      endereco_bairro: texto(formData, "enderecoBairro"),
      endereco_cidade: texto(formData, "enderecoCidade"),
      endereco_estado: texto(formData, "enderecoEstado"),
      texto_institucional: texto(formData, "textoInstitucional"),
      logo_path: texto(formData, "logo") || null,
      retrato_hero_path: texto(formData, "retratoHero") || null,
      retrato_sobre_path: texto(formData, "retratoSobre") || null,
    })
    .eq("id", true);

  if (error) {
    if (error.code === "42501") {
      return { erro: "Sua conta não tem permissão de escrita. Confira a tabela `admins`." };
    }
    return { erro: `Não foi possível salvar: ${error.message}` };
  }

  // Estes dados aparecem em todo o site: rodapé, contato, assistente, metadata.
  revalidatePath("/", "layout");
  return { salvo: true };
}
