
import type { Lesson } from '@/lib/types';

export const lessonM12L1: Lesson = {
  id: 'm12-l1',
  title: 'Lição 12.1: Aspectos Demográficos e Epidemiológicos do Envelhecimento',
  type: 'interactive',
  content: `O envelhecimento populacional é um fenômeno global. A OMS (2015) estima que a proporção da população mundial com mais de 60 anos quase <!-- INTERACTIVE_WORD_CHOICE: OPTIONS=[*duplicará (de 12% para 22%);triplicará (de 10% para 30%);manter-se-á estável] --> entre 2015 e 2050. No Brasil, esse processo é acelerado: de 14,2 milhões de idosos em 2000 para 29,9 milhões em 2020 (IBGE, 2018). Em 2050, idosos podem representar cerca de 30% da população brasileira.

Essa transição demográfica resulta da <!-- INTERACTIVE_FILL_IN_BLANK: [redução nas taxas de fecundidade e aumento da expectativa de vida|aumento da fecundidade e redução da mortalidade infantil|migração internacional e urbanização] -->. A taxa de fecundidade no Brasil caiu de 6,28 filhos/mulher (1960) para 1,77 (2018), abaixo do nível de reposição (2,1). A expectativa de vida aumentou de 45,5 anos (1940) para 76,3 anos (2018).

Paralelamente, ocorre uma **transição epidemiológica**: diminuição de doenças infectocontagiosas e aumento de <!-- INTERACTIVE_WORD_CHOICE: OPTIONS=[*Doenças Crônicas Não Transmissíveis (DCNTs);Doenças Infecciosas Emergentes;Acidentes de Trânsito] --> (cardiovasculares, diabetes, câncer). As DCNTs são responsáveis por ~74% das mortes no Brasil, afetando desproporcionalmente idosos (Brasil, 2019) e frequentemente resultando em comprometimentos funcionais.

O envelhecimento é heterogêneo, influenciado por gênero, raça, escolaridade, renda, etc. (Neri, 2013). Mulheres vivem mais, mas com mais limitações funcionais. Há também o "envelhecimento do envelhecimento": aumento da proporção de idosos <!-- INTERACTIVE_FILL_IN_BLANK: [mais velhos (80+ anos)|mais jovens (60-69 anos)|apenas com doenças crônicas] -->, grupo com maior prevalência de multimorbidade e fragilidade (Camarano, 2014). Compreender esses aspectos é vital para políticas públicas adequadas (Kalache, 2008).`,
  estimatedTime: '10-15 mins',
  coverImage: 'https://placehold.co/600x300.png',
  aiHint: 'envelhecimento demografia epidemiologia idosos',
  references: [
    "OMS. (2015). Relatório mundial sobre envelhecimento e saúde.",
    "IBGE. (2018). Projeção da população do Brasil e das Unidades da Federação.",
    "Camarano, A. A. (2014). Novo regime demográfico: uma nova relação entre população e desenvolvimento?",
    "Brasil. Ministério da Saúde. (2019). Vigitel Brasil 2018.",
    "Neri, A. L. (2013). Conceitos e teorias sobre o envelhecimento.",
    "Kalache, A. (2008). O mundo envelhece: é imperativo criar um pacto de solidariedade social."
  ]
};
