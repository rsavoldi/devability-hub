
import type { Exercise } from '@/lib/types';

export const module6OrderingExercises: Exercise[] = [
  {
    id: 'm6-e11',
    moduleId: 'mod-trilha6-0',
    title: 'Etapas do Psicodiagnóstico',
    type: 'ordering',
    question: 'Ordene as seguintes etapas gerais de um processo de psicodiagnóstico (simplificado):',
    options: [
        { id: 'etapa2', text: 'Levantamento de hipóteses e escolha de instrumentos.' },
        { id: 'etapa1', text: 'Entrevista inicial e coleta de história.' },
        { id: 'etapa4', text: 'Análise, integração dos dados e elaboração de inferências.' },
        { id: 'etapa3', text: 'Aplicação de técnicas e testes.' },
        { id: 'etapa5', text: 'Comunicação dos resultados (devolutiva).' }
    ],
    correctAnswer: ['etapa1', 'etapa2', 'etapa3', 'etapa4', 'etapa5'],
    feedback: 'Ótima sequência! Essas são as etapas macro de um processo de psicodiagnóstico bem conduzido.',
    points: 15,
    estimatedTime: '3 mins'
  },
  {
    id: 'm6-e12',
    moduleId: 'mod-trilha6-0',
    title: 'Evolução da Avaliação Psicológica na Deficiência',
    type: 'ordering',
    question: 'Ordene as abordagens da avaliação psicológica na deficiência da mais antiga/tradicional para a mais contemporânea/contextualizada:',
    options: [
        { id: 'evol2', text: 'Avaliação focada na identificação de déficits para fins de classificação e segregação (ex: testes de QI iniciais).' },
        { id: 'evol3', text: 'Avaliação funcional e contextualizada (CIF), considerando interação indivíduo-ambiente e necessidades de suporte.' },
        { id: 'evol1', text: 'Abordagens qualitativas e clínicas, buscando compreensão aprofundada, mas ainda com foco no indivíduo.' }
    ],
    correctAnswer: ['evol2', 'evol1', 'evol3'],
    feedback: 'Correto! A avaliação evoluiu de um foco em déficits para abordagens mais compreensivas, funcionais e contextuais.',
    points: 15,
    estimatedTime: '3 mins'
  }
];
