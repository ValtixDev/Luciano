-- Luciano Góis Negócios Imobiliários — schema inicial
-- Aplicar com: supabase db push  (ou via MCP quando o projeto for criado)

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------- enums
create type finalidade    as enum ('venda', 'aluguel');
create type tipo_imovel   as enum ('apartamento', 'casa', 'terreno', 'comercial', 'lancamento');
create type status_imovel as enum ('disponivel', 'reservado', 'vendido', 'alugado', 'inativo');
create type estagio_obra  as enum ('pronto', 'em_construcao', 'na_planta');
create type origem_lead   as enum ('site', 'chat_ia', 'whatsapp', 'imovel');
create type status_lead   as enum ('novo', 'em_atendimento', 'visita', 'proposta', 'convertido', 'perdido');
create type status_post   as enum ('rascunho', 'publicado');

-- ---------------------------------------------------------------- imoveis
create table imoveis (
  id                uuid primary key default gen_random_uuid(),
  codigo            text not null unique,
  slug              text not null unique,

  titulo            text not null,
  descricao_curta   text not null default '',
  descricao         text not null default '',

  finalidade        finalidade[] not null default '{venda}',
  tipo              tipo_imovel not null,
  status            status_imovel not null default 'disponivel',
  estagio           estagio_obra not null default 'pronto',

  -- comercial
  preco             numeric(14,2),
  preco_sob_consulta boolean not null default false,
  condominio        numeric(12,2),
  iptu              numeric(12,2),

  -- localização
  estado            text not null default 'AL',
  cidade            text not null default 'Maceió',
  bairro            text not null,
  regiao            text not null default 'Maceió',
  rua               text,
  numero            text,
  cep               text,
  latitude          double precision,
  longitude         double precision,
  ocultar_endereco  boolean not null default true,

  -- características
  area_util         numeric(10,2),
  area_total        numeric(10,2),
  quartos           smallint not null default 0,
  suites            smallint not null default 0,
  banheiros         smallint not null default 0,
  vagas             smallint not null default 0,
  diferenciais      text[] not null default '{}',

  -- publicação
  destaque          boolean not null default false,
  publicar_site     boolean not null default true,
  publicar_olx      boolean not null default false,
  publicar_zap      boolean not null default false,

  -- SEO (gerado automaticamente no painel, editável)
  seo_title         text,
  seo_description   text,

  -- salvaguarda: conteúdo provisório nunca deve vazar para produção
  is_placeholder    boolean not null default false,

  criado_em         timestamptz not null default now(),
  atualizado_em     timestamptz not null default now(),

  constraint preco_definido check (preco_sob_consulta or preco is not null)
);

create index imoveis_publicos_idx on imoveis (status, publicar_site) where status = 'disponivel';
create index imoveis_bairro_idx   on imoveis (bairro);
create index imoveis_tipo_idx     on imoveis (tipo);
create index imoveis_preco_idx    on imoveis (preco);

-- ---------------------------------------------------------------- fotos
create table imovel_fotos (
  id         uuid primary key default gen_random_uuid(),
  imovel_id  uuid not null references imoveis(id) on delete cascade,
  storage_path text not null,
  alt        text not null default '',
  ordem      smallint not null default 0,
  capa       boolean not null default false,
  criado_em  timestamptz not null default now()
);

create index imovel_fotos_imovel_idx on imovel_fotos (imovel_id, ordem);
-- uma única capa por imóvel
create unique index imovel_fotos_capa_idx on imovel_fotos (imovel_id) where capa;

-- ---------------------------------------------------------------- leads
create table leads (
  id         uuid primary key default gen_random_uuid(),
  nome       text not null,
  telefone   text,
  email      text,
  mensagem   text,
  imovel_id  uuid references imoveis(id) on delete set null,
  origem     origem_lead not null default 'site',
  status     status_lead not null default 'novo',
  criado_em  timestamptz not null default now()
);

create index leads_status_idx on leads (status, criado_em desc);

-- ---------------------------------------------------------------- blog
create table posts (
  id               uuid primary key default gen_random_uuid(),
  slug             text not null unique,
  titulo           text not null,
  resumo           text not null default '',
  conteudo         text not null default '',
  capa_path        text,
  categoria        text not null default 'Mercado',
  autor            text not null default 'Luciano Góis',
  seo_title        text,
  seo_description  text,
  status           status_post not null default 'rascunho',
  publicado_em     date,
  criado_em        timestamptz not null default now(),
  atualizado_em    timestamptz not null default now()
);

