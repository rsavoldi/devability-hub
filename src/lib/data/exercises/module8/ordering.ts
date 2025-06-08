
import type { Exercise } from '@/lib/types';

export const module8OrderingExercises: Exercise[] = [
  {
    id: 'm8-e11',
    moduleId: 'mod-trilha8-0',
    title: 'Passos para Tomada de Decisão Ética (Simplificado)',
    type: 'ordering',
    question: 'Ordene os seguintes passos para uma tomada de decisão ética em uma situação profissional complexa envolvendo uma pessoa com deficiência (adaptado de Beauchamp & Childress):',
    options: [
      { id: 'tde_opt2', text: 'Identificar os princípios éticos relevantes e possíveis conflitos entre eles.' },
      { id: 'tde_opt1', text: 'Reunir todos os fatos relevantes da situação.' },
      { id: 'tde_opt4', text: 'Tomar uma decisão e justificar a escolha.' },
      { id: 'tde_opt3', text: 'Explorar diferentes cursos de ação e suas potenciais consequências.' },
      { id: 'tde_opt5', text: 'Refletir sobre a decisão e suas implicações após a implementação (se aplicável).' }
    ],
    correctAnswer: ['tde_opt1', 'tde_opt2', 'tde_opt3', 'tde_opt4', 'tde_opt5'],
    feedback: 'Excelente! Uma abordagem sistemática ajuda na tomada de decisões éticas complexas.',
    points: 15,
    estimatedTime: '3 mins'
  },
  {
    id: 'm8-e12',
    moduleId: 'mod-trilha8-0',
    title: 'Níveis de Participação em Pesquisa Emancipatória (Simplificado)',
    type: 'ordering',
    question: 'Ordene os seguintes níveis de participação de pessoas com deficiência em pesquisas, do menos para o mais emancipatório/protagonista:',
    options: [
      { id: 'pesq_part2', text: 'Ser consultado sobre temas ou métodos de pesquisa.' },
      { id: 'pesq_part1', text: 'Ser apenas sujeito/fonte de dados da pesquisa.' },
      { id: 'pesq_part4', text: 'Liderar e controlar todo o processo de pesquisa.' },
      { id: 'pesq_part3', text: 'Atuar como co-pesquisador em colaboração com acadêmicos.' }
    ],
    correctAnswer: ['pesq_part1', 'pesq_part2', 'pesq_part3', 'pesq_part4'],
    feedback: 'Correto! A pesquisa emancipatória busca mover a participação para níveis mais colaborativos e de liderança.',
    points: 15,
    estimatedTime: '3 mins'
  }
];
