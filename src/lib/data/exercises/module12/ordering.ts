
import type { Exercise } from '@/lib/types';

export const module12OrderingExercises: Exercise[] = [
  {
    id: 'm12-e11-new',
    moduleId: 'mod-trilha12-0',
    title: 'Hierarquia de Perda Funcional (Simplificada)',
    type: 'ordering',
    question: 'Ordene os tipos de Atividades de Vida Diária da mais complexa (geralmente perdida primeiro) para a mais básica (geralmente perdida por último) em um processo de declínio funcional.',
    options: [
      { id: 'ord_func2', text: 'Atividades Instrumentais de Vida Diária (AIVDs)' },
      { id: 'ord_func1', text: 'Atividades Avançadas de Vida Diária (AAVDs)' },
      { id: 'ord_func3', text: 'Atividades Básicas de Vida Diária (ABVDs)' }
    ],
    correctAnswer: ['ord_func1', 'ord_func2', 'ord_func3'],
    feedback: 'Correto! Geralmente, a perda funcional segue a ordem: AAVDs, depois AIVDs e, por fim, ABVDs.',
    points: 15,
    estimatedTime: '2 mins'
  },
  {
    id: 'm12-e12-new',
    moduleId: 'mod-trilha12-0',
    title: 'Evolução da Abordagem à Pessoa Idosa',
    type: 'ordering',
    question: 'Ordene as seguintes abordagens à pessoa idosa da mais tradicional/limitadora para a mais contemporânea/empoderadora.',
    options: [
      { id: 'abord_ord2', text: 'Foco na proteção passiva e cuidado assistencialista.' },
      { id: 'abord_ord1', text: 'Visão da velhice como doença e declínio inevitável.' },
      { id: 'abord_ord3', text: 'Promoção do envelhecimento ativo, autonomia e direitos (paradigma de direitos humanos).' }
    ],
    correctAnswer: ['abord_ord1', 'abord_ord2', 'abord_ord3'],
    feedback: 'Excelente! A compreensão evoluiu de uma visão de declínio para uma de envelhecimento ativo e com direitos.',
    points: 15,
    estimatedTime: '2 mins'
  }
];
