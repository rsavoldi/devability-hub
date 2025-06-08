
import type { Exercise } from '@/lib/types';

export const module12FillInTheBlankExercises: Exercise[] = [
  {
    id: 'm12-e2',
    moduleId: 'mod-trilha12-0',
    title: 'Capacidade Intrínseca vs. Funcional',
    type: 'fill-in-the-blank',
    question: 'Segundo a OMS, a ______ refere-se ao conjunto de todas as capacidades físicas e mentais de um indivíduo, enquanto a capacidade funcional é o que ele consegue realizar em seu ambiente.',
    options: [
      { id: 'cap_opt1', text: 'capacidade intrínseca' },
      { id: 'cap_opt2', text: 'reserva fisiológica' },
      { id: 'cap_opt3', text: 'vitalidade percebida' }
    ],
    correctAnswer: 'capacidade intrínseca',
    feedback: 'Exato! A capacidade funcional depende da interação da capacidade intrínseca com o ambiente.',
    points: 10,
    estimatedTime: '2 mins'
  },
  {
    id: 'm12-e5',
    moduleId: 'mod-trilha12-0',
    title: 'Cuidados de Longa Duração (CLD)',
    type: 'fill-in-the-blank',
    question: 'No Brasil, a principal fonte de Cuidados de Longa Duração para idosos com limitações funcionais são os cuidados ______, majoritariamente prestados por mulheres da família.',
    options: [
      { id: 'cld_opt1', text: 'informais' },
      { id: 'cld_opt2', text: 'institucionais públicos' },
      { id: 'cld_opt3', text: 'formais domiciliares privados' }
    ],
    correctAnswer: 'informais',
    feedback: 'Exato! Os cuidados informais familiares, especialmente por mulheres, são predominantes no Brasil.',
    points: 10,
    estimatedTime: '2 mins'
  },
];
