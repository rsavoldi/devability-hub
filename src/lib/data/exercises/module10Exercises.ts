
import type { Exercise } from '@/lib/types';

export const module10Exercises: Exercise[] = [
  {
    id: 'm10-e1',
    moduleId: 'mod-trilha10-0',
    title: 'Princípios do Desenho Universal',
    type: 'multiple-choice',
    question: 'Qual dos seguintes NÃO é um dos sete princípios do Desenho Universal?',
    options: [
      { id: 'opt1', text: 'Uso Equitativo' },
      { id: 'opt2', text: 'Flexibilidade no Uso' },
      { id: 'opt3', text: 'Design de Luxo e Exclusividade' },
      { id: 'opt4', text: 'Tolerância ao Erro' }
    ],
    correctAnswer: 'opt3',
    feedback: 'Correto! O Desenho Universal busca inclusão e acessibilidade para todos, não luxo ou exclusividade. Os outros são princípios do DU.',
    points: 10,
    estimatedTime: '3 mins'
  },
  {
    id: 'm10-e2',
    moduleId: 'mod-trilha10-0',
    title: 'Conceito de Neurodiversidade',
    type: 'fill-in-the-blank',
    question: 'A perspectiva da neurodiversidade propõe que condições como autismo e TDAH representam variações ______ do cérebro humano, e não necessariamente patologias.',
    options: [
      { id: 'neuro_opt1', text: 'naturais' },
      { id: 'neuro_opt2', text: 'defeituosas' },
      { id: 'neuro_opt3', text: 'adquiridas' }
    ],
    correctAnswer: 'naturais',
    feedback: 'Exato! A neurodiversidade encara essas variações como parte da diversidade humana natural.',
    points: 10,
    estimatedTime: '3 mins'
  },
  {
    id: 'm10-e3',
    moduleId: 'mod-trilha10-0',
    title: 'Tecnologia Assistiva vs. Desenho Universal',
    type: 'association',
    question: 'Associe os conceitos (Coluna A) com suas definições/objetivos principais (Coluna B).',
    options: [
      { id: 'a1', text: 'Coluna A: Desenho Universal (DU)' }, { id: 'b1', text: 'Coluna B: Cria produtos e ambientes utilizáveis por todas as pessoas, na maior extensão possível, sem necessidade de adaptação.' },
      { id: 'a2', text: 'Coluna A: Tecnologia Assistiva (TA)' }, { id: 'b2', text: 'Coluna B: Oferece soluções específicas para necessidades particulares que não podem ser completamente atendidas pelo DU.' },
      { id: 'a3', text: 'Coluna A: WCAG' }, { id: 'b3', text: 'Coluna B: Diretrizes de acessibilidade para conteúdo web, um exemplo de aplicação de princípios de DU na tecnologia.' },
    ],
    correctAnswer: ["a1-b1", "a2-b2", "a3-b3"],
    feedback: 'Perfeitas associações! DU e TA são complementares na promoção da acessibilidade.',
    points: 15,
    estimatedTime: '5 mins'
  },
  {
    id: 'm10-e4',
    moduleId: 'mod-trilha10-0',
    title: 'Deficiência Oculta e Estigma',
    type: 'multiple-choice',
    question: 'Uma pessoa com uma deficiência oculta (invisível) frequentemente enfrenta o desafio de:',
    options: [
      { id: 'opt1', text: 'Ser imediatamente reconhecida e receber todos os suportes necessários sem precisar pedir.' },
      { id: 'opt2', text: 'Ter suas experiências questionadas ou minimizadas por outros ("você não parece doente").' },
      { id: 'opt3', text: 'Não precisar se preocupar com barreiras de acessibilidade, pois sua condição não é física.' },
      { id: 'opt4', text: 'Ter acesso facilitado a benefícios sociais devido à clareza de sua condição.' }
    ],
    correctAnswer: 'opt2',
    feedback: 'Correto! O ceticismo e o descrédito são desafios comuns para pessoas com deficiências ocultas, pois suas limitações não são aparentes.',
    points: 10,
    estimatedTime: '4 mins'
  },
  {
    id: 'm10-e5',
    moduleId: 'mod-trilha10-0',
    title: 'Ecologia de Saberes na Inclusão',
    type: 'fill-in-the-blank',
    question: 'A "ecologia de saberes", proposta por Boaventura de Sousa Santos, no contexto da inclusão, sugere a valorização e o diálogo entre o conhecimento científico e o conhecimento ______ das pessoas com deficiência.',
    options: [
      { id: 'eco_opt1', text: 'experiencial' },
      { id: 'eco_opt2', text: 'ancestral' },
      { id: 'eco_opt3', text: 'intuitivo' }
    ],
    correctAnswer: 'experiencial',
    feedback: 'Exato! A ecologia de saberes valoriza a pluralidade de conhecimentos, incluindo o conhecimento baseado na vivência direta da deficiência.',
    points: 10,
    estimatedTime: '3 mins'
  },
  {
    id: 'm10-e6',
    moduleId: 'mod-trilha10-0',
    title: 'Design Centrado no Usuário em TA',
    type: 'multiple-choice',
    question: 'No desenvolvimento de Tecnologias Assistivas (TA), qual abordagem é fundamental para criar produtos mais adequados e efetivos, que também promove empoderamento?',
    options: [
      { id: 'opt1', text: 'Design focado apenas na estética e no custo de produção.' },
      { id: 'opt2', text: 'Design centrado no usuário, envolvendo pessoas com deficiência em todas as etapas.' },
      { id: 'opt3', text: 'Design baseado exclusivamente nas opiniões de especialistas e engenheiros.' },
      { id: 'opt4', text: 'Design que prioriza a tecnologia mais avançada, mesmo que complexa para o usuário final.' }
    ],
    correctAnswer: 'opt2',
    feedback: 'Correto! O design centrado no usuário coloca as pessoas com deficiência no centro do processo, resultando em tecnologias mais eficazes e relevantes.',
    points: 10,
    estimatedTime: '4 mins'
  }
];

    