import Image from "next/image";
import Link from "next/link";
import { navLinks } from "@/lib/site";
import { linkWhatsapp, type Configuracao } from "@/lib/configuracoes";

export function SiteFooter({ config }: { config: Configuracao }) {
  const ano = new Date().getFullYear();

  return (
    <footer className="grain relative overflow-hidden border-t border-navy-700/40 bg-navy-950 text-white/60">
      <div className="container-page relative grid gap-14 py-20 md:grid-cols-[1.5fr_1fr_1fr]">
        <div className="space-y-6">
          <Image
            src={config.logo}
            alt={config.razao}
            width={866}
            height={288}
            className="h-14 w-auto"
          />
          <p className="max-w-sm text-sm leading-[1.7]">{config.textoInstitucional}</p>
          <p className="text-xs tracking-[0.12em] text-white/35">{config.creci}</p>
        </div>

        <div className="space-y-5">
          <p className="eyebrow text-[0.5625rem] text-gold">Navegação</p>
          <ul className="space-y-3 text-sm">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="group inline-block transition-colors duration-300 hover:text-white"
                >
                  <span className="relative">
                    {link.label}
                    <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-gold transition-transform duration-400 ease-[var(--ease-out-soft)] group-hover:scale-x-100" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-5">
          <p className="eyebrow text-[0.5625rem] text-gold">Contato</p>
          <ul className="space-y-3 text-sm">
            <li>
              <a
                href={linkWhatsapp(config)}
                target="_blank"
                rel="noopener noreferrer"
                className="num transition-colors duration-300 hover:text-white"
              >
                {config.telefone}
              </a>
            </li>
            <li>
              <a
                href={config.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors duration-300 hover:text-white"
              >
                {config.instagram}
              </a>
            </li>
            <li className="pt-2 leading-[1.7] text-white/45">
              {config.endereco.rua}
              <br />
              {config.endereco.bairro} · {config.endereco.cidade}/{config.endereco.estado}
            </li>
          </ul>
        </div>
      </div>

      <div className="relative border-t border-white/[0.08]">
        <div className="container-page flex flex-col gap-4 py-7 text-xs md:flex-row md:items-center md:justify-between">
          <p className="text-white/40">
            © {ano} {config.razao}
          </p>

          <p className="text-white/40">
            Desenvolvido por{" "}
            <a
              href="https://valtix.com.br"
              target="_blank"
              rel="noopener noreferrer"
              className="group text-white/60 transition-colors duration-300 hover:text-gold-marca"
            >
              <span className="relative">
                Valtix
                <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-gold-marca transition-transform duration-400 ease-[var(--ease-out-soft)] group-hover:scale-x-100" />
              </span>
            </a>
          </p>
          <p className="max-w-xl text-white/30">
            Valores e disponibilidade dos imóveis estão sujeitos a alterações sem
            aviso prévio.
          </p>
        </div>
      </div>
    </footer>
  );
}
