-- Novo número de contato do Luciano: +55 82 98874-3028.
--
-- O banco manda no site — a constante em src/lib/site.ts é só fallback. Sem
-- este update a linha de configurações continuaria servindo o número antigo
-- para todos os botões de WhatsApp.

alter table configuracoes
  alter column telefone set default '(82) 98874-3028',
  alter column whatsapp set default '5582988743028';

update configuracoes set
  telefone = '(82) 98874-3028',
  whatsapp = '5582988743028'
where id;
