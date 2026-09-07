-- Enquadramento por foto: zoom e ponto focal.
--
-- Sem isto, o recorte de uma foto vertical dentro de um card 4:3 é sempre pelo
-- centro — e o centro raramente é onde está o assunto. Estas colunas guardam a
-- decisão de quem cadastrou, em vez de deixar o navegador escolher.

alter table imovel_fotos
  add column if not exists zoom  numeric(4,2) not null default 1.00,
  add column if not exists pos_x numeric(5,2) not null default 50.00,
  add column if not exists pos_y numeric(5,2) not null default 50.00;

-- Limites que o formulário respeita; a constraint impede valor absurdo vindo
-- de fora da interface.
alter table imovel_fotos
  add constraint zoom_valido  check (zoom  between 1 and 3),
  add constraint pos_x_valido check (pos_x between 0 and 100),
  add constraint pos_y_valido check (pos_y between 0 and 100);

-- A ordem passa a ser consultada com frequência (reordenação no painel).
create index if not exists imovel_fotos_ordem_idx
  on imovel_fotos (imovel_id, ordem);
