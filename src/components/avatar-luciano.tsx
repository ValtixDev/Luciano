import Image from "next/image";
import { site } from "@/lib/site";

/**
 * Retrato do Luciano com selo de verificado.
 *
 * O enquadramento é fixo em 50% 22%: o retrato original é 3:4 de corpo médio,
 * e um recorte circular pelo centro cortaria o rosto na altura da boca.
 */
export function AvatarLuciano({ className = "size-14" }: { className?: string }) {
  return (
    <span className={`relative shrink-0 ${className}`}>
      <Image
        src={site.fotos.hero.src}
        alt={site.nome}
        width={site.fotos.hero.largura}
        height={site.fotos.hero.altura}
        sizes="96px"
        style={{ objectPosition: "50% 22%" }}
        className="h-full w-full rounded-full object-cover"
      />

      {/* O anel na cor do fundo separa o selo da fotografia. */}
      <span
        aria-hidden="true"
        className="absolute -right-0.5 -top-0.5 flex size-[38%] items-center justify-center rounded-full bg-[#1d9bf0] ring-2 ring-offwhite"
      >
        <svg viewBox="0 0 24 24" className="size-[60%] fill-white">
          <path d="M9.6 16.2 5.4 12l1.4-1.4 2.8 2.8 7-7L18 7.8z" />
        </svg>
      </span>

      <span className="sr-only">Perfil verificado</span>
    </span>
  );
}
