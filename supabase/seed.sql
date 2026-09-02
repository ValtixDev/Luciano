-- Seed gerado a partir de src/data/ — não editar à mão.
-- Os imóveis entram com is_placeholder = true e ficam invisíveis ao público
-- pela policy de RLS. Aparecem só no /admin, para servirem de referência.

insert into imoveis (
  codigo, slug, titulo, descricao_curta, descricao,
  finalidade, tipo, status, estagio,
  preco, preco_sob_consulta, condominio, iptu,
  estado, cidade, bairro, regiao, ocultar_endereco,
  area_util, area_total, quartos, suites, banheiros, vagas,
  diferenciais, destaque, is_placeholder
) values (
  'LG-001', 'apartamento-vista-mar-ponta-verde', 'Apartamento com vista mar na Ponta Verde', 'Apartamento amplo a uma quadra da orla, com vista definitiva para o mar e planta bem resolvida.', 'Apartamento em edifício residencial na Ponta Verde, a poucos metros da orla, com vista definitiva para o mar — sem projeção de construção que possa fechá-la. A sala se abre para a varanda em toda a extensão social, integrando os dois ambientes. São três quartos, sendo duas suítes, e a cozinha tem área de serviço independente, com passagem que evita o cruzamento com a área social. Duas vagas cobertas e demarcadas. O prédio oferece infraestrutura completa de lazer e portaria 24 horas. Localização que resolve o dia a dia a pé: restaurantes, farmácia e supermercado no quarteirão.',
  array['venda']::finalidade[], 'apartamento', 'disponivel', 'pronto',
  1250000, false, 1180, 340,
  'AL', 'Maceió', 'Ponta Verde', 'Maceió', true,
  126, 148, 3, 2, 3, 2,
  array['Vista para o mar', 'Piscina', 'Academia', 'Área gourmet', 'Portaria 24h', 'Varanda', 'Elevador'], true, true
) on conflict (codigo) do nothing;

insert into imoveis (
  codigo, slug, titulo, descricao_curta, descricao,
  finalidade, tipo, status, estagio,
  preco, preco_sob_consulta, condominio, iptu,
  estado, cidade, bairro, regiao, ocultar_endereco,
  area_util, area_total, quartos, suites, banheiros, vagas,
  diferenciais, destaque, is_placeholder
) values (
  'LG-002', 'apartamento-proximo-orla-jatiuca', 'Apartamento próximo à orla de Jatiúca', 'Três quartos em rua tranquila da Jatiúca, a poucos minutos a pé da praia e do comércio do bairro.', 'Apartamento de três quartos em rua tranquila da Jatiúca, a poucos minutos a pé da praia. A sala em dois ambientes comporta mesa de jantar e estar sem disputa de espaço, e a varanda com churrasqueira funciona como extensão da área social. Uma suíte, banheiro social e lavanderia independente. Duas vagas de garagem. É a planta que costuma agradar a família que quer a orla por perto sem pagar o ticket da primeira quadra: supermercados, escolas e comércio de bairro estão todos no entorno imediato.',
  array['venda']::finalidade[], 'apartamento', 'disponivel', 'pronto',
  890000, false, 890, 260,
  'AL', 'Maceió', 'Jatiúca', 'Maceió', true,
  104, 120, 3, 1, 2, 2,
  array['Piscina', 'Área gourmet', 'Portaria 24h', 'Varanda', 'Elevador'], true, true
) on conflict (codigo) do nothing;

insert into imoveis (
  codigo, slug, titulo, descricao_curta, descricao,
  finalidade, tipo, status, estagio,
  preco, preco_sob_consulta, condominio, iptu,
  estado, cidade, bairro, regiao, ocultar_endereco,
  area_util, area_total, quartos, suites, banheiros, vagas,
  diferenciais, destaque, is_placeholder
) values (
  'LG-003', 'casa-em-condominio-litoral-norte', 'Casa em condomínio no Litoral Norte', 'Casa de alto padrão em condomínio fechado, com quatro suítes, piscina privativa e acesso à praia.', 'Residência em condomínio fechado no Litoral Norte de Maceió, com quatro suítes e living amplo integrado ao deck e à piscina — a planta foi resolvida para que a área social se abra inteiramente para o exterior. Cozinha gourmet contígua à varanda, lavabo de apoio e três vagas. O condomínio tem segurança 24 horas e acesso privativo à praia. Atende tanto quem procura moradia definitiva longe do trânsito da orla quanto quem busca casa de veraneio com estrutura para receber.',
  array['venda']::finalidade[], 'casa', 'disponivel', 'pronto',
  1850000, false, 1450, 520,
  'AL', 'Maceió', 'Guaxuma', 'Litoral Norte', true,
  280, 420, 4, 4, 5, 3,
  array['Piscina privativa', 'Condomínio fechado', 'Área gourmet', 'Portaria 24h', 'Acesso à praia'], true, true
) on conflict (codigo) do nothing;

