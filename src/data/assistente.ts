export type Opcao = {
  rotulo: string;
  /** Próximo nó da árvore. */
  proximo?: string;
  /** Resposta pronta, para as perguntas frequentes. */
  resposta?: string;
  /** Abre o WhatsApp com esta mensagem. */
  whatsapp?: string;
  /** Filtros acumulados até virarem a querystring de /imoveis. */
  filtro?: Record<string, string>;
};

export type No = {
  pergunta: string;
  opcoes: Opcao[];
  /** Nó final: mostra o resultado com o que foi escolhido. */
  final?: boolean;
};

/**
 * Fluxo do assistente. É uma árvore fixa, sem modelo de linguagem:
 * toda resposta já está escrita aqui e todo caminho termina no catálogo
 * filtrado ou numa conversa no WhatsApp.
 *
 * TODO: as respostas de perguntas frequentes precisam do aval do Luciano.
 */
export const arvore: Record<string, No> = {
  inicio: {
    pergunta: "Olá! Posso ajudar a encontrar o imóvel certo. Por onde começamos?",
    opcoes: [
      { rotulo: "Quero comprar", proximo: "tipo", filtro: { finalidade: "venda" } },
      { rotulo: "Quero alugar", proximo: "tipo", filtro: { finalidade: "aluguel" } },
      { rotulo: "Quero investir", proximo: "investir" },
      {
        rotulo: "Quero vender meu imóvel",
        whatsapp:
          "Olá Luciano, tenho um imóvel para vender e gostaria de conversar sobre a avaliação.",
      },
      { rotulo: "Tenho uma dúvida", proximo: "duvidas" },
    ],
  },

  tipo: {
    pergunta: "Que tipo de imóvel você procura?",
    opcoes: [
      { rotulo: "Apartamento", proximo: "faixa", filtro: { tipo: "apartamento" } },
      { rotulo: "Casa", proximo: "faixa", filtro: { tipo: "casa" } },
      { rotulo: "Terreno", proximo: "faixa", filtro: { tipo: "terreno" } },
      { rotulo: "Sala comercial", proximo: "faixa", filtro: { tipo: "comercial" } },
      { rotulo: "Lançamento", proximo: "faixa", filtro: { tipo: "lancamento" } },
      { rotulo: "Tanto faz", proximo: "faixa" },
    ],
  },

  faixa: {
    pergunta: "Qual faixa de valor faz sentido para você?",
    opcoes: [
      { rotulo: "Até R$ 500 mil", proximo: "resultado", filtro: { precoMax: "500000" } },
      {
        rotulo: "R$ 500 mil a R$ 800 mil",
        proximo: "resultado",
        filtro: { precoMin: "500000", precoMax: "800000" },
      },
      {
        rotulo: "R$ 800 mil a R$ 1,2 milhão",
        proximo: "resultado",
        filtro: { precoMin: "800000", precoMax: "1200000" },
      },
      {
        rotulo: "Acima de R$ 1,2 milhão",
        proximo: "resultado",
        filtro: { precoMin: "1200000" },
      },
      { rotulo: "Prefiro não dizer agora", proximo: "resultado" },
    ],
  },

  investir: {
    pergunta: "Investimento tem caminhos diferentes. Qual te interessa mais?",
    opcoes: [
      {
        rotulo: "Renda com aluguel",
        whatsapp:
          "Olá Luciano, procuro um imóvel para investir com foco em renda de aluguel. Pode me orientar?",
      },
      {
        rotulo: "Valorização no Litoral Norte",
        proximo: "resultado",
        filtro: { q: "Litoral Norte" },
      },
      {
        rotulo: "Comprar na planta",
        proximo: "resultado",
        filtro: { tipo: "lancamento" },
      },
      {
        rotulo: "Ainda não sei, quero orientação",
        whatsapp:
          "Olá Luciano, quero investir em imóvel em Maceió mas ainda não decidi o caminho. Podemos conversar?",
      },
    ],
  },

  duvidas: {
    pergunta: "Sobre o que você quer saber?",
    opcoes: [
      {
        rotulo: "Em quais regiões o Luciano atua?",
        resposta:
          "A atuação é em Maceió, no Litoral Norte e na região metropolitana — da orla aos bairros de expansão.",
      },
      {
        rotulo: "Onde fica o escritório?",
        resposta:
          "Rua José Cabral Acioli, Sala 12 — Jatiúca, Maceió/AL. Vale combinar o horário pelo WhatsApp antes de passar.",
      },
      {
        rotulo: "Como funciona a avaliação do meu imóvel?",
        resposta:
          "A avaliação parte da análise da região, do estado do imóvel e do que está sendo praticado em imóveis semelhantes. É feita sem compromisso — o primeiro passo é uma conversa.",
      },
      {
        rotulo: "Dá para comprar financiado?",
        resposta:
          "Sim, a maior parte das compras é feita com financiamento bancário. O Luciano acompanha a documentação e a análise de crédito, e cada banco tem condições próprias — vale simular em mais de um.",
      },
      {
        rotulo: "Quero falar direto com o Luciano",
        whatsapp: "Olá Luciano, vim pelo site e gostaria de conversar.",
      },
    ],
  },

  resultado: {
    pergunta: "Perfeito. Achei o caminho — veja as opções abaixo.",
    opcoes: [],
    final: true,
  },
};
