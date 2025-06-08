
import type { Exercise } from '@/lib/types';

export const module3FillInTheBlankExercises: Exercise[] = [
  {
    id: 'm3-e4',
    moduleId: 'mod-trilha3-0',
    title: 'DUA na Educação Inclusiva',
    type: 'fill-in-the-blank',
    question: 'O Desenho Universal para a Aprendizagem (DUA) propõe múltiplos meios de representação da informação, múltiplos meios de ação e expressão do aprendizado, e múltiplos meios de _______.',
    options: [ 
        {id: 'dua_opt1', text: 'avaliação padronizada'},
        {id: 'dua_opt2', text: 'engajamento e motivação'},
        {id: 'dua_opt3', text: 'memorização de conteúdos'}
    ],
    correctAnswer: 'engajamento e motivação', 
    feedback: 'Correto! Os três princípios do DUA são: representação, ação/expressão e engajamento/motivação.',
    points: 10,
    estimatedTime: '2 mins'
  },
  {
    id: 'm3-e8',
    moduleId: 'mod-trilha3-0',
    title: 'Participação na Pesquisa',
    type: 'fill-in-the-blank',
    question: 'O lema "______ sobre nós, sem nós" enfatiza a importância da participação ativa das pessoas com deficiência na pesquisa.',
    options: [
        {id: 'lema_opt1', text: 'Nada'},
        {id: 'lema_opt2', text: 'Tudo'},
        {id: 'lema_opt3', text: 'Algo'}
    ],
    correctAnswer: 'Nada', 
    feedback: 'Correto! "Nada sobre nós, sem nós" é um lema fundamental do movimento de direitos das pessoas com deficiência.',
    points: 10,
    estimatedTime: '2 mins'
  }
];
