
import type { Exercise } from '@/lib/types';

export const module10OrderingExercises: Exercise[] = [
  {
    id: 'm10-e11-new',
    moduleId: 'mod-trilha10-0',
    title: 'Processo de Divulgação da Deficiência Oculta (Simplificado)',
    type: 'ordering',
    question: 'Ordene as considerações que uma pessoa com deficiência oculta pode fazer ao decidir sobre a divulgação de sua condição (de uma reflexão interna para uma ação).',
    options: [
      { id: 'do_ord2', text: 'Ponderar potenciais benefícios (suportes, compreensão) vs. riscos (estigma, discriminação).' },
      { id: 'do_ord1', text: 'Reconhecer internamente os desafios e necessidades relacionados à condição.' },
      { id: 'do_ord4', text: 'Decidir como e para quem revelar, se optar por fazê-lo.' },
      { id: 'do_ord3', text: 'Avaliar o ambiente específico (ex: trabalho, social) e a receptividade.' }
    ],
    correctAnswer: ['do_ord1', 'do_ord2', 'do_ord3', 'do_ord4'],
    feedback: 'Boa sequência! A decisão de divulgar uma deficiência oculta é complexa e envolve múltiplas considerações pessoais e contextuais.',
    points: 15,
    estimatedTime: '3 mins'
  },
  {
    id: 'm10-e12-new',
    moduleId: 'mod-trilha10-0',
    title: 'Evolução da Compreensão da Neurodiversidade (Simplificado)',
    type: 'ordering',
    question: 'Ordene as seguintes perspectivas sobre diferenças neurológicas, da mais tradicional/patologizante para a mais atual/inclusiva.',
    options: [
      { id: 'nd_ord2', text: 'Foco em tratamento para "normalizar" o indivíduo.' },
      { id: 'nd_ord1', text: 'Diferenças neurológicas vistas como déficits ou transtornos.' },
      { id: 'nd_ord4', text: 'Valorização das diferenças como parte da diversidade humana, com foco em adaptações ambientais e pontos fortes.' },
      { id: 'nd_ord3', text: 'Reconhecimento de desafios, mas com questionamento da patologização exclusiva.' }
    ],
    correctAnswer: ['nd_ord1', 'nd_ord2', 'nd_ord3', 'nd_ord4'],
    feedback: 'Correto! A compreensão evoluiu de um modelo puramente médico para uma perspectiva que valoriza a neurodiversidade e a inclusão.',
    points: 15,
    estimatedTime: '3 mins'
  }
];
