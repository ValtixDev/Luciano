"use client";

import Link from "next/link";
import { useActionState } from "react";
import { salvarPost, type EstadoPost } from "@/app/admin/(painel)/blog/acoes";
import { UploadCapa } from "@/components/admin/upload-capa";
import { AdminButton, AdminLinkButton } from "@/components/admin/ui";
import { Field, Fieldset, Input, Select, Textarea } from "@/components/admin/fields";

export type PostEdicao = {
  slug: string;
  titulo: string;
  resumo: string;
  conteudo: string;
  capaPath: string | null;
  categoria: string;
  autor: string;
  status: string;
  publicadoEm: string;
  seoTitle: string;
  seoDescription: string;
};

const CATEGORIAS = ["Mercado", "Investimentos", "Maceió", "Dicas"];

export function FormularioPost({ post }: { post?: PostEdicao }) {
  const edicao = Boolean(post);
  const [estado, acao, enviando] = useActionState<EstadoPost, FormData>(salvarPost, {});

  return (
    <form action={acao} className="grid gap-6 xl:grid-cols-[1fr_320px]">
      {post && <input type="hidden" name="slugOriginal" value={post.slug} />}

      <div className="space-y-6">
        <Fieldset titulo="Conteúdo">
          <div className="grid gap-4">
            <Field label="Título">
              <Input name="titulo" defaultValue={post?.titulo} required />
            </Field>
            <Field label="Slug (URL)" hint="/blog/… — deixe vazio para gerar do título.">
              <Input name="slug" defaultValue={post?.slug} />
            </Field>
            <Field label="Resumo" hint="Aparece no card do blog e na meta description.">
              <Textarea name="resumo" rows={2} defaultValue={post?.resumo} />
            </Field>
            <Field label="Conteúdo" hint="Separe os parágrafos com uma linha em branco.">
              <Textarea name="conteudo" rows={18} defaultValue={post?.conteudo} />
            </Field>
          </div>
        </Fieldset>

        <Fieldset titulo="Imagem de capa">
          <UploadCapa inicial={post?.capaPath ?? null} />
        </Fieldset>

        <Fieldset titulo="SEO">
          <div className="grid gap-4">
            <Field label="SEO title">
              <Input name="seoTitle" defaultValue={post?.seoTitle} placeholder="Gerado a partir do título" />
            </Field>
            <Field label="Meta description">
              <Textarea name="seoDescription" rows={2} defaultValue={post?.seoDescription} placeholder="Gerada a partir do resumo" />
            </Field>
          </div>
        </Fieldset>
      </div>

      <aside>
        <div className="sticky top-6 space-y-6">
          <Fieldset titulo="Publicação">
            <div className="grid gap-4">
              <Field label="Status">
                <Select name="status" defaultValue={post?.status ?? "rascunho"}>
                  <option value="rascunho">Rascunho</option>
                  <option value="publicado">Publicado</option>
                </Select>
              </Field>
              <Field label="Categoria">
                <Select name="categoria" defaultValue={post?.categoria ?? "Mercado"}>
                  {CATEGORIAS.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </Select>
              </Field>
              <Field label="Autor">
                <Input name="autor" defaultValue={post?.autor ?? "Luciano Góis"} />
              </Field>
              <Field label="Data de publicação">
                <Input name="publicadoEm" type="date" defaultValue={post?.publicadoEm} />
              </Field>
            </div>
          </Fieldset>

          <div className="space-y-2">
            {estado.erro && (
              <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
                {estado.erro}
              </p>
            )}

            <AdminButton className="w-full" type="submit" disabled={enviando}>
              {enviando ? "Salvando…" : edicao ? "Salvar alterações" : "Criar artigo"}
            </AdminButton>

            {edicao && post && (
              <AdminLinkButton
                href={`/blog/${post.slug}`}
                target="_blank"
                variante="secundaria"
                className="w-full"
              >
                Ver no site
              </AdminLinkButton>
            )}

            <Link
              href="/admin/blog"
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
