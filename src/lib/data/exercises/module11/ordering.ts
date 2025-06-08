
import type { Exercise } from '@/lib/types';

export const module11OrderingExercises: Exercise[] = [
  {
    id: 'm11-e11-new',
    moduleId: 'mod-trilha11-0',
    title: 'Processo Histórico da Inclusão no Ensino Superior (Cabral, 2017)',
    type: 'ordering',
    question: 'Ordene as fases do processo de inclusão de pessoas com deficiência no ensino superior brasileiro, da mais antiga para a mais recente, conforme Cabral (2017).',
    options: [
      { id: 'fase_integracao', text: 'Fase de Integração (presença pontual, estudante se adapta)' },
      { id: 'fase_exclusao', text: 'Fase de Exclusão (ausência quase total)' },
      { id: 'fase_inclusao', text: 'Fase de Inclusão (responsabilidade institucional)' }
    ],
    correctAnswer: ['fase_exclusao', 'fase_integracao', 'fase_inclusao'],
    feedback: 'Correto! A sequência é Exclusão, seguida por Integração e, mais recentemente, a fase de Inclusão.',
    points: 15,
    estimatedTime: '2 mins'
  },
  {
    id: 'm11-e12-new',
    moduleId: 'mod-trilha11-0',
    title: 'Etapas para Implementação do Desenho Universal para Aprendizagem (DUA)',
    type: 'ordering',
    question: 'Embora não estritamente linear, ordene as seguintes ações para implementar o DUA em uma disciplina no ensino superior, de uma fase inicial de planejamento para uma de aplicação e avaliação.',
    options: [
      { id: 'dua_planejar', text: 'Planejar aulas com múltiplos meios de representação, ação/expressão e engajamento.'},
      { id: 'dua_avaliar', text: 'Avaliar a eficácia das estratégias e fazer ajustes contínuos.'},
      { id: 'dua_identificar', text: 'Identificar potenciais barreiras no currículo e nos métodos de ensino atuais.'},
      { id: 'dua_implementar', text: 'Implementar as estratégias flexíveis em sala de aula.'}
    ],
    correctAnswer: ['dua_identificar', 'dua_planejar', 'dua_implementar', 'dua_avaliar'],
    feedback: 'Boa sequência! Identificar barreiras, planejar com base nos princípios do DUA, implementar e depois avaliar/ajustar é um ciclo eficaz.',
    points: 15,
    estimatedTime: '3 mins'
  }
];
