
import type { Exercise } from '@/lib/types';

export const module10FillInTheBlankExercises: Exercise[] = [
  {
    id: 'm10-e2',
    moduleId: 'mod-trilha10-0',
    title: 'Conceito de Neurodiversidade',
    type: 'fill-in-the-blank',
    question: 'A perspectiva da neurodiversidade propõe que condições como autismo e TDAH representam variações ______ do cérebro humano, e não necessariamente patologias.',
    options: [
      { id: 'neuro_opt1', text: 'naturais' },
      { id: 'neuro_opt2', text: 'defeituosas' },
      { id: 'neuro_opt3', text: 'adquiridas' }
    ],
    correctAnswer: 'naturais',
    feedback: 'Exato! A neurodiversidade encara essas variações como parte da diversidade humana natural.',
    points: 10,
    estimatedTime: '2 mins'
  },
  {
    id: 'm10-e5',
    moduleId: 'mod-trilha10-0',
    title: 'Ecologia de Saberes na Inclusão',
    type: 'fill-in-the-blank',
    question: 'A "ecologia de saberes", proposta por Boaventura de Sousa Santos, no contexto da inclusão, sugere a valorização e o diálogo entre o conhecimento científico e o conhecimento ______ das pessoas com deficiência.',
    options: [
      { id: 'eco_opt1', text: 'experiencial' },
      { id: 'eco_opt2', text: 'ancestral' },
      { id: 'eco_opt3', text: 'intuitivo' }
    ],
    correctAnswer: 'experiencial',
    feedback: 'Exato! A ecologia de saberes valoriza a pluralidade de conhecimentos, incluindo o conhecimento baseado na vivência direta da deficiência.',
    points: 10,
    estimatedTime: '2 mins'
  }
];