insert into imoveis (
  codigo, slug, titulo, descricao_curta, descricao,
  finalidade, tipo, status, estagio,
  preco, preco_sob_consulta, condominio, iptu,
  estado, cidade, bairro, regiao, ocultar_endereco,
  area_util, area_total, quartos, suites, banheiros, vagas,
  diferenciais, destaque, is_placeholder
) values (
  'LG-004', 'lancamento-residencial-mangabeiras', 'Lançamento residencial nas Mangabeiras', 'Unidades de dois e três quartos em lançamento na região das Mangabeiras, com condições diretas com a construtora.', 'Empreendimento em fase de lançamento na região das Mangabeiras, com plantas de dois e três quartos e varanda gourmet em todas as unidades. Área de lazer completa e implantação que preserva ventilação cruzada na maior parte dos apartamentos. Por estar em lançamento, aceita condições de pagamento negociadas diretamente com a construtora, com entrada parcelada até a entrega das chaves. Vale conferir o memorial descritivo e a simulação já com a correção do saldo aplicada.',
  array['venda']::finalidade[], 'lancamento', 'disponivel', 'na_planta',
  620000, false, null, null,
  'AL', 'Maceió', 'Mangabeiras', 'Maceió', true,
  78, 92, 3, 1, 2, 1,
  array['Piscina', 'Academia', 'Área gourmet', 'Elevador'], false, true
) on conflict (codigo) do nothing;

insert into imoveis (
  codigo, slug, titulo, descricao_curta, descricao,
  finalidade, tipo, status, estagio,
  preco, preco_sob_consulta, condominio, iptu,
  estado, cidade, bairro, regiao, ocultar_endereco,
  area_util, area_total, quartos, suites, banheiros, vagas,
  diferenciais, destaque, is_placeholder
) values (
  'LG-005', 'sala-comercial-farol', 'Sala comercial no Farol', 'Sala comercial pronta para uso em edifício corporativo do Farol, com duas vagas e recepção.', 'Sala comercial pronta para uso em edifício corporativo no Farol, com recepção, dois ambientes privativos, copa e banheiro. A divisão atende bem consultórios, escritórios de advocacia e empresas de serviço que precisam de uma sala de espera separada do atendimento. Duas vagas de garagem e estacionamento rotativo para visitantes — item raro na região e decisivo para quem recebe clientes. Prédio com elevador e portaria.',
  array['venda', 'aluguel']::finalidade[], 'comercial', 'disponivel', 'pronto',
  480000, false, 720, 210,
  'AL', 'Maceió', 'Farol', 'Maceió', false,
  62, 62, 0, 0, 1, 2,
  array['Elevador', 'Portaria 24h', 'Estacionamento para visitantes'], false, true
) on conflict (codigo) do nothing;

insert into imoveis (
  codigo, slug, titulo, descricao_curta, descricao,
  finalidade, tipo, status, estagio,
  preco, preco_sob_consulta, condominio, iptu,
  estado, cidade, bairro, regiao, ocultar_endereco,
  area_util, area_total, quartos, suites, banheiros, vagas,
  diferenciais, destaque, is_placeholder
) values (
  'LG-006', 'terreno-garca-torta', 'Terreno em Garça Torta', 'Terreno plano em área de expansão do Litoral Norte, ideal para construção de residência ou investimento.', 'Terreno plano e murado em Garça Torta, área de expansão do Litoral Norte, em rua pavimentada e com infraestrutura de água, energia e esgoto já disponível na testada. A topografia sem desnível reduz o custo de fundação e simplifica o projeto. Serve tanto para quem pretende construir residência própria quanto para quem quer formar patrimônio numa região que segue recebendo novos condomínios.',
  array['venda']::finalidade[], 'terreno', 'disponivel', 'pronto',
  null, true, null, null,
  'AL', 'Maceió', 'Garça Torta', 'Litoral Norte', true,
  null, 450, 0, 0, 0, 0,
  array['Terreno plano', 'Murado', 'Rua pavimentada'], false, true
) on conflict (codigo) do nothing;

