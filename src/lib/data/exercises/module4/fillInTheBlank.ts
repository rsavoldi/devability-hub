
import type { Exercise } from '@/lib/types';

export const module4FillInTheBlankExercises: Exercise[] = [
  {
    id: 'm4-e2',
    moduleId: 'mod-trilha4-0',
    title: 'ABA e Comportamento',
    type: 'fill-in-the-blank',
    question: 'A Análise do Comportamento Aplicada (ABA) se baseia na ideia de que o comportamento é aprendido e pode ser modificado pela manipulação de ______.',
    options: [
      {id: 'aba_opt1', text: 'antecedentes e consequências'},
      {id: 'aba_opt2', text: 'processos inconscientes'},
      {id: 'aba_opt3', text: 'fatores exclusivamente genéticos'}
    ],
    correctAnswer: 'antecedentes e consequências',
    feedback: 'Exato! A ABA foca em como os antecedentes e as consequências moldam o comportamento.',
    points: 10,
    estimatedTime: '2 mins',
  },
  {
    id: 'm4-e9',
    moduleId: 'mod-trilha4-0',
    title: 'Neuroplasticidade: Períodos Críticos',
    type: 'fill-in-the-blank',
    question: 'Os ______ ou sensíveis no desenvolvimento são janelas temporais onde o cérebro está particularmente receptivo a certas experiências para o desenvolvimento de funções específicas, como a linguagem.',
    options: [
      { id: 'pc_opt1', text: 'períodos críticos' },
      { id: 'pc_opt2', text: 'estágios finais' },
      { id: 'pc_opt3', text: 'momentos de descanso' }
    ],
    correctAnswer: 'períodos críticos',
    feedback: 'Correto! Períodos críticos ou sensíveis são fases de alta plasticidade para aquisição de certas habilidades.',
    points: 10,
    estimatedTime: '2 mins'
  }
];
