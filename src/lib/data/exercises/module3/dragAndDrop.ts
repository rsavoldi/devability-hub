
import type { Exercise } from '@/lib/types';

export const module3DragAndDropExercises: Exercise[] = [
  {
    id: 'm3-dnd-1',
    moduleId: 'mod-trilha3-0',
    title: 'Categorizando Tecnologias Assistivas',
    type: 'drag-and-drop',
    question: 'Arraste os exemplos de Tecnologia Assistiva para suas categorias corretas (Lição 3.6).',
    options: [
      { id: 'ta_ex1', text: 'Prancha de comunicação com símbolos' },
      { id: 'ta_ex2', text: 'Software leitor de tela' },
      { id: 'ta_ex3', text: 'Cadeira de rodas motorizada' },
      { id: 'ta_ex4', text: 'Bengala longa' },
      { id: 'ta_ex5', text: 'Teclado adaptado com colmeia' },
      { id: 'ta_ex6', text: 'Aplicativo de vocalização para tablet' },
    ],
    targetCategories: [
      { id: 'cat_caa', text: 'Comunicação Aumentativa e Alternativa (CAA)' },
      { id: 'cat_acess_comp', text: 'Acessibilidade ao Computador' },
      { id: 'cat_aux_mob', text: 'Auxílios de Mobilidade' },
      { id: 'cat_aux_dv', text: 'Auxílios para Deficiência Visual' },
    ],
    correctAnswer: {
      'ta_ex1': 'cat_caa',
      'ta_ex2': 'cat_acess_comp', // Ou poderia ser cat_aux_dv, mas é mais específico para computador
      'ta_ex3': 'cat_aux_mob',
      'ta_ex4': 'cat_aux_dv',
      'ta_ex5': 'cat_acess_comp',
      'ta_ex6': 'cat_caa',
    },
    feedback: 'Excelente categorização! As Tecnologias Assistivas são diversas e atendem a muitas necessidades, melhorando a autonomia e participação.',
    points: 20,
    estimatedTime: '3 mins'
  },
  {
    id: 'm3-dnd-2',
    moduleId: 'mod-trilha3-0',
    title: 'Inclusão Educacional: Barreiras vs. Facilitadores',
    type: 'drag-and-drop',
    question: 'Categorize os seguintes elementos como Barreiras ou Facilitadores para a Inclusão Educacional (Lição 3.4).',
    options: [
      { id: 'ie_opt1', text: 'Currículo inflexível e padronizado' },
      { id: 'ie_opt2', text: 'Atendimento Educacional Especializado (AEE)' },
      { id: 'ie_opt3', text: 'Falta de formação de professores para a diversidade' },
      { id: 'ie_opt4', text: 'Desenho Universal para a Aprendizagem (DUA)' },
      { id: 'ie_opt5', text: 'Materiais didáticos inacessíveis' },
      { id: 'ie_opt6', text: 'Trabalho colaborativo entre professores' },
    ],
    targetCategories: [
      { id: 'cat_barreiras_ie', text: 'Barreiras à Inclusão Educacional' },
      { id: 'cat_facilitadores_ie', text: 'Facilitadores da Inclusão Educacional' },
    ],
    correctAnswer: {
      'ie_opt1': 'cat_barreiras_ie',
      'ie_opt2': 'cat_facilitadores_ie',
      'ie_opt3': 'cat_barreiras_ie',
      'ie_opt4': 'cat_facilitadores_ie',
      'ie_opt5': 'cat_barreiras_ie',
      'ie_opt6': 'cat_facilitadores_ie',
    },
    feedback: 'Ótimo! Identificar barreiras e facilitadores é chave para promover uma educação verdadeiramente inclusiva e eficaz.',
    points: 20,
    estimatedTime: '3 mins'
  }
];
