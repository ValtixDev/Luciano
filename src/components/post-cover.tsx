import Image from "next/image";
import { PropertyPhoto } from "@/components/property-photo";
import type { Post } from "@/types";

/**
 * Capa do artigo. Cai no gráfico de fallback enquanto o post não tem fotografia,
 * para nenhuma listagem ficar com buraco.
 */
export function PostCover({
  post,
  seed = 0,
  sizes,
  className = "",
  priority = false,
}: {
  post: Post;
  seed?: number;
  sizes: string;
  className?: string;
  priority?: boolean;
}) {
  if (!post.capa) {
    return (
      <PropertyPhoto seed={seed} className={className} rotulo={post.titulo} />
    );
  }

  return (
    <Image
      src={post.capa.src}
      alt={post.capa.alt}
      width={post.capa.largura}
      height={post.capa.altura}
      sizes={sizes}
      priority={priority}
      className={`object-cover ${className}`}
    />
  );
}
