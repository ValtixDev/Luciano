"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { criarClienteServidor } from "@/lib/supabase/server";

export type EstadoFormulario = { erro?: string };

const texto = (f: FormData, campo: string) => {
  const v = f.get(campo);
  return typeof v === "string" ? v.trim() : "";
};

const numero = (f: FormData, campo: string) => {
  const v = texto(f, campo);
  if (!v) return null;
  const n = Number(v.replace(",", "."));
  return Number.isFinite(n) ? n : null;
};

const inteiro = (f: FormData, campo: string) => numero(f, campo) ?? 0;
const marcado = (f: FormData, campo: string) => f.get(campo) === "on";

/** Fallback de slug a partir do título, quando o campo vem vazio. */
function gerarSlug(valor: string) {
  return valor
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function salvarImovel(
  _anterior: EstadoFormulario,
  formData: FormData,
): Promise<EstadoFormulario> {
  const sb = await criarClienteServidor();
  if (!sb) return { erro: "Supabase não configurado." };

  const titulo = texto(formData, "titulo");
  const codigo = texto(formData, "codigo");
  if (!titulo) return { erro: "O título é obrigatório." };
  if (!codigo) return { erro: "O código interno é obrigatório." };

  const finalidade = [
    marcado(formData, "finalidadeVenda") ? "venda" : null,
    marcado(formData, "finalidadeAluguel") ? "aluguel" : null,
  ].filter(Boolean) as string[];

  if (finalidade.length === 0) {
    return { erro: "Marque ao menos uma finalidade: venda ou aluguel." };
  }

  const sobConsulta = marcado(formData, "precoSobConsulta");
  const preco = numero(formData, "preco");
  if (!sobConsulta && preco === null) {
    return { erro: "Informe o valor ou marque “Valor sob consulta”." };
  }

  const registro = {
    codigo,
    slug: texto(formData, "slug") || gerarSlug(titulo),
    titulo,
    descricao_curta: texto(formData, "descricaoCurta"),
    descricao: texto(formData, "descricao"),
    finalidade,
    tipo: texto(formData, "tipo"),
    status: texto(formData, "status"),
    estagio: texto(formData, "estagio"),
    preco: sobConsulta ? null : preco,
    preco_sob_consulta: sobConsulta,
    condominio: numero(formData, "condominio"),
    iptu: numero(formData, "iptu"),
    estado: texto(formData, "estado") || "AL",
    cidade: texto(formData, "cidade") || "Maceió",
    bairro: texto(formData, "bairro"),
    regiao: texto(formData, "regiao") || "Maceió",
    rua: texto(formData, "rua") || null,
    numero: texto(formData, "numero") || null,
    cep: texto(formData, "cep") || null,
    latitude: numero(formData, "latitude"),
    longitude: numero(formData, "longitude"),
    ocultar_endereco: marcado(formData, "ocultarEndereco"),
    area_util: numero(formData, "areaUtil"),
    area_total: numero(formData, "areaTotal"),
    quartos: inteiro(formData, "quartos"),
    suites: inteiro(formData, "suites"),
    banheiros: inteiro(formData, "banheiros"),
    vagas: inteiro(formData, "vagas"),
    diferenciais: formData.getAll("diferenciais").map(String),
    destaque: marcado(formData, "destaque"),
    publicar_site: marcado(formData, "publicarSite"),
    publicar_olx: marcado(formData, "publicarOlx"),
    publicar_zap: marcado(formData, "publicarZap"),
    seo_title: texto(formData, "seoTitle") || null,
    seo_description: texto(formData, "seoDescription") || null,
    is_placeholder: marcado(formData, "isPlaceholder"),
  };

  const id = texto(formData, "id");

  // No cadastro, o id vem do gerenciador de fotos: os arquivos já foram
  // enviados para uma pasta com esse nome antes do imóvel existir.
  const idProvisorio = texto(formData, "imovelIdProvisorio");

  // Três ramos em vez de um objeto montado: o supabase-js infere as colunas do
  // literal recebido, então `id` precisa estar presente já na chamada.
  const { data, error } = id
    ? await sb.from("imoveis").update(registro).eq("id", id).select("id").single()
    : idProvisorio
      ? await sb
          .from("imoveis")
          .insert({ ...registro, id: idProvisorio })
          .select("id")
          .single()
      : await sb.from("imoveis").insert(registro).select("id").single();

  if (error) {
    if (error.code === "23505") {
      return { erro: "Já existe um imóvel com esse código ou slug." };
    }
    // 42501 = RLS recusou: a conta não está em `admins`.
    if (error.code === "42501") {
      return { erro: "Sua conta não tem permissão de escrita. Confira a tabela `admins`." };
    }
    return { erro: `Não foi possível salvar: ${error.message}` };
  }

  // Só agora as fotos podem virar linhas: a chave estrangeira exige o imóvel.
  if (!id && data?.id) {
    const bruto = texto(formData, "fotosNovas");
    if (bruto) {
      try {
        const enviadas = JSON.parse(bruto) as {
          caminho: string;
          ordem: number;
          capa: boolean;
          zoom: number;
          pos_x: number;
          pos_y: number;
        }[];

        if (enviadas.length > 0) {
          await sb.from("imovel_fotos").insert(
            enviadas.map((f) => ({
              imovel_id: data.id,
              storage_path: f.caminho,
              alt: "",
              ordem: f.ordem,
              capa: f.capa,
              zoom: f.zoom,
              pos_x: f.pos_x,
              pos_y: f.pos_y,
            })),
          );
        }
      } catch {
        // Imóvel já foi criado; perder o vínculo das fotos não justifica
        // desfazer o cadastro. O usuário reenvia pela tela de edição.
      }
    }
  }

  revalidatePath("/admin/imoveis");
  revalidatePath("/imoveis");
  revalidatePath("/");

  // A própria página do imóvel: sem isto, um 404 servido enquanto o imóvel
  // ainda não era público continuava em cache mesmo depois de publicado.
  revalidatePath(`/imovel/${registro.slug}`);

  // Slug alterado: o endereço antigo também precisa ser expulso do cache,
  // senão continua servindo a versão anterior.
  const slugAnterior = texto(formData, "slugOriginal");
  if (slugAnterior && slugAnterior !== registro.slug) {
    revalidatePath(`/imovel/${slugAnterior}`);
  }

  revalidatePath("/sitemap.xml");
  redirect("/admin/imoveis");
}

export async function excluirImovel(formData: FormData) {
  const sb = await criarClienteServidor();
  if (!sb) return;

  const id = texto(formData, "id");
  if (!id) return;

  const slug = texto(formData, "slug");
  await sb.from("imoveis").delete().eq("id", id);

  revalidatePath("/admin/imoveis");
  revalidatePath("/imoveis");
  revalidatePath("/");
  if (slug) revalidatePath(`/imovel/${slug}`);
  revalidatePath("/sitemap.xml");
  redirect("/admin/imoveis");
}
