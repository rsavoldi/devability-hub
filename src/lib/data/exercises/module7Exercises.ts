
import type { Exercise } from '@/lib/types';

export const module7Exercises: Exercise[] = [
  {
    id: 'm7-e1',
    moduleId: 'mod-trilha7-0',
    title: 'Interseccionalidade na Pesquisa',
    type: 'multiple-choice',
    question: 'O que significa o conceito de "interseccionalidade" na pesquisa sobre deficiência?',
    options: [
      { id: 'opt1', text: 'Focar apenas no tipo de deficiência, ignorando outros fatores.' },
      { id: 'opt2', text: 'Analisar como a deficiência interage com outras categorias sociais (gênero, raça, classe) afetando as experiências.' },
      { id: 'opt3', text: 'Um método de dividir a pesquisa em seções menores e independentes.' },
      { id: 'opt4', text: 'A colaboração entre pesquisadores de diferentes interseções geográficas.' }
    ],
    correctAnswer: 'opt2',
    feedback: 'Correto! Interseccionalidade examina como diferentes formas de opressão e identidade se cruzam e impactam as experiências das pessoas com deficiência.',
    points: 10,
    estimatedTime: '3 mins'
  },
  {
    id: 'm7-e2',
    moduleId: 'mod-trilha7-0',
    title: 'Tipos de Estudos Quantitativos',
    type: 'association',
    question: 'Associe o tipo de estudo quantitativo (Coluna A) com sua principal característica (Coluna B).',
    options: [
      { id: 'a1', text: 'Coluna A: Estudos Epidemiológicos' }, { id: 'b1', text: 'Coluna B: Investigam prevalência e distribuição de deficiências em populações.' },
      { id: 'a2', text: 'Coluna A: Estudos Experimentais' }, { id: 'b2', text: 'Coluna B: Avaliam eficácia de intervenções manipulando variáveis e controlando condições.' },
      { id: 'a3', text: 'Coluna A: Estudos Longitudinais' }, { id: 'b3', text: 'Coluna B: Acompanham os mesmos indivíduos ao longo do tempo para observar mudanças.' },
    ],
    correctAnswer: ["a1-b1", "a2-b2", "a3-b3"],
    feedback: 'Excelentes associações! Cada tipo de estudo tem um propósito específico na pesquisa quantitativa.',
    points: 15,
    estimatedTime: '5 mins'
  },
  {
    id: 'm7-e3',
    moduleId: 'mod-trilha7-0',
    title: 'Pesquisa-Ação',
    type: 'multiple-choice',
    question: 'Qual o principal objetivo da Pesquisa-Ação no contexto da deficiência?',
    options: [
      { id: 'opt1', text: 'Apenas descrever detalhadamente uma situação social.' },
      { id: 'opt2', text: 'Produzir conhecimento teórico para publicação acadêmica exclusiva.' },
      { id: 'opt3', text: 'Combinar investigação e intervenção para produzir mudanças sociais concretas com participação dos sujeitos.' },
      { id: 'opt4', text: 'Testar hipóteses estatísticas de forma rigorosamente controlada em laboratório.' }
    ],
    correctAnswer: 'opt3',
    feedback: 'Correto! A Pesquisa-Ação visa a transformação social através da colaboração e da aplicação prática do conhecimento gerado.',
    points: 10,
    estimatedTime: '4 mins'
  },
  {
    id: 'm7-e4',
    moduleId: 'mod-trilha7-0',
    title: 'Pesquisa Inclusiva',
    type: 'fill-in-the-blank',
    question: 'Na pesquisa inclusiva (ou emancipatória), as pessoas com deficiência são reconhecidas como ______ no processo de produção de conhecimento.',
    options: [
      {id: 'pi_opt1', text: 'colaboradoras e especialistas em suas vidas'},
      {id: 'pi_opt2', text: 'objetos passivos de estudo'},
      {id: 'pi_opt3', text: 'apenas fontes de dados brutos'}
    ],
    correctAnswer: 'colaboradoras e especialistas em suas vidas',
    feedback: 'Exato! A pesquisa inclusiva valoriza o protagonismo e o conhecimento experiencial das pessoas com deficiência.',
    points: 10,
    estimatedTime: '3 mins'
  },
  {
    id: 'm7-e5',
    moduleId: 'mod-trilha7-0',
    title: 'Consentimento Informado na Pesquisa',
    type: 'multiple-choice',
    question: 'Ao obter consentimento informado de uma pessoa com deficiência intelectual para participar de uma pesquisa, o que é eticamente crucial?',
    options: [
      { id: 'opt1', text: 'Acelerar o processo para não cansar o participante.' },
      { id: 'opt2', text: 'Usar linguagem técnica para garantir a precisão da informação.' },
      { id: 'opt3', text: 'Presumir incapacidade e obter consentimento apenas de um responsável legal.' },
      { id: 'opt4', text: 'Adaptar a linguagem e os materiais para garantir compreensão, oferecer suportes à decisão e verificar o consentimento de forma contínua.' }
    ],
    correctAnswer: 'opt4',
    feedback: 'Correto! O consentimento deve ser verdadeiramente informado e voluntário, com todas as adaptações necessárias para garantir a compreensão e autonomia do participante.',
    points: 10,
    estimatedTime: '4 mins'
  },
  {
    id: 'm7-e6',
    moduleId: 'mod-trilha7-0',
    title: 'Lema do Movimento de Pessoas com Deficiência',
    type: 'fill-in-the-blank',
    question: 'Qual lema, adotado pelo movimento internacional de pessoas com deficiência, enfatiza seu direito à participação nas decisões que as afetam?',
    options: [
      { id: 'lema_opt1', text: '"Ajuda para todos, por todos."' },
      { id: 'lema_opt2', text: '"Nada sobre nós, sem nós."' },
      { id: 'lema_opt3', text: '"Ver para crer, sentir para entender."'}
    ],
    correctAnswer: '"Nada sobre nós, sem nós."',
    feedback: 'Exato! Este lema é central para o movimento de direitos das pessoas com deficiência, demandando participação e protagonismo.',
    points: 10,
    estimatedTime: '3 mins'
  }
];
