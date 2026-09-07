-- Configurações que o site consome de verdade.
--
-- A tela do painel exibia campos que não iam a lugar nenhum. Estas colunas
-- fecham o circuito: razão social, endereço estruturado e as imagens da marca
-- passam a vir do banco, com as constantes do código servindo só de fallback.

alter table configuracoes
  add column if not exists razao            text,
  add column if not exists endereco_rua     text,
  add column if not exists endereco_bairro  text,
  add column if not exists endereco_cidade  text,
  add column if not exists endereco_estado  text,
  add column if not exists logo_path        text,
  add column if not exists retrato_hero_path  text,
  add column if not exists retrato_sobre_path text;

-- Os campos de IA sobraram do desenho original: o assistente é uma árvore de
-- decisão fixa e não consome prompt nenhum. Ficam para quando a IA entrar.
comment on column configuracoes.ia_prompt is
  'Reservado. O assistente atual é determinístico e não usa este campo.';

update configuracoes set
  razao           = coalesce(razao,           'Luciano Góis Negócios Imobiliários'),
  endereco_rua    = coalesce(endereco_rua,    'Rua José Cabral Acioli, Sala 12'),
  endereco_bairro = coalesce(endereco_bairro, 'Jatiúca'),
  endereco_cidade = coalesce(endereco_cidade, 'Maceió'),
  endereco_estado = coalesce(endereco_estado, 'AL'),
  texto_institucional = coalesce(
    texto_institucional,
    'Compra, venda e investimentos imobiliários em Maceió e região, com mais de 20 anos de experiência no mercado alagoano.'
  )
where id;
