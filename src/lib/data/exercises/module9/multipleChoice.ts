
import type { Exercise } from '@/lib/types';

export const module9MultipleChoiceExercises: Exercise[] = [
  {
    id: 'm9-e1',
    moduleId: 'mod-trilha9-0',
    title: 'Paradigmas da Deficiência: Institucionalização',
    type: 'multiple-choice',
    question: 'Qual era o foco principal do Paradigma da Institucionalização em relação às pessoas com deficiência?',
    options: [
      { id: 'opt1', text: 'Desenvolvimento de potencialidades e autonomia.' },
      { id: 'opt2', text: 'Cuidado custodial e proteção em ambientes segregados.' },
      { id: 'opt3', text: 'Inclusão social e laboral plena.' },
      { id: 'opt4', text: 'Adaptação da sociedade às necessidades individuais.' }
    ],
    correctAnswer: 'opt2',
    feedback: 'Correto! O Paradigma da Institucionalização focava no cuidado custodial, muitas vezes segregando as pessoas com deficiência.',
    points: 10,
    estimatedTime: '2 mins'
  },
  {
    id: 'm9-e3',
    moduleId: 'mod-trilha9-0',
    title: 'Lei de Cotas e Inclusão Laboral no Brasil',
    type: 'multiple-choice',
    question: 'A Lei de Cotas (Lei nº 8.213/1991) no Brasil exige que empresas com 100 ou mais empregados preencham uma porcentagem de seus cargos com pessoas com deficiência ou reabilitados. Essa porcentagem varia de:',
    options: [
      { id: 'cotas_opt1', text: '1% a 3%' },
      { id: 'cotas_opt2', text: '2% a 5%' },
      { id: 'cotas_opt3', text: '5% a 10%' },
      { id: 'cotas_opt4', text: '10% a 15%' }
    ],
    correctAnswer: 'cotas_opt2',
    feedback: 'Correto! A Lei de Cotas estabelece uma variação de 2% a 5%, dependendo do número total de empregados da empresa.',
    points: 10,
    estimatedTime: '2 mins'
  },
  {
    id: 'm9-e5',
    moduleId: 'mod-trilha9-0',
    title: 'Papel do Estado na Inclusão',
    type: 'multiple-choice',
    question: 'Qual NÃO é considerado um papel fundamental do Estado na promoção da inclusão de pessoas com deficiência?',
    options: [
      { id: 'est_opt1', text: 'Formulação e implementação de políticas públicas inclusivas.' },
      { id: 'est_opt2', text: 'Legislação e regulamentação para garantia de direitos e acessibilidade.' },
      { id: 'est_opt3', text: 'Prover cuidado direto e exclusivo a todas as pessoas com deficiência, substituindo o papel da família.' },
      { id: 'est_opt4', text: 'Fiscalização do cumprimento de leis e políticas e articulação intersetorial.' }
    ],
    correctAnswer: 'est_opt3',
    feedback: 'Correto! Embora o Estado deva garantir suportes, o cuidado direto e exclusivo não é seu papel principal, e a família tem um papel fundamental. O Estado deve criar condições para a inclusão em todos os âmbitos.',
    points: 10,
    estimatedTime: '2 mins',
  },
  {
    id: 'm9-e7',
    moduleId: 'mod-trilha9-0',
    title: 'Função do Atendimento Educacional Especializado (AEE)',
    type: 'multiple-choice',
    question: 'Qual é a principal função do Atendimento Educacional Especializado (AEE) no contexto da educação inclusiva brasileira?',
    options: [
      { id: 'opt1', text: 'Substituir a escolarização na classe comum para alunos com deficiência.' },
      { id: 'opt2', text: 'Oferecer reforço escolar para alunos com dificuldades de aprendizagem.' },
      { id: 'opt3', text: 'Identificar, elaborar e organizar recursos pedagógicos e de acessibilidade para eliminar barreiras à participação dos estudantes com deficiência.' },
      { id: 'opt4', text: 'Diagnosticar e medicar estudantes com transtornos de aprendizagem.' }
    ],
    correctAnswer: 'opt3',
    feedback: 'Correto! O AEE é complementar/suplementar e visa eliminar barreiras para a plena participação e aprendizagem.',
    points: 10,
    estimatedTime: '2 mins'
  },
  {
    id: 'm9-e8',
    moduleId: 'mod-trilha9-0',
    title: 'Conceito de Adaptações Razoáveis',
    type: 'multiple-choice',
    question: 'Na Lei Brasileira de Inclusão, o que são "adaptações razoáveis" no contexto laboral?',
    options: [
      { id: 'opt1', text: 'Grandes reformas estruturais que alteram completamente o ambiente de trabalho, independentemente do custo.' },
      { id: 'opt2', text: 'Modificações e ajustes necessários e adequados que não acarretem ônus desproporcional e indevido, para assegurar igualdade de oportunidades.' },
      { id: 'opt3', text: 'Apenas a compra de softwares caros para todos os funcionários.' },
      { id: 'opt4', text: 'Redução da jornada de trabalho com redução salarial proporcional para pessoas com deficiência.' }
    ],
    correctAnswer: 'opt2',
    feedback: 'Exato! Adaptações razoáveis são ajustes que não impõem ônus desproporcional e visam garantir a igualdade de oportunidades.',
    points: 10,
    estimatedTime: '2 mins'
  },
  {
    id: 'm9-e9',
    moduleId: 'mod-trilha9-0',
    title: 'Principal Desafio Atitudinal na Inclusão',
    type: 'multiple-choice',
    question: 'Segundo Omote (2018), qual tipo de barreira é frequentemente o mais significativo obstáculo à inclusão social de pessoas com deficiência?',
    options: [
      { id: 'opt1', text: 'Barreiras arquitetônicas.' },
      { id: 'opt2', text: 'Barreiras na comunicação.' },
      { id: 'opt3', text: 'Barreiras atitudinais (preconceitos, estereótipos).' },
      { id: 'opt4', text: 'Barreiras financeiras individuais.' }
    ],
    correctAnswer: 'opt3',
    feedback: 'Correto! As barreiras atitudinais, como preconceitos e estigmas, são apontadas como obstáculos centrais para a inclusão.',
    points: 10,
    estimatedTime: '2 mins'
  }
];
