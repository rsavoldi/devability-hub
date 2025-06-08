
import type { Exercise } from '@/lib/types';

export const module5DragAndDropExercises: Exercise[] = [
  {
    id: 'm5-e12',
    moduleId: 'mod-trilha5-0',
    title: 'Categorizando Funções Executivas',
    type: 'drag-and-drop',
    question: 'Arraste cada exemplo para a Função Executiva (FE) correspondente.',
    options: [
      { id: 'dd-opt1', text: 'Lembrar de uma lista de compras enquanto está no supermercado.' },
      { id: 'dd-opt2', text: 'Evitar dizer algo inadequado em uma reunião.' },
      { id: 'dd-opt3', text: 'Mudar de plano quando um imprevisto acontece.' },
      { id: 'dd-opt4', text: 'Seguir uma receita com vários passos.' },
      { id: 'dd-opt5', text: 'Não se distrair com o barulho da rua ao estudar.' },
      { id: 'dd-opt6', text: 'Pensar em diferentes soluções para um problema.' }
    ],
    targetCategories: [
      { id: 'cat-mt', text: 'Memória de Trabalho' },
      { id: 'cat-ci', text: 'Controle Inibitório' },
      { id: 'cat-fc', text: 'Flexibilidade Cognitiva' }
    ],
    correctAnswer: {
      'dd-opt1': 'cat-mt',
      'dd-opt2': 'cat-ci',
      'dd-opt3': 'cat-fc',
      'dd-opt4': 'cat-mt',
      'dd-opt5': 'cat-ci',
      'dd-opt6': 'cat-fc',
    },
    feedback: 'Ótima categorização! Memória de Trabalho: lista de compras, receita. Controle Inibitório: evitar dizer algo, não se distrair. Flexibilidade Cognitiva: mudar de plano, pensar em soluções diversas.',
    points: 20,
    estimatedTime: '4 mins'
  },
  {
    id: 'm5-e13',
    moduleId: 'mod-trilha5-0',
    title: 'Neuropsicologia da Deficiência: Avanços vs. Desafios',
    type: 'drag-and-drop',
    question: 'Categorize os seguintes itens como "Avanços em Neuropsicologia da Deficiência" ou "Desafios Éticos/Práticos Atuais".',
    options: [
      { id: 'item1', text: 'Uso de Neuroimagem Avançada para entender correlatos neurais.' },
      { id: 'item2', text: 'Lacuna entre pesquisa básica e aplicação prática (research-to-practice gap).' },
      { id: 'item3', text: 'Desenvolvimento de intervenções baseadas na neuroplasticidade.' },
      { id: 'item4', text: 'Necessidade de adaptação cultural de instrumentos de avaliação.' },
      { id: 'item5', text: 'Potencial da Inteligência Artificial para análise de dados e personalização.' },
      { id: 'item6', text: 'Questões éticas sobre privacidade de "neurodireitos" e uso de novas tecnologias.' }
    ],
    targetCategories: [
      { id: 'cat-avancos', text: 'Avanços em Neuropsicologia' },
      { id: 'cat-desafios', text: 'Desafios Éticos/Práticos' }
    ],
    correctAnswer: {
      'item1': 'cat-avancos',
      'item2': 'cat-desafios',
      'item3': 'cat-avancos',
      'item4': 'cat-desafios',
      'item5': 'cat-avancos',
      'item6': 'cat-desafios',
    },
    feedback: 'Excelente categorização! O campo da neuropsicologia da deficiência está repleto de avanços promissores, mas também enfrenta desafios importantes para uma aplicação ética e equitativa.',
    points: 20,
    estimatedTime: '3 mins'
  }
];
