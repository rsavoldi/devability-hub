
import type { Exercise } from '@/lib/types';

export const module8Exercises: Exercise[] = [
  {
    id: 'm8-e1',
    moduleId: 'mod-trilha8-0',
    title: 'Princípio Ético Central',
    type: 'multiple-choice',
    question: 'Qual princípio ético fundamental reconhece o valor intrínseco de cada indivíduo, independentemente de suas características ou condições, e é um pilar da Convenção da ONU (2006)?',
    options: [
      { id: 'opt1', text: 'Competência Profissional' },
      { id: 'opt2', text: 'Respeito à Dignidade Humana' },
      { id: 'opt3', text: 'Justiça Distributiva' },
      { id: 'opt4', text: 'Não-Maleficência' }
    ],
    correctAnswer: 'opt2',
    feedback: 'Correto! O respeito à dignidade humana é um princípio primordial que fundamenta todos os outros na atuação com pessoas com deficiência.',
    points: 10,
    estimatedTime: '3 mins'
  },
  {
    id: 'm8-e2',
    moduleId: 'mod-trilha8-0',
    title: 'Dilema na Avaliação: Instrumentos',
    type: 'fill-in-the-blank',
    question: 'Um dilema ético na avaliação psicológica de pessoas com deficiência é o uso de instrumentos não validados para essa população, o que pode levar a interpretações inadequadas ou _____.',
    options: [
      { id: 'dilema_opt1', text: 'rotulações estigmatizantes' },
      { id: 'dilema_opt2', text: 'diagnósticos precisos sempre' },
      { id: 'dilema_opt3', text: 'resultados facilmente generalizáveis' }
    ],
    correctAnswer: 'rotulações estigmatizantes',
    feedback: 'Exato! O uso de instrumentos não validados ou mal adaptados pode resultar em rotulações e subestimação de capacidades.',
    points: 10,
    estimatedTime: '3 mins'
  },
  {
    id: 'm8-e3',
    moduleId: 'mod-trilha8-0',
    title: 'Intervenção: Normalização vs. Diferença',
    type: 'association',
    question: 'Associe as abordagens de intervenção (Coluna A) com seus focos principais (Coluna B) no contexto do dilema "Normalização vs. Valorização da Diferença".',
    options: [
      { id: 'a1', text: 'Coluna A: Abordagens Tradicionais de Normalização' }, { id: 'b1', text: 'Coluna B: Buscam aproximar a pessoa com deficiência de padrões considerados "normais".' },
      { id: 'a2', text: 'Coluna A: Perspectivas Críticas de Valorização da Diferença' }, { id: 'b2', text: 'Coluna B: Focam na remoção de barreiras e no respeito à identidade, sem impor padrões normativos.' },
      { id: 'a3', text: 'Coluna A: Intervenções Equilibradas' }, { id: 'b3', text: 'Coluna B: Buscam desenvolver habilidades socialmente valorizadas, respeitando a identidade e as escolhas da pessoa.' }
    ],
    correctAnswer: ["a1-b1", "a2-b2", "a3-b3"],
    feedback: 'Boas associações! Este é um dilema central na prática com pessoas com deficiência.',
    points: 15,
    estimatedTime: '5 mins'
  },
  {
    id: 'm8-e4',
    moduleId: 'mod-trilha8-0',
    title: 'Linguagem na Comunicação Ética',
    type: 'multiple-choice',
    question: 'Qual expressão é MAIS adequada e respeitosa ao se referir a uma pessoa com limitações funcionais, segundo as diretrizes éticas atuais?',
    options: [
      { id: 'opt1', text: 'O deficiente' },
      { id: 'opt2', text: 'Pessoa portadora de necessidades especiais' },
      { id: 'opt3', text: 'Pessoa com deficiência' },
      { id: 'opt4', text: 'O excepcional' }
    ],
    correctAnswer: 'opt3',
    feedback: 'Correto! "Pessoa com deficiência" é o termo recomendado pela Convenção da ONU e pela LBI, pois enfatiza a pessoa antes da deficiência.',
    points: 10,
    estimatedTime: '3 mins'
  },
  {
    id: 'm8-e5',
    moduleId: 'mod-trilha8-0',
    title: 'Pesquisa Emancipatória',
    type: 'fill-in-the-blank',
    question: 'O lema "Nada sobre nós, sem nós" é central para a pesquisa ______, que valoriza o protagonismo das pessoas com deficiência na produção de conhecimento.',
    options: [
      { id: 'pesq_opt1', text: 'emancipatória (ou participativa)' },
      { id: 'pesq_opt2', text: 'experimental controlada' },
      { id: 'pesq_opt3', text: 'quantitativa longitudinal' }
    ],
    correctAnswer: 'emancipatória (ou participativa)',
    feedback: 'Exato! A pesquisa emancipatória busca transformar as relações de poder na pesquisa, envolvendo as pessoas com deficiência como colaboradoras ativas.',
    points: 10,
    estimatedTime: '3 mins'
  },
  {
    id: 'm8-e6',
    moduleId: 'mod-trilha8-0',
    title: 'Diretriz Ética: Abordagem',
    type: 'multiple-choice',
    question: 'Qual diretriz ética sugere que o profissional deve reconhecer a singularidade de cada pessoa com deficiência e a complexa interação entre sua condição de saúde e fatores contextuais?',
    options: [
      { id: 'opt1', text: 'Manter competência profissional exclusivamente técnica.' },
      { id: 'opt2', text: 'Adotar uma abordagem individualizada e contextualizada.' },
      { id: 'opt3', text: 'Priorizar a padronização de todos os procedimentos.' },
      { id: 'opt4', text: 'Focar apenas nos aspectos biológicos da deficiência.' }
    ],
    correctAnswer: 'opt2',
    feedback: 'Correto! Uma abordagem individualizada e contextualizada é crucial para uma prática ética e eficaz, considerando a pessoa em sua totalidade e em seu ambiente.',
    points: 10,
    estimatedTime: '4 mins'
  }
];

    