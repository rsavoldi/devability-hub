
import type { Exercise } from '@/lib/types';

export const module7FillInTheBlankExercises: Exercise[] = [
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
    estimatedTime: '2 mins'
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
    estimatedTime: '2 mins'
  }
];
