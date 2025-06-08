
import type { Exercise } from '@/lib/types';

export const module6AssociationExercises: Exercise[] = [
  {
    id: 'm6-e2',
    moduleId: 'mod-trilha6-0',
    title: 'Modelos de Avaliação',
    type: 'association',
    question: 'Associe os modelos de avaliação psicológica (Coluna A) com suas características principais (Coluna B).',
    options: [
      { id: 'a1', text: 'Coluna A: Modelo Psicométrico' }, { id: 'b1', text: 'Coluna B: Ênfase na mensuração objetiva com instrumentos padronizados e normatizados.' },
      { id: 'a2', text: 'Coluna A: Modelo Funcional (CIF)' }, { id: 'b2', text: 'Coluna B: Avalia atividades, participação e interação com fatores contextuais.' },
      { id: 'a3', text: 'Coluna A: Modelo Ecológico' }, { id: 'b3', text: 'Coluna B: Analisa a pessoa em interação com múltiplos sistemas ambientais (micro, meso, exo, macro).' },
    ],
    correctAnswer: ["a1-b1", "a2-b2", "a3-b3"],
    feedback: 'Excelentes associações! Cada modelo oferece uma perspectiva valiosa para a avaliação.',
    points: 15,
    estimatedTime: '3 mins'
  },
  {
    id: 'm6-e10',
    moduleId: 'mod-trilha6-0',
    title: 'Adaptações Específicas na Avaliação',
    type: 'association',
    question: 'Associe o tipo de deficiência (Coluna A) com uma consideração/adaptação importante na avaliação psicológica (Coluna B).',
    options: [
      { id: 'a1', text: 'Coluna A: Deficiência Visual' }, { id: 'b1', text: 'Coluna B: Uso de materiais táteis ou descrições verbais para testes.' },
      { id: 'a2', text: 'Coluna A: Deficiência Auditiva (usuário de Libras)' }, { id: 'b2', text: 'Coluna B: Avaliação na língua preferencial, possivelmente com intérprete qualificado.' },
      { id: 'a3', text: 'Coluna A: Deficiência Física (com comprometimento motor na fala)' }, { id: 'b3', text: 'Coluna B: Uso de sistemas de Comunicação Aumentativa e Alternativa (CAA).' }
    ],
    correctAnswer: ["a1-b1", "a2-b2", "a3-b3"],
    feedback: 'Boas associações! Adaptar a avaliação às especificidades de cada deficiência é fundamental para a validade do processo.',
    points: 15,
    estimatedTime: '3 mins'
  }
];
