"use client";

import Link from "next/link";
import { useActionState } from "react";
import { GerenciadorFotos } from "@/components/admin/gerenciador-fotos";
import { SeletorMapa } from "@/components/admin/seletor-mapa";
import { salvarImovel, type EstadoFormulario } from "@/app/admin/(painel)/imoveis/acoes";
import { AdminButton, AdminLinkButton } from "@/components/admin/ui";
import { Check, Field, Fieldset, Input, Select, Textarea } from "@/components/admin/fields";
import { estagioLabel, statusLabel, tipoLabel } from "@/lib/imoveis";
import type { EstagioObra, Imovel, StatusImovel, TipoImovel } from "@/types";

const DIFERENCIAIS = [
  "Piscina",
  "Piscina privativa",
  "Academia",
  "Área gourmet",
  "Portaria 24h",
  "Elevador",
  "Varanda",
  "Vista para o mar",
  "Mobiliado",
  "Condomínio fechado",
  "Playground",
  "Salão de festas",
  "Acesso à praia",
  "Gerador",
];

/** Formulário de cadastro e edição de imóvel, gravando via server action. */
export function PropertyForm({ imovel }: { imovel?: Imovel }) {
  const edicao = Boolean(imovel);
  const [estado, acao, enviando] = useActionState<EstadoFormulario, FormData>(
    salvarImovel,
    {},
  );

  return (
    <form action={acao} className="grid gap-6 xl:grid-cols-[1fr_320px]">
      {imovel && (
        <>
          <input type="hidden" name="id" value={imovel.id} />
          {/* Permite expulsar o endereço antigo do cache quando o slug muda. */}
          <input type="hidden" name="slugOriginal" value={imovel.slug} />
        </>
      )}
      <div className="space-y-6">
        <Fieldset
          titulo="Informações básicas"
          descricao="O título e o slug alimentam a URL pública e o SEO da página do imóvel."
        >
          <div className="grid gap-4">
            <Field label="Título">
              <Input
                name="titulo"
                defaultValue={imovel?.titulo}
                placeholder="Apartamento com vista mar na Ponta Verde"
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Código interno">
                <Input name="codigo" defaultValue={imovel?.codigo} placeholder="LG-007" />
              </Field>
              <Field label="Slug (URL)" hint="/imovel/…">
                <Input
                  name="slug"
                  defaultValue={imovel?.slug}
                  placeholder="apartamento-vista-mar-ponta-verde"
                />
              </Field>
            </div>

            <Field
              label="Descrição curta"
              hint="Aparece no card do catálogo e na meta description automática."
            >
              <Textarea
                name="descricaoCurta"
                rows={2}
                defaultValue={imovel?.descricaoCurta}
              />
            </Field>

            <Field label="Descrição completa">
              <Textarea name="descricao" rows={7} defaultValue={imovel?.descricao} />
            </Field>
          </div>
        </Fieldset>

        <Fieldset titulo="Comercial">
          <div className="grid gap-4">
            <div className="grid gap-2 sm:grid-cols-2">
              <Check
                name="finalidadeVenda"
                label="Venda"
                defaultChecked={imovel?.finalidade.includes("venda") ?? true}
              />
              <Check
                name="finalidadeAluguel"
                label="Aluguel"
                defaultChecked={imovel?.finalidade.includes("aluguel")}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Valor (R$)">
                <Input
                  name="preco"
                  type="number"
                  step={1000}
                  defaultValue={imovel?.preco ?? ""}
                  placeholder="850000"
                />
              </Field>
              <Field label="Condomínio (R$)">
                <Input
                  name="condominio"
                  type="number"
                  defaultValue={imovel?.condominio ?? ""}
                  placeholder="890"
                />
              </Field>
              <Field label="IPTU (R$)">
                <Input
                  name="iptu"
                  type="number"
                  defaultValue={imovel?.iptu ?? ""}
                  placeholder="260"
                />
              </Field>
            </div>

            <Check
              name="precoSobConsulta"
              label="Valor sob consulta"
              hint="Oculta o preço no site; o card exibe “Sob consulta”."
              defaultChecked={imovel?.precoSobConsulta}
            />
          </div>
        </Fieldset>

        <Fieldset titulo="Localização">
          <div className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-4">
              <Field label="Estado">
                <Input name="estado" defaultValue={imovel?.estado ?? "AL"} />
              </Field>
              <Field label="Cidade" className="sm:col-span-2">
                <Input name="cidade" defaultValue={imovel?.cidade ?? "Maceió"} />
              </Field>
              <Field label="CEP">
                <Input name="cep" placeholder="57035-000" />
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Bairro">
                <Input name="bairro" defaultValue={imovel?.bairro} placeholder="Jatiúca" />
              </Field>
              <Field label="Região" hint="Agrupa o imóvel nas páginas por região.">
                <Select name="regiao" defaultValue={imovel?.regiao ?? "Maceió"}>
                  <option>Maceió</option>
                  <option>Litoral Norte</option>
                  <option>Região Metropolitana</option>
                </Select>
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-[2fr_1fr]">
              <Field label="Rua">
                <Input name="rua" placeholder="Rua …" />
              </Field>
              <Field label="Número">
                <Input name="numero" placeholder="123" />
              </Field>
            </div>

            <Field
              label="Localização no mapa"
              hint="Define o mapa da página do imóvel. Busque pelo endereço ou clique no ponto exato."
            >
              <SeletorMapa
                latitude={imovel?.latitude ?? null}
                longitude={imovel?.longitude ?? null}
                enderecoInicial={
                  imovel ? `${imovel.bairro}, ${imovel.cidade}` : "Maceió, AL"
                }
              />
            </Field>

            <Check
              name="ocultarEndereco"
              label="Ocultar endereço exato no site"
              hint="O site mostra apenas a região aproximada; o endereço completo fica no painel."
              defaultChecked={imovel?.ocultarEndereco ?? true}
            />
          </div>
        </Fieldset>

        <Fieldset titulo="Características">
          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
            <Field label="Área útil (m²)">
              <Input name="areaUtil" type="number" defaultValue={imovel?.areaUtil ?? ""} />
            </Field>
            <Field label="Área total (m²)">
              <Input name="areaTotal" type="number" defaultValue={imovel?.areaTotal ?? ""} />
            </Field>
            <Field label="Quartos">
              <Input name="quartos" type="number" min={0} defaultValue={imovel?.quartos ?? 0} />
            </Field>
            <Field label="Suítes">
              <Input name="suites" type="number" min={0} defaultValue={imovel?.suites ?? 0} />
            </Field>
            <Field label="Banheiros">
              <Input name="banheiros" type="number" min={0} defaultValue={imovel?.banheiros ?? 0} />
            </Field>
            <Field label="Vagas">
              <Input name="vagas" type="number" min={0} defaultValue={imovel?.vagas ?? 0} />
            </Field>
          </div>
        </Fieldset>

        <Fieldset
          titulo="Fotos"
          descricao="Arraste para reordenar; a primeira é a capa. Cada foto tem zoom e ponto focal próprios."
        >
          <GerenciadorFotos imovelId={imovel?.id} fotos={imovel?.fotos ?? []} />
        </Fieldset>

        <Fieldset titulo="Diferenciais">
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {DIFERENCIAIS.map((d) => (
              <Check
                key={d}
                name="diferenciais"
                value={d}
                label={d}
                defaultChecked={imovel?.diferenciais.includes(d)}
              />
            ))}
          </div>
        </Fieldset>

        <Fieldset
          titulo="SEO"
          descricao="Gerados automaticamente a partir do título e da localização. Edite apenas se quiser sobrescrever."
        >
          <div className="grid gap-4">
            <Field label="SEO title">
              <Input
                name="seoTitle"
                placeholder={
                  imovel
                    ? `${tipoLabel[imovel.tipo]} ${imovel.quartos} quartos à venda no ${imovel.bairro} | Luciano Góis`
                    : "Gerado automaticamente"
                }
              />
            </Field>
            <Field label="Meta description">
              <Textarea name="seoDescription" rows={2} placeholder="Gerada automaticamente" />
            </Field>
          </div>
        </Fieldset>
      </div>

      {/* COLUNA LATERAL */}
      <aside className="space-y-6">
        <div className="space-y-6 xl:sticky xl:top-6">
          <Fieldset titulo="Publicação">
            <div className="grid gap-4">
              <Field label="Status">
                <Select name="status" defaultValue={imovel?.status ?? "disponivel"}>
                  {(Object.keys(statusLabel) as StatusImovel[]).map((s) => (
                    <option key={s} value={s}>
                      {statusLabel[s]}
                    </option>
                  ))}
                </Select>
              </Field>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
                <Field label="Tipo">
                  <Select name="tipo" defaultValue={imovel?.tipo ?? "apartamento"}>
                    {(Object.keys(tipoLabel) as TipoImovel[]).map((t) => (
                      <option key={t} value={t}>
                        {tipoLabel[t]}
                      </option>
                    ))}
                  </Select>
                </Field>
                <Field label="Estágio da obra">
                  <Select name="estagio" defaultValue={imovel?.estagio ?? "pronto"}>
                    {(Object.keys(estagioLabel) as EstagioObra[]).map((e) => (
                      <option key={e} value={e}>
                        {estagioLabel[e]}
                      </option>
                    ))}
                  </Select>
                </Field>
              </div>

              <div className="space-y-2 border-t border-sand pt-4">
                <Check name="publicarSite" label="Publicar no site" defaultChecked />
                <Check name="destaque" label="Destaque na home" defaultChecked={imovel?.destaque} />
                <Check name="publicarOlx" label="Publicar na OLX" />
                <Check name="publicarZap" label="Publicar no ZAP / VivaReal" />
              </div>

              <div className="border-t border-sand pt-4">
                <Check
                  name="isPlaceholder"
                  label="Conteúdo placeholder"
                  hint="Bloqueia a exibição pública mesmo com “Publicar no site” ligado."
                  defaultChecked={imovel?.isPlaceholder}
                />
              </div>
            </div>
          </Fieldset>

          <div className="space-y-2">
            {estado.erro && (
              <p
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700"
              >
                {estado.erro}
              </p>
            )}

            <AdminButton className="w-full" type="submit" disabled={enviando}>
              {enviando
                ? "Salvando…"
                : edicao
                  ? "Salvar alterações"
                  : "Cadastrar imóvel"}
            </AdminButton>
            {edicao && imovel && (
              <AdminLinkButton
                href={`/imovel/${imovel.slug}`}
                target="_blank"
                variante="secundaria"
                className="w-full"
              >
                Ver no site
              </AdminLinkButton>
            )}
            <Link
              href="/admin/imoveis"
              className="block pt-2 text-center text-xs font-semibold text-muted hover:text-navy"
            >
              Cancelar
            </Link>
          </div>
        </div>
      </aside>
    </form>
  );
}
