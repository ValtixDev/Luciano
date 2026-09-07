"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { criarClienteNavegador } from "@/lib/supabase/client";
import { supabaseUrl } from "@/lib/supabase/config";

const LIMITE_MB = 8;

/**
 * Campo de imagem única. Sobe para o Storage e devolve a URL num campo oculto,
 * para o formulário gravar junto com os demais dados.
 */
export function UploadImagem({
  nome,
  inicial,
  rotulo,
  proporcao = "aspect-16/10",
  fundoEscuro = false,
}: {
  nome: string;
  inicial: string | null;
  rotulo: string;
  proporcao?: string;
  /** Logo é dourado sobre transparente: precisa de fundo escuro para conferir. */
  fundoEscuro?: boolean;
}) {
  const entrada = useRef<HTMLInputElement>(null);
  const [valor, setValor] = useState(inicial ?? "");
  const [ocupado, setOcupado] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function enviar(arquivo: File) {
    if (arquivo.size > LIMITE_MB * 1024 * 1024) {
      setErro(`A imagem passa de ${LIMITE_MB} MB.`);
      return;
    }

    const sb = criarClienteNavegador();
    if (!sb) return;

    setErro(null);
    setOcupado(true);

    const extensao = arquivo.name.split(".").pop()?.toLowerCase() ?? "png";
    const caminho = `marca/${crypto.randomUUID()}.${extensao}`;

    const { error } = await sb.storage
      .from("imoveis")
      .upload(caminho, arquivo, { cacheControl: "31536000", upsert: false });

    if (error) {
      setErro(`Falha ao enviar: ${error.message}`);
      setOcupado(false);
      return;
    }

    setValor(`${supabaseUrl}/storage/v1/object/public/imoveis/${caminho}`);
    setOcupado(false);
  }

  return (
    <div>
      <input type="hidden" name={nome} value={valor} />
      <span className="mb-1.5 block text-xs font-semibold text-graphite">{rotulo}</span>

      {valor ? (
        <div>
          <div
            className={`${proporcao} overflow-hidden rounded-xl border border-sand ${
              fundoEscuro ? "bg-navy p-4" : "bg-white"
            }`}
          >
            <Image
              src={valor}
              alt={rotulo}
              width={800}
              height={500}
              sizes="320px"
              className={`h-full w-full ${fundoEscuro ? "object-contain" : "object-cover"}`}
            />
          </div>
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={() => entrada.current?.click()}
              disabled={ocupado}
              className="rounded-lg border border-sand px-3 py-1.5 text-xs font-semibold text-navy hover:bg-offwhite disabled:opacity-50"
            >
              {ocupado ? "Enviando…" : "Trocar"}
            </button>
            <button
              type="button"
              onClick={() => setValor("")}
              className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50"
            >
              Remover
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => entrada.current?.click()}
          disabled={ocupado}
          className={`${proporcao} flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-navy/20 bg-offwhite px-4 text-center transition-colors hover:border-navy/40 disabled:opacity-60`}
        >
          <span className="text-xs font-semibold text-navy">
            {ocupado ? "Enviando…" : "Enviar imagem"}
          </span>
        </button>
      )}

      <input
        ref={entrada}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => e.target.files?.[0] && enviar(e.target.files[0])}
      />

      {erro && (
        <p role="alert" className="mt-2 text-xs text-red-700">
          {erro}
        </p>
      )}
    </div>
  );
}
