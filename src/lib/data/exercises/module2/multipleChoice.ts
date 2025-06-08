
import type { Exercise } from '@/lib/types';

export const module2MultipleChoiceExercises: Exercise[] = [
  {
    id: 'm2-e1',
    moduleId: 'mod-trilha2-0',
    title: 'Transição para Vida Adulta: Autonomia',
    type: 'multiple-choice',
    question: 'Qual é um dos principais focos para jovens com deficiência na transição para a vida adulta, conforme a Lição 2.1?',
    options: [
      { id: 'opt1', text: 'Aumento da dependência familiar para segurança.' },
      { id: 'opt2', text: 'Busca por maior autonomia e vida independente.' },
      { id: 'opt3', text: 'Foco exclusivo em atividades de lazer supervisionadas.' },
      { id: 'opt4', text: 'Adiamento da entrada no mercado de trabalho.' },
    ],
    correctAnswer: 'opt2',
    feedback: 'Correto! A transição para a vida adulta jovem envolve a busca por maior autonomia, planejamento de carreira e construção de uma vida independente, com os suportes necessários.',
    points: 10,
    estimatedTime: '2 mins',
  },
  {
    id: 'm2-e3',
    moduleId: 'mod-trilha2-0',
    title: 'Reserva Cognitiva na Vida Adulta',
    type: 'multiple-choice',
    question: 'De acordo com a Lição 2.3, como a reserva cognitiva, que protege contra o declínio cognitivo, pode ser construída por adultos com deficiência?',
    options: [
      { id: 'rc_opt1', text: 'Evitando qualquer tipo de desafio intelectual para poupar o cérebro.' },
      { id: 'rc_opt2', text: 'Engajando-se em atividades educacionais, ocupacionais e de lazer intelectualmente estimulantes.' },
      { id: 'rc_opt3', text: 'Apenas através de medicação específica para a memória.' },
      { id: 'rc_opt4', text: 'Limitando interações sociais para focar no desenvolvimento individual.' },
    ],
    correctAnswer: 'rc_opt2',
    feedback: 'Correto! A reserva cognitiva é fortalecida por um estilo de vida ativo e engajado em atividades estimulantes.',
    points: 15,
    estimatedTime: '2 mins',
  },
  {
    id: 'm2-e5',
    moduleId: 'mod-trilha2-0',
    title: 'Cuidados Paliativos e DAV',
    type: 'multiple-choice',
    question: 'O que são Diretivas Antecipadas de Vontade (DAV) mencionadas na Lição 2.8?',
    options: [
      { id: 'dav_opt1', text: 'Um plano de aposentadoria antecipada para idosos com deficiência.' },
      { id: 'dav_opt2', text: 'Um documento legal que nomeia um cuidador principal.' },
      { id: 'dav_opt3', text: 'Um registro das preferências da pessoa sobre cuidados e tratamentos médicos futuros, caso ela se torne incapaz de se comunicar.' },
      { id: 'dav_opt4', text: 'Um tipo de tecnologia assistiva para comunicação.' },
    ],
    correctAnswer: 'dav_opt3',
    feedback: 'Correto! As DAV, ou testamento vital, são importantes para garantir a autonomia do paciente em decisões sobre seus cuidados de saúde no fim da vida.',
    points: 10,
    estimatedTime: '2 mins',
  },
  {
    id: 'm2-e6',
    moduleId: 'mod-trilha2-0',
    title: 'Multimorbidade no Envelhecimento com Deficiência',
    type: 'multiple-choice',
    question: 'O que é "multimorbidade", um desafio comum em idosos, especialmente aqueles com deficiência preexistente (Lição 2.6)?',
    options: [
      { id: 'mm_opt1', text: 'Presença de uma única condição crônica, mas de alta gravidade.' },
      { id: 'mm_opt2', text: 'Presença simultânea de duas ou mais condições crônicas de saúde.' },
      { id: 'mm_opt3', text: 'Aumento da mobilidade devido a múltiplas adaptações e tecnologias assistivas.' },
      { id: 'mm_opt4', text: 'Foco exclusivo em problemas de saúde mental, ignorando os físicos.' },
    ],
    correctAnswer: 'mm_opt2',
    feedback: 'Correto! Multimorbidade é a coexistência de múltiplas condições crônicas, exigindo uma abordagem de cuidado integral e coordenada.',
    points: 10,
    estimatedTime: '2 mins',
  },
  {
    id: 'm2-e9',
    moduleId: 'mod-trilha2-0',
    title: 'Autoadvocacia na Transição para a Vida Adulta',
    type: 'multiple-choice',
    question: 'Qual é a importância da "autoadvocacia" para jovens com deficiência durante a transição para a vida adulta (Lição 2.1)?',
    options: [
      { id: 'aa_opt1', text: 'Permite que outras pessoas tomem todas as decisões por eles.' },
      { id: 'aa_opt2', text: 'Refere-se à capacidade de defender os próprios direitos, necessidades e tomar decisões sobre a própria vida.' },
      { id: 'aa_opt3', text: 'É uma técnica para melhorar a memória de longo prazo.' },
      { id: 'aa_opt4', text: 'Significa focar apenas nas próprias necessidades, ignorando as dos outros.' },
    ],
    correctAnswer: 'aa_opt2',
    feedback: 'Correto! Autoadvocacia é a habilidade de se expressar e defender os próprios interesses e direitos, fundamental para a autonomia.',
    points: 10,
    estimatedTime: '2 mins',
  },
  {
    id: 'm2-e12', // Novo ID
    moduleId: 'mod-trilha2-0',
    title: 'Envelhecimento Acelerado na Síndrome de Down',
    type: 'multiple-choice',
    question: 'Qual condição neurológica é frequentemente associada ao "envelhecimento acelerado" em pessoas com Síndrome de Down, conforme a Lição 2.6?',
    options: [
      { id: 'sd_opt1', text: 'Doença de Parkinson de início tardio.' },
      { id: 'sd_opt2', text: 'Desenvolvimento precoce da Doença de Alzheimer.' },
      { id: 'sd_opt3', text: 'Aumento da incidência de Esclerose Lateral Amiotrófica (ELA).' },
      { id: 'sd_opt4', text: 'Maior resistência a doenças cardiovasculares.' },
    ],
    correctAnswer: 'sd_opt2',
    feedback: 'Correto! Pessoas com Síndrome de Down têm um risco aumentado de desenvolver a Doença de Alzheimer em idades mais jovens.',
    points: 10,
    estimatedTime: '2 mins'
  },
  {
    id: 'm2-e13', // Novo ID
    moduleId: 'mod-trilha2-0',
    title: 'Etarismo e Capacitismo',
    type: 'multiple-choice',
    question: 'Qual o termo que descreve o preconceito e a discriminação baseados na idade, frequentemente enfrentado por pessoas idosas, incluindo aquelas com deficiência (Lição 2.9)?',
    options: [
      { id: 'disc_opt1', text: 'Capacitismo' },
      { id: 'disc_opt2', text: 'Xenofobia' },
      { id: 'disc_opt3', text: 'Etarismo (ou Idadismo)' },
      { id: 'disc_opt4', text: 'Sexismo' },
    ],
    correctAnswer: 'disc_opt3',
    feedback: 'Correto! Etarismo (ou Idadismo) é o preconceito e a discriminação com base na idade.',
    points: 10,
    estimatedTime: '2 mins'
  }
];
