"use client";

import { useState } from "react";
import { estiloBotao } from "@/components/ui/button";
import { whatsappUrl } from "@/lib/site";

const campo =
  "h-12 w-full rounded-lg border border-sand bg-white px-4 text-sm text-graphite focus:border-navy focus:outline-none";
const rotulo = "eyebrow mb-2 block text-muted";

const interesses = [
  "Comprar um imóvel",
  "Alugar um imóvel",
  "Investir em imóvel",
  "Vender meu imóvel",
  "Outro assunto",
];

/**
 * V1: monta a conversa no WhatsApp a partir do formulário.
 * Quando o Supabase entrar, este submit também grava em `leads`
 * com origem = "site" antes de redirecionar.
 */
export function ContactForm() {
  const [nome, setNome] = useState("");
  const [interesse, setInteresse] = useState(interesses[0]);
  const [mensagem, setMensagem] = useState("");

  const texto = [
    `Olá Luciano, meu nome é ${nome || "[nome]"}.`,
    `Assunto: ${interesse}.`,
    mensagem && `\n${mensagem}`,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <form
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        window.open(whatsappUrl(texto), "_blank", "noopener,noreferrer");
      }}
    >
      <div>
        <label className={rotulo} htmlFor="nome">
          Seu nome
        </label>
        <input
          id="nome"
          name="nome"
          required
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Como podemos te chamar?"
          className={campo}
        />
      </div>

      <div>
        <label className={rotulo} htmlFor="interesse">
          Como podemos ajudar?
        </label>
        <select
          id="interesse"
          name="interesse"
          value={interesse}
          onChange={(e) => setInteresse(e.target.value)}
          className={`${campo} appearance-none`}
        >
          {interesses.map((i) => (
            <option key={i}>{i}</option>
          ))}
        </select>
      </div>

      <div>
        <label className={rotulo} htmlFor="mensagem">
          Mensagem
        </label>
        <textarea
          id="mensagem"
          name="mensagem"
          rows={5}
          value={mensagem}
          onChange={(e) => setMensagem(e.target.value)}
          placeholder="Conte o que você procura: região, número de quartos, faixa de valor..."
          className="w-full rounded-lg border border-sand bg-white p-4 text-sm text-graphite focus:border-navy focus:outline-none"
        />
      </div>

      <button type="submit" className={`${estiloBotao("primaria", "lg")} w-full`}>
        Enviar pelo WhatsApp
      </button>

      <p className="text-xs leading-relaxed text-muted">
        Ao enviar, a conversa abre no WhatsApp já preenchida com as informações
        acima.
      </p>
    </form>
  );
}
