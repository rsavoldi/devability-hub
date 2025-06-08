
import type { Exercise } from '@/lib/types';

export const module7DragAndDropExercises: Exercise[] = [
  {
    id: 'm7-dnd-1',
    moduleId: 'mod-trilha7-0',
    title: 'Ética na Pesquisa: Consentimento vs. Proteção',
    type: 'drag-and-drop',
    question: 'Categorize as ações como "Foco no Consentimento Informado" ou "Foco na Proteção contra Danos" na pesquisa com pessoas com deficiência (Lição 7.5).',
    options: [
        { id: 'etica_dd1', text: 'Adaptar materiais de consentimento para linguagem simples.' },
        { id: 'etica_dd2', text: 'Minimizar riscos de estigmatização nos resultados.' },
        { id: 'etica_dd3', text: 'Verificar continuamente a voluntariedade da participação.' },
        { id: 'etica_dd4', text: 'Garantir anonimato e confidencialidade dos dados.' },
        { id: 'etica_dd5', text: 'Oferecer suportes para a tomada de decisão sobre participar.' },
        { id: 'etica_dd6', text: 'Avaliar o impacto social potencial da pesquisa antes de iniciar.' }
    ],
    targetCategories: [
        { id: 'cat-consentimento', text: 'Foco no Consentimento Informado' },
        { id: 'cat-protecao', text: 'Foco na Proteção contra Danos' }
    ],
    correctAnswer: {
        'etica_dd1': 'cat-consentimento',
        'etica_dd2': 'cat-protecao',
        'etica_dd3': 'cat-consentimento',
        'etica_dd4': 'cat-protecao',
        'etica_dd5': 'cat-consentimento',
        'etica_dd6': 'cat-protecao'
    },
    feedback: 'Boa categorização! Ambos são cruciais, mas têm focos distintos na prática ética da pesquisa.',
    points: 20,
    estimatedTime: '3 mins'
  },
  {
    id: 'm7-dnd-2',
    moduleId: 'mod-trilha7-0',
    title: 'Pesquisa Quantitativa vs. Qualitativa: Características',
    type: 'drag-and-drop',
    question: 'Categorize as seguintes características como típicas de "Pesquisa Quantitativa" ou "Pesquisa Qualitativa" (Lições 7.2 e 7.3).',
    options: [
        { id: 'qq_dd1', text: 'Busca por generalização estatística.' },
        { id: 'qq_dd2', text: 'Foco na compreensão de significados e experiências em profundidade.' },
        { id: 'qq_dd3', text: 'Uso de testes padronizados e escalas.' },
        { id: 'qq_dd4', text: 'Coleta de dados através de entrevistas abertas e observação participante.' },
        { id: 'qq_dd5', text: 'Análise de dados através de números e modelos estatísticos.' },
        { id: 'qq_dd6', text: 'Interpretação de narrativas e discursos.' }
    ],
    targetCategories: [
        { id: 'cat-quanti', text: 'Pesquisa Quantitativa' },
        { id: 'cat-quali', text: 'Pesquisa Qualitativa' }
    ],
    correctAnswer: {
        'qq_dd1': 'cat-quanti',
        'qq_dd2': 'cat-quali',
        'qq_dd3': 'cat-quanti',
        'qq_dd4': 'cat-quali',
        'qq_dd5': 'cat-quanti',
        'qq_dd6': 'cat-quali'
    },
    feedback: 'Exato! Quantitativa foca em números e generalizações, qualitativa em profundidade e significados.',
    points: 20,
    estimatedTime: '3 mins'
  }
];
