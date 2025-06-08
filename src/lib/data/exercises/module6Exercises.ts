
import type { Exercise } from '@/lib/types';

export const module6Exercises: Exercise[] = [
  {
    id: 'm6-e1',
    moduleId: 'mod-trilha6-0',
    title: 'Evolução da Avaliação Psicológica',
    type: 'multiple-choice',
    question: 'Qual política brasileira marcou uma mudança para uma avaliação mais contextualizada da pessoa com deficiência, considerando barreiras ambientais?',
    options: [
      { id: 'opt1', text: 'A Lei de Diretrizes e Bases da Educação de 1961.' },
      { id: 'opt2', text: 'O Código de Ética do Psicólogo de 1987.' },
      { id: 'opt3', text: 'A Política Nacional de Educação Especial na Perspectiva da Educação Inclusiva (2008).' },
      { id: 'opt4', text: 'O Estatuto da Criança e do Adolescente (1990).' }
    ],
    correctAnswer: 'opt3',
    feedback: 'Correto! A Política de 2008 enfatizou uma avaliação que considera a interação do indivíduo com as barreiras, superando o foco apenas no déficit.',
    points: 10,
    estimatedTime: '3 mins'
  },
  {
    id: 'm6-e2',
    moduleId: 'mod-trilha6-0',
    title: 'Modelos de Avaliação',
    type: 'association',
    question: 'Associe os modelos de avaliação psicológica (Coluna A) com suas características principais (Coluna B).',
    options: [
      { id: 'a1', text: 'Coluna A: Modelo Psicométrico' }, { id: 'b1', text: 'Coluna B: Ênfase na mensuração objetiva com instrumentos padronizados e normatizados.' },
      { id: 'a2', text: 'Coluna A: Modelo Funcional (CIF)' }, { id: 'b2', text: 'Coluna B: Avalia atividades, participação e interação com fatores contextuais.' },
      { id: 'a3', text: 'Coluna A: Modelo Ecológico' }, { id: 'b3', text: 'Coluna B: Analisa a pessoa em interação com múltiplos sistemas ambientais (micro, meso, exo, macro).' },
    ],
    correctAnswer: ["a1-b1", "a2-b2", "a3-b3"],
    feedback: 'Excelentes associações! Cada modelo oferece uma perspectiva valiosa para a avaliação.',
    points: 15,
    estimatedTime: '5 mins'
  },
  {
    id: 'm6-e3',
    moduleId: 'mod-trilha6-0',
    title: 'Instrumentos de Avaliação',
    type: 'multiple-choice',
    question: 'Qual tipo de instrumento é essencial para o diagnóstico de Deficiência Intelectual, além da avaliação do funcionamento intelectual?',
    options: [
      { id: 'opt1', text: 'Testes projetivos de personalidade.' },
      { id: 'opt2', text: 'Escalas de comportamento adaptativo.' },
      { id: 'opt3', text: 'Inventários de interesse vocacional.' },
      { id: 'opt4', text: 'Questionários de autoeficácia.' }
    ],
    correctAnswer: 'opt2',
    feedback: 'Correto! Segundo a AAIDD, a avaliação do comportamento adaptativo é crucial para o diagnóstico de DI.',
    points: 10,
    estimatedTime: '4 mins'
  },
  {
    id: 'm6-e4',
    moduleId: 'mod-trilha6-0',
    title: 'Avaliação de Pessoas com TEA',
    type: 'fill-in-the-blank',
    question: 'Na avaliação de pessoas com TEA, é importante usar uma abordagem _______, considerando particularidades sensoriais e múltiplas fontes de informação.',
    options: [
      { id: 'tea_opt1', text: 'flexível' },
      { id: 'tea_opt2', text: 'rígida' },
      { id: 'tea_opt3', text: 'acelerada' }
    ],
    correctAnswer: 'flexível',
    feedback: 'Exato! A flexibilidade e a consideração das características individuais do TEA são chave na avaliação.',
    points: 10,
    estimatedTime: '3 mins'
  },
  {
    id: 'm6-e5',
    moduleId: 'mod-trilha6-0',
    title: 'Comunicação de Resultados do Psicodiagnóstico',
    type: 'multiple-choice',
    question: 'Ao comunicar os resultados de um psicodiagnóstico de uma pessoa com deficiência, o que o psicólogo deve priorizar?',
    options: [
      { id: 'opt1', text: 'Apenas a classificação diagnóstica e o escore do QI.' },
      { id: 'opt2', text: 'Uma linguagem técnica e complexa para demonstrar expertise.' },
      { id: 'opt3', text: 'Uma compreensão contextualizada, focando em potencialidades, necessidades de suporte e orientações práticas.' },
      { id: 'opt4', text: 'Limitar a informação apenas aos familiares, excluindo a pessoa avaliada.' }
    ],
    correctAnswer: 'opt3',
    feedback: 'Correto! A comunicação deve ser clara, respeitosa, acessível e construtiva, indo além de rótulos.',
    points: 10,
    estimatedTime: '4 mins'
  },
  {
    id: 'm6-e6',
    moduleId: 'mod-trilha6-0',
    title: 'Princípio Ético na Avaliação',
    type: 'multiple-choice',
    question: 'Qual princípio ético fundamental implica que o psicólogo deve obter consentimento informado, garantir privacidade e respeitar a autonomia da pessoa com deficiência durante a avaliação?',
    options: [
      { id: 'opt1', text: 'Princípio da Beneficência (fazer o bem).' },
      { id: 'opt2', text: 'Princípio da Justiça (equidade).' },
      { id: 'opt3', text: 'Princípio do Respeito à Dignidade e Direitos da Pessoa.' },
      { id: 'opt4', text: 'Princípio da Competência Profissional.' }
    ],
    correctAnswer: 'opt3',
    feedback: 'Exatamente! O respeito à dignidade, autonomia e direitos é central na prática ética com pessoas com deficiência.',
    points: 10,
    estimatedTime: '3 mins'
  }
];
