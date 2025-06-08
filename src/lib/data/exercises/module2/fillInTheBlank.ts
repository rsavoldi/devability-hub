
import type { Exercise } from '@/lib/types';

export const module2FillInTheBlankExercises: Exercise[] = [
  {
    id: 'm2-e2',
    moduleId: 'mod-trilha2-0',
    title: 'Condições Secundárias de Saúde',
    type: 'fill-in-the-blank',
    question: 'Condições de saúde que ocorrem como resultado direto ou indireto da deficiência primária, como dor crônica ou fadiga, são chamadas de ______.',
    options: [
      { id: 'cs_opt1', text: 'comorbidades primárias' },
      { id: 'cs_opt2', text: 'condições secundárias' },
      { id: 'cs_opt3', text: 'agravamentos inevitáveis' },
    ],
    correctAnswer: 'condições secundárias',
    feedback: 'Exato! O manejo e prevenção de condições secundárias são cruciais para o bem-estar do adulto com deficiência.',
    points: 10,
    estimatedTime: '2 mins',
  },
  {
    id: 'm2-e7',
    moduleId: 'mod-trilha2-0',
    title: 'Importância das Redes de Apoio',
    type: 'fill-in-the-blank',
    question: 'Redes de apoio social, como família, amigos e grupos de pares, são cruciais para combater o _______ e fornecer suporte prático e emocional a adultos com deficiência (Lição 2.4).',
    options: [
      { id: 'ras_opt1', text: 'isolamento' },
      { id: 'ras_opt2', text: 'desenvolvimento excessivo' },
      { id: 'ras_opt3', text: 'estigma internalizado' },
    ],
    correctAnswer: 'isolamento',
    feedback: 'Exato! Redes de apoio social são vitais para o bem-estar, promovendo conexões e combatendo o isolamento.',
    points: 10,
    estimatedTime: '2 mins',
  }
];
