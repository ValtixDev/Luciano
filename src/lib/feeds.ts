import { clientePublico } from "@/lib/supabase/publico";
import { CAMPOS_IMOVEL, mapearImovel, type LinhaImovel } from "@/lib/supabase/mapeadores";
import type { Imovel } from "@/types";

/**
 * Requisitos que o anúncio precisa cumprir para o portal aceitar.
 * Cada item é verificado no imóvel real — nada aqui é presumido.
 */
export type Pendencia = { campo: string; motivo: string };

export function validarParaPortal(imovel: Imovel): Pendencia[] {
  const pendencias: Pendencia[] = [];

  if (imovel.fotos.length === 0) {
    pendencias.push({ campo: "Fotos", motivo: "Anúncio sem foto é recusado." });
  }
  if (imovel.preco === null) {
    pendencias.push({
      campo: "Valor",
      motivo: "Portais não aceitam “sob consulta”; é preciso um valor.",
    });
  }
  if (!imovel.descricao || imovel.descricao.length < 50) {
    pendencias.push({
      campo: "Descrição",
      motivo: "Descrição muito curta — mínimo de 50 caracteres.",
    });
  }
  if (!imovel.bairro) {
    pendencias.push({ campo: "Bairro", motivo: "Obrigatório para o mapa do portal." });
  }
  if (imovel.tipo !== "terreno" && imovel.areaUtil === null && imovel.areaTotal === null) {
    pendencias.push({ campo: "Área", motivo: "Informe a área útil ou a total." });
  }

  return pendencias;
}

export type ImovelFeed = { imovel: Imovel; pendencias: Pendencia[] };

/**
 * Imóveis marcados para os portais.
 *
 * A flag `publicar_zap`/`publicar_olx` é a intenção do corretor; a validação
 * diz se o anúncio de fato entra. Um imóvel marcado mas incompleto aparece no
 * painel como pendência, e fica fora do XML.
 */
export async function imoveisParaPortais(): Promise<ImovelFeed[]> {
  const sb = clientePublico();
  if (!sb) return [];

  const { data } = await sb
    .from("imoveis")
    .select(CAMPOS_IMOVEL)
    .eq("status", "disponivel")
    .eq("is_placeholder", false)
    .or("publicar_zap.eq.true,publicar_olx.eq.true")
    .order("atualizado_em", { ascending: false });

  return ((data as LinhaImovel[] | null) ?? [])
    .map(mapearImovel)
    .map((imovel) => ({ imovel, pendencias: validarParaPortal(imovel) }));
}

const TIPO_VRSYNC: Record<string, { categoria: string; tipo: string }> = {
  apartamento: { categoria: "Residential", tipo: "Apartment" },
  casa: { categoria: "Residential", tipo: "Home" },
  lancamento: { categoria: "Residential", tipo: "Apartment" },
  terreno: { categoria: "Residential", tipo: "Residential Land" },
  comercial: { categoria: "Commercial", tipo: "Building" },
};

const escapar = (v: string) =>
  v
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const tag = (nome: string, valor: string | number | null | undefined) =>
  valor === null || valor === undefined || valor === ""
    ? ""
    : `<${nome}>${escapar(String(valor))}</${nome}>`;

/**
 * Feed no padrão VRSync (ListingDataFeed), lido por VivaReal, ZAP e OLX —
 * hoje as três marcas pertencem ao mesmo grupo e compartilham a importação.
 */
export function gerarVrsync({
  itens,
  base,
  contato,
}: {
  itens: ImovelFeed[];
  base: string;
  contato: { nome: string; email: string | null; telefone: string };
}) {
  const validos = itens.filter((i) => i.pendencias.length === 0);
  const agora = new Date().toISOString();

  const anuncios = validos
    .map(({ imovel }) => {
      const mapa = TIPO_VRSYNC[imovel.tipo] ?? TIPO_VRSYNC.apartamento;
      const venda = imovel.finalidade.includes("venda");

      const midia = imovel.fotos
        .map(
          (f, i) =>
            `<Item medium="image" caption="${escapar(f.alt || imovel.titulo)}" primary="${i === 0}">${escapar(f.url ?? "")}</Item>`,
        )
        .join("");

      const caracteristicas = imovel.diferenciais
        .map((d) => `<Feature>${escapar(d)}</Feature>`)
        .join("");

      return `<Listing>
${tag("ListingID", imovel.codigo)}
${tag("Title", imovel.titulo)}
<TransactionType>${venda ? "For Sale" : "For Rent"}</TransactionType>
<PublicationType>STANDARD</PublicationType>
${tag("DetailViewUrl", `${base}/imovel/${imovel.slug}`)}
<Details>
<PropertyType><${mapa.categoria} type="${mapa.tipo}"/></PropertyType>
${tag("Description", imovel.descricao)}
<ListPrice currency="BRL">${imovel.preco}</ListPrice>
${imovel.condominio ? `<PropertyAdministrationFee currency="BRL">${imovel.condominio}</PropertyAdministrationFee>` : ""}
${imovel.iptu ? `<YearlyTax currency="BRL">${imovel.iptu}</YearlyTax>` : ""}
${imovel.areaUtil ? `<LivingArea unit="square metres">${imovel.areaUtil}</LivingArea>` : ""}
${imovel.areaTotal ? `<LotArea unit="square metres">${imovel.areaTotal}</LotArea>` : ""}
${tag("Bedrooms", imovel.quartos)}
${tag("Bathrooms", imovel.banheiros)}
${tag("Suites", imovel.suites)}
<Garage type="Parking Space">${imovel.vagas}</Garage>
${caracteristicas ? `<Features>${caracteristicas}</Features>` : ""}
<Media>${midia}</Media>
</Details>
<Location displayAddress="${imovel.ocultarEndereco ? "Neighborhood" : "All"}">
<Country abbreviation="BR">Brasil</Country>
<State abbreviation="${escapar(imovel.estado)}">Alagoas</State>
${tag("City", imovel.cidade)}
${tag("Neighborhood", imovel.bairro)}
${imovel.latitude != null ? `<Latitude>${imovel.latitude}</Latitude>` : ""}
${imovel.longitude != null ? `<Longitude>${imovel.longitude}</Longitude>` : ""}
</Location>
<ContactInfo>
${tag("Name", contato.nome)}
${tag("Email", contato.email)}
${tag("Telephone", contato.telefone)}
</ContactInfo>
</Listing>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<ListingDataFeed xmlns="http://www.vivareal.com/schemas/1.0/VRSync"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.vivareal.com/schemas/1.0/VRSync http://xml.vivareal.com/vrsync.xsd">
<Header>
${tag("Provider", contato.nome)}
${tag("Email", contato.email)}
${tag("ContactName", contato.nome)}
<PublishDate>${agora}</PublishDate>
</Header>
<Listings>
${anuncios}
</Listings>
</ListingDataFeed>`;
}