create index posts_publicados_idx on posts (status, publicado_em desc);

-- ---------------------------------------------------------------- configurações (linha única)
create table configuracoes (
  id                 boolean primary key default true check (id),
  nome               text not null default 'Luciano Góis',
  creci              text not null default 'CRECI/AL 1983/5946J',
  telefone           text not null default '(82) 98147-8085',
  whatsapp           text not null default '5582981478085',
  whatsapp_mensagem  text not null default 'Olá Luciano, vim pelo site.',
  email              text,
  instagram          text not null default '@lucianogoisimoveis',
  endereco           text,
  texto_institucional text,
  ia_prompt          text,
  ia_faq             jsonb not null default '[]',
  atualizado_em      timestamptz not null default now()
);

insert into configuracoes (id) values (true);

-- ---------------------------------------------------------------- administradores
-- Sem esta tabela, QUALQUER pessoa que criasse conta no projeto viraria admin,
-- porque as policies confiariam apenas no papel `authenticated`.
create table admins (
  id        uuid primary key references auth.users(id) on delete cascade,
  nome      text,
  criado_em timestamptz not null default now()
);

alter table admins enable row level security;

-- security definer para conseguir ler `admins` de dentro das próprias policies
-- sem cair em recursão de RLS. search_path fixo evita sequestro por schema.
create or replace function public.eh_admin()
returns boolean
language sql
stable
security definer
set search_path = public, pg_catalog
as $$
  select exists (select 1 from public.admins where id = auth.uid());
$$;

create policy admins_leem_a_si on admins for select to authenticated
  using (id = auth.uid());

-- ---------------------------------------------------------------- atualizado_em
create or replace function set_atualizado_em()
returns trigger language plpgsql as $$
begin
  new.atualizado_em = now();
  return new;
end;
$$;

create trigger imoveis_atualizado_em before update on imoveis
  for each row execute function set_atualizado_em();
create trigger posts_atualizado_em before update on posts
  for each row execute function set_atualizado_em();
create trigger configuracoes_atualizado_em before update on configuracoes
  for each row execute function set_atualizado_em();

-- ---------------------------------------------------------------- RLS
-- Leitura pública apenas do que está publicado e não é placeholder.
-- Escrita exclusiva de usuários autenticados (o admin do Luciano).
alter table imoveis       enable row level security;
alter table imovel_fotos  enable row level security;
alter table posts         enable row level security;
alter table leads         enable row level security;
alter table configuracoes enable row level security;

create policy imoveis_leitura_publica on imoveis for select to anon
  using (publicar_site and status = 'disponivel' and not is_placeholder);
create policy imoveis_admin on imoveis for all to authenticated
  using (eh_admin()) with check (eh_admin());

create policy fotos_leitura_publica on imovel_fotos for select to anon
  using (exists (
    select 1 from imoveis i
    where i.id = imovel_id
      and i.publicar_site and i.status = 'disponivel' and not i.is_placeholder
  ));
create policy fotos_admin on imovel_fotos for all to authenticated
  using (eh_admin()) with check (eh_admin());

create policy posts_leitura_publica on posts for select to anon
  using (status = 'publicado');
create policy posts_admin on posts for all to authenticated
  using (eh_admin()) with check (eh_admin());

-- Visitante pode criar lead, mas nunca ler a base.
create policy leads_insercao_publica on leads for insert to anon with check (true);
create policy leads_admin on leads for all to authenticated
  using (eh_admin()) with check (eh_admin());

create policy configuracoes_leitura_publica on configuracoes for select to anon
  using (true);
create policy configuracoes_admin on configuracoes for all to authenticated
  using (eh_admin()) with check (eh_admin());

-- ---------------------------------------------------------------- storage
insert into storage.buckets (id, name, public)
values ('imoveis', 'imoveis', true)
on conflict (id) do nothing;

create policy fotos_leitura_publica_storage on storage.objects for select to anon
  using (bucket_id = 'imoveis');

create policy fotos_escrita_admin on storage.objects for all to authenticated
  using (bucket_id = 'imoveis' and eh_admin())
  with check (bucket_id = 'imoveis' and eh_admin());
