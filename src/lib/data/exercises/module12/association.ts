
import type { Exercise } from '@/lib/types';

export const module12AssociationExercises: Exercise[] = [
  {
    id: 'm12-e3',
    moduleId: 'mod-trilha12-0',
    title: 'Envelhecimento e Deficiência',
    type: 'association',
    question: 'Associe os termos relacionados ao envelhecimento e deficiência (Coluna A) com suas descrições (Coluna B).',
    options: [
      { id: 'a1', text: 'Coluna A: Envelhecimento Precoce' }, { id: 'b1', text: 'Coluna B: Surgimento antecipado de condições de saúde típicas de idades mais avançadas em pessoas com deficiências preexistentes.' },
      { id: 'a2', text: 'Coluna A: Cascata de Limitações' }, { id: 'b2', text: 'Coluna B: Processo cumulativo onde uma limitação inicial pode levar a complicações secundárias e novas limitações.' },
      { id: 'a3', text: 'Coluna A: Etarismo e Capacitismo' }, { id: 'b3', text: 'Coluna B: Formas de discriminação combinadas que podem afetar idosos com deficiência.' },
    ],
    correctAnswer: ["a1-b1", "a2-b2", "a3-b3"],
    feedback: 'Perfeitas associações! Esses conceitos são importantes para entender os desafios do envelhecimento com deficiência.',
    points: 15,
    estimatedTime: '3 mins'
  },
  {
    id: 'm12-e10-new',
    moduleId: 'mod-trilha12-0',
    title: 'Tipos de Atividades de Vida Diária',
    type: 'association',
    question: 'Associe os tipos de Atividades de Vida Diária (Coluna A) com seus exemplos correspondentes (Coluna B).',
    options: [
      { id: 'a1', text: 'Coluna A: Atividades Básicas de Vida Diária (ABVDs)' }, { id: 'b1', text: 'Coluna B: Alimentar-se, vestir-se, tomar banho.' },
      { id: 'a2', text: 'Coluna A: Atividades Instrumentais de Vida Diária (AIVDs)' }, { id: 'b2', text: 'Coluna B: Preparar refeições, administrar finanças, usar telefone.' },
      { id: 'a3', text: 'Coluna A: Atividades Avançadas de Vida Diária (AAVDs)' }, { id: 'b3', text: 'Coluna B: Trabalho voluntário, participação em atividades sociais e de lazer.' }
    ],
    correctAnswer: ["a1-b1", "a2-b2", "a3-b3"],
    feedback: 'Ótima associação! Compreender esses níveis de atividades é fundamental na avaliação funcional de idosos.',
    points: 15,
    estimatedTime: '3 mins'
  }
];
