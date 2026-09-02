import { PropertyPhoto } from "@/components/property-photo";
import { VideoPlayer } from "@/components/video-player";
import type { VideoCurto } from "@/types";

/** Extrai o id de um link do YouTube (watch, youtu.be ou /shorts/). */
function idYouTube(url: string) {
  const m = url.match(
    /(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{11})/,
  );
  return m?.[1] ?? null;
}

export function VideoVertical({
  video,
  seed = 0,
}: {
  video: VideoCurto;
  seed?: number;
}) {
  const yt = video.url ? idYouTube(video.url) : null;

  // min-w-0: sem isso o texto da legenda impede a coluna do grid de encolher.
  return (
    <figure className="group flex min-w-0 flex-col">
      <div className="relative aspect-9/16 overflow-hidden rounded-card border border-sand bg-navy">
        {yt ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${yt}`}
            title={video.titulo}
            loading="lazy"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full border-0"
          />
        ) : video.url ? (
          <VideoPlayer video={video} />
        ) : (
          <>
            <PropertyPhoto
              seed={seed}
              className="h-full w-full transition-transform duration-[900ms] ease-[var(--ease-out-soft)] group-hover:scale-[1.05]"
              rotulo={video.titulo}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="eyebrow text-[0.5rem] text-white/35">Em breve</span>
            </div>
          </>
        )}
      </div>

      <figcaption className="mt-3 sm:mt-6">
        <h3 className="font-display text-[0.8125rem] leading-snug tracking-tight text-navy sm:text-lg lg:text-xl">
          {video.titulo}
        </h3>
        <p className="mt-2 hidden text-sm leading-relaxed text-muted sm:block">
          {video.descricao}
        </p>
      </figcaption>
    </figure>
  );
}
