
import type { Exercise } from '@/lib/types';

export const module12DragAndDropExercises: Exercise[] = [
  {
    id: 'm12-e13-new',
    moduleId: 'mod-trilha12-0',
    title: 'Envelhecimento Ativo: Ações e Pilares',
    type: 'drag-and-drop',
    question: 'Categorize as seguintes ações/conceitos como pertencentes aos pilares do "Envelhecimento Ativo" ou como "Contrários ao Envelhecimento Ativo".',
    options: [
      { id: 'ea_dnd1', text: 'Promoção de hábitos saudáveis ao longo da vida.' },
      { id: 'ea_dnd2', text: 'Isolamento social para "proteger" o idoso.' },
      { id: 'ea_dnd3', text: 'Garantia de segurança financeira e acesso a serviços.' },
      { id: 'ea_dnd4', text: 'Visão da velhice como passividade e dependência.' },
      { id: 'ea_dnd5', text: 'Oportunidades de aprendizagem contínua.' },
      { id: 'ea_dnd6', text: 'Estímulo à participação cívica e cultural.' }
    ],
    targetCategories: [
      { id: 'cat_envel_ativo', text: 'Coerente com Envelhecimento Ativo' },
      { id: 'cat_contrario_ea', text: 'Contrário ao Envelhecimento Ativo' }
    ],
    correctAnswer: {
      'ea_dnd1': 'cat_envel_ativo',
      'ea_dnd2': 'cat_contrario_ea',
      'ea_dnd3': 'cat_envel_ativo',
      'ea_dnd4': 'cat_contrario_ea',
      'ea_dnd5': 'cat_envel_ativo',
      'ea_dnd6': 'cat_envel_ativo'
    },
    feedback: 'Ótima categorização! O envelhecimento ativo foca em saúde, participação, segurança e aprendizagem, combatendo visões passivas.',
    points: 20,
    estimatedTime: '3 mins'
  },
  {
    id: 'm12-e14-new',
    moduleId: 'mod-trilha12-0',
    title: 'Fragilidade vs. Robustez no Idoso',
    type: 'drag-and-drop',
    question: 'Categorize as seguintes características como mais associadas à "Fragilidade" ou à "Robustez/Resiliência" no idoso.',
    options: [
      { id: 'fr_dnd1', text: 'Perda de peso não intencional significativa.' },
      { id: 'fr_dnd2', text: 'Alta capacidade de adaptação a estressores.' },
      { id: 'fr_dnd3', text: 'Fadiga autorrelatada constante.' },
      { id: 'fr_dnd4', text: 'Manutenção de bom nível de atividade física.' },
      { id: 'fr_dnd5', text: 'Redução da velocidade de marcha.' },
      { id: 'fr_dnd6', text: 'Forte rede de suporte social e emocional.' }
    ],
    targetCategories: [
      { id: 'cat_fragilidade', text: 'Associado à Fragilidade' },
      { id: 'cat_robustez', text: 'Associado à Robustez/Resiliência' }
    ],
    correctAnswer: {
      'fr_dnd1': 'cat_fragilidade',
      'fr_dnd2': 'cat_robustez',
      'fr_dnd3': 'cat_fragilidade',
      'fr_dnd4': 'cat_robustez',
      'fr_dnd5': 'cat_fragilidade',
      'fr_dnd6': 'cat_robustez'
    },
    feedback: 'Excelente! Identificar sinais de fragilidade é importante para intervenções preventivas, enquanto fatores de robustez/resiliência promovem um envelhecimento mais saudável.',
    points: 20,
    estimatedTime: '3 mins'
  }
];
