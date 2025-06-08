
import type { Lesson, Exercise, Module } from '@/lib/types';

export const placeholderLessonsGeneric: Lesson[] = [
  { id: 'l-placeholder-1', title: 'Lição Introdutória Genérica', type: 'text', content: 'Conteúdo da lição introdutória para esta trilha...', estimatedTime: '10 mins', coverImage: 'https://placehold.co/600x300.png', aiHint: 'educacional abstrato' },
  { id: 'l-placeholder-2', title: 'Conceitos Chave Genéricos', type: 'interactive', content: 'Explorando conceitos chave de forma interativa para esta trilha.', estimatedTime: '15 mins', coverImage: 'https://placehold.co/600x300.png', aiHint: 'ideias conhecimento' },
];

export const placeholderExercisesGeneric: Exercise[] = [
  { id: 'e-placeholder-1', title: 'Quiz Rápido Genérico', type: 'multiple-choice', question: 'Qual é o conceito principal desta trilha genérica?', options: [{id: 'opt1', text:'Opção A'}, {id: 'opt2', text:'Opção B'}], correctAnswer: 'opt1', feedback: 'Feedback sobre a resposta genérica.', points: 10, estimatedTime: '5 mins' },
];

export const createPlaceholderModule = (trilhaId: string, trilhaTitle: string, index: number): Module => ({
  id: `mod-${trilhaId}-${index}`,
  title: `Módulo Principal: ${trilhaTitle.substring(0, 40)}...`,
  lessons: placeholderLessonsGeneric.map(l => ({...l, id: `${l.id}-${trilhaId}-${index}`})),
  exercises: placeholderExercisesGeneric.map(e => ({...e, id: `${e.id}-${trilhaId}-${index}`})),
  isCompleted: false,
  progress: 0,
});
