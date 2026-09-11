"use client";

import { useActionState } from "react";
import {
  salvarConfiguracoes,
  type EstadoConfig,
} from "@/app/admin/(painel)/configuracoes/acoes";
import { UploadImagem } from "@/components/admin/upload-imagem";
import { AdminButton } from "@/components/admin/ui";
import { Field, Fieldset, Input, Textarea } from "@/components/admin/fields";
import type { Configuracao } from "@/lib/configuracoes";

export function FormularioConfiguracoes({ config }: { config: Configuracao }) {
  const [estado, acao, enviando] = useActionState<EstadoConfig, FormData>(
    salvarConfiguracoes,
    {},
  );

  return (
    <form action={acao}>
      <div className="grid gap-6 xl:grid-cols-2">
        <Fieldset
          titulo="Identidade"
          descricao="Aparece no rodapé, na página de contato e nos dados estruturados que o Google lê."
        >
          <div className="grid gap-4">
            <Field label="Nome">
              <Input name="nome" defaultValue={config.nome} required />
            </Field>
            <Field label="Razão / assinatura">
              <Input name="razao" defaultValue={config.razao} />
            </Field>
            <Field label="CRECI">
              <Input name="creci" defaultValue={config.creci} />
            </Field>
            <Field
              label="Texto institucional"
              hint="Usado no rodapé e como descrição do site nos buscadores."
            >
              <Textarea
                name="textoInstitucional"
                rows={4}
                defaultValue={config.textoInstitucional}
              />
            </Field>
          </div>
        </Fieldset>

        <Fieldset
          titulo="Contato"
          descricao="O WhatsApp alimenta todos os botões do site e as mensagens do assistente."
        >
          <div className="grid gap-4">
            <Field label="Telefone exibido">
              <Input name="telefone" defaultValue={config.telefone} />
            </Field>
            <Field
              label="WhatsApp"
              hint="Só números, com DDI e DDD. Ex.: 5582988743028"
            >
              <Input name="whatsapp" defaultValue={config.whatsapp} inputMode="numeric" />
            </Field>
            <Field
              label="Mensagem padrão"
              hint="Na página do imóvel, o nome e o código são acrescentados automaticamente."
            >
              <Textarea
                name="whatsappMensagem"
                rows={2}
                defaultValue={config.whatsappMensagem}
              />
            </Field>
            <Field label="E-mail">
              <Input name="email" type="email" defaultValue={config.email ?? ""} />
            </Field>
            <Field label="Instagram" hint="Com ou sem @; o link é montado sozinho.">
              <Input name="instagram" defaultValue={config.instagram} />
            </Field>
          </div>
        </Fieldset>

        <Fieldset
          titulo="Endereço"
          descricao="Alimenta o rodapé, a seção “Onde estou” e o mapa da home."
        >
          <div className="grid gap-4">
            <Field label="Rua e número">
              <Input name="enderecoRua" defaultValue={config.endereco.rua} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Bairro">
                <Input name="enderecoBairro" defaultValue={config.endereco.bairro} />
              </Field>
              <Field label="Cidade">
                <Input name="enderecoCidade" defaultValue={config.endereco.cidade} />
              </Field>
              <Field label="UF">
                <Input name="enderecoEstado" defaultValue={config.endereco.estado} maxLength={2} />
              </Field>
            </div>
          </div>
        </Fieldset>

        <Fieldset
          titulo="Imagens da marca"
          descricao="Trocar aqui substitui em todo o site — cabeçalho, rodapé, painel e hero."
        >
          <div className="grid gap-5">
            <UploadImagem
              nome="logo"
              inicial={config.logo}
              rotulo="Logo (fundo transparente)"
              proporcao="aspect-3/1"
              fundoEscuro
            />
            <div className="grid gap-5 sm:grid-cols-2">
              <UploadImagem
                nome="retratoHero"
                inicial={config.retratoHero}
                rotulo="Retrato do hero"
                proporcao="aspect-4/5"
              />
              <UploadImagem
                nome="retratoSobre"
                inicial={config.retratoSobre}
                rotulo="Retrato da seção Sobre"
                proporcao="aspect-4/5"
              />
            </div>
          </div>
        </Fieldset>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-end gap-4">
        {estado.erro && (
          <p role="alert" className="mr-auto rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {estado.erro}
          </p>
        )}
        {estado.salvo && !estado.erro && (
          <p role="status" className="mr-auto text-sm font-semibold text-emerald-700">
            Alterações salvas e publicadas no site.
          </p>
        )}
        <AdminButton type="submit" disabled={enviando}>
          {enviando ? "Salvando…" : "Salvar alterações"}
        </AdminButton>
      </div>
    </form>
  );
}
