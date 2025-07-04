
import type { Exercise } from '@/lib/types';

export const module4MultipleChoiceExercises: Exercise[] = [
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
    estimatedTime: '2 mins'
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
    estimatedTime: '2 mins'
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
    estimatedTime: '2 mins',
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
    estimatedTime: '2 mins',
  },
  {
    id: 'm4-e7',
    moduleId: 'mod-trilha4-0',
    title: 'Teoria da Autodeterminação (SDT)',
    type: 'multiple-choice',
    question: 'Quais são as três necessidades psicológicas básicas inatas segundo a Teoria da Autodeterminação de Deci e Ryan?',
    options: [
      { id: 'sdt_opt1', text: 'Segurança, Estabilidade e Riqueza.' },
      { id: 'sdt_opt2', text: 'Autonomia, Competência e Relacionamento (Pertencimento).' },
      { id: 'sdt_opt3', text: 'Poder, Realização e Afiliação.' },
      { id: 'sdt_opt4', text: 'Conhecimento, Habilidade e Reconhecimento.' }
    ],
    correctAnswer: 'sdt_opt2',
    feedback: 'Correto! Autonomia, Competência e Relacionamento são as três necessidades psicológicas básicas fundamentais na SDT.',
    points: 10,
    estimatedTime: '2 mins'
  },
  {
    id: 'm4-e8',
    moduleId: 'mod-trilha4-0',
    title: 'Teoria Crip e Normalidade',
    type: 'multiple-choice',
    question: 'A Teoria Crip, dentro das perspectivas críticas da deficiência, questiona principalmente qual conceito social?',
    options: [
      { id: 'crip_opt1', text: 'A importância da reabilitação médica.' },
      { id: 'crip_opt2', text: 'A ideia de "normalidade compulsória" e o padrão de um corpo/mente "normal".' },
      { id: 'crip_opt3', text: 'A necessidade de tecnologias assistivas.' },
      { id: 'crip_opt4', text: 'O papel da família no suporte à pessoa com deficiência.' }
    ],
    correctAnswer: 'crip_opt2',
    feedback: 'Exatamente! A Teoria Crip desafia a noção de um corpo/mente "normal" como padrão universal e desejável, criticando a "normalidade compulsória".',
    points: 10,
    estimatedTime: '2 mins',
  }
];
