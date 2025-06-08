
import type { Exercise } from '@/lib/types';

export const module3OrderingExercises: Exercise[] = [
  {
    id: 'm3-ord-1',
    moduleId: 'mod-trilha3-0',
    title: 'Ordem dos Paradigmas Históricos da Deficiência',
    type: 'ordering',
    question: 'Ordene os paradigmas históricos da abordagem à deficiência, do mais antigo para o mais recente, conforme a Lição 3.1.',
    options: [
      { id: 'paradigma_suportes', text: 'Paradigma de Suportes' },
      { id: 'paradigma_institucionalizacao', text: 'Paradigma da Institucionalização' },
      { id: 'paradigma_servicos', text: 'Paradigma de Serviços' },
    ],
    correctAnswer: ['paradigma_institucionalizacao', 'paradigma_servicos', 'paradigma_suportes'],
    feedback: 'Correto! A sequência histórica predominante é: Institucionalização, seguido por Serviços e, mais recentemente, o paradigma de Suportes.',
    points: 15,
    estimatedTime: '2 mins'
  },
  {
    id: 'm3-ord-2',
    moduleId: 'mod-trilha3-0',
    title: 'Etapas Simplificadas da Intervenção Precoce',
    type: 'ordering',
    question: 'Ordene as seguintes etapas gerais de um processo de Intervenção Precoce (simplificado) conforme a Lição 3.3.',
    options: [
      { id: 'ip_planejamento', text: 'Planejamento da intervenção centrado na família e na criança.' },
      { id: 'ip_acolhimento', text: 'Acolhimento e identificação de necessidades da criança e da família.' },
      { id: 'ip_implementacao', text: 'Implementação de estratégias em contextos naturais e acompanhamento.' },
      { id: 'ip_avaliacao_inicial', text: 'Avaliação inicial multidisciplinar detalhada.' },
    ],
    correctAnswer: ['ip_acolhimento', 'ip_avaliacao_inicial', 'ip_planejamento', 'ip_implementacao'],
    feedback: 'Ótima sequência! Geralmente, o processo inicia com o acolhimento, seguido de uma avaliação, o planejamento conjunto e, então, a implementação com acompanhamento contínuo.',
    points: 15,
    estimatedTime: '3 mins'
  }
];
