"use client";

import Image from "next/image";
import { useState } from "react";
import type { VideoCurto } from "@/types";

function Play() {
  return (
    <span className="flex size-10 items-center justify-center rounded-full border border-gold/50 bg-navy-950/40 backdrop-blur-sm transition-[background-color,border-color,transform] duration-500 ease-[var(--ease-out-soft)] group-hover:scale-110 group-hover:border-gold group-hover:bg-navy-950/60 sm:size-16 lg:size-20">
      <svg viewBox="0 0 24 24" className="ml-0.5 size-4 fill-gold-soft sm:size-6 lg:size-7" aria-hidden="true">
        <path d="M8 5.5v13l11-6.5z" />
      </svg>
    </span>
  );
}

/**
 * Mostra o primeiro quadro e só carrega o vídeo depois do clique.
 * Os arquivos somam vários MB — com `preload` ativo, a home pagaria essa conta
 * em toda visita, mesmo sem ninguém assistir.
 */
export function VideoPlayer({ video }: { video: VideoCurto }) {
  const [tocando, setTocando] = useState(false);

  if (tocando && video.url) {
    return (
      <video
        src={video.url}
        poster={video.poster?.src}
        controls
        autoPlay
        playsInline
        className="absolute inset-0 h-full w-full bg-navy object-cover"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setTocando(true)}
      aria-label={`Reproduzir: ${video.titulo}`}
      className="group absolute inset-0 h-full w-full cursor-pointer"
    >
      {video.poster && (
        <Image
          src={video.poster.src}
          alt=""
          width={video.poster.largura}
          height={video.poster.altura}
          sizes="(min-width: 1280px) 410px, 33vw"
          className="h-full w-full object-cover transition-transform duration-[900ms] ease-[var(--ease-out-soft)] group-hover:scale-[1.05]"
        />
      )}
      <span className="absolute inset-0 bg-gradient-to-t from-navy-950/55 via-navy-950/10 to-navy-950/15" />
      <span className="absolute inset-0 flex items-center justify-center">
        <Play />
      </span>
    </button>
  );
}
