export type Finalidade = "venda" | "aluguel";
export type TipoImovel =
  | "apartamento"
  | "casa"
  | "terreno"
  | "comercial"
  | "lancamento";
export type StatusImovel =
  | "disponivel"
  | "reservado"
  | "vendido"
  | "alugado"
  | "inativo";
export type EstagioObra = "pronto" | "em_construcao" | "na_planta";

export type Foto = {
  id: string;
  /** Caminho no bucket. Necessário para atualizar e remover. */
  caminho: string;
  url: string | null;
  alt: string;
  ordem: number;
  capa: boolean;
  /** Enquadramento: 1 = sem zoom; ponto focal em porcentagem. */
  zoom: number;
  posX: number;
  posY: number;
};

export type Imovel = {
  id: string;
  codigo: string;
  slug: string;
  titulo: string;
  descricaoCurta: string;
  descricao: string;
  finalidade: Finalidade[];
  tipo: TipoImovel;
  status: StatusImovel;
  estagio: EstagioObra;
  preco: number | null;
  precoSobConsulta: boolean;
  condominio: number | null;
  iptu: number | null;
  bairro: string;
  cidade: string;
  estado: string;
  regiao: string;
  ocultarEndereco: boolean;
  areaUtil: number | null;
  areaTotal: number | null;
  quartos: number;
  suites: number;
  banheiros: number;
  vagas: number;
  diferenciais: string[];
  destaque: boolean;
  publicarSite: boolean;
  publicarOlx: boolean;
  publicarZap: boolean;
  /** Conteúdo provisório — nunca deve ir para produção como imóvel real. */
  isPlaceholder: boolean;
  fotos: Foto[];
  totalFotos: number;
  atualizadoEm: string;
};

export type Capa = {
  src: string;
  /** Dimensões reais do arquivo — evitam salto de layout no carregamento. */
  largura: number;
  altura: number;
  alt: string;
};

export type Post = {
  slug: string;
  /** `null` mantém o gráfico de fallback no lugar da fotografia. */
  capa: Capa | null;
  titulo: string;
  resumo: string;
  conteudo: string[];
  categoria: "Mercado" | "Investimentos" | "Maceió" | "Dicas";
  autor: string;
  publicadoEm: string;
  tempoLeitura: number;
  isPlaceholder: boolean;
};

export type OrigemLead = "site" | "chat_ia" | "whatsapp" | "imovel";
export type StatusLead =
  | "novo"
  | "em_atendimento"
  | "visita"
  | "proposta"
  | "convertido"
  | "perdido";

export type Lead = {
  id: string;
  nome: string;
  telefone: string;
  email: string | null;
  mensagem: string;
  imovelSlug: string | null;
  imovelTitulo: string | null;
  origem: OrigemLead;
  status: StatusLead;
  criadoEm: string;
};

export type VideoCurto = {
  id: string;
  titulo: string;
  descricao: string;
  /** Arquivo .mp4 ou link do YouTube. `null` mantém o espaço reservado. */
  url: string | null;
  /** Primeiro quadro do vídeo. É o que evita baixar o .mp4 antes do clique. */
  poster: {
    src: string;
    largura: number;
    altura: number;
  } | null;
  isPlaceholder: boolean;
};
