
import type { Exercise } from '@/lib/types';

export const module5AssociationExercises: Exercise[] = [
  {
    id: 'm5-e9',
    moduleId: 'mod-trilha5-0',
    title: 'Fenótipos Cognitivos e Condições',
    type: 'association',
    question: 'Associe cada condição (Coluna A) com uma característica neuropsicológica frequentemente associada (Coluna B).',
    options: [
      { id: 'a1', text: 'Coluna A: Síndrome de Down' }, 
      { id: 'b1', text: 'Coluna B: Relativa força em habilidades visuoespaciais, mas desafios na memória verbal de curto prazo.' },
      { id: 'a2', text: 'Coluna A: Transtorno do Espectro Autista (TEA)' }, 
      { id: 'b2', text: 'Coluna B: Dificuldades na Teoria da Mente e processamento focado em detalhes (coerência central fraca).' },
      { id: 'a3', text: 'Coluna A: Surdez Congênita (usuário de Língua de Sinais)' }, 
      { id: 'b3', text: 'Coluna B: Possível reorganização cerebral com áreas auditivas participando do processamento visuoespacial da língua de sinais.' }
    ],
    correctAnswer: ["a1-b1", "a2-b2", "a3-b3"],
    feedback: 'Boas associações! Compreender esses fenótipos ajuda a personalizar os suportes.',
    points: 15,
    estimatedTime: '3 mins'
  },
  {
    id: 'm5-e10',
    moduleId: 'mod-trilha5-0',
    title: 'Abordagens de Reabilitação Neuropsicológica',
    type: 'association',
    question: 'Associe cada abordagem de reabilitação neuropsicológica (Coluna A) com seu objetivo principal (Coluna B).',
    options: [
      { id: 'a1', text: 'Coluna A: Restauração de Função' }, 
      { id: 'b1', text: 'Coluna B: Melhorar uma função cognitiva específica através de treino direto e estimulação.' },
      { id: 'a2', text: 'Coluna A: Compensação de Função' }, 
      { id: 'b2', text: 'Coluna B: Ensinar o uso de estratégias alternativas ou funções preservadas para contornar um déficit.' },
      { id: 'a3', text: 'Coluna A: Adaptação Ambiental/Funcional' }, 
      { id: 'b3', text: 'Coluna B: Modificar o ambiente ou a tarefa para reduzir o impacto da limitação funcional.' }
    ],
    correctAnswer: ["a1-b1", "a2-b2", "a3-b3"],
    feedback: 'Excelentes associações! Essas são as três principais estratégias em reabilitação neuropsicológica.',
    points: 15,
    estimatedTime: '3 mins'
  }
];
