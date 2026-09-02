"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { criarClienteNavegador } from "@/lib/supabase/client";
import { supabaseUrl } from "@/lib/supabase/config";
import type { Foto } from "@/types";

const LIMITE_MB = 8;

/**
 * Sobe as fotos direto do navegador para o Storage e registra em `imovel_fotos`.
 * O arquivo não passa pelo servidor Next — evita o limite de corpo de requisição
 * das server actions e não ocupa a função com bytes de imagem.
 */
export function GerenciadorFotos({
  imovelId,
  fotos,
}: {
  imovelId: string;
  fotos: Foto[];
}) {
  const router = useRouter();
  const entrada = useRef<HTMLInputElement>(null);
  const [ocupado, setOcupado] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function enviar(arquivos: FileList) {
    const sb = criarClienteNavegador();
    if (!sb) return;

    setErro(null);
    setOcupado(true);

    for (const [indice, arquivo] of Array.from(arquivos).entries()) {
      if (arquivo.size > LIMITE_MB * 1024 * 1024) {
        setErro(`"${arquivo.name}" passa de ${LIMITE_MB} MB.`);
        continue;
      }

      const extensao = arquivo.name.split(".").pop()?.toLowerCase() ?? "jpg";
      const caminho = `${imovelId}/${crypto.randomUUID()}.${extensao}`;

      const { error: erroUpload } = await sb.storage
        .from("imoveis")
        .upload(caminho, arquivo, { cacheControl: "31536000", upsert: false });

      if (erroUpload) {
        setErro(`Falha ao enviar "${arquivo.name}": ${erroUpload.message}`);
        continue;
      }

      const { error: erroRegistro } = await sb.from("imovel_fotos").insert({
        imovel_id: imovelId,
        storage_path: caminho,
        alt: "",
        ordem: fotos.length + indice,
        // Primeira foto do imóvel vira capa automaticamente.
        capa: fotos.length === 0 && indice === 0,
      });

      if (erroRegistro) {
        // Não deixa arquivo órfão no bucket se o registro falhar.
        await sb.storage.from("imoveis").remove([caminho]);
        setErro(`Não foi possível registrar a foto: ${erroRegistro.message}`);
      }
    }

    setOcupado(false);
    if (entrada.current) entrada.current.value = "";
    router.refresh();
  }

  async function remover(url: string) {
    const sb = criarClienteNavegador();
    if (!sb) return;

    const caminho = url.split("/object/public/imoveis/")[1];
    if (!caminho) return;

    setOcupado(true);
    await sb.from("imovel_fotos").delete().eq("storage_path", caminho);
    await sb.storage.from("imoveis").remove([caminho]);
    setOcupado(false);
    router.refresh();
  }

  async function definirCapa(url: string) {
    const sb = criarClienteNavegador();
    if (!sb) return;

    const caminho = url.split("/object/public/imoveis/")[1];
    if (!caminho) return;

    setOcupado(true);
    await sb.from("imovel_fotos").update({ capa: false }).eq("imovel_id", imovelId);
    await sb.from("imovel_fotos").update({ capa: true }).eq("storage_path", caminho);
    setOcupado(false);
    router.refresh();
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => entrada.current?.click()}
        disabled={ocupado}
        className="flex min-h-32 w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-navy/20 bg-offwhite px-6 py-10 text-center transition-colors hover:border-navy/40 disabled:opacity-60"
      >
        <span className="text-sm font-semibold text-navy">
          {ocupado ? "Enviando…" : "Selecionar fotos"}
        </span>
        <span className="mt-1 text-xs text-muted">
          JPG, PNG ou WebP até {LIMITE_MB} MB
        </span>
      </button>

      <input
        ref={entrada}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => e.target.files?.length && enviar(e.target.files)}
      />

      {erro && (
        <p
          role="alert"
          className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700"
        >
          {erro}
        </p>
      )}

      {fotos.length > 0 && (
        <ul className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-5">
          {fotos.map((foto) => (
            <li key={foto.url} className="group relative">
              <Image
                src={foto.url ?? ""}
                alt={foto.alt}
                width={400}
                height={300}
                sizes="160px"
                className="aspect-4/3 w-full rounded-xl object-cover"
              />

              {foto.capa && (
                <span className="absolute left-2 top-2 rounded-md bg-gold px-2 py-0.5 text-[0.5625rem] font-bold text-navy-950">
                  CAPA
                </span>
              )}

              <div className="absolute inset-x-0 bottom-0 flex justify-between gap-1 rounded-b-xl bg-navy-950/80 px-2 py-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                {!foto.capa && (
                  <button
                    type="button"
                    onClick={() => definirCapa(foto.url ?? "")}
                    className="text-[0.625rem] font-semibold text-white hover:text-gold-soft"
                  >
                    Capa
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => remover(foto.url ?? "")}
                  className="ml-auto text-[0.625rem] font-semibold text-white hover:text-red-300"
                >
                  Excluir
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export { supabaseUrl };
