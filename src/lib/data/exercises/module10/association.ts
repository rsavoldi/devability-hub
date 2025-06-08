
import type { Exercise } from '@/lib/types';

export const module10AssociationExercises: Exercise[] = [
  {
    id: 'm10-e3',
    moduleId: 'mod-trilha10-0',
    title: 'Tecnologia Assistiva vs. Desenho Universal',
    type: 'association',
    question: 'Associe os conceitos (Coluna A) com suas definições/objetivos principais (Coluna B).',
    options: [
      { id: 'a1', text: 'Coluna A: Desenho Universal (DU)' }, { id: 'b1', text: 'Coluna B: Cria produtos e ambientes utilizáveis por todas as pessoas, na maior extensão possível, sem necessidade de adaptação.' },
      { id: 'a2', text: 'Coluna A: Tecnologia Assistiva (TA)' }, { id: 'b2', text: 'Coluna B: Oferece soluções específicas para necessidades particulares que não podem ser completamente atendidas pelo DU.' },
      { id: 'a3', text: 'Coluna A: WCAG' }, { id: 'b3', text: 'Coluna B: Diretrizes de acessibilidade para conteúdo web, um exemplo de aplicação de princípios de DU na tecnologia.' },
    ],
    correctAnswer: ["a1-b1", "a2-b2", "a3-b3"],
    feedback: 'Perfeitas associações! DU e TA são complementares na promoção da acessibilidade.',
    points: 15,
    estimatedTime: '3 mins'
  },
  {
    id: 'm10-e10-new',
    moduleId: 'mod-trilha10-0',
    title: 'Desenho Universal para Aprendizagem (DUA) e seus Princípios',
    type: 'association',
    question: 'Associe os princípios do Desenho Universal para a Aprendizagem (DUA) (Coluna A) com suas respectivas descrições (Coluna B).',
    options: [
        { id: 'dua_a1', text: 'Coluna A: Múltiplos Meios de Representação' }, { id: 'dua_b1', text: 'Coluna B: Oferecer a informação em diferentes formatos (visual, auditivo, tátil).' },
        { id: 'dua_a2', text: 'Coluna A: Múltiplos Meios de Ação e Expressão' }, { id: 'dua_b2', text: 'Coluna B: Permitir que os alunos demonstrem o que sabem de diversas maneiras (fala, escrita, desenho, etc.).' },
        { id: 'dua_a3', text: 'Coluna A: Múltiplos Meios de Engajamento' }, { id: 'dua_b3', text: 'Coluna B: Estimular o interesse e a motivação dos alunos por meio de escolhas, relevância e desafios adequados.' }
    ],
    correctAnswer: ["dua_a1-dua_b1", "dua_a2-dua_b2", "dua_a3-dua_b3"],
    feedback: 'Perfeito! Estes são os três princípios fundamentais do DUA, que visam tornar a aprendizagem acessível a todos.',
    points: 15,
    estimatedTime: '3 mins'
  }
];
