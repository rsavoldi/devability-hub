
import type { Exercise } from '@/lib/types';

export const module5FillInTheBlankExercises: Exercise[] = [
  {
    id: 'm5-e5',
    moduleId: 'mod-trilha5-0',
    title: 'Conceito de Neuroplasticidade',
    type: 'fill-in-the-blank',
    question: 'A capacidade do cérebro de se reorganizar estrutural e funcionalmente em resposta a experiências, aprendizagem ou lesões é conhecida como ______. (Use uma palavra)',
    options: [ // Options for the dropdown style fill-in-the-blank
      { id: 'opt1', text: 'neuroplasticidade' },
      { id: 'opt2', text: 'neurogênese' },
      { id: 'opt3', text: 'mielinização' }
    ],
    correctAnswer: 'neuroplasticidade',
    feedback: 'Exato! A neuroplasticidade é fundamental para a aprendizagem, adaptação e recuperação funcional.',
    points: 10,
    estimatedTime: '1 min'
  },
  {
    id: 'm5-e6',
    moduleId: 'mod-trilha5-0',
    title: 'Memória Episódica',
    type: 'fill-in-the-blank',
    question: 'A memória para eventos pessoais e autobiográficos, como o que você fez no seu último aniversário, é chamada de memória ______. (Use uma palavra)',
    options: [
      { id: 'opt1', text: 'episódica' },
      { id: 'opt2', text: 'semântica' },
      { id: 'opt3', text: 'procedural' }
    ],
    correctAnswer: 'episódica',
    feedback: 'Correto! A memória episódica armazena nossas experiências pessoais.',
    points: 10,
    estimatedTime: '1 min'
  },
  {
    id: 'm5-e7',
    moduleId: 'mod-trilha5-0',
    title: 'Memória Semântica',
    type: 'fill-in-the-blank',
    question: 'O conhecimento de que Paris é a capital da França faz parte da sua memória ______. (Use uma palavra)',
    options: [
      { id: 'opt1', text: 'semântica' },
      { id: 'opt2', text: 'episódica' },
      { id: 'opt3', text: 'de trabalho' }
    ],
    correctAnswer: 'semântica',
    feedback: 'Exato! A memória semântica refere-se ao nosso conhecimento de fatos e conceitos sobre o mundo.',
    points: 10,
    estimatedTime: '1 min'
  },
  {
    id: 'm5-e8',
    moduleId: 'mod-trilha5-0',
    title: 'DUA e Neuropsicologia',
    type: 'fill-in-the-blank',
    question: 'O Desenho Universal para a Aprendizagem (DUA), ao propor múltiplos meios de representação, ação/expressão e engajamento, alinha-se com a compreensão neuropsicológica da ______ de aprendizagem. (Use uma palavra)',
    options: [
      { id: 'opt1', text: 'diversidade' },
      { id: 'opt2', text: 'padronização' },
      { id: 'opt3', text: 'rigidez' }
    ],
    correctAnswer: 'diversidade',
    feedback: 'Correto! O DUA reconhece e planeja para a diversidade de perfis neurocognitivos dos estudantes.',
    points: 10,
    estimatedTime: '2 mins'
  }
];
