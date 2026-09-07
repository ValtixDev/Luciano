import Image from "next/image";
import { PropertyPhoto } from "@/components/property-photo";
import type { Foto } from "@/types";

/**
 * Foto real do imóvel, respeitando o enquadramento definido no painel.
 * Sem fotografia cadastrada, cai no gráfico de fallback — nenhuma listagem
 * fica com buraco.
 */
export function FotoImovel({
  foto,
  alt,
  sizes,
  seed = 0,
  className = "",
  priority = false,
}: {
  foto?: Foto;
  alt: string;
  sizes: string;
  seed?: number;
  className?: string;
  priority?: boolean;
}) {
  if (!foto?.url) {
    return <PropertyPhoto seed={seed} className={className} rotulo={alt} />;
  }

  return (
    <Image
      src={foto.url}
      alt={foto.alt || alt}
      width={1600}
      height={1200}
      sizes={sizes}
      priority={priority}
      style={{
        objectPosition: `${foto.posX}% ${foto.posY}%`,
        transform: foto.zoom !== 1 ? `scale(${foto.zoom})` : undefined,
      }}
      className={`object-cover ${className}`}
    />
  );
}
