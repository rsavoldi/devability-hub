
import type { Exercise } from '@/lib/types';

export const module10DragAndDropExercises: Exercise[] = [
  {
    id: 'm10-e13-new',
    moduleId: 'mod-trilha10-0',
    title: 'Desenho Universal: Princípios vs. Não-Princípios',
    type: 'drag-and-drop',
    question: 'Categorize os itens como "Princípios do Desenho Universal" ou "Não são Princípios do DU".',
    options: [
        { id: 'du_dnd1', text: 'Uso Equitativo' },
        { id: 'du_dnd2', text: 'Custo Elevado Obrigatório' },
        { id: 'du_dnd3', text: 'Flexibilidade no Uso' },
        { id: 'du_dnd4', text: 'Design Exclusivo para um Grupo' },
        { id: 'du_dnd5', text: 'Tolerância ao Erro' },
        { id: 'du_dnd6', text: 'Complexidade para Especialistas' }
    ],
    targetCategories: [
        { id: 'cat_principios_du', text: 'Princípios do Desenho Universal' },
        { id: 'cat_nao_principios_du', text: 'Não são Princípios do DU' }
    ],
    correctAnswer: { 
      'du_dnd1': 'cat_principios_du', 
      'du_dnd2': 'cat_nao_principios_du', 
      'du_dnd3': 'cat_principios_du', 
      'du_dnd4': 'cat_nao_principios_du', 
      'du_dnd5': 'cat_principios_du', 
      'du_dnd6': 'cat_nao_principios_du' 
    },
    feedback: 'Ótimo! O DU visa simplicidade, equidade e flexibilidade, não custo elevado ou exclusividade.',
    points: 20,
    estimatedTime: '3 mins'
  },
  {
    id: 'm10-e14-new',
    moduleId: 'mod-trilha10-0',
    title: 'Neurodiversidade: Foco em Forças vs. Foco em Déficits',
    type: 'drag-and-drop',
    question: 'Categorize as abordagens como "Foco nas Forças (Neurodiversidade)" ou "Foco nos Déficits (Modelo Médico Tradicional)".',
    options: [
        { id: 'nd_foco1', text: 'Identificar e desenvolver talentos específicos (ex: hiperfoco, pensamento sistemático).' },
        { id: 'nd_foco2', text: 'Priorizar a eliminação de comportamentos "atípicos".' },
        { id: 'nd_foco3', text: 'Adaptar o ambiente para acomodar diferentes estilos de processamento.' },
        { id: 'nd_foco4', text: 'Medir o sucesso pela proximidade com padrões "normais".' },
        { id: 'nd_foco5', text: 'Reconhecer habilidades únicas em áreas como criatividade ou atenção a detalhes.' },
        { id: 'nd_foco6', text: 'Concentrar-se apenas nas dificuldades e limitações da pessoa.' }
    ],
    targetCategories: [
        { id: 'cat_foco_forcas', text: 'Foco nas Forças (Neurodiversidade)' },
        { id: 'cat_foco_deficits', text: 'Foco nos Déficits (Modelo Médico)' }
    ],
    correctAnswer: { 
      'nd_foco1': 'cat_foco_forcas', 
      'nd_foco2': 'cat_foco_deficits', 
      'nd_foco3': 'cat_foco_forcas', 
      'nd_foco4': 'cat_foco_deficits', 
      'nd_foco5': 'cat_foco_forcas', 
      'nd_foco6': 'cat_foco_deficits' 
    },
    feedback: 'Excelente! A perspectiva da neurodiversidade muda o foco de apenas corrigir déficits para reconhecer e cultivar as forças individuais.',
    points: 20,
    estimatedTime: '3 mins'
  }
];
