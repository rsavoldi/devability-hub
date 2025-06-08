
import type { Exercise } from '@/lib/types';

export const module9AssociationExercises: Exercise[] = [
  {
    id: 'm9-e4',
    moduleId: 'mod-trilha9-0',
    title: 'Acessibilidade e LBI',
    type: 'association',
    question: 'Associe os tipos de acessibilidade (Coluna A) com suas descrições conforme a Lei Brasileira de Inclusão (Coluna B).',
    options: [
      { id: 'a1', text: 'Coluna A: Acessibilidade Arquitetônica' }, { id: 'b1', text: 'Coluna B: Eliminação de barreiras em edificações, espaços e mobiliários.' },
      { id: 'a2', text: 'Coluna A: Acessibilidade Comunicacional' }, { id: 'b2', text: 'Coluna B: Eliminação de barreiras na comunicação interpessoal, escrita e digital (ex: Libras, Braille, legendas).' },
      { id: 'a3', text: 'Coluna A: Acessibilidade Atitudinal' }, { id: 'b3', text: 'Coluna B: Eliminação de preconceitos, estereótipos e discriminações.' },
    ],
    correctAnswer: ["a1-b1", "a2-b2", "a3-b3"],
    feedback: 'Boas associações! A LBI aborda a acessibilidade de forma ampla.',
    points: 15,
    estimatedTime: '3 mins'
  },
  {
    id: 'm9-e10',
    moduleId: 'mod-trilha9-0',
    title: 'Papéis dos Atores na Inclusão',
    type: 'association',
    question: 'Associe cada ator social (Coluna A) com uma de suas responsabilidades chave na promoção da inclusão (Coluna B).',
    options: [
      { id: 'a1', text: 'Coluna A: Família' }, { id: 'b1', text: 'Coluna B: Prover cuidado, suporte direto e atuar como defensora de direitos.' },
      { id: 'a2', text: 'Coluna A: Comunidade' }, { id: 'b2', text: 'Coluna B: Oferecer espaços de acolhimento, eliminar barreiras locais e promover participação em atividades.' },
      { id: 'a3', text: 'Coluna A: Estado' }, { id: 'b3', text: 'Coluna B: Formular políticas públicas, legislar, fiscalizar e garantir recursos para inclusão.' }
    ],
    correctAnswer: ["a1-b1", "a2-b2", "a3-b3"],
    feedback: 'Perfeito! Família, comunidade e Estado têm papéis complementares e cruciais para a inclusão efetiva.',
    points: 15,
    estimatedTime: '3 mins'
  }
];
