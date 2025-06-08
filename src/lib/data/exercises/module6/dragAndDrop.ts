
import type { Exercise } from '@/lib/types';

export const module6DragAndDropExercises: Exercise[] = [
  {
    id: 'm6-e13',
    moduleId: 'mod-trilha6-0',
    title: 'Instrumentos vs. Modelos de Avaliação',
    type: 'drag-and-drop',
    question: 'Categorize os itens como "Instrumento/Técnica de Avaliação" ou "Modelo/Abordagem Teórica de Avaliação".',
    options: [
        { id: 'item1', text: 'Escalas Wechsler de Inteligência' },
        { id: 'item2', text: 'Modelo Psicométrico' },
        { id: 'item3', text: 'Observação Comportamental Sistemática' },
        { id: 'item4', text: 'Modelo Funcional (CIF)' },
        { id: 'item5', text: 'Entrevista Psicológica' },
        { id: 'item6', text: 'Modelo Ecológico de Bronfenbrenner' }
    ],
    targetCategories: [
        { id: 'cat-instrumento', text: 'Instrumento/Técnica' },
        { id: 'cat-modelo', text: 'Modelo/Abordagem Teórica' }
    ],
    correctAnswer: { 
      'item1': 'cat-instrumento', 
      'item2': 'cat-modelo', 
      'item3': 'cat-instrumento', 
      'item4': 'cat-modelo', 
      'item5': 'cat-instrumento', 
      'item6': 'cat-modelo' 
    },
    feedback: 'Boa categorização! É importante distinguir os instrumentos que usamos das abordagens teóricas que guiam a avaliação.',
    points: 20,
    estimatedTime: '3 mins'
  },
  {
    id: 'm6-e14',
    moduleId: 'mod-trilha6-0',
    title: 'Ética na Avaliação: Fazer vs. Não Fazer',
    type: 'drag-and-drop',
    question: 'Categorize as seguintes práticas como "Conduta Ética Esperada" ou "Conduta Antiética/Problemática" na avaliação psicológica de pessoas com deficiência.',
    options: [
        { id: 'etica1', text: 'Presumir incapacidade de consentimento e obter apenas de terceiros.' },
        { id: 'etica2', text: 'Adaptar instrumentos para garantir acessibilidade, justificando as adaptações.' },
        { id: 'etica3', text: 'Utilizar linguagem estigmatizante nos relatórios.' },
        { id: 'etica4', text: 'Respeitar a autonomia e a diversidade da pessoa avaliada.' },
        { id: 'etica5', text: 'Interpretar resultados isoladamente, sem considerar o contexto.' },
        { id: 'etica6', text: 'Manter competência profissional e buscar atualização contínua.' }
    ],
    targetCategories: [
        { id: 'cat-etica', text: 'Conduta Ética Esperada' },
        { id: 'cat-antietica', text: 'Conduta Antiética/Problemática' }
    ],
    correctAnswer: { 
      'etica1': 'cat-antietica', 
      'etica2': 'cat-etica', 
      'etica3': 'cat-antietica', 
      'etica4': 'cat-etica', 
      'etica5': 'cat-antietica', 
      'etica6': 'cat-etica' 
    },
    feedback: 'Excelente! Distinguir condutas éticas das antiéticas é crucial para uma prática profissional responsável.',
    points: 20,
    estimatedTime: '3 mins'
  }
];
