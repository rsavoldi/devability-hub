
import type { Exercise } from '@/lib/types';

export const module10MultipleChoiceExercises: Exercise[] = [
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
    estimatedTime: '2 mins'
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
    estimatedTime: '2 mins',
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
    estimatedTime: '2 mins',
  },
  {
    id: 'm10-e7-new',
    moduleId: 'mod-trilha10-0',
    title: 'Interseccionalidade em Deficiência Oculta',
    type: 'multiple-choice',
    question: 'Ao considerar deficiências ocultas, por que a abordagem interseccional é importante?',
    options: [
        { id: 'opt1', text: 'Para focar apenas na deficiência principal, ignorando outros fatores.' },
        { id: 'opt2', text: 'Para reconhecer como a deficiência oculta pode interagir com gênero, raça ou classe social, criando barreiras específicas.' },
        { id: 'opt3', text: 'Para padronizar o tratamento para todas as pessoas com a mesma deficiência oculta.' },
        { id: 'opt4', text: 'Para provar que deficiências ocultas são menos impactantes que as visíveis.' }
    ],
    correctAnswer: 'opt2',
    feedback: 'Correto! A interseccionalidade ajuda a entender as múltiplas dimensões da experiência e as barreiras únicas enfrentadas.',
    points: 10,
    estimatedTime: '2 mins'
  },
  {
    id: 'm10-e8-new',
    moduleId: 'mod-trilha10-0',
    title: 'Objetivos da "Ecologia de Saberes"',
    type: 'multiple-choice',
    question: 'Qual o principal objetivo da "ecologia de saberes" no contexto da inclusão da pessoa com deficiência?',
    options: [
        { id: 'opt1', text: 'Priorizar o conhecimento científico sobre o conhecimento experiencial.' },
        { id: 'opt2', text: 'Criar um consenso único e universal sobre a deficiência.' },
        { id: 'opt3', text: 'Promover o diálogo e a valorização entre diferentes formas de conhecimento (científico, experiencial, etc.) para uma compreensão mais rica.' },
        { id: 'opt4', text: 'Descartar abordagens teóricas tradicionais em favor de novas perspectivas.' }
    ],
    correctAnswer: 'opt3',
    feedback: 'Exato! A ecologia de saberes busca integrar e valorizar diversas formas de conhecimento para uma compreensão mais completa e inclusiva.',
    points: 10,
    estimatedTime: '2 mins'
  },
  {
    id: 'm10-e9-new',
    moduleId: 'mod-trilha10-0',
    title: 'Símbolo para Deficiências Ocultas',
    type: 'multiple-choice',
    question: 'Qual símbolo é internacionalmente reconhecido para indicar deficiências ocultas, facilitando o reconhecimento e suporte em locais públicos?',
    options: [
        { id: 'opt1', text: 'Um laço azul.' },
        { id: 'opt2', text: 'O Símbolo Internacional de Acesso (cadeira de rodas).' },
        { id: 'opt3', text: 'O Cordão de Girassol.' },
        { id: 'opt4', text: 'Um trevo de quatro folhas.' }
    ],
    correctAnswer: 'opt3',
    feedback: 'Correto! O Cordão de Girassol é um símbolo discreto usado para indicar deficiências ou condições não visíveis.',
    points: 10,
    estimatedTime: '1 min'
  }
];
