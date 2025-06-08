
import type { Exercise } from '@/lib/types';

export const module8MultipleChoiceExercises: Exercise[] = [
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
    estimatedTime: '2 mins'
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
    estimatedTime: '1 min'
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
    estimatedTime: '2 mins',
  },
  {
    id: 'm8-e7',
    moduleId: 'mod-trilha8-0',
    title: 'Equidade vs. Igualdade na Intervenção',
    type: 'multiple-choice',
    question: 'Ao planejar uma intervenção para uma pessoa com deficiência, o princípio ético da equidade, em contraste com a igualdade formal, sugere que o profissional deve:',
    options: [
      { id: 'opt1', text: 'Oferecer exatamente os mesmos recursos e suportes para todas as pessoas, independentemente de suas necessidades.' },
      { id: 'opt2', text: 'Ajustar os suportes e recursos às necessidades específicas de cada indivíduo para garantir oportunidades justas.' },
      { id: 'opt3', text: 'Limitar os suportes para promover a independência forçada.' },
      { id: 'opt4', text: 'Priorizar as pessoas com deficiências menos complexas, pois são mais fáceis de atender.' }
    ],
    correctAnswer: 'opt2',
    feedback: 'Correto! Equidade significa oferecer suportes diferenciados para alcançar resultados justos, reconhecendo as necessidades individuais.',
    points: 10,
    estimatedTime: '2 mins'
  },
  {
    id: 'm8-e8',
    moduleId: 'mod-trilha8-0',
    title: 'Dilema da Rotulação Diagnóstica',
    type: 'multiple-choice',
    question: 'Qual é um dos principais dilemas éticos ao atribuir um rótulo diagnóstico a uma pessoa com deficiência?',
    options: [
      { id: 'opt1', text: 'O diagnóstico sempre garante acesso imediato e irrestrito a todos os serviços necessários.' },
      { id: 'opt2', text: 'O diagnóstico pode facilitar o acesso a suportes, mas também pode levar à estigmatização e redução de expectativas.' },
      { id: 'opt3', text: 'O diagnóstico é um processo puramente objetivo que não carrega implicações sociais.' },
      { id: 'opt4', text: 'O diagnóstico deve ser evitado a todo custo, mesmo que impeça o acesso a direitos.' }
    ],
    correctAnswer: 'opt2',
    feedback: 'Exato! O diagnóstico tem um duplo potencial: facilitar acesso a direitos e suportes, mas também carregar o risco de estigma e expectativas limitadas.',
    points: 10,
    estimatedTime: '2 mins',
  },
  {
    id: 'm8-e9',
    moduleId: 'mod-trilha8-0',
    title: 'Reflexividade do Pesquisador',
    type: 'multiple-choice',
    question: 'Na pesquisa ética com pessoas com deficiência, por que a "reflexividade" do pesquisador é considerada fundamental?',
    options: [
      { id: 'opt1', text: 'Para garantir que o pesquisador mantenha uma distância emocional completa dos participantes.' },
      { id: 'opt2', text: 'Para que o pesquisador analise criticamente seus próprios pressupostos, vieses e como sua posição social pode influenciar a pesquisa.' },
      { id: 'opt3', text: 'Para assegurar que apenas pesquisadores com deficiência investiguem temas sobre deficiência.' },
      { id: 'opt4', text: 'Para acelerar o processo de coleta de dados, evitando questionamentos desnecessários.' }
    ],
    correctAnswer: 'opt2',
    feedback: 'Correto! A reflexividade envolve uma autoanálise crítica do pesquisador sobre seus próprios vieses e o impacto de sua posição no processo de pesquisa.',
    points: 10,
    estimatedTime: '2 mins'
  }
];
