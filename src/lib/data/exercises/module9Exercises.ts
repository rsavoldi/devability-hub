
import type { Exercise } from '@/lib/types';

export const module9Exercises: Exercise[] = [
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
    estimatedTime: '3 mins'
  },
  {
    id: 'm9-e2',
    moduleId: 'mod-trilha9-0',
    title: 'Declaração de Salamanca e Inclusão Educacional',
    type: 'fill-in-the-blank',
    question: 'A Declaração de Salamanca (1994) proclamou que escolas regulares com orientação ______ são os meios mais eficazes de combater atitudes discriminatórias.',
    options: [
      { id: 'salam_opt1', text: 'inclusiva' },
      { id: 'salam_opt2', text: 'especializada' },
      { id: 'salam_opt3', text: 'competitiva' }
    ],
    correctAnswer: 'inclusiva',
    feedback: 'Exato! A Declaração de Salamanca é um marco para a educação inclusiva.',
    points: 10,
    estimatedTime: '3 mins'
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
    estimatedTime: '3 mins'
  },
  {
    id: 'm9-e4',
    moduleId: 'mod-trilha9-0',
    title: 'Acessibilidade e LBI',
    type: 'association',
    question: 'Associe os tipos de acessibilidade (Coluna A) com suas descrições conforme a Lei Brasileira de Inclusão (Coluna B).',
    options: [
      { id: 'a1', text: 'Coluna A: Acessibilidade Arquitetônica' }, { id: 'b1', text: 'Coluna B: Eliminação de barreiras em edificações, espaços e mobiliários.' },
      { id: 'a2', text: 'Coluna A: Acessibilidade Comunicacional' }, { id: 'b2', text: 'Coluna B: Eliminação de barreiras na comunicação interpessoal, escrita e digital (ex: Libras, Braille, legendas).' },
      { id: 'a3', text: 'Coluna A: Acessibilidade Atitudinal' }, { id: 'b3', text: 'Coluna B: Eliminação de preconceitos, estereótipos e discriminações.' },
    ],
    correctAnswer: ["a1-b1", "a2-b2", "a3-b3"],
    feedback: 'Boas associações! A LBI aborda a acessibilidade de forma ampla.',
    points: 15,
    estimatedTime: '5 mins'
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
    estimatedTime: '4 mins'
  },
  {
    id: 'm9-e6',
    moduleId: 'mod-trilha9-0',
    title: 'Desafios Futuros para a Inclusão',
    type: 'fill-in-the-blank',
    question: 'Um dos grandes desafios para a inclusão efetiva é superar as ______ atitudinais, como preconceitos e estereótipos, que muitas vezes são mais difíceis de modificar do que as físicas.',
    options: [
      { id: 'des_opt1', text: 'barreiras' },
      { id: 'des_opt2', text: 'facilidades' },
      { id: 'des_opt3', text: 'oportunidades' }
    ],
    correctAnswer: 'barreiras',
    feedback: 'Exato! As barreiras atitudinais são obstáculos significativos e persistentes para a inclusão plena.',
    points: 10,
    estimatedTime: '3 mins'
  }
];

    