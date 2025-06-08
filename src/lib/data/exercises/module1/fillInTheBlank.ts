
import type { Exercise } from '@/lib/types';

export const module1FillInTheBlankExercises: Exercise[] = [
  {
    id: 'm1-e1.1.5',
    moduleId: 'mod-trilha1-0',
    title: 'Definição de Pessoa com Deficiência (LBI)',
    type: 'fill-in-the-blank',
    question: 'A Lei Brasileira de Inclusão define pessoa com deficiência como aquela que tem impedimento de longo prazo de natureza física, mental, intelectual ou sensorial, o qual, em interação com uma ou mais ______, pode obstruir sua participação plena.',
    options: [
      { id: 'lbi_opt1', text: 'barreiras' },
      { id: 'lbi_opt2', text: 'facilidades' },
      { id: 'lbi_opt3', text: 'oportunidades' },
    ],
    correctAnswer: 'barreiras',
    feedback: 'Correto! A LBI enfatiza a interação com barreiras.',
    points: 10,
    estimatedTime: '2 mins',
  },
  {
    id: 'm1-e1.2.5',
    moduleId: 'mod-trilha1-0',
    title: 'Orientação e Mobilidade (O&M)',
    type: 'fill-in-the-blank',
    question: 'A técnica de O&M que envolve o uso de um instrumento para detectar obstáculos e informações táteis do ambiente para pessoas com deficiência visual é o uso da _______.',
    options: [
        {id: 'om_opt1', text: 'bengala longa'},
        {id: 'om_opt2', text: 'lente de aumento'},
        {id: 'om_opt3', text: 'cão-guia'}
    ],
    correctAnswer: 'bengala longa',
    feedback: 'Correto! A bengala longa é uma ferramenta essencial na Orientação e Mobilidade.',
    points: 10,
    estimatedTime: '2 mins'
  },
  {
    id: 'm1-e1.3.5',
    moduleId: 'mod-trilha1-0',
    title: 'Dislexia',
    type: 'fill-in-the-blank',
    question: 'A ______ é um transtorno específico de aprendizagem que afeta principalmente a leitura e escrita.',
    options: [
      {id: 'dd_opt1a', text: 'Dislexia'},
      {id: 'dd_opt2a', text: 'Discalculia'},
      {id: 'dd_opt3a', text: 'Disgrafia'},
    ],
    correctAnswer: 'Dislexia',
    feedback: 'Correto! Dislexia refere-se a dificuldades na leitura/escrita.',
    points: 10,
    estimatedTime: '2 mins'
  },
  {
    id: 'm1-e1.4.5',
    moduleId: 'mod-trilha1-0',
    title: 'Identidade e Cultura Surda',
    type: 'fill-in-the-blank',
    question: 'Para crianças e adolescentes surdos, o acesso à ______ é um fator importante para a construção de uma identidade positiva e senso de comunidade.',
    options: [
        {id: 'cs_opt1', text: 'cultura surda'},
        {id: 'cs_opt2', text: 'terapia da fala intensiva'},
        {id: 'cs_opt3', text: 'música clássica'}
    ],
    correctAnswer: 'cultura surda',
    feedback: 'Correto! A cultura surda, incluindo a língua de sinais e as experiências compartilhadas, é vital para a identidade de muitas pessoas surdas.',
    points: 10,
    estimatedTime: '2 mins'
  },
  {
    id: 'm1-e1.5.2',
    moduleId: 'mod-trilha1-0',
    title: 'Zona de Desenvolvimento Proximal (ZDP)',
    type: 'fill-in-the-blank',
    question: 'O conceito de ZDP de Vygotsky refere-se à distância entre o nível de desenvolvimento real da criança e seu nível de desenvolvimento _______, alcançável com suporte.',
    options: [
        {id: 'zdp_opt1', text: 'potencial'},
        {id: 'zdp_opt2', text: 'limitado'},
        {id: 'zdp_opt3', text: 'inato'}
    ],
    correctAnswer: 'potencial',
    feedback: 'Correto! A ZDP destaca o potencial de aprendizagem da criança com a mediação adequada.',
    points: 10,
    estimatedTime: '2 mins'
  },
  {
    id: 'm1-e1.6.2',
    moduleId: 'mod-trilha1-0',
    title: 'Desenvolvimento Motor na Deficiência Auditiva',
    type: 'fill-in-the-blank',
    question: 'Crianças com deficiência auditiva podem apresentar desafios no ______, especialmente se o sistema vestibular for afetado.',
    options: [
      {id: 'da_opt1', text: 'equilíbrio'},
      {id: 'da_opt2', text: 'força'},
      {id: 'da_opt3', text: 'flexibilidade'}
    ],
    correctAnswer: 'equilíbrio',
    feedback: 'Exato! O equilíbrio pode ser afetado em algumas crianças com deficiência auditiva, dependendo da causa e extensão da perda.',
    points: 10,
    estimatedTime: '2 mins'
  }
];
