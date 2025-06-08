
import type { Exercise } from '@/lib/types';

export const module6MultipleChoiceExercises: Exercise[] = [
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
    estimatedTime: '2 mins'
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
    estimatedTime: '2 mins',
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
    estimatedTime: '2 mins',
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
    estimatedTime: '2 mins'
  },
  {
    id: 'm6-e7',
    moduleId: 'mod-trilha6-0',
    title: 'Entrevista Psicológica na Avaliação',
    type: 'multiple-choice',
    question: 'Na avaliação psicológica da pessoa com deficiência, qual é uma adaptação importante ao conduzir uma entrevista psicológica, especialmente se houver dificuldades de comunicação?',
    options: [
        { id: 'opt1', text: 'Falar mais alto e rapidamente para economizar tempo.' },
        { id: 'opt2', text: 'Utilizar recursos visuais, linguagem simplificada ou intérpretes de Libras, conforme necessário.' },
        { id: 'opt3', text: 'Focar apenas nas respostas dos familiares, ignorando a pessoa avaliada.' },
        { id: 'opt4', text: 'Aplicar um questionário padronizado em vez de uma entrevista aberta.' }
    ],
    correctAnswer: 'opt2',
    feedback: 'Correto! Adaptar a comunicação é essencial para garantir que a pessoa com deficiência possa participar plenamente da entrevista.',
    points: 10,
    estimatedTime: '2 mins'
  },
  {
    id: 'm6-e8',
    moduleId: 'mod-trilha6-0',
    title: 'Avaliação de Deficiência Intelectual (DI)',
    type: 'multiple-choice',
    question: 'Segundo a AAIDD (2010), o diagnóstico de Deficiência Intelectual requer limitações significativas em quais áreas, além do funcionamento intelectual?',
    options: [
        { id: 'opt1', text: 'Apenas no desempenho acadêmico.' },
        { id: 'opt2', text: 'No comportamento adaptativo (habilidades práticas, sociais e conceituais).' },
        { id: 'opt3', text: 'Apenas em habilidades motoras finas.' },
        { id: 'opt4', text: 'Na capacidade de socialização com pares da mesma idade.' }
    ],
    correctAnswer: 'opt2',
    feedback: 'Correto! O diagnóstico de DI considera tanto o funcionamento intelectual quanto o comportamento adaptativo.',
    points: 10,
    estimatedTime: '2 mins'
  }
];
