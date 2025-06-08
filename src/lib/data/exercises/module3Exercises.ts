
import type { Exercise } from '@/lib/types';

export const module3Exercises: Exercise[] = [
  {
    id: 'm3-e1',
    moduleId: 'mod-trilha3-0',
    title: 'Paradigmas Históricos da Deficiência',
    type: 'multiple-choice',
    question: 'Qual paradigma histórico da deficiência focava na segregação em instituições especializadas, com ênfase no cuidado custodial?',
    options: [
      { id: 'opt1', text: 'Paradigma de Suportes' },
      { id: 'opt2', text: 'Paradigma de Serviços' },
      { id: 'opt3', text: 'Paradigma da Institucionalização' },
      { id: 'opt4', text: 'Paradigma Biopsicossocial' }
    ],
    correctAnswer: 'opt3',
    feedback: 'Correto! O Paradigma da Institucionalização caracterizou-se pela segregação e cuidado custodial.',
    points: 10,
    estimatedTime: '3 mins'
  },
  {
    id: 'm3-e2',
    moduleId: 'mod-trilha3-0',
    title: 'Modelo Social vs. Modelo Médico',
    type: 'association',
    question: 'Associe os modelos de compreensão da deficiência (Coluna A) com suas características principais (Coluna B).',
    options: [
      { id: 'a1', text: 'Coluna A: Modelo Médico' }, { id: 'b1', text: 'Coluna B: Foca na deficiência como um problema individual, uma doença a ser curada ou reabilitada.' },
      { id: 'a2', text: 'Coluna A: Modelo Social' }, { id: 'b2', text: 'Coluna B: Entende a deficiência como resultado de barreiras sociais, atitudinais e ambientais.' },
      { id: 'a3', text: 'Coluna A: Modelo Biopsicossocial (CIF)' }, { id: 'b3', text: 'Coluna B: Considera a interação entre condições de saúde e fatores contextuais (ambientais e pessoais).' },
    ],
    correctAnswer: ["a1-b1", "a2-b2", "a3-b3"], 
    feedback: 'Ótimas associações! Compreender esses modelos é fundamental.',
    points: 15,
    estimatedTime: '5 mins'
  },
  {
    id: 'm3-e3',
    moduleId: 'mod-trilha3-0',
    title: 'Princípios da Intervenção Precoce',
    type: 'multiple-choice',
    question: 'Qual NÃO é um pilar dos modelos contemporâneos de Intervenção Precoce?',
    options: [
      { id: 'ipopt1', text: 'Abordagem centrada na família e nas suas rotinas' },
      { id: 'ipopt2', text: 'Foco na plasticidade cerebral dos primeiros anos de vida' },
      { id: 'ipopt3', text: 'Intervenção exclusiva em ambientes clínicos altamente especializados, sem envolvimento familiar direto' },
      { id: 'ipopt4', text: 'Abordagem transdisciplinar e integrada dos profissionais envolvidos' }
    ],
    correctAnswer: 'ipopt3',
    feedback: 'Correto! A IP contemporânea valoriza a intervenção em contextos naturais e o papel central da família, não apenas ambientes clínicos isolados.',
    points: 10,
    estimatedTime: '4 mins'
  },
  {
    id: 'm3-e4',
    moduleId: 'mod-trilha3-0',
    title: 'DUA na Educação Inclusiva',
    type: 'fill-in-the-blank',
    question: 'O Desenho Universal para a Aprendizagem (DUA) propõe múltiplos meios de representação da informação, múltiplos meios de ação e expressão do aprendizado, e múltiplos meios de _______.',
    options: [ 
        {id: 'dua_opt1', text: 'avaliação padronizada'},
        {id: 'dua_opt2', text: 'engajamento e motivação'},
        {id: 'dua_opt3', text: 'memorização de conteúdos'}
    ],
    correctAnswer: 'engajamento e motivação', 
    feedback: 'Correto! Os três princípios do DUA são: representação, ação/expressão e engajamento/motivação.',
    points: 10,
    estimatedTime: '3 mins'
  },
  {
    id: 'm3-e5',
    moduleId: 'mod-trilha3-0',
    title: 'Tecnologia Assistiva (TA)',
    type: 'multiple-choice',
    question: 'Qual das seguintes afirmações MELHOR define Tecnologia Assistiva (TA) conforme a Lei Brasileira de Inclusão?',
    options: [
        { id: 'ta_opt1', text: 'Apenas dispositivos eletrônicos caros para pessoas com deficiências severas.' },
        { id: 'ta_opt2', text: 'Produtos, equipamentos, dispositivos, recursos, metodologias, estratégias, práticas e serviços para promover funcionalidade e participação.' },
        { id: 'ta_opt3', text: 'Um substituto completo para terapias de reabilitação tradicionais.' },
        { id: 'ta_opt4', text: 'Softwares de computador exclusivamente para fins educacionais.' }
    ],
    correctAnswer: 'ta_opt2',
    feedback: 'Correto! A LBI tem uma definição ampla de TA, incluindo não apenas produtos, mas também serviços e metodologias.',
    points: 10,
    estimatedTime: '4 mins'
  },
   {
    id: 'm3-e6',
    moduleId: 'mod-trilha3-0',
    title: 'Abordagem Centrada na Família',
    type: 'multiple-choice',
    question: 'Na abordagem centrada na família, como os profissionais devem atuar?',
    options: [
      { id: 'acf_opt1', text: 'Como especialistas que ditam todas as regras e decisões.' },
      { id: 'acf_opt2', text: 'Como parceiros, consultores e colaboradores das famílias, respeitando suas escolhas e fortalecendo suas capacidades.' },
      { id: 'acf_opt3', text: 'Como observadores passivos, apenas coletando dados sobre a dinâmica familiar.' },
      { id: 'acf_opt4', text: 'Focando exclusivamente nas necessidades da criança, sem considerar o contexto familiar.' }
    ],
    correctAnswer: 'acf_opt2',
    feedback: 'Exato! A parceria e o respeito às escolhas da família são centrais nesta abordagem.',
    points: 10,
    estimatedTime: '3 mins'
  },
  {
    id: 'm3-e7',
    moduleId: 'mod-trilha3-0',
    title: 'Componentes da RBC',
    type: 'multiple-choice',
    question: 'Qual dos seguintes NÃO é um dos cinco componentes principais da Reabilitação Baseada na Comunidade (RBC)?',
    options: [
      { id: 'rbc_opt1', text: 'Saúde' },
      { id: 'rbc_opt2', text: 'Educação' },
      { id: 'rbc_opt3', text: 'Financeiro (foco em investimentos de alto risco)' },
      { id: 'rbc_opt4', text: 'Empoderamento' },
      { id: 'rbc_opt5', text: 'Subsistência (geração de renda)' },
    ],
    correctAnswer: 'rbc_opt3',
    feedback: 'Correto! Os cinco componentes da RBC são Saúde, Educação, Subsistência, Social e Empoderamento. O componente financeiro está mais ligado à subsistência e acesso a benefícios do que a investimentos de risco.',
    points: 10,
    estimatedTime: '4 mins'
  },
  {
    id: 'm3-e8',
    moduleId: 'mod-trilha3-0',
    title: 'Participação na Pesquisa',
    type: 'fill-in-the-blank',
    question: 'O lema "______ sobre nós, sem nós" enfatiza a importância da participação ativa das pessoas com deficiência na pesquisa.',
    options: [
        {id: 'lema_opt1', text: 'Nada'},
        {id: 'lema_opt2', text: 'Tudo'},
        {id: 'lema_opt3', text: 'Algo'}
    ],
    correctAnswer: 'Nada', 
    feedback: 'Correto! "Nada sobre nós, sem nós" é um lema fundamental do movimento de direitos das pessoas com deficiência.',
    points: 10,
    estimatedTime: '3 mins'
  }
];

    