
import type { Exercise } from '@/lib/types';

export const module11FillInTheBlankExercises: Exercise[] = [
  {
    id: 'm11-e2',
    moduleId: 'mod-trilha11-0',
    title: 'LBI e Acesso ao Ensino Superior',
    type: 'fill-in-the-blank',
    question: 'O Artigo 30 da Lei Brasileira de Inclusão (LBI) estabelece medidas para o processo seletivo e permanência no ensino superior, incluindo a tradução completa do edital e de suas retificações em _____.',
    options: [
      { id: 'lbi_opt1', text: 'Libras' },
      { id: 'lbi_opt2', text: 'Braille' },
      { id: 'lbi_opt3', text: 'Inglês' }
    ],
    correctAnswer: 'Libras',
    feedback: 'Exato! A LBI exige a tradução do edital para Libras, garantindo acessibilidade comunicacional para pessoas surdas.',
    points: 10,
    estimatedTime: '2 mins'
  },
  {
    id: 'm11-e5',
    moduleId: 'mod-trilha11-0',
    title: 'Boas Práticas: Transição Ensino Médio-Superior',
    type: 'fill-in-the-blank',
    question: 'Programas de _____ Ensino Médio-Superior, como o PTES da UFSC, oferecem orientação e suporte específico para estudantes com deficiência que desejam ingressar na universidade.',
    options: [
      {id: 'trans_opt1', text: 'Transição'},
      {id: 'trans_opt2', text: 'Competição'},
      {id: 'trans_opt3', text: 'Nivelamento'}
    ],
    correctAnswer: 'Transição',
    feedback: 'Exato! Programas de transição são uma boa prática para apoiar o acesso ao ensino superior.',
    points: 10,
    estimatedTime: '2 mins'
  },
];