insert into posts (
  slug, titulo, resumo, conteudo, capa_path, categoria, autor, status, publicado_em
) values (
  'vale-a-pena-comprar-um-imovel-em-maceio-em-2026', 'Vale a pena comprar um imóvel em Maceió em 2026?', 'A resposta depende menos do mercado e mais de três variáveis suas: horizonte de permanência, custo total da operação e região escolhida.',
  'Essa é a pergunta que mais ouço, e ela não tem uma resposta única. Comprar um imóvel não é uma aposta no mercado — é uma decisão sobre a sua vida nos próximos anos. Antes de olhar preço, vale organizar três variáveis: por quanto tempo você pretende ficar, quanto a operação custa de verdade e em qual região o imóvel está.

Comece pelo horizonte. Comprar tem custos que não voltam: ITBI, registro em cartório, escritura e a própria corretagem. Esses valores se diluem com o tempo. Quem pretende permanecer poucos anos no imóvel raramente compensa a conta — nesse cenário, alugar costuma ser a decisão mais racional, mesmo quando o aluguel parece caro no mês a mês.

Depois, olhe o custo total, não o preço da unidade. Um apartamento mais barato num prédio com condomínio alto pode sair mais caro no fim do ano do que uma unidade de valor maior em um edifício enxuto. Some parcela, condomínio, IPTU e uma reserva para manutenção. É esse número que precisa caber no seu orçamento, não o valor da etiqueta.

No financiamento, o prazo e o sistema de amortização mudam bastante o total pago. Prazos mais longos aliviam a parcela e encarecem o conjunto; prazos curtos fazem o contrário. Peça a simulação em mais de um banco e compare o Custo Efetivo Total, não apenas a taxa anunciada.

Sobre a região: Maceió não se move como um bloco único. A orla consolidada e os bairros de expansão têm dinâmicas próprias de oferta, de perfil de morador e de ritmo de valorização. Analisar a média da cidade costuma render decisões piores do que analisar o quarteirão. Duas ruas de distância já mudam o preço por metro quadrado, a oferta de serviços e o movimento no fim de semana.

Também vale separar as intenções. Quem compra para morar decide pela rotina: trajeto até o trabalho, escola das crianças, o que existe a pé. Quem compra para investir decide por liquidez: com que velocidade aquele imóvel aluga, qual o perfil do inquilino da região e quanto sobra depois do condomínio e do IPTU. Misturar os dois critérios é o erro mais comum que vejo.

Minha leitura, depois de mais de vinte anos acompanhando esse mercado, é que a compra vale a pena quando resolve um problema concreto e cabe no orçamento sem consumir a sua reserva de emergência. O momento do mercado importa — mas importa menos do que a adequação do imóvel ao seu momento.',
  '/blog/comprar-imovel-maceio.webp', 'Mercado', 'Luciano Góis', 'publicado', '2026-08-20'
) on conflict (slug) do nothing;

insert into posts (
  slug, titulo, resumo, conteudo, capa_path, categoria, autor, status, publicado_em
) values (
  'ponta-verde-ou-jatiuca-qual-regiao-escolher', 'Ponta Verde ou Jatiúca: qual região escolher?', 'Os dois bairros são comparados o tempo todo, mas atendem perfis diferentes. A escolha depende menos do bairro e mais da sua rotina.',
  'Ponta Verde e Jatiúca aparecem juntas em quase toda busca por imóvel em Maceió. São vizinhas, ambas valorizadas e ambas com orla. Mas quem mora nas duas sabe que a experiência do dia a dia é diferente — e é essa diferença que costuma decidir a compra.

A Ponta Verde é o cartão-postal. Fortemente verticalizada, com a faixa de praia mais movimentada da cidade, concentra hotéis, restaurantes e o fluxo de turistas o ano inteiro. Quem quer viver a praia como parte da rotina, sair a pé para jantar e ter tudo a poucos quarteirões encontra ali o melhor cenário. A contrapartida é o ticket: a primeira quadra da orla cobra caro pela vista e pela localização.

A Jatiúca tem um caráter mais misto. Além da orla, o bairro se estende por ruas residenciais, com escolas, supermercados, clínicas e comércio de bairro. Isso costuma agradar famílias que precisam resolver a semana inteira dentro do próprio bairro. Ao se afastar da praia, a oferta cresce e o preço por metro quadrado fica mais acessível — muitas vezes com plantas maiores pelo mesmo valor.

Movimento é um fator que poucos avaliam antes de assinar. A Ponta Verde é mais turística, com ritmo diferente na alta temporada e nos fins de semana. Algumas ruas da Jatiúca são bem mais silenciosas. Nenhum dos dois é melhor: depende de você querer estar dentro do movimento ou a dez minutos dele.

Vale olhar também a vaga de garagem e o trajeto. Prédios mais antigos na orla às vezes têm uma vaga só, ou vagas presas. Se a família tem dois carros, isso muda a lista de opções bem mais do que a metragem.

Para investimento, a lógica muda outra vez. A Ponta Verde tem demanda forte de temporada, com diária mais alta e ocupação sazonal. A Jatiúca tende a oferecer locação anual mais estável, com menos rotatividade e menos gestão. São dois negócios diferentes, com esforços diferentes.

A recomendação prática que sempre faço: antes de decidir, escreva como é a sua semana de verdade — não a semana ideal. Onde você trabalha, onde as crianças estudam, onde você faz mercado, o que você faz no sábado. Depois visite os dois bairros em horários diferentes, incluindo um fim de tarde de sexta. A resposta costuma aparecer sozinha.',
  '/blog/ponta-verde-jatiuca.webp', 'Maceió', 'Luciano Góis', 'publicado', '2026-08-12'
) on conflict (slug) do nothing;

