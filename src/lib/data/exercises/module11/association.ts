
import type { Exercise } from '@/lib/types';

export const module11AssociationExercises: Exercise[] = [
  {
    id: 'm11-e3',
    moduleId: 'mod-trilha11-0',
    title: 'Funções dos Núcleos de Acessibilidade',
    type: 'association',
    question: 'Associe as funções dos Núcleos de Acessibilidade (Coluna A) com suas descrições (Coluna B).',
    options: [
      { id: 'a1', text: 'Coluna A: Suporte Pedagógico' }, { id: 'b1', text: 'Coluna B: Orientação a professores sobre adaptações curriculares e produção de materiais acessíveis.' },
      { id: 'a2', text: 'Coluna A: Intermediação Institucional' }, { id: 'b2', text: 'Coluna B: Articulação entre diferentes setores da IES para implementar políticas inclusivas.' },
      { id: 'a3', text: 'Coluna A: Sensibilização da Comunidade Acadêmica' }, { id: 'b3', text: 'Coluna B: Promoção de eventos e cursos para aumentar conhecimento sobre deficiência e inclusão.' }
    ],
    correctAnswer: ["a1-b1", "a2-b2", "a3-b3"],
    feedback: 'Perfeitas associações! Os Núcleos de Acessibilidade desempenham múltiplas funções cruciais.',
    points: 15,
    estimatedTime: '3 mins'
  },
  {
    id: 'm11-e10-new',
    moduleId: 'mod-trilha11-0',
    title: 'Políticas de Ação Afirmativa no Ensino Superior',
    type: 'association',
    question: 'Associe a política de ação afirmativa (Coluna A) com sua principal característica (Coluna B) no contexto do acesso de PCDs ao ensino superior brasileiro.',
    options: [
      { id: 'a1', text: 'Coluna A: Lei de Cotas (Federais)' }, { id: 'b1', text: 'Coluna B: Reserva de vagas em IES públicas federais para estudantes de escolas públicas, incluindo PCDs.' },
      { id: 'a2', text: 'Coluna A: ProUni' }, { id: 'b2', text: 'Coluna B: Concessão de bolsas de estudo em IES privadas para estudantes de baixa renda, incluindo PCDs.' }
    ],
    correctAnswer: ["a1-b1", "a2-b2"],
    feedback: 'Ótima associação! A Lei de Cotas foca em IES públicas federais e o ProUni em bolsas para IES privadas.',
    points: 15,
    estimatedTime: '2 mins'
  }
];
