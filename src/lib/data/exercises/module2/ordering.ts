
import type { Exercise } from '@/lib/types';

export const module2OrderingExercises: Exercise[] = [
  {
    id: 'm2-e10',
    moduleId: 'mod-trilha2-0',
    title: 'Fases da Adaptação Psicossocial à Deficiência Adquirida',
    type: 'ordering',
    question: 'Ordene as fases do processo de adaptação psicossocial à deficiência adquirida na meia-idade, conforme mencionado na Lição 2.5 (Livneh & Antonak, 2005):',
    options: [
      { id: 'adapt_opt2', text: 'Negação' },
      { id: 'adapt_opt1', text: 'Choque' },
      { id: 'adapt_opt4', text: 'Depressão' },
      { id: 'adapt_opt3', text: 'Raiva' },
      { id: 'adapt_opt5', text: 'Aceitação e Ajustamento' },
    ],
    correctAnswer: ['adapt_opt1', 'adapt_opt2', 'adapt_opt3', 'adapt_opt4', 'adapt_opt5'],
    feedback: 'Correto! A sequência típica, embora não linear para todos, geralmente envolve Choque, Negação, Raiva, Depressão e, por fim, Aceitação e Ajustamento.',
    points: 15,
    estimatedTime: '3 mins'
  },
  {
    id: 'm2-e14', // Novo ID
    moduleId: 'mod-trilha2-0',
    title: 'Pilares do Envelhecimento Ativo (OMS)',
    type: 'ordering',
    question: 'Ordene os quatro pilares do Envelhecimento Ativo, conforme definidos e ampliados pela OMS (Lição 2.8), em qualquer ordem que faça sentido para memorização (a ordem de apresentação no texto pode variar, mas todos são importantes).',
    options: [
      { id: 'ea_opt_b', text: 'Participação' },
      { id: 'ea_opt_a', text: 'Saúde' },
      { id: 'ea_opt_d', text: 'Aprendizagem ao Longo da Vida' },
      { id: 'ea_opt_c', text: 'Segurança' },
    ],
    // A ordem correta não é estritamente sequencial na teoria, mas para o exercício, vamos usar a ordem da lição
    correctAnswer: ['ea_opt_a', 'ea_opt_b', 'ea_opt_c', 'ea_opt_d'], 
    feedback: 'Excelente! Saúde, Participação, Segurança e Aprendizagem ao Longo da Vida são os pilares do Envelhecimento Ativo. A ordem exata de listagem pode variar, mas todos são cruciais.',
    points: 15,
    estimatedTime: '3 mins'
  }
];
