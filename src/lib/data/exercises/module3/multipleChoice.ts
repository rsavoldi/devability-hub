
import type { Exercise } from '@/lib/types';

export const module3MultipleChoiceExercises: Exercise[] = [
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
    estimatedTime: '2 mins'
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
    estimatedTime: '2 mins',
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
    estimatedTime: '2 mins',
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
    estimatedTime: '2 mins'
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
    estimatedTime: '2 mins',
  },
  {
    id: 'm3-e10',
    moduleId: 'mod-trilha3-0',
    title: 'Componente Chave da RBC',
    type: 'multiple-choice',
    question: 'Qual dos seguintes é um componente chave da Reabilitação Baseada na Comunidade (RBC) que visa fortalecer a voz e a participação das pessoas com deficiência e suas famílias?',
    options: [
        { id: 'rbc_key_opt1', text: 'Medicalização intensiva das condições de saúde.' },
        { id: 'rbc_key_opt2', text: 'Empoderamento.' },
        { id: 'rbc_key_opt3', text: 'Segregação em ambientes especializados para maior proteção.' },
        { id: 'rbc_key_opt4', text: 'Padronização de todos os serviços oferecidos.' }
    ],
    correctAnswer: 'rbc_key_opt2',
    feedback: 'Correto! O Empoderamento é um dos cinco componentes essenciais da RBC, juntamente com Saúde, Educação, Subsistência e Social, focando no fortalecimento da autonomia e participação.',
    points: 10,
    estimatedTime: '2 mins'
  }
];
