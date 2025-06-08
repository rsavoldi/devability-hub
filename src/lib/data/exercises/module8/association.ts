
import type { Exercise } from '@/lib/types';

export const module8AssociationExercises: Exercise[] = [
  {
    id: 'm8-e3',
    moduleId: 'mod-trilha8-0',
    title: 'Intervenção: Normalização vs. Diferença',
    type: 'association',
    question: 'Associe as abordagens de intervenção (Coluna A) com seus focos principais (Coluna B) no contexto do dilema "Normalização vs. Valorização da Diferença".',
    options: [
      { id: 'a1', text: 'Coluna A: Abordagens Tradicionais de Normalização' }, { id: 'b1', text: 'Coluna B: Buscam aproximar a pessoa com deficiência de padrões considerados "normais".' },
      { id: 'a2', text: 'Coluna A: Perspectivas Críticas de Valorização da Diferença' }, { id: 'b2', text: 'Coluna B: Focam na remoção de barreiras e no respeito à identidade, sem impor padrões normativos.' },
      { id: 'a3', text: 'Coluna A: Intervenções Equilibradas' }, { id: 'b3', text: 'Coluna B: Buscam desenvolver habilidades socialmente valorizadas, respeitando a identidade e as escolhas da pessoa.' }
    ],
    correctAnswer: ["a1-b1", "a2-b2", "a3-b3"],
    feedback: 'Boas associações! Este é um dilema central na prática com pessoas com deficiência.',
    points: 15,
    estimatedTime: '3 mins'
  },
  {
    id: 'm8-e10',
    moduleId: 'mod-trilha8-0',
    title: 'Práticas de Comunicação Ética',
    type: 'association',
    question: 'Associe as práticas de comunicação (Coluna A) com seus princípios éticos correspondentes (Coluna B) na interação com pessoas com deficiência.',
    options: [
      { id: 'a1', text: 'Coluna A: Usar linguagem clara, simples e, se necessário, recursos como Libras ou Braille.' }, { id: 'b1', text: 'Coluna B: Garantir Acessibilidade Comunicacional.' },
      { id: 'a2', text: 'Coluna A: Fornecer informações completas sobre procedimentos, riscos e benefícios.' }, { id: 'b2', text: 'Coluna B: Promover a Transparência e o Consentimento Informado.' },
      { id: 'a3', text: 'Coluna A: Evitar termos pejorativos ou que infantilizem a pessoa.' }, { id: 'b3', text: 'Coluna B: Manter uma Linguagem Respeitosa e Não Estigmatizante.' }
    ],
    correctAnswer: ["a1-b1", "a2-b2", "a3-b3"],
    feedback: 'Ótimas associações! Essas práticas são fundamentais para uma comunicação ética e eficaz.',
    points: 15,
    estimatedTime: '3 mins'
  }
];