insert into posts (
  slug, titulo, resumo, conteudo, capa_path, categoria, autor, status, publicado_em
) values (
  'o-que-analisar-antes-de-comprar-um-imovel-na-planta', 'O que analisar antes de comprar um imóvel na planta', 'Registro de incorporação, memorial descritivo, correção do saldo e prazo de entrega: o checklist que separa uma boa compra de uma dor de cabeça.',
  'Comprar na planta costuma significar entrada menor, parcelas diluídas e a chance de escolher a unidade. Em troca, você assume um compromisso longo com uma obra que ainda não existe. Os pontos abaixo são os que eu verifico antes de recomendar qualquer lançamento a um cliente.

O primeiro é o registro de incorporação. Um empreendimento só pode ser comercializado depois que a incorporação é registrada no cartório de imóveis, conforme a Lei 4.591/64. Esse registro reúne o memorial, a matrícula do terreno e a documentação da construtora. Peça o número e confira na matrícula. Se não existir, não avance — nem por um preço melhor.

O segundo é o histórico da construtora. Quantos empreendimentos ela já entregou, em que prazo e com que qualidade. Vale visitar um prédio entregue há alguns anos e conversar com o síndico ou com moradores. Acabamento envelhece, e é assim que se descobre o que estava por trás do estande.

O terceiro é o memorial descritivo. Ele é o documento que realmente define o que você vai receber: marca e padrão de louças, metais, esquadrias, piso e revestimento. Expressões como “similar ou superior” são comuns e legítimas, mas merecem atenção — peça exemplos concretos do que a construtora considera equivalente.

O quarto é a correção do saldo devedor. Durante a obra, as parcelas costumam ser corrigidas pelo INCC, o índice que acompanha o custo da construção. Depois da entrega das chaves, o contrato normalmente passa a usar outro índice. Isso significa que o valor final pago é maior do que a soma das parcelas do folheto. Peça a simulação com a correção aplicada e decida com esse número.

O quinto é o prazo. Contratos de incorporação em geral preveem uma tolerância de até 180 dias além da data prevista de entrega, e essa cláusula é válida. Planeje sua vida considerando o prazo com a tolerância, não sem ela — principalmente se você estiver pagando aluguel em paralelo.

O sexto é o que acontece se você precisar sair. A Lei 13.786/2018, conhecida como Lei do Distrato, definiu regras para a rescisão e para quanto a incorporadora pode reter. Leia essa cláusula antes de assinar, e não depois de precisar dela.

Por fim, o financiamento das chaves. Boa parte dos contratos deixa um saldo relevante para ser financiado na entrega, e a aprovação do crédito acontece naquele momento — não na assinatura. Sua renda, seu score e as regras do banco podem ter mudado em três anos. Avalie desde já se você teria crédito aprovado hoje para aquele saldo.

Comprar na planta é um bom negócio quando a conta fecha no cenário conservador: com a correção aplicada, com a entrega no prazo máximo e com o financiamento aprovado. Se só fecha no cenário otimista, o risco está sendo transferido para você.',
  '/blog/imovel-na-planta.webp', 'Investimentos', 'Luciano Góis', 'publicado', '2026-08-02'
) on conflict (slug) do nothing;

