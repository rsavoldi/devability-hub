
import type { Exercise } from '@/lib/types';

export const module9OrderingExercises: Exercise[] = [
  {
    id: 'm9-ord-1',
    moduleId: 'mod-trilha9-0',
    title: 'Ordem Cronológica dos Paradigmas da Deficiência',
    type: 'ordering',
    question: 'Ordene os paradigmas de abordagem à deficiência do mais antigo para o mais recente.',
    options: [
      { id: 'par2', text: 'Paradigma de Serviços' },
      { id: 'par3', text: 'Paradigma de Suportes' },
      { id: 'par1', text: 'Paradigma da Institucionalização' }
    ],
    correctAnswer: ['par1', 'par2', 'par3'],
    feedback: 'Correto! A evolução histórica geralmente segue: Institucionalização, Serviços e, mais recentemente, Suportes.',
    points: 15,
    estimatedTime: '2 mins'
  },
  {
    id: 'm9-ord-2',
    moduleId: 'mod-trilha9-0',
    title: 'Etapas para Inclusão Educacional Efetiva',
    type: 'ordering',
    question: 'Ordene as seguintes ações para promover uma inclusão educacional efetiva, de uma etapa mais inicial para uma mais contínua.',
    options: [
      { id: 'edu_etapa2', text: 'Implementação de adaptações curriculares e metodológicas (ex: DUA).' },
      { id: 'edu_etapa4', text: 'Avaliação e monitoramento contínuos do processo inclusivo.' },
      { id: 'edu_etapa1', text: 'Identificação e avaliação das necessidades educacionais específicas do aluno.' },
      { id: 'edu_etapa3', text: 'Oferta de Atendimento Educacional Especializado (AEE) no contraturno.' }
    ],
    correctAnswer: ['edu_etapa1', 'edu_etapa2', 'edu_etapa3', 'edu_etapa4'],
    feedback: 'Boa sequência! Identificar necessidades, adaptar o ensino, oferecer AEE e monitorar são passos chave para a inclusão.',
    points: 15,
    estimatedTime: '3 mins'
  }
];
