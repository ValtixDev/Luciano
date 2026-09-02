import type { Metadata } from "next";
import { AdminButton, PageHeader } from "@/components/admin/ui";
import { Check, Field, Fieldset, Input, Textarea } from "@/components/admin/fields";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Configurações" };

export default function ConfiguracoesPage() {
  return (
    <>
      <PageHeader
        titulo="Configurações"
        descricao="Dados que alimentam o site inteiro: cabeçalho, rodapé, SEO local e o assistente de IA."
        acao={<AdminButton type="button">Salvar alterações</AdminButton>}
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <Fieldset titulo="Perfil">
          <div className="grid gap-4">
            <Field label="Nome">
              <Input name="nome" defaultValue={site.nome} />
            </Field>
            <Field label="Razão / assinatura">
              <Input name="razao" defaultValue={site.razao} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="CRECI">
                <Input name="creci" defaultValue={site.creci} />
              </Field>
              <Field label="Telefone">
                <Input name="telefone" defaultValue={site.telefoneExibicao} />
              </Field>
            </div>
            <Field label="E-mail">
              <Input name="email" type="email" placeholder="contato@lucianogois.com.br" />
            </Field>
            <Field label="Instagram">
              <Input name="instagram" defaultValue={site.instagram} />
            </Field>
            <Field label="Endereço">
              <Input
                name="endereco"
                defaultValue={`${site.endereco.rua}, ${site.endereco.bairro}, ${site.endereco.cidade}/${site.endereco.estado}`}
              />
            </Field>
          </div>
        </Fieldset>

        <Fieldset
          titulo="WhatsApp"
          descricao="Número e mensagem padrão usados em todos os botões do site."
        >
          <div className="grid gap-4">
            <Field label="Número (com DDI)" hint="Formato aceito pelo wa.me">
              <Input name="whatsapp" defaultValue={site.whatsapp} />
            </Field>
            <Field
              label="Mensagem padrão"
              hint="Na página do imóvel, o nome e o código do imóvel são acrescentados automaticamente."
            >
              <Textarea
                name="whatsappMensagem"
                rows={3}
                defaultValue="Olá Luciano, vim pelo site e gostaria de conversar."
              />
            </Field>
          </div>
        </Fieldset>

        <Fieldset
          titulo="Site"
          descricao="Identidade visual e texto institucional exibidos nas páginas públicas."
        >
          <div className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-3">
              {["Logo", "Favicon", "Foto do Luciano"].map((r) => (
                <div key={r}>
                  <span className="mb-1.5 block text-xs font-semibold text-graphite">
                    {r}
                  </span>
                  <div className="flex aspect-square items-center justify-center rounded-lg border-2 border-dashed border-navy/20 bg-offwhite text-center text-[0.625rem] text-muted">
                    Enviar
                  </div>
                </div>
              ))}
            </div>
            <Field label="Texto institucional" hint="Usado na home e na página Sobre.">
              <Textarea name="textoInstitucional" rows={5} defaultValue={site.descricao} />
            </Field>
            <Field label="Domínio" hint="Alimenta canonical, Open Graph e sitemap.">
              <Input name="url" defaultValue={site.url} />
            </Field>
          </div>
        </Fieldset>

        <Fieldset
          titulo="Assistente de IA"
          descricao="Um único agente: recomenda imóveis do acervo e responde dúvidas gerais."
        >
          <div className="grid gap-4">
            <Field
              label="Comportamento"
              hint="Tom de voz e limites do assistente. Ele consulta o acervo automaticamente."
            >
              <Textarea
                name="iaPrompt"
                rows={6}
                defaultValue="Você é o assistente do corretor Luciano Góis, em Maceió/AL. Ajude o visitante a encontrar imóveis do acervo, tire dúvidas sobre regiões e sobre o atendimento, e encaminhe para o WhatsApp quando fizer sentido. Nunca invente imóveis, valores ou condições que não estejam no acervo."
              />
            </Field>
            <Field label="Perguntas frequentes" hint="Uma por linha.">
              <Textarea
                name="iaFaq"
                rows={5}
                defaultValue={"Luciano trabalha em qual região?\nVocês trabalham com financiamento?\nOnde fica o escritório?\nComo funciona a avaliação de um imóvel para venda?"}
              />
            </Field>
            <Field label="Telefone de encaminhamento">
              <Input name="iaTelefone" defaultValue={site.telefoneExibicao} />
            </Field>
            <Check
              name="iaAtivo"
              label="Assistente ativo no site"
              hint="Quando desligado, o botão flutuante volta a apontar direto para o WhatsApp."
              defaultChecked
            />
          </div>
        </Fieldset>
      </div>

      <div className="mt-6 flex justify-end">
        <AdminButton type="button">Salvar alterações</AdminButton>
      </div>
    </>
  );
}
