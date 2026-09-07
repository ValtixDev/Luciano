"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";
import type { Map as MapaLeaflet, Marker } from "leaflet";

/** Centro de Maceió, usado quando o imóvel ainda não tem coordenada. */
const PADRAO: [number, number] = [-9.6658, -35.7353];

type Props = {
  latitude: number | null;
  longitude: number | null;
  /** Preenche a busca quando o endereço já foi digitado no formulário. */
  enderecoInicial?: string;
};

/**
 * Seletor de localização com Leaflet e tiles do OpenStreetMap.
 *
 * OSM em vez do Google porque a API JavaScript do Google exige chave e
 * faturamento ativo. A exibição pública continua no embed do Google, que
 * dispensa chave — aqui só precisamos escolher o ponto.
 */
export function SeletorMapa({ latitude, longitude, enderecoInicial = "" }: Props) {
  const container = useRef<HTMLDivElement>(null);
  const mapa = useRef<MapaLeaflet | null>(null);
  const marcador = useRef<Marker | null>(null);

  const [ponto, setPonto] = useState<[number, number] | null>(
    latitude != null && longitude != null ? [latitude, longitude] : null,
  );
  const [busca, setBusca] = useState(enderecoInicial);
  const [procurando, setProcurando] = useState(false);
  const [aviso, setAviso] = useState<string | null>(null);

  useEffect(() => {
    let vivo = true;

    (async () => {
      const L = await import("leaflet");
      if (!vivo || !container.current || mapa.current) return;

      const m = L.map(container.current).setView(ponto ?? PADRAO, ponto ? 17 : 13);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap",
        maxZoom: 19,
      }).addTo(m);

      // divIcon evita o problema clássico de caminho de imagem do Leaflet
      // com bundlers, e ainda deixa o pino na cor da marca.
      const icone = L.divIcon({
        className: "",
        html: `<span style="display:block;width:22px;height:22px;border-radius:9999px;background:#eb9912;border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.4)"></span>`,
        iconSize: [22, 22],
        iconAnchor: [11, 11],
      });

      const fixar = (lat: number, lng: number) => {
        setPonto([lat, lng]);
        if (marcador.current) {
          marcador.current.setLatLng([lat, lng]);
        } else {
          marcador.current = L.marker([lat, lng], { icon: icone, draggable: true })
            .addTo(m)
            .on("dragend", (e) => {
              const p = (e.target as Marker).getLatLng();
              setPonto([p.lat, p.lng]);
            });
        }
      };

      if (ponto) fixar(ponto[0], ponto[1]);
      m.on("click", (e) => fixar(e.latlng.lat, e.latlng.lng));
      mapa.current = m;
    })();

    return () => {
      vivo = false;
      mapa.current?.remove();
      mapa.current = null;
      marcador.current = null;
    };
    // Monta uma vez: as atualizações seguintes passam pelas refs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function procurar() {
    const termo = busca.trim();
    if (!termo) return;

    setAviso(null);
    setProcurando(true);

    try {
      // Nominatim é gratuito e sem chave. A busca só dispara no clique, nunca
      // por tecla, para respeitar a política de uso do serviço.
      const resposta = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=br&q=${encodeURIComponent(termo)}`,
        { headers: { Accept: "application/json" } },
      );
      const resultados = (await resposta.json()) as { lat: string; lon: string }[];

      if (resultados.length === 0) {
        setAviso("Endereço não encontrado. Tente com o bairro e a cidade, ou clique direto no mapa.");
        return;
      }

      const lat = Number(resultados[0].lat);
      const lng = Number(resultados[0].lon);
      setPonto([lat, lng]);
      mapa.current?.setView([lat, lng], 17);
      marcador.current?.setLatLng([lat, lng]);

      // Sem marcador ainda: o clique no mapa cria; aqui força a criação.
      if (!marcador.current) {
        const L = await import("leaflet");
        marcador.current = L.marker([lat, lng], {
          draggable: true,
          icon: L.divIcon({
            className: "",
            html: `<span style="display:block;width:22px;height:22px;border-radius:9999px;background:#eb9912;border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.4)"></span>`,
            iconSize: [22, 22],
            iconAnchor: [11, 11],
          }),
        })
          .addTo(mapa.current!)
          .on("dragend", (e) => {
            const p = (e.target as Marker).getLatLng();
            setPonto([p.lat, p.lng]);
          });
      }
    } catch {
      setAviso("Não foi possível consultar o serviço de endereços agora.");
    } finally {
      setProcurando(false);
    }
  }

  function limpar() {
    setPonto(null);
    marcador.current?.remove();
    marcador.current = null;
  }

  return (
    <div>
      <input type="hidden" name="latitude" value={ponto?.[0] ?? ""} />
      <input type="hidden" name="longitude" value={ponto?.[1] ?? ""} />

      <div className="flex gap-2">
        <input
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              // Enter dentro do formulário submeteria o imóvel inteiro.
              e.preventDefault();
              procurar();
            }
          }}
          placeholder="Rua, número, bairro, cidade"
          className="h-10 flex-1 rounded-lg border border-sand bg-white px-3 text-sm text-graphite placeholder:text-muted/60 focus:border-navy focus:outline-none"
        />
        <button
          type="button"
          onClick={procurar}
          disabled={procurando}
          className="h-10 shrink-0 rounded-lg bg-navy px-4 text-sm font-semibold text-white transition-colors hover:bg-navy-700 disabled:opacity-50"
        >
          {procurando ? "Buscando…" : "Buscar"}
        </button>
      </div>

      <div
        ref={container}
        className="mt-3 h-72 w-full overflow-hidden rounded-xl border border-sand"
      />

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
        {ponto ? (
          <>
            <span className="num text-graphite">
              {ponto[0].toFixed(6)}, {ponto[1].toFixed(6)}
            </span>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${ponto[0]},${ponto[1]}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-navy hover:text-gold-dim"
            >
              Conferir no Google Maps →
            </a>
            <button
              type="button"
              onClick={limpar}
              className="font-semibold text-muted hover:text-red-700"
            >
              Remover marcação
            </button>
          </>
        ) : (
          <span className="text-muted">
            Clique no mapa para marcar, ou busque pelo endereço acima.
          </span>
        )}
      </div>

      {aviso && (
        <p role="alert" className="mt-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
          {aviso}
        </p>
      )}
    </div>
  );
}
