
import type { Exercise } from '@/lib/types';

export const module4Exercises: Exercise[] = [
  {
    id: 'm4-e1',
    moduleId: 'mod-trilha4-0',
    title: 'Vygotsky e Compensação Social',
    type: 'multiple-choice',
    question: 'Na teoria de Vygotsky, o que é fundamental para o processo de "compensação social" da deficiência?',
    options: [
      { id: 'opt1', text: 'Isolamento para focar no desenvolvimento interno.' },
      { id: 'opt2', text: 'Mediação por instrumentos culturais e interações sociais.' },
      { id: 'opt3', text: 'Tratamento médico intensivo para eliminar a deficiência.' },
      { id: 'opt4', text: 'Aceitação passiva das limitações impostas pela deficiência.' }
    ],
    correctAnswer: 'opt2',
    feedback: 'Correto! Vygotsky enfatizava que a cultura e as interações sociais oferecem caminhos alternativos para o desenvolvimento.',
    points: 10,
    estimatedTime: '3 mins'
  },
  {
    id: 'm4-e2',
    moduleId: 'mod-trilha4-0',
    title: 'ABA e Comportamento',
    type: 'fill-in-the-blank',
    question: 'A Análise do Comportamento Aplicada (ABA) se baseia na ideia de que o comportamento é aprendido e pode ser modificado pela manipulação de ______.',
    options: [
      {id: 'aba_opt1', text: 'antecedentes e consequências'},
      {id: 'aba_opt2', text: 'processos inconscientes'},
      {id: 'aba_opt3', text: 'fatores exclusivamente genéticos'}
    ],
    correctAnswer: 'antecedentes e consequências',
    feedback: 'Exato! A ABA foca em como os antecedentes e as consequências moldam o comportamento.',
    points: 10,
    estimatedTime: '4 mins'
  },
  {
    id: 'm4-e3',
    moduleId: 'mod-trilha4-0',
    title: 'Sistemas de Bronfenbrenner',
    type: 'association',
    question: 'Associe os sistemas da Teoria Bioecológica de Bronfenbrenner (Coluna A) com suas descrições (Coluna B).',
    options: [
      { id: 'a1', text: 'Coluna A: Microssistema' }, { id: 'b1', text: 'Coluna B: Ambientes imediatos de interação face a face (ex: família, escola).' },
      { id: 'a2', text: 'Coluna A: Mesossistema' }, { id: 'b2', text: 'Coluna B: Interconexões entre dois ou mais microssistemas (ex: relação família-escola).' },
      { id: 'a3', text: 'Coluna A: Macrossistema' }, { id: 'b3', text: 'Coluna B: Padrões culturais mais amplos, valores e leis da sociedade.' },
      { id: 'a4', text: 'Coluna A: Cronossistema' }, { id: 'b4', text: 'Coluna B: Dimensão do tempo, incluindo mudanças ao longo da vida e históricas.' }
    ],
    correctAnswer: ["a1-b1", "a2-b2", "a3-b3", "a4-b4"],
    feedback: 'Perfeito! Entender esses sistemas ajuda a ver a pessoa em seu contexto completo.',
    points: 15,
    estimatedTime: '5 mins'
  },
  {
    id: 'm4-e4',
    moduleId: 'mod-trilha4-0',
    title: 'Modelo Social vs. Lesão e Deficiência',
    type: 'multiple-choice',
    question: 'No Modelo Social da Deficiência, a "deficiência" (disability) é primariamente causada por:',
    options: [
      { id: 'ms_opt1', text: 'Limitações inerentes à "lesão" (impairment) corporal do indivíduo.' },
      { id: 'ms_opt2', text: 'Barreiras sociais, atitudinais e ambientais que excluem pessoas com lesões.' },
      { id: 'ms_opt3', text: 'Falta de esforço individual para superar a lesão.' },
      { id: 'ms_opt4', text: 'Fatores genéticos e hereditários determinantes.' }
    ],
    correctAnswer: 'ms_opt2',
    feedback: 'Correto! O Modelo Social enfatiza que são as barreiras na sociedade que criam a deficiência.',
    points: 10,
    estimatedTime: '3 mins'
  },
  {
    id: 'm4-e5',
    moduleId: 'mod-trilha4-0',
    title: 'Neuroplasticidade e Intervenção',
    type: 'multiple-choice',
    question: 'O conceito de neuroplasticidade é fundamental para intervenções porque sugere que:',
    options: [
      { id: 'np_opt1', text: 'O cérebro é fixo e imutável após a primeira infância.' },
      { id: 'np_opt2', text: 'Apenas intervenções medicamentosas podem alterar o funcionamento cerebral.' },
      { id: 'np_opt3', text: 'O cérebro pode se reorganizar em resposta a experiências e treinamento, permitindo compensação funcional.' },
      { id: 'np_opt4', text: 'A genética determina 100% da capacidade cerebral, sem espaço para mudanças.' }
    ],
    correctAnswer: 'np_opt3',
    feedback: 'Exatamente! A neuroplasticidade é a base da aprendizagem e da reabilitação, mostrando que o cérebro pode se adaptar.',
    points: 10,
    estimatedTime: '4 mins'
  },
  {
    id: 'm4-e6',
    moduleId: 'mod-trilha4-0',
    title: 'Componentes da CIF',
    type: 'multiple-choice',
    question: 'Além das Funções e Estruturas do Corpo e Condições de Saúde, quais são os outros componentes principais da funcionalidade segundo a CIF?',
    options: [
      { id: 'cif_opt1', text: 'Diagnóstico Médico e Prognóstico Individual.' },
      { id: 'cif_opt2', text: 'Atividades, Participação e Fatores Contextuais (Ambientais e Pessoais).' },
      { id: 'cif_opt3', text: 'Nível Socioeconômico e Histórico Familiar apenas.' },
      { id: 'cif_opt4', text: 'Habilidades Inatas e Potencial Genético.' }
    ],
    correctAnswer: 'cif_opt2',
    feedback: 'Correto! A CIF tem uma visão abrangente, incluindo Atividades, Participação e a influência crucial dos Fatores Contextuais.',
    points: 15,
    estimatedTime: '5 mins'
  }
];
