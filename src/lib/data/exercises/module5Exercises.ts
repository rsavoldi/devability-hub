
import type { Exercise } from '@/lib/types';

export const module5Exercises: Exercise[] = [
  {
    id: 'm5-e1',
    moduleId: 'mod-trilha5-0',
    title: 'Neuroplasticidade',
    type: 'multiple-choice',
    question: 'O que é neuroplasticidade?',
    options: [
      { id: 'opt1', text: 'Uma condição neurológica rara.' },
      { id: 'opt2', text: 'A capacidade do cérebro de se modificar em resposta a experiências.' },
      { id: 'opt3', text: 'O estudo dos plásticos usados em implantes cerebrais.' },
      { id: 'opt4', text: 'A rigidez do cérebro após a infância.' }
    ],
    correctAnswer: 'opt2',
    feedback: 'Correto! Neuroplasticidade é a capacidade do cérebro de se reorganizar.',
    points: 10,
    estimatedTime: '3 mins'
  },
  {
    id: 'm5-e2',
    moduleId: 'mod-trilha5-0',
    title: 'Fenótipo Cognitivo do TEA',
    type: 'fill-in-the-blank',
    question: 'No TEA, a dificuldade em compreender estados mentais alheios é frequentemente associada a desafios na Teoria da ____.',
    options: [
      { id: 'tea_opt1', text: 'Mente' },
      { id: 'tea_opt2', text: 'Coerência Central' },
      { id: 'tea_opt3', text: 'Relatividade Social' }
    ],
    correctAnswer: 'Mente',
    feedback: 'Exato! Desafios na Teoria da Mente são uma característica investigada no TEA.',
    points: 10,
    estimatedTime: '3 mins'
  },
  {
    id: 'm5-e3',
    moduleId: 'mod-trilha5-0',
    title: 'Abordagens de Reabilitação Neuropsicológica',
    type: 'association',
    question: 'Associe as abordagens de reabilitação neuropsicológica (Coluna A) com suas descrições (Coluna B).',
    options: [
      { id: 'a1', text: 'Coluna A: Restauração' }, { id: 'b1', text: 'Coluna B: Visa recuperar funções comprometidas através de estimulação direta.' },
      { id: 'a2', text: 'Coluna A: Compensação' }, { id: 'b2', text: 'Coluna B: Desenvolve estratégias alternativas usando funções preservadas.' },
      { id: 'a3', text: 'Coluna A: Adaptação' }, { id: 'b3', text: 'Coluna B: Modifica o ambiente e as tarefas para reduzir o impacto das limitações.' }
    ],
    correctAnswer: ["a1-b1", "a2-b2", "a3-b3"],
    feedback: 'Perfeito! Essas são as três principais abordagens na reabilitação neuropsicológica.',
    points: 15,
    estimatedTime: '5 mins'
  },
  {
    id: 'm5-e4',
    moduleId: 'mod-trilha5-0',
    title: 'Períodos Críticos/Sensíveis',
    type: 'multiple-choice',
    question: 'O que são "Períodos Críticos ou Sensíveis" no contexto da neuropsicologia do desenvolvimento?',
    options: [
      { id: 'pc_opt1', text: 'Fases em que o cérebro está mais propenso a lesões irreversíveis.' },
      { id: 'pc_opt2', text: 'Janelas temporais onde o cérebro está particularmente suscetível a certas experiências ambientais para o desenvolvimento de funções específicas.' },
      { id: 'pc_opt3', text: 'Momentos de descanso cerebral necessários após aprendizado intenso.' },
      { id: 'pc_opt4', text: 'Estágios onde não ocorrem mudanças significativas no cérebro.' }
    ],
    correctAnswer: 'pc_opt2',
    feedback: 'Correto! São janelas de oportunidade para o desenvolvimento de funções específicas, influenciadas pela experiência.',
    points: 10,
    estimatedTime: '4 mins'
  },
  {
    id: 'm5-e5',
    moduleId: 'mod-trilha5-0',
    title: 'Funções Executivas e Córtex Pré-frontal',
    type: 'multiple-choice',
    question: 'O desenvolvimento das Funções Executivas (FE) está principalmente associado à maturação de qual área cerebral?',
    options: [
      { id: 'fe_opt1', text: 'Córtex Occipital' },
      { id: 'fe_opt2', text: 'Cerebelo' },
      { id: 'fe_opt3', text: 'Córtex Pré-frontal' },
      { id: 'fe_opt4', text: 'Hipocampo' }
    ],
    correctAnswer: 'fe_opt3',
    feedback: 'Exato! O córtex pré-frontal é a principal área cerebral envolvida no desenvolvimento e funcionamento das Funções Executivas.',
    points: 10,
    estimatedTime: '3 mins'
  },
  {
    id: 'm5-e6',
    moduleId: 'mod-trilha5-0',
    title: 'Desmistificando "Neuromitos"',
    type: 'fill-in-the-blank',
    question: 'Um "neuromito" comum é a ideia de que usamos apenas ____% do nosso cérebro.',
    options: [
      { id: 'neuro_opt1', text: '10' },
      { id: 'neuro_opt2', text: '50' },
      { id: 'neuro_opt3', text: '90' }
    ],
    correctAnswer: '10',
    feedback: 'Correto! A ideia de que usamos apenas 10% do cérebro é um neuromito popular, mas falso. Usamos todas as partes do nosso cérebro, embora não todas ao mesmo tempo.',
    points: 10,
    estimatedTime: '3 mins'
  }
];
