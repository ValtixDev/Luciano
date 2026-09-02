import { estiloBotao, Seta } from "@/components/ui/button";
import { listarBairros, tipoLabel } from "@/lib/imoveis";
import type { TipoImovel } from "@/types";

const campo =
  "peer h-13 w-full appearance-none border-0 border-b border-sand bg-transparent px-0 pb-2 text-[0.9375rem] text-graphite transition-colors duration-300 focus:border-navy focus:outline-none";

const rotulo = "eyebrow mb-1 block text-[0.5625rem] text-muted";

const faixas = [
  { label: "Qualquer valor", min: "", max: "" },
  { label: "Até R$ 500 mil", min: "", max: "500000" },
  { label: "R$ 500 mil a R$ 800 mil", min: "500000", max: "800000" },
  { label: "R$ 800 mil a R$ 1,2 mi", min: "800000", max: "1200000" },
  { label: "Acima de R$ 1,2 mi", min: "1200000", max: "" },
];

/** Formulário GET puro: funciona sem JavaScript e mantém a URL compartilhável. */
export async function SearchPanel() {
  const bairros = await listarBairros();

  return (
    <form
      action="/imoveis"
      method="get"
      className="rounded-2xl border border-sand bg-white p-8 shadow-[0_32px_80px_-48px] shadow-navy/50 sm:p-10"
    >
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className={rotulo} htmlFor="finalidade">
            Finalidade
          </label>
          <select id="finalidade" name="finalidade" className={campo} defaultValue="">
            <option value="">Comprar ou alugar</option>
            <option value="venda">Comprar</option>
            <option value="aluguel">Alugar</option>
          </select>
        </div>

        <div>
          <label className={rotulo} htmlFor="tipo">
            Tipo
          </label>
          <select id="tipo" name="tipo" className={campo} defaultValue="">
            <option value="">Todos os tipos</option>
            {(Object.keys(tipoLabel) as TipoImovel[]).map((t) => (
              <option key={t} value={t}>
                {tipoLabel[t]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={rotulo} htmlFor="bairro">
            Localização
          </label>
          <select id="bairro" name="bairro" className={campo} defaultValue="">
            <option value="">Maceió e região</option>
            {bairros.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={rotulo} htmlFor="faixa">
            Faixa de preço
          </label>
          <select id="faixa" name="faixa" className={campo} defaultValue="">
            {faixas.map((f) => (
              <option key={f.label} value={`${f.min}:${f.max}`}>
                {f.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-10 flex flex-col gap-5 border-t border-sand pt-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-sm text-xs leading-relaxed text-muted">
          Não encontrou o que procura? Luciano busca o imóvel sob medida para o
          seu perfil.
        </p>
        <button type="submit" className={`${estiloBotao("primaria", "lg")} shrink-0`}>
          Buscar imóveis <Seta />
        </button>
      </div>
    </form>
  );
}
