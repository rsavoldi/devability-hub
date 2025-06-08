
import type { Exercise } from '@/lib/types';

export const module7OrderingExercises: Exercise[] = [
  {
    id: 'm7-ord-1',
    moduleId: 'mod-trilha7-0',
    title: 'Etapas da Pesquisa Participativa (Simplificado)',
    type: 'ordering',
    question: 'Ordene as etapas gerais de um processo de pesquisa participativa/inclusiva (simplificado), conforme discutido na Lição 7.4.',
    options: [
      { id: 'pp_etapa2', text: 'Coleta e análise colaborativa dos dados.' },
      { id: 'pp_etapa1', text: 'Definição conjunta do problema e dos objetivos da pesquisa.' },
      { id: 'pp_etapa4', text: 'Ação ou disseminação dos resultados para promover mudança.' },
      { id: 'pp_etapa3', text: 'Interpretação conjunta dos resultados e planejamento de ações.' }
    ],
    correctAnswer: ['pp_etapa1', 'pp_etapa2', 'pp_etapa3', 'pp_etapa4'],
    feedback: 'Ótima sequência! A pesquisa participativa envolve colaboração em todas as fases, desde a definição do problema até a ação.',
    points: 15,
    estimatedTime: '3 mins'
  },
  {
    id: 'm7-ord-2',
    moduleId: 'mod-trilha7-0',
    title: 'Níveis de Participação na Ciência Cidadã (Simplificado)',
    type: 'ordering',
    question: 'Ordene os seguintes níveis de participação na Ciência Cidadã do menos ao mais envolvido, conforme a Lição 7.4.',
    options: [
      { id: 'cc_nivel2', text: 'Contribuição (cidadãos coletam dados seguindo protocolos definidos por cientistas).' },
      { id: 'cc_nivel1', text: 'Crowdsourcing (cidadãos fornecem recursos, como poder computacional).' },
      { id: 'cc_nivel3', text: 'Colaboração (cidadãos participam na análise e interpretação, podendo modificar o projeto).' },
      { id: 'cc_nivel4', text: 'Cocriação (cidadãos participam em todas as etapas, incluindo definição do problema e design da pesquisa).' }
    ],
    correctAnswer: ['cc_nivel1', 'cc_nivel2', 'cc_nivel3', 'cc_nivel4'],
    feedback: 'Correto! A participação na ciência cidadã pode variar desde contribuições pontuais até o codesign completo da pesquisa.',
    points: 15,
    estimatedTime: '3 mins'
  }
];
