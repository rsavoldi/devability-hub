
import type { Exercise } from '@/lib/types';

export const module8FillInTheBlankExercises: Exercise[] = [
  {
    id: 'm8-e2',
    moduleId: 'mod-trilha8-0',
    title: 'Dilema na Avaliação: Instrumentos',
    type: 'fill-in-the-blank',
    question: 'Um dilema ético na avaliação psicológica de pessoas com deficiência é o uso de instrumentos não validados para essa população, o que pode levar a interpretações inadequadas ou _____.',
    options: [
      { id: 'dilema_opt1', text: 'rotulações estigmatizantes' },
      { id: 'dilema_opt2', text: 'diagnósticos precisos sempre' },
      { id: 'dilema_opt3', text: 'resultados facilmente generalizáveis' }
    ],
    correctAnswer: 'rotulações estigmatizantes',
    feedback: 'Exato! O uso de instrumentos não validados ou mal adaptados pode resultar em rotulações e subestimação de capacidades.',
    points: 10,
    estimatedTime: '2 mins'
  },
  {
    id: 'm8-e5',
    moduleId: 'mod-trilha8-0',
    title: 'Pesquisa Emancipatória',
    type: 'fill-in-the-blank',
    question: 'O lema "Nada sobre nós, sem nós" é central para a pesquisa ______, que valoriza o protagonismo das pessoas com deficiência na produção de conhecimento.',
    options: [
      { id: 'pesq_opt1', text: 'emancipatória (ou participativa)' },
      { id: 'pesq_opt2', text: 'experimental controlada' },
      { id: 'pesq_opt3', text: 'quantitativa longitudinal' }
    ],
    correctAnswer: 'emancipatória (ou participativa)',
    feedback: 'Exato! A pesquisa emancipatória busca transformar as relações de poder na pesquisa, envolvendo as pessoas com deficiência como colaboradoras ativas.',
    points: 10,
    estimatedTime: '2 mins'
  }
];
