
import type { Exercise } from '@/lib/types';

export const module8DragAndDropExercises: Exercise[] = [
  {
    id: 'm8-e13',
    moduleId: 'mod-trilha8-0',
    title: 'Intervenções: Autonomia vs. Paternalismo',
    type: 'drag-and-drop',
    question: 'Categorize as seguintes ações de intervenção como "Promotoras de Autonomia" ou "Práticas Paternalistas".',
    options: [
      { id: 'ap_opt1', text: 'Decidir pela pessoa qual tratamento ela deve seguir, sem consultá-la.' },
      { id: 'ap_opt2', text: 'Oferecer informações claras sobre opções de tratamento e apoiar a decisão da pessoa.' },
      { id: 'ap_opt3', text: 'Restringir atividades da pessoa "para o seu próprio bem", sem diálogo.' },
      { id: 'ap_opt4', text: 'Incentivar a pessoa a expressar suas preferências e metas.' },
      { id: 'ap_opt5', text: 'Assumir que a pessoa não é capaz de fazer escolhas significativas.' },
      { id: 'ap_opt6', text: 'Apoiar o desenvolvimento de habilidades de autoadvocacia.' }
    ],
    targetCategories: [
      { id: 'cat-autonomia', text: 'Promotoras de Autonomia' },
      { id: 'cat-paternalismo', text: 'Práticas Paternalistas' }
    ],
    correctAnswer: { 
      'ap_opt1': 'cat-paternalismo', 
      'ap_opt2': 'cat-autonomia', 
      'ap_opt3': 'cat-paternalismo', 
      'ap_opt4': 'cat-autonomia', 
      'ap_opt5': 'cat-paternalismo', 
      'ap_opt6': 'cat-autonomia' 
    },
    feedback: 'Ótima categorização! Promover autonomia é um pilar ético, enquanto o paternalismo a restringe.',
    points: 20,
    estimatedTime: '3 mins'
  },
  {
    id: 'm8-e14',
    moduleId: 'mod-trilha8-0',
    title: 'Diretrizes Éticas na Prática Profissional',
    type: 'drag-and-drop',
    question: 'Categorize as seguintes ações como "Alinhadas com Diretrizes Éticas" ou "Contrárias às Diretrizes Éticas" na prática com pessoas com deficiência.',
    options: [
      { id: 'de_opt1', text: 'Usar uma abordagem padronizada para todas as pessoas com o mesmo diagnóstico.' },
      { id: 'de_opt2', text: 'Garantir acessibilidade comunicacional durante todo o atendimento.' },
      { id: 'de_opt3', text: 'Compartilhar informações confidenciais sem consentimento, exceto em risco iminente.' },
      { id: 'de_opt4', text: 'Manter-se atualizado sobre legislações e melhores práticas inclusivas.' },
      { id: 'de_opt5', text: 'Ignorar o contexto sociocultural da pessoa ao planejar intervenções.' },
      { id: 'de_opt6', text: 'Priorizar a voz e a agência da pessoa com deficiência em todas as decisões.' }
    ],
    targetCategories: [
      { id: 'cat-alinhada', text: 'Alinhada com Diretrizes Éticas' },
      { id: 'cat-contraria', text: 'Contrária às Diretrizes Éticas' }
    ],
    correctAnswer: { 
      'de_opt1': 'cat-contraria', 
      'de_opt2': 'cat-alinhada', 
      'de_opt3': 'cat-contraria', 
      'de_opt4': 'cat-alinhada', 
      'de_opt5': 'cat-contraria', 
      'de_opt6': 'cat-alinhada' 
    },
    feedback: 'Excelente! Seguir as diretrizes éticas é crucial para uma prática respeitosa e eficaz.',
    points: 20,
    estimatedTime: '3 mins'
  }
];
