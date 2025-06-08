
import type { Exercise } from '@/lib/types';

export const module1AssociationExercises: Exercise[] = [
  {
    id: 'm1-e1.1.3',
    moduleId: 'mod-trilha1-0',
    title: 'Associação de Termos Chave (Introdução)',
    type: 'association',
    question: 'Associe os termos da Coluna A com suas definições corretas na Coluna B.',
    options: [
      { id: 'a1', text: 'Coluna A: CIF' }, { id: 'b1', text: 'Coluna B: Classificação que descreve funcionalidade e incapacidade em relação à saúde e fatores contextuais.' },
      { id: 'a2', text: 'Coluna A: Barreiras Atitudinais' }, { id: 'b2', text: 'Coluna B: Preconceitos, estigmas e estereótipos que dificultam a participação social.' },
      { id: 'a3', text: 'Coluna A: Neurodiversidade' }, { id: 'b3', text: 'Coluna B: Conceito que reconhece variações neurológicas como parte da diversidade humana.' },
      { id: 'a4', text: 'Coluna A: Modelo Social da Deficiência' }, { id: 'b4', text: 'Coluna B: Entende a deficiência como resultado da interação entre o indivíduo e as barreiras impostas pela sociedade.' },
    ],
    correctAnswer: ["a1-b1", "a2-b2", "a3-b3", "a4-b4"],
    feedback: 'Ótimas associações! Esses termos são base para entender a deficiência sob uma perspectiva atual e inclusiva.',
    points: 20,
    estimatedTime: '3 mins'
  },
  {
    id: 'm1-e1.2.4',
    moduleId: 'mod-trilha1-0',
    title: 'Tônus Muscular na Paralisia Cerebral',
    type: 'association',
    question: 'Associe os termos relacionados ao tônus muscular na Paralisia Cerebral (Coluna A) com suas descrições (Coluna B).',
    options: [
      { id: 'pc_a1', text: 'Coluna A: Hipotonia' }, { id: 'pc_b1', text: 'Coluna B: Tônus muscular diminuído, resultando em flacidez.' },
      { id: 'pc_a2', text: 'Coluna A: Hipertonia' }, { id: 'pc_b2', text: 'Coluna B: Tônus muscular aumentado, resultando em rigidez ou espasticidade.' },
      { id: 'pc_a3', text: 'Coluna A: Espasticidade' }, { id: 'pc_b3', text: 'Coluna B: Um tipo de hipertonia com aumento da resistência ao movimento passivo dependente da velocidade.' },
    ],
    correctAnswer: ["pc_a1-pc_b1", "pc_a2-pc_b2", "pc_a3-pc_b3"],
    feedback: 'Excelente! Compreender essas distinções de tônus é importante no contexto da Paralisia Cerebral.',
    points: 15,
    estimatedTime: '3 mins'
  },
  {
    id: 'm1-e1.5.3',
    moduleId: 'mod-trilha1-0',
    title: 'Componentes da Linguagem',
    type: 'association',
    question: 'Associe os componentes da linguagem (Coluna A) com suas definições (Coluna B).',
    options: [
      { id: 'lang_a1', text: 'Coluna A: Fonologia' }, { id: 'lang_b1', text: 'Coluna B: Estudo dos sons da fala e suas combinações.' },
      { id: 'lang_a2', text: 'Coluna A: Semântica' }, { id: 'lang_b2', text: 'Coluna B: Estudo do significado das palavras e frases.' },
      { id: 'lang_a3', text: 'Coluna A: Sintaxe' }, { id: 'lang_b3', text: 'Coluna B: Estudo das regras de combinação das palavras para formar frases.' },
      { id: 'lang_a4', text: 'Coluna A: Pragmática' }, { id: 'lang_b4', text: 'Coluna B: Estudo do uso da linguagem em contextos sociais e comunicativos.' },
    ],
    correctAnswer: ["lang_a1-lang_b1", "lang_a2-lang_b2", "lang_a3-lang_b3", "lang_a4-lang_b4"],
    feedback: 'Muito bem! Esses são os componentes fundamentais para entender o desenvolvimento e os transtornos da linguagem.',
    points: 20,
    estimatedTime: '3 mins'
  },
  {
    id: 'm1-e1.6.3',
    moduleId: 'mod-trilha1-0',
    title: 'Funções Executivas e Exemplos',
    type: 'association',
    question: 'Associe cada Função Executiva (Coluna A) com um exemplo de sua aplicação (Coluna B).',
    options: [
      { id: 'fe_a1', text: 'Coluna A: Memória de Trabalho' }, { id: 'fe_b1', text: 'Coluna B: Lembrar uma lista de compras enquanto navega no supermercado.' },
      { id: 'fe_a2', text: 'Coluna A: Controle Inibitório' }, { id: 'fe_b2', text: 'Coluna B: Evitar responder impulsivamente antes que o professor termine a pergunta.' },
      { id: 'fe_a3', text: 'Coluna A: Flexibilidade Cognitiva' }, { id: 'fe_b3', text: 'Coluna B: Mudar de estratégia quando a abordagem inicial para resolver um problema não funciona.' },
    ],
    correctAnswer: ["fe_a1-fe_b1", "fe_a2-fe_b2", "fe_a3-fe_b3"],
    feedback: 'Ótimas associações! As Funções Executivas são essenciais para muitas tarefas diárias e acadêmicas.',
    points: 15,
    estimatedTime: '3 mins'
  }
];
