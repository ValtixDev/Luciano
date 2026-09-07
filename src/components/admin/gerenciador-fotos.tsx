"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import { criarClienteNavegador } from "@/lib/supabase/client";
import { supabaseUrl } from "@/lib/supabase/config";
import type { Foto } from "@/types";

const LIMITE_MB = 8;
const ZOOM_MIN = 1;
const ZOOM_MAX = 3;

const urlPublica = (caminho: string) =>
  `${supabaseUrl}/storage/v1/object/public/imoveis/${caminho}`;

/**
 * Galeria do imóvel: envio, reordenação, escolha de capa e enquadramento.
 *
 * Funciona em dois modos:
 * - EDIÇÃO   (imovelId definido): cada ação grava direto no banco.
 * - CADASTRO (sem imovelId): os arquivos vão para o Storage sob um id gerado
 *   aqui, e a lista viaja num campo oculto. O vínculo em `imovel_fotos` só
 *   pode existir depois do imóvel, por causa da chave estrangeira.
 */
export function GerenciadorFotos({
  imovelId,
  fotos: iniciais,
}: {
  imovelId?: string;
  fotos: Foto[];
}) {
  const router = useRouter();
  const entrada = useRef<HTMLInputElement>(null);

  const [fotos, setFotos] = useState<Foto[]>(iniciais);
  const [ocupado, setOcupado] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [editando, setEditando] = useState<string | null>(null);
  const [arrastando, setArrastando] = useState<string | null>(null);

  /**
   * No cadastro o imóvel ainda não existe, mas o arquivo precisa de uma pasta.
   * O id é gerado no primeiro envio — nunca na renderização — porque servidor e
   * cliente produziriam UUIDs diferentes e a hidratação divergiria.
   */
  const [idProvisorio, setIdProvisorio] = useState("");

  const modoEdicao = Boolean(imovelId);

  /** No modo edição grava no banco; no cadastro só atualiza o estado local. */
  const persistir = useCallback(
    async (novas: Foto[], alteradas: Foto[]) => {
      setFotos(novas);
      if (!modoEdicao) return;

      const sb = criarClienteNavegador();
      if (!sb) return;

      await Promise.all(
        alteradas.map((f) =>
          sb
            .from("imovel_fotos")
            .update({
              ordem: f.ordem,
              capa: f.capa,
              zoom: f.zoom,
              pos_x: f.posX,
              pos_y: f.posY,
            })
            .eq("id", f.id),
        ),
      );
      router.refresh();
    },
    [modoEdicao, router],
  );

  async function enviar(arquivos: FileList) {
    const sb = criarClienteNavegador();
    if (!sb) return;

    setErro(null);
    setOcupado(true);

    let pasta = imovelId ?? idProvisorio;
    if (!pasta) {
      pasta = crypto.randomUUID();
      setIdProvisorio(pasta);
    }

    const adicionadas: Foto[] = [];

    for (const [i, arquivo] of Array.from(arquivos).entries()) {
      if (arquivo.size > LIMITE_MB * 1024 * 1024) {
        setErro(`"${arquivo.name}" passa de ${LIMITE_MB} MB.`);
        continue;
      }

      const extensao = arquivo.name.split(".").pop()?.toLowerCase() ?? "jpg";
      const caminho = `${pasta}/${crypto.randomUUID()}.${extensao}`;

      const { error } = await sb.storage
        .from("imoveis")
        .upload(caminho, arquivo, { cacheControl: "31536000", upsert: false });

      if (error) {
        setErro(`Falha ao enviar "${arquivo.name}": ${error.message}`);
        continue;
      }

      const nova: Foto = {
        id: crypto.randomUUID(),
        caminho,
        url: urlPublica(caminho),
        alt: "",
        ordem: fotos.length + adicionadas.length + i,
        capa: fotos.length === 0 && adicionadas.length === 0 && i === 0,
        zoom: 1,
        posX: 50,
        posY: 50,
      };

      if (modoEdicao) {
        const { data, error: erroRegistro } = await sb
          .from("imovel_fotos")
          .insert({
            imovel_id: imovelId,
            storage_path: caminho,
            alt: "",
            ordem: nova.ordem,
            capa: nova.capa,
          })
          .select("id")
          .single();

        if (erroRegistro) {
          // Sem registro, o arquivo viraria lixo no bucket.
          await sb.storage.from("imoveis").remove([caminho]);
          setErro(`Não foi possível registrar a foto: ${erroRegistro.message}`);
          continue;
        }
        nova.id = data.id as string;
      }

      adicionadas.push(nova);
    }

    setFotos((atuais) => [...atuais, ...adicionadas]);
    setOcupado(false);
    if (entrada.current) entrada.current.value = "";
    if (modoEdicao) router.refresh();
  }

  async function remover(foto: Foto) {
    const sb = criarClienteNavegador();
    if (!sb) return;

    setOcupado(true);
    if (modoEdicao) await sb.from("imovel_fotos").delete().eq("id", foto.id);
    await sb.storage.from("imoveis").remove([foto.caminho]);

    const restantes = renumerar(fotos.filter((f) => f.id !== foto.id));
    // Removeu a capa: a primeira restante assume, senão o imóvel fica sem.
    if (foto.capa && restantes.length > 0) restantes[0].capa = true;

    await persistir(restantes, restantes);
    setOcupado(false);
    if (editando === foto.id) setEditando(null);
  }

  function renumerar(lista: Foto[]) {
    return lista.map((f, i) => ({ ...f, ordem: i }));
  }

  async function mover(id: string, direcao: -1 | 1) {
    const i = fotos.findIndex((f) => f.id === id);
    const j = i + direcao;
    if (i < 0 || j < 0 || j >= fotos.length) return;

    const lista = [...fotos];
    [lista[i], lista[j]] = [lista[j], lista[i]];
    const renumerada = renumerar(lista);
    await persistir(renumerada, [renumerada[i], renumerada[j]]);
  }

  async function soltarEm(idAlvo: string) {
    if (!arrastando || arrastando === idAlvo) return;

    const origem = fotos.findIndex((f) => f.id === arrastando);
    const destino = fotos.findIndex((f) => f.id === idAlvo);
    const lista = [...fotos];
    const [movida] = lista.splice(origem, 1);
    lista.splice(destino, 0, movida);

    const renumerada = renumerar(lista);
    setArrastando(null);
    await persistir(renumerada, renumerada);
  }

  async function definirCapa(id: string) {
    const nova = fotos.map((f) => ({ ...f, capa: f.id === id }));
    await persistir(nova, nova);
  }

  async function ajustar(id: string, campo: "zoom" | "posX" | "posY", valor: number) {
    const nova = fotos.map((f) => (f.id === id ? { ...f, [campo]: valor } : f));
    setFotos(nova);
    const alterada = nova.find((f) => f.id === id);
    if (alterada) await persistir(nova, [alterada]);
  }

  const emEdicao = fotos.find((f) => f.id === editando);

  return (
    <div>
      {/* No cadastro, a lista viaja com o formulário e vira imovel_fotos no servidor. */}
      {!modoEdicao && (
        <input type="hidden" name="imovelIdProvisorio" value={idProvisorio} />
      )}
      {!modoEdicao && (
        <input
          type="hidden"
          name="fotosNovas"
          value={JSON.stringify(
            fotos.map((f) => ({
              caminho: f.caminho,
              ordem: f.ordem,
              capa: f.capa,
              zoom: f.zoom,
              pos_x: f.posX,
              pos_y: f.posY,
            })),
          )}
        />
      )}

      <button
        type="button"
        onClick={() => entrada.current?.click()}
        disabled={ocupado}
        className="flex min-h-28 w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-navy/20 bg-offwhite px-6 py-8 text-center transition-colors hover:border-navy/40 disabled:opacity-60"
      >
        <span className="text-sm font-semibold text-navy">
          {ocupado ? "Enviando…" : "Selecionar fotos"}
        </span>
        <span className="mt-1 text-xs text-muted">
          JPG, PNG ou WebP até {LIMITE_MB} MB · pode escolher várias
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
        <p role="alert" className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
          {erro}
        </p>
      )}

      {fotos.length > 0 && (
        <>
          <p className="mt-5 text-xs text-muted">
            Arraste para reordenar. A primeira é a capa, usada no catálogo e no
            compartilhamento.
          </p>

          <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {fotos.map((foto, i) => (
              <li
                key={foto.id}
                draggable
                onDragStart={() => setArrastando(foto.id)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => soltarEm(foto.id)}
                onDragEnd={() => setArrastando(null)}
                className={`group relative cursor-grab rounded-xl border-2 transition-[border-color,opacity] active:cursor-grabbing ${
                  arrastando === foto.id
                    ? "border-gold-marca opacity-40"
                    : foto.capa
                      ? "border-gold-marca"
                      : "border-transparent"
                }`}
              >
                <div className="aspect-4/3 overflow-hidden rounded-[0.6rem]">
                  <Image
                    src={foto.url ?? ""}
                    alt={foto.alt || "Foto do imóvel"}
                    width={400}
                    height={300}
                    sizes="200px"
                    style={{
                      objectPosition: `${foto.posX}% ${foto.posY}%`,
                      transform: `scale(${foto.zoom})`,
                    }}
                    className="h-full w-full object-cover"
                  />
                </div>

                {foto.capa && (
                  <span className="absolute left-2 top-2 rounded-md bg-gold-marca px-2 py-0.5 text-[0.5625rem] font-bold text-navy-950">
                    CAPA
                  </span>
                )}

                <div className="absolute inset-x-0 bottom-0 flex items-center gap-1 rounded-b-[0.6rem] bg-navy-950/85 px-2 py-1.5 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
                  <button
                    type="button"
                    onClick={() => mover(foto.id, -1)}
                    disabled={i === 0}
                    aria-label="Mover para trás"
                    className="text-xs text-white disabled:opacity-30"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    onClick={() => mover(foto.id, 1)}
                    disabled={i === fotos.length - 1}
                    aria-label="Mover para frente"
                    className="text-xs text-white disabled:opacity-30"
                  >
                    →
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditando(editando === foto.id ? null : foto.id)}
                    className="ml-1 text-[0.625rem] font-semibold text-white hover:text-gold-marca"
                  >
                    Ajustar
                  </button>
                  {!foto.capa && (
                    <button
                      type="button"
                      onClick={() => definirCapa(foto.id)}
                      className="text-[0.625rem] font-semibold text-white hover:text-gold-marca"
                    >
                      Capa
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => remover(foto)}
                    aria-label="Excluir foto"
                    className="ml-auto text-[0.625rem] font-semibold text-white hover:text-red-300"
                  >
                    Excluir
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      {emEdicao && (
        <div className="mt-5 rounded-xl border border-sand bg-offwhite p-5">
          <div className="flex items-baseline justify-between">
            <p className="text-sm font-semibold text-navy">Enquadramento</p>
            <button
              type="button"
              onClick={() => setEditando(null)}
              className="text-xs font-semibold text-muted hover:text-navy"
            >
              Concluir
            </button>
          </div>

          <div className="mt-4 grid gap-5 sm:grid-cols-[240px_1fr]">
            {/* Prévia no mesmo 4:3 do card do catálogo. */}
            <div className="aspect-4/3 overflow-hidden rounded-xl border border-sand-dark bg-white">
              <Image
                src={emEdicao.url ?? ""}
                alt=""
                width={600}
                height={450}
                sizes="240px"
                style={{
                  objectPosition: `${emEdicao.posX}% ${emEdicao.posY}%`,
                  transform: `scale(${emEdicao.zoom})`,
                }}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="space-y-4">
              <Controle
                rotulo="Zoom"
                valor={emEdicao.zoom}
                min={ZOOM_MIN}
                max={ZOOM_MAX}
                passo={0.05}
                sufixo="×"
                onChange={(v) => ajustar(emEdicao.id, "zoom", v)}
              />
              <Controle
                rotulo="Horizontal"
                valor={emEdicao.posX}
                min={0}
                max={100}
                passo={1}
                sufixo="%"
                onChange={(v) => ajustar(emEdicao.id, "posX", v)}
              />
              <Controle
                rotulo="Vertical"
                valor={emEdicao.posY}
                min={0}
                max={100}
                passo={1}
                sufixo="%"
                onChange={(v) => ajustar(emEdicao.id, "posY", v)}
              />

              <button
                type="button"
                onClick={async () => {
                  await ajustar(emEdicao.id, "zoom", 1);
                  await ajustar(emEdicao.id, "posX", 50);
                  await ajustar(emEdicao.id, "posY", 50);
                }}
                className="text-xs font-semibold text-muted hover:text-navy"
              >
                Restaurar padrão
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Controle({
  rotulo,
  valor,
  min,
  max,
  passo,
  sufixo,
  onChange,
}: {
  rotulo: string;
  valor: number;
  min: number;
  max: number;
  passo: number;
  sufixo: string;
  onChange: (v: number) => void;
}) {
  return (
    <label className="block">
      <span className="flex items-baseline justify-between text-xs font-semibold text-graphite">
        {rotulo}
        <span className="num font-normal text-muted">
          {valor.toFixed(passo < 1 ? 2 : 0)}
          {sufixo}
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={passo}
        value={valor}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 w-full accent-navy"
      />
    </label>
  );
}
