-- Slugs cadastrados com espaço e acento ("Casa em Paripueira") geravam URLs
-- que nunca casavam com o banco: a página do imóvel respondia 404. O painel
-- agora normaliza o slug ao salvar; aqui corrigimos os que já existiam.
--
-- Também remove o imóvel de teste ("edificio teste"). As fotos dele em
-- imovel_fotos saem junto pelo `on delete cascade`.

update imoveis set slug = 'edificio-edmilson-pontes'    where id = '1bd03d99-804c-4e0c-a76e-d66eb0c72dfd';
update imoveis set slug = 'splendido-residence'         where id = '1211ec5d-8d68-4438-943c-6a470adc4c9c';
update imoveis set slug = 'reserva-aldeprime'           where id = 'c862b087-a81a-4352-b544-3928b90cc176';
update imoveis set slug = 'terreno-em-marechal-deodoro' where id = '3b2088cb-6831-402f-9f28-1f6881e8a14d';
update imoveis set slug = 'casa-em-paripueira'          where id = '34dba89a-badd-474d-a49b-273a5f77325f';

delete from imoveis where id = '322594af-36ea-4884-a933-737ffe7b5620';
