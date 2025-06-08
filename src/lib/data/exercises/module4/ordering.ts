
import type { Exercise } from '@/lib/types';

export const module4OrderingExercises: Exercise[] = [
  {
    id: 'm4-e11',
    moduleId: 'mod-trilha4-0',
    title: 'Estágios Psicossociais de Erikson (Simplificado)',
    type: 'ordering',
    question: 'Ordene os seguintes estágios psicossociais de Erik Erikson em uma sequência de desenvolvimento aproximada (da infância à velhice):',
    options: [
      { id: 'erik_opt2', text: 'Identidade vs. Confusão de Papéis (Adolescência)' },
      { id: 'erik_opt1', text: 'Confiança vs. Desconfiança (Primeira Infância)' },
      { id: 'erik_opt4', text: 'Integridade vs. Desespero (Velhice)' },
      { id: 'erik_opt3', text: 'Intimidade vs. Isolamento (Jovem Adulto)' },
    ],
    correctAnswer: ['erik_opt1', 'erik_opt2', 'erik_opt3', 'erik_opt4'],
    feedback: 'Correto! Esta é uma sequência geral dos estágios de Erikson, cada um com seu desafio psicossocial específico.',
    points: 15,
    estimatedTime: '3 mins'
  },
  {
    id: 'm4-e12',
    moduleId: 'mod-trilha4-0',
    title: 'Componentes da CIF (Hierarquia Simplificada)',
    type: 'ordering',
    question: 'Ordene os componentes da CIF, do mais individual/biológico para o mais contextual/social, em uma hierarquia simplificada:',
    options: [
      { id: 'cif_ord3', text: 'Atividades e Participação' },
      { id: 'cif_ord1', text: 'Condição de Saúde (Transtorno/Doença)' },
      { id: 'cif_ord4', text: 'Fatores Contextuais (Ambientais e Pessoais)' },
      { id: 'cif_ord2', text: 'Funções e Estruturas do Corpo' },
    ],
    // Nota: A CIF é interativa, não estritamente hierárquica, mas para o exercício, esta ordem representa um fluxo comum de análise.
    correctAnswer: ['cif_ord1', 'cif_ord2', 'cif_ord3', 'cif_ord4'],
    feedback: 'Boa ordenação! A CIF analisa como a condição de saúde e as funções/estruturas do corpo interagem com atividades, participação e fatores contextuais para definir a funcionalidade.',
    points: 15,
    estimatedTime: '3 mins'
  }
];
