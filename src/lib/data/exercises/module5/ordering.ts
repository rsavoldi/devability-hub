
import type { Exercise } from '@/lib/types';

export const module5OrderingExercises: Exercise[] = [
  {
    id: 'm5-e11',
    moduleId: 'mod-trilha5-0',
    title: 'Etapas da Avaliação Neuropsicológica',
    type: 'ordering',
    question: 'Ordene as seguintes etapas de um processo de Avaliação Neuropsicológica (simplificado):',
    options: [
      { id: 'opt1', text: 'Coleta de dados (aplicação de testes e técnicas)' },
      { id: 'opt2', text: 'Análise e integração dos resultados' },
      { id: 'opt3', text: 'Entrevista inicial (Anamnese) e levantamento de hipóteses' },
      { id: 'opt4', text: 'Devolutiva e elaboração do laudo/relatório' }
    ],
    correctAnswer: ['opt3', 'opt1', 'opt2', 'opt4'],
    feedback: 'Correto! A sequência geralmente envolve: anamnese/hipóteses, coleta de dados, análise/integração, e por fim a devolutiva/laudo.',
    points: 15,
    estimatedTime: '3 mins'
  }
];
