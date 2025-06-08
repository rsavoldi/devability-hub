
import type { Exercise } from '@/lib/types';

export const module6FillInTheBlankExercises: Exercise[] = [
  {
    id: 'm6-e4',
    moduleId: 'mod-trilha6-0',
    title: 'Avaliação de Pessoas com TEA',
    type: 'fill-in-the-blank',
    question: 'Na avaliação de pessoas com TEA, é importante usar uma abordagem _______, considerando particularidades sensoriais e múltiplas fontes de informação.',
    options: [
      { id: 'tea_opt1', text: 'flexível' },
      { id: 'tea_opt2', text: 'rígida' },
      { id: 'tea_opt3', text: 'acelerada' }
    ],
    correctAnswer: 'flexível',
    feedback: 'Exato! A flexibilidade e a consideração das características individuais do TEA são chave na avaliação.',
    points: 10,
    estimatedTime: '2 mins'
  },
  {
    id: 'm6-e9',
    moduleId: 'mod-trilha6-0',
    title: 'Interpretação de Resultados na Avaliação',
    type: 'fill-in-the-blank',
    question: 'Na avaliação psicológica da pessoa com deficiência, a interpretação dos resultados deve ser ______, considerando o contexto de vida, experiências e oportunidades, e não apenas os escores.',
    options: [
        { id: 'opt1', text: 'contextualizada' },
        { id: 'opt2', text: 'padronizada' },
        { id: 'opt3', text: 'rápida' }
    ],
    correctAnswer: 'contextualizada',
    feedback: 'Exato! A interpretação contextualizada é crucial para evitar conclusões deterministas ou reducionistas.',
    points: 10,
    estimatedTime: '2 mins'
  }
];
