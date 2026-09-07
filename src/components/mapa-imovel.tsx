import type { Imovel } from "@/types";

/**
 * Mapa da página do imóvel, via embed do Google — dispensa chave de API.
 *
 * Respeita a decisão de cadastro: com "ocultar endereço exato" ligado, o mapa
 * mostra a região pelo bairro em vez das coordenadas, e num zoom mais aberto.
 * Publicar a coordenada exata de um imóvel ocupado não é detalhe menor.
 */
export function MapaImovel({ imovel }: { imovel: Imovel }) {
  const temCoordenada = imovel.latitude != null && imovel.longitude != null;
  const exato = temCoordenada && !imovel.ocultarEndereco;

  const regiao = `${imovel.bairro}, ${imovel.cidade} - ${imovel.estado}`;
  const consulta = exato ? `${imovel.latitude},${imovel.longitude}` : regiao;
  const zoom = exato ? 17 : 14;

  const linkExterno = exato
    ? `https://www.google.com/maps/search/?api=1&query=${imovel.latitude},${imovel.longitude}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(regiao)}`;

  return (
    <div className="mt-6">
      <div className="aspect-21/9 overflow-hidden rounded-card border border-sand">
        <iframe
          title={
            exato
              ? `Mapa da localização do imóvel em ${regiao}`
              : `Mapa da região aproximada: ${regiao}`
          }
          src={`https://www.google.com/maps?q=${encodeURIComponent(consulta)}&z=${zoom}&output=embed`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
          className="h-full w-full border-0"
        />
      </div>

      <a
        href={linkExterno}
        target="_blank"
        rel="noopener noreferrer"
        className="group mt-3 inline-flex items-center gap-2 text-sm font-semibold text-navy"
      >
        <span className="relative">
          Abrir no Google Maps
          <span className="absolute inset-x-0 -bottom-1 h-px origin-left scale-x-0 bg-gold-marca transition-transform duration-400 ease-[var(--ease-out-soft)] group-hover:scale-x-100" />
        </span>
        <span className="transition-transform duration-400 ease-[var(--ease-out-soft)] group-hover:translate-x-1">
          →
        </span>
      </a>
    </div>
  );
}
