
import type { Exercise } from '@/lib/types';

export const module5MultipleChoiceExercises: Exercise[] = [
  {
    id: 'm5-e1',
    moduleId: 'mod-trilha5-0',
    title: 'Função do Corpo Caloso',
    type: 'multiple-choice',
    question: 'Qual é a principal função do corpo caloso no cérebro?',
    options: [
      { id: 'opt1', text: 'Processar emoções primárias.' },
      { id: 'opt2', text: 'Conectar os dois hemisférios cerebrais, permitindo a comunicação entre eles.' },
      { id: 'opt3', text: 'Regular funções vitais como respiração e batimentos cardíacos.' },
      { id: 'opt4', text: 'Armazenar memórias de longo prazo.' }
    ],
    correctAnswer: 'opt2',
    feedback: 'Correto! O corpo caloso é um feixe de fibras nervosas que conecta os hemisférios esquerdo e direito, crucial para a integração de informações.',
    points: 10,
    estimatedTime: '2 mins'
  },
  {
    id: 'm5-e2',
    moduleId: 'mod-trilha5-0',
    title: 'Plasticidade Cross-Modal',
    type: 'multiple-choice',
    question: 'A plasticidade cross-modal, observada em pessoas com deficiências sensoriais, refere-se à capacidade do cérebro de:',
    options: [
      { id: 'opt1', text: 'Criar novos neurônios para substituir os danificados.' },
      { id: 'opt2', text: 'Recrutar áreas cerebrais de uma modalidade sensorial para processar informações de outra modalidade.' },
      { id: 'opt3', text: 'Aumentar o tamanho físico do cérebro para compensar a perda sensorial.' },
      { id: 'opt4', text: 'Desligar completamente as áreas sensoriais não utilizadas.' }
    ],
    correctAnswer: 'opt2',
    feedback: 'Exato! A plasticidade cross-modal é a reorganização funcional onde, por exemplo, o córtex visual de uma pessoa cega pode processar informações táteis ou auditivas.',
    points: 10,
    estimatedTime: '2 mins'
  },
  {
    id: 'm5-e3',
    moduleId: 'mod-trilha5-0',
    title: 'Princípio na Avaliação Neuropsicológica',
    type: 'multiple-choice',
    question: 'Um princípio fundamental na avaliação neuropsicológica de pessoas com deficiência é garantir que os instrumentos e procedimentos sejam:',
    options: [
      { id: 'opt1', text: 'Aplicados o mais rapidamente possível para evitar fadiga.' },
      { id: 'opt2', text: 'Os mesmos utilizados para a população geral, sem qualquer adaptação, para garantir a padronização.' },
      { id: 'opt3', text: 'Adaptados para serem acessíveis e justos, considerando as características individuais e minimizando o impacto da deficiência na mensuração do construto alvo.' },
      { id: 'opt4', text: 'Focados exclusivamente na identificação de déficits para fins de classificação.' }
    ],
    correctAnswer: 'opt3',
    feedback: 'Correto! Acessibilidade, justiça e adaptação dos instrumentos são cruciais para uma avaliação neuropsicológica válida e ética no contexto da deficiência.',
    points: 10,
    estimatedTime: '2 mins'
  },
  {
    id: 'm5-e4',
    moduleId: 'mod-trilha5-0',
    title: 'Desafio na Neuropsicologia da Deficiência',
    type: 'multiple-choice',
    question: 'Qual é um dos principais desafios na aplicação dos avanços da neuropsicologia da deficiência na prática clínica e educacional?',
    options: [
      { id: 'opt1', text: 'A falta de interesse das pessoas com deficiência em novas intervenções.' },
      { id: 'opt2', text: 'A excessiva simplicidade das descobertas neurocientíficas, que não se aplicam a casos complexos.' },
      { id: 'opt3', text: 'A dificuldade em traduzir achados de pesquisa básica para intervenções eficazes e aplicáveis em contextos reais (lacuna pesquisa-prática).' },
      { id: 'opt4', text: 'O custo proibitivo de todos os equipamentos de neuroimagem para diagnóstico.' }
    ],
    correctAnswer: 'opt3',
    feedback: 'Correto! A translação do conhecimento da pesquisa para a prática (research-to-practice gap) é um desafio significativo, exigindo mais pesquisas aplicadas e formação profissional.',
    points: 10,
    estimatedTime: '2 mins'
  }
];
