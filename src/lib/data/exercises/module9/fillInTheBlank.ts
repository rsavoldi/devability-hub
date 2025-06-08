
import type { Exercise } from '@/lib/types';

export const module9FillInTheBlankExercises: Exercise[] = [
  {
    id: 'm9-e2',
    moduleId: 'mod-trilha9-0',
    title: 'Declaração de Salamanca e Inclusão Educacional',
    type: 'fill-in-the-blank',
    question: 'A Declaração de Salamanca (1994) proclamou que escolas regulares com orientação ______ são os meios mais eficazes de combater atitudes discriminatórias.',
    options: [
      { id: 'salam_opt1', text: 'inclusiva' },
      { id: 'salam_opt2', text: 'especializada' },
      { id: 'salam_opt3', text: 'competitiva' }
    ],
    correctAnswer: 'inclusiva',
    feedback: 'Exato! A Declaração de Salamanca é um marco para a educação inclusiva.',
    points: 10,
    estimatedTime: '2 mins'
  },
  {
    id: 'm9-e6',
    moduleId: 'mod-trilha9-0',
    title: 'Desafios Futuros para a Inclusão',
    type: 'fill-in-the-blank',
    question: 'Um dos grandes desafios para a inclusão efetiva é superar as ______ atitudinais, como preconceitos e estereótipos, que muitas vezes são mais difíceis de modificar do que as físicas.',
    options: [
      { id: 'des_opt1', text: 'barreiras' },
      { id: 'des_opt2', text: 'facilidades' },
      { id: 'des_opt3', text: 'oportunidades' }
    ],
    correctAnswer: 'barreiras',
    feedback: 'Exato! As barreiras atitudinais são obstáculos significativos e persistentes para a inclusão plena.',
    points: 10,
    estimatedTime: '2 mins'
  }
];
