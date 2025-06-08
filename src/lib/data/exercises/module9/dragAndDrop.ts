
import type { Exercise } from '@/lib/types';

export const module9DragAndDropExercises: Exercise[] = [
  {
    id: 'm9-dnd-1',
    moduleId: 'mod-trilha9-0',
    title: 'Categorizando Tipos de Acessibilidade',
    type: 'drag-and-drop',
    question: 'Arraste os exemplos para a categoria correta de acessibilidade.',
    options: [
      { id: 'acess1', text: 'Rampas em calçadas e edifícios' },
      { id: 'acess2', text: 'Legendas em vídeos e Intérprete de Libras' },
      { id: 'acess3', text: 'Softwares leitores de tela para computadores' },
      { id: 'acess4', text: 'Informações em linguagem simples e clara' },
      { id: 'acess5', text: 'Atitudes de respeito e não discriminação' },
      { id: 'acess6', text: 'Veículos de transporte público com elevador' }
    ],
    targetCategories: [
      { id: 'cat_arq', text: 'Acessibilidade Arquitetônica/Física' },
      { id: 'cat_com', text: 'Acessibilidade Comunicacional/Informacional' },
      { id: 'cat_atit', text: 'Acessibilidade Atitudinal' }
    ],
    correctAnswer: {
      'acess1': 'cat_arq',
      'acess2': 'cat_com',
      'acess3': 'cat_com',
      'acess4': 'cat_com',
      'acess5': 'cat_atit',
      'acess6': 'cat_arq'
    },
    feedback: 'Ótimo! Acessibilidade é multifacetada, incluindo aspectos físicos, de comunicação e atitudinais.',
    points: 20,
    estimatedTime: '3 mins'
  },
  {
    id: 'm9-dnd-2',
    moduleId: 'mod-trilha9-0',
    title: 'Identificando Barreiras e Facilitadores da Inclusão',
    type: 'drag-and-drop',
    question: 'Categorize os seguintes itens como "Barreiras à Inclusão" ou "Facilitadores da Inclusão".',
    options: [
      { id: 'bf1', text: 'Políticas públicas fragmentadas' },
      { id: 'bf2', text: 'Fortalecimento de movimentos sociais de PCD' },
      { id: 'bf3', text: 'Falta de capacitação de profissionais' },
      { id: 'bf4', text: 'Avanços em tecnologias assistivas' },
      { id: 'bf5', text: 'Estigma e preconceito social' },
      { id: 'bf6', text: 'Implementação efetiva da Lei de Cotas' }
    ],
    targetCategories: [
      { id: 'cat_bar', text: 'Barreiras à Inclusão' },
      { id: 'cat_fac', text: 'Facilitadores da Inclusão' }
    ],
    correctAnswer: {
      'bf1': 'cat_bar',
      'bf2': 'cat_fac',
      'bf3': 'cat_bar',
      'bf4': 'cat_fac',
      'bf5': 'cat_bar',
      'bf6': 'cat_fac'
    },
    feedback: 'Excelente! Identificar o que impede e o que promove a inclusão é crucial para avançarmos.',
    points: 20,
    estimatedTime: '3 mins'
  }
];
