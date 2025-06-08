
import type { Exercise } from '@/lib/types';

export const module12MultipleChoiceExercises: Exercise[] = [
  {
    id: 'm12-e1',
    moduleId: 'mod-trilha12-0',
    title: 'Transição Demográfica no Brasil',
    type: 'multiple-choice',
    question: 'Quais são os dois principais processos que resultam na transição demográfica observada no Brasil, levando ao envelhecimento populacional?',
    options: [
      { id: 'opt1', text: 'Aumento da imigração e diminuição da emigração.' },
      { id: 'opt2', text: 'Redução nas taxas de fecundidade e aumento da expectativa de vida.' },
      { id: 'opt3', text: 'Aumento da taxa de natalidade e estabilização da mortalidade.' },
      { id: 'opt4', text: 'Melhora no saneamento básico e aumento da taxa de urbanização.' }
    ],
    correctAnswer: 'opt2',
    feedback: 'Correto! A queda da fecundidade e o aumento da longevidade são os motores da transição demográfica.',
    points: 10,
    estimatedTime: '2 mins'
  },
  {
    id: 'm12-e4',
    moduleId: 'mod-trilha12-0',
    title: 'Pilares do Envelhecimento Ativo',
    type: 'multiple-choice',
    question: 'Qual dos seguintes NÃO é um dos quatro pilares do Envelhecimento Ativo, conforme ampliado pela OMS?',
    options: [
      { id: 'ea_opt1', text: 'Saúde' },
      { id: 'ea_opt2', text: 'Participação' },
      { id: 'ea_opt3', text: 'Competição Econômica' },
      { id: 'ea_opt4', text: 'Segurança' },
      { id: 'ea_opt5', text: 'Aprendizagem ao Longo da Vida' }
    ],
    correctAnswer: 'ea_opt3',
    feedback: 'Correto! Os pilares são Saúde, Participação, Segurança e Aprendizagem ao Longo da Vida. Competição econômica não é um deles.',
    points: 10,
    estimatedTime: '2 mins',
  },
  {
    id: 'm12-e6',
    moduleId: 'mod-trilha12-0',
    title: 'Estatuto do Idoso',
    type: 'multiple-choice',
    question: 'O Estatuto do Idoso (Lei nº 10.741/2003) garante, entre outros direitos, a gratuidade nos transportes coletivos públicos urbanos para pessoas com idade igual ou superior a:',
    options: [
      { id: 'est_opt1', text: '60 anos' },
      { id: 'est_opt2', text: '65 anos' },
      { id: 'est_opt3', text: '70 anos' },
      { id: 'est_opt4', text: '55 anos, se aposentado' }
    ],
    correctAnswer: 'est_opt2',
    feedback: 'Correto! O Estatuto do Idoso garante a gratuidade a partir dos 65 anos nos transportes coletivos públicos urbanos e semiurbanos. Para alguns transportes interestaduais, a regra pode ser a partir dos 60 com comprovação de renda.',
    points: 10,
    estimatedTime: '2 mins'
  },
  {
    id: 'm12-e7-new',
    moduleId: 'mod-trilha12-0',
    title: 'CIF e Funcionalidade no Envelhecimento',
    type: 'multiple-choice',
    question: 'Segundo a Classificação Internacional de Funcionalidade, Incapacidade e Saúde (CIF), a funcionalidade de uma pessoa idosa resulta da interação entre sua condição de saúde e:',
    options: [
      { id: 'cif_opt1', text: 'Apenas seus fatores genéticos e biológicos.' },
      { id: 'cif_opt2', text: 'Apenas o suporte financeiro que recebe.' },
      { id: 'cif_opt3', text: 'Os fatores contextuais (ambientais e pessoais).' },
      { id: 'cif_opt4', text: 'A quantidade de medicamentos que utiliza.' }
    ],
    correctAnswer: 'cif_opt3',
    feedback: 'Correto! A CIF enfatiza a interação entre a condição de saúde e os fatores contextuais (ambientais e pessoais) para determinar a funcionalidade.',
    points: 10,
    estimatedTime: '2 mins'
  },
  {
    id: 'm12-e8-new',
    moduleId: 'mod-trilha12-0',
    title: 'Modelo SOC de Baltes',
    type: 'multiple-choice',
    question: 'No modelo de Otimização Seletiva com Compensação (SOC) de Baltes, qual estratégia envolve o uso de recursos alternativos quando os originais não estão mais disponíveis?',
    options: [
      { id: 'soc_opt1', text: 'Seleção' },
      { id: 'soc_opt2', text: 'Otimização' },
      { id: 'soc_opt3', text: 'Compensação' },
      { id: 'soc_opt4', text: 'Resignação' }
    ],
    correctAnswer: 'soc_opt3',
    feedback: 'Exato! A Compensação é a estratégia de usar alternativas para manter o funcionamento diante de perdas.',
    points: 10,
    estimatedTime: '2 mins'
  },
  {
    id: 'm12-e9-new',
    moduleId: 'mod-trilha12-0',
    title: 'Convenção Interamericana sobre Direitos dos Idosos',
    type: 'multiple-choice',
    question: 'Qual o status da Convenção Interamericana sobre a Proteção dos Direitos Humanos dos Idosos (OEA, 2015) em relação ao Brasil?',
    options: [
      { id: 'conv_opt1', text: 'Foi ratificada e tem força de lei complementar.' },
      { id: 'conv_opt2', text: 'Foi assinada, mas ainda não foi ratificada pelo Brasil.' },
      { id: 'conv_opt3', text: 'Não foi assinada pelo Brasil e não tem validade no país.' },
      { id: 'conv_opt4', text: 'Foi ratificada e tem status de emenda constitucional.' }
    ],
    correctAnswer: 'conv_opt2',
    feedback: 'Correto! O Brasil assinou a Convenção em 2015, mas, até informações mais recentes (consulte fontes atualizadas), sua ratificação ainda estava pendente.',
    points: 10,
    estimatedTime: '2 mins'
  }
];
