"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { criarClienteNavegador } from "@/lib/supabase/client";
import { supabaseUrl } from "@/lib/supabase/config";

const LIMITE_MB = 8;

/**
 * Capa do artigo. Sobe direto para o Storage e devolve a URL num campo oculto,
 * para o formulário gravar junto com o resto.
 *
 * Reaproveita o bucket `imoveis` sob o prefixo `blog/`: as policies dele já
 * dão leitura pública e escrita só para admin, então não precisa de migration.
 */
export function UploadCapa({ inicial }: { inicial: string | null }) {
  const entrada = useRef<HTMLInputElement>(null);
  const [capa, setCapa] = useState(inicial ?? "");
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

    const extensao = arquivo.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const caminho = `blog/${crypto.randomUUID()}.${extensao}`;

    const { error } = await sb.storage
      .from("imoveis")
      .upload(caminho, arquivo, { cacheControl: "31536000", upsert: false });

    if (error) {
      setErro(`Falha ao enviar: ${error.message}`);
      setOcupado(false);
      return;
    }

    setCapa(`${supabaseUrl}/storage/v1/object/public/imoveis/${caminho}`);
    setOcupado(false);
  }

  return (
    <div>
      <input type="hidden" name="capaPath" value={capa} />

      {capa ? (
        <div className="relative">
          <Image
            src={capa}
            alt="Capa do artigo"
            width={1200}
            height={750}
            sizes="(min-width: 1280px) 640px, 100vw"
            className="aspect-16/10 w-full rounded-xl border border-sand object-cover"
          />
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() => entrada.current?.click()}
              disabled={ocupado}
              className="rounded-lg border border-sand px-3 py-1.5 text-xs font-semibold text-navy hover:bg-offwhite disabled:opacity-50"
            >
              {ocupado ? "Enviando…" : "Trocar imagem"}
            </button>
            <button
              type="button"
              onClick={() => setCapa("")}
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
          className="flex min-h-32 w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-navy/20 bg-offwhite px-6 py-10 text-center transition-colors hover:border-navy/40 disabled:opacity-60"
        >
          <span className="text-sm font-semibold text-navy">
            {ocupado ? "Enviando…" : "Selecionar capa"}
          </span>
          <span className="mt-1 text-xs text-muted">
            Proporção 16:10 · também usada no compartilhamento
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
        <p role="alert" className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
          {erro}
        </p>
      )}
    </div>
  );
}
