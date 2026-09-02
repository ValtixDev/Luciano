import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { site, whatsappUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contato",
  description:
    "Fale com Luciano Góis sobre compra, venda, aluguel ou investimento imobiliário em Maceió e região.",
  alternates: { canonical: "/contato" },
};

export default function ContatoPage() {
  const canais = [
    {
      rotulo: "WhatsApp",
      valor: site.telefoneExibicao,
      href: whatsappUrl("Olá Luciano, vim pela página de contato do site."),
    },
    { rotulo: "Instagram", valor: site.instagram, href: site.instagramUrl },
  ];

  return (
    <>
      <PageHero
        eyebrow="Contato"
        titulo={
          <>
            Vamos conversar sobre
            <br className="hidden sm:block" /> o seu próximo imóvel.
          </>
        }
        texto="Conte o que você procura e retornamos com as melhores possibilidades para o seu momento."
      />

      <section className="bg-offwhite py-16 sm:py-20 lg:py-24">
        <div className="container-page grid gap-16 lg:grid-cols-[1fr_0.85fr]">
          <Reveal className="rounded-card border border-sand bg-white p-8 shadow-[0_32px_80px_-56px] shadow-navy/50 sm:p-10">
            <h2 className="display-2 text-navy">Enviar mensagem</h2>
            <div className="mt-8">
              <ContactForm />
            </div>
          </Reveal>

          <Reveal delay={140} className="space-y-10">
            <div>
              <p className="eyebrow text-gold-dim">Canais diretos</p>
              <ul className="mt-5 space-y-4">
                {canais.map((c) => (
                  <li key={c.rotulo}>
                    <a
                      href={c.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block rounded-card border border-sand px-6 py-5 transition-[border-color,background-color,transform] duration-400 ease-[var(--ease-out-soft)] hover:-translate-y-0.5 hover:border-sand-dark hover:bg-offwhite"
                    >
                      <p className="eyebrow text-muted">{c.rotulo}</p>
                      <p className="mt-1.5 font-display text-xl tracking-tight text-navy">{c.valor}</p>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="eyebrow text-gold-dim">Escritório</p>
              <address className="mt-5 rounded-card border border-sand bg-offwhite px-6 py-5 text-sm not-italic leading-relaxed text-graphite">
                {site.razao}
                <br />
                {site.endereco.rua}
                <br />
                {site.endereco.bairro} · {site.endereco.cidade}/{site.endereco.estado}
                <br />
                <span className="mt-2 inline-block text-xs text-muted">{site.creci}</span>
              </address>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
