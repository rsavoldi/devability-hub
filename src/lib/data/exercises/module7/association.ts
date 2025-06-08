
import type { Exercise } from '@/lib/types';

export const module7AssociationExercises: Exercise[] = [
  {
    id: 'm7-e2',
    moduleId: 'mod-trilha7-0',
    title: 'Tipos de Estudos Quantitativos',
    type: 'association',
    question: 'Associe o tipo de estudo quantitativo (Coluna A) com sua principal característica (Coluna B).',
    options: [
      { id: 'a1', text: 'Coluna A: Estudos Epidemiológicos' }, { id: 'b1', text: 'Coluna B: Investigam prevalência e distribuição de deficiências em populações.' },
      { id: 'a2', text: 'Coluna A: Estudos Experimentais' }, { id: 'b2', text: 'Coluna B: Avaliam eficácia de intervenções manipulando variáveis e controlando condições.' },
      { id: 'a3', text: 'Coluna A: Estudos Longitudinais' }, { id: 'b3', text: 'Coluna B: Acompanham os mesmos indivíduos ao longo do tempo para observar mudanças.' },
    ],
    correctAnswer: ["a1-b1", "a2-b2", "a3-b3"],
    feedback: 'Excelentes associações! Cada tipo de estudo tem um propósito específico na pesquisa quantitativa.',
    points: 15,
    estimatedTime: '3 mins'
  },
  {
    id: 'm7-e10',
    moduleId: 'mod-trilha7-0',
    title: 'Métodos de Coleta de Dados Qualitativos',
    type: 'association',
    question: 'Associe o método de coleta de dados qualitativo (Coluna A) com sua descrição (Coluna B), conforme a Lição 7.3.',
    options: [
      { id: 'a1', text: 'Coluna A: Entrevista em profundidade' }, { id: 'b1', text: 'Coluna B: Conversa detalhada para explorar experiências e significados individuais.' },
      { id: 'a2', text: 'Coluna A: Grupo Focal' }, { id: 'b2', text: 'Coluna B: Discussão em grupo para capturar interações e perspectivas coletivas.' },
      { id: 'a3', text: 'Coluna A: Observação Participante' }, { id: 'b3', text: 'Coluna B: Imersão no contexto para compreender práticas e significados culturais.' }
    ],
    correctAnswer: ["a1-b1", "a2-b2", "a3-b3"],
    feedback: 'Perfeito! Esses são métodos comuns e valiosos na pesquisa qualitativa sobre deficiência.',
    points: 15,
    estimatedTime: '3 mins'
  }
];
