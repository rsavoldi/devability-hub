
import type { Exercise } from '@/lib/types';

export const module4AssociationExercises: Exercise[] = [
  {
    id: 'm4-e3',
    moduleId: 'mod-trilha4-0',
    title: 'Sistemas de Bronfenbrenner',
    type: 'association',
    question: 'Associe os sistemas da Teoria Bioecológica de Bronfenbrenner (Coluna A) com suas descrições (Coluna B).',
    options: [
      { id: 'a1', text: 'Coluna A: Microssistema' }, { id: 'b1', text: 'Coluna B: Ambientes imediatos de interação face a face (ex: família, escola).' },
      { id: 'a2', text: 'Coluna A: Mesossistema' }, { id: 'b2', text: 'Coluna B: Interconexões entre dois ou mais microssistemas (ex: relação família-escola).' },
      { id: 'a3', text: 'Coluna A: Macrossistema' }, { id: 'b3', text: 'Coluna B: Padrões culturais mais amplos, valores e leis da sociedade.' },
      { id: 'a4', text: 'Coluna A: Cronossistema' }, { id: 'b4', text: 'Coluna B: Dimensão do tempo, incluindo mudanças ao longo da vida e históricas.' }
    ],
    correctAnswer: ["a1-b1", "a2-b2", "a3-b3", "a4-b4"],
    feedback: 'Perfeito! Entender esses sistemas ajuda a ver a pessoa em seu contexto completo.',
    points: 15,
    estimatedTime: '3 mins'
  },
  {
    id: 'm4-e10',
    moduleId: 'mod-trilha4-0',
    title: 'Teorias e Focos Principais',
    type: 'association',
    question: 'Associe cada abordagem teórica (Coluna A) com seu foco principal no estudo da deficiência (Coluna B).',
    options: [
      { id: 'teo_a1', text: 'Coluna A: Teoria Histórico-Cultural (Vygotsky)' }, { id: 'teo_b1', text: 'Coluna B: Mediação social e cultural na superação de limitações por vias alternativas.' },
      { id: 'teo_a2', text: 'Coluna A: Análise do Comportamento Aplicada (ABA)' }, { id: 'teo_b2', text: 'Coluna B: Modificação de comportamento através de antecedentes e consequências.' },
      { id: 'teo_a3', text: 'Coluna A: Modelo Social da Deficiência' }, { id: 'teo_b3', text: 'Coluna B: Deficiência como resultado de barreiras sociais e opressão.' },
      { id: 'teo_a4', text: 'Coluna A: Neuropsicologia (Neuroplasticidade)' }, { id: 'teo_b4', text: 'Coluna B: Capacidade do cérebro de se reorganizar em resposta a experiências.' }
    ],
    correctAnswer: ["teo_a1-teo_b1", "teo_a2-teo_b2", "teo_a3-teo_b3", "teo_a4-teo_b4"],
    feedback: 'Ótimas associações! Cada teoria oferece uma lente valiosa para entender a deficiência.',
    points: 20,
    estimatedTime: '3 mins'
  }
];
