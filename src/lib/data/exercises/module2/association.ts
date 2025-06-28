
import type { Exercise } from '@/lib/types';

export const module2AssociationExercises: Exercise[] = [
  {
    id: 'm2-e4',
    moduleId: 'mod-trilha2-0',
    title: 'Etarismo e Capacitismo',
    type: 'association',
    question: 'Associe os termos da Coluna A com suas definições corretas na Coluna B, conforme discutido na Lição 2.9.',
    options: [
      { id: 'a1', text: 'Coluna A: Etarismo' }, { id: 'b1', text: 'Coluna B: Preconceito e discriminação baseados na idade.' },
      { id: 'a2', text: 'Coluna A: Capacitismo' }, { id: 'b2', text: 'Coluna B: Preconceito e discriminação baseados na deficiência.' },
      { id: 'a3', text: 'Coluna A: Estatuto do Idoso' }, { id: 'b3', text: 'Coluna B: Lei brasileira que assegura direitos às pessoas com 60 anos ou mais.' },
      { id: 'a4', text: 'Coluna A: LBI' }, { id: 'b4', text: 'Coluna B: Lei Brasileira de Inclusão, que garante direitos às pessoas com deficiência.' },
    ],
    correctAnswer: ["a1-b1", "a2-b2", "a3-b3", "a4-b4"],
    feedback: 'Excelentes associações! Compreender etarismo e capacitismo é vital para combater a discriminação.',
    points: 20,
    estimatedTime: '3 mins',
  },
  {
    id: 'm2-e8',
    moduleId: 'mod-trilha2-0',
    title: 'Conceitos Cognitivos na Vida Adulta',
    type: 'association',
    question: 'Associe os conceitos cognitivos da vida adulta (Coluna A) com suas descrições (Coluna B), conforme a Lição 2.3.',
    options: [
      { id: 'cca1', text: 'Coluna A: Plasticidade Cerebral Adulta' }, { id: 'ccb1', text: 'Coluna B: Capacidade do cérebro de se reorganizar e formar novas conexões mesmo na idade adulta.' },
      { id: 'cca2', text: 'Coluna A: Funções Executivas (FE)' }, { id: 'ccb2', text: 'Coluna B: Habilidades como planejamento, organização e flexibilidade cognitiva, cruciais para adaptação.' },
      { id: 'cca3', text: 'Coluna A: Reserva Cognitiva' }, { id: 'ccb3', text: 'Coluna B: Capacidade do cérebro de lidar com danos mantendo o funcionamento, construída por experiências estimulantes.' },
    ],
    correctAnswer: ["cca1-ccb1", "cca2-ccb2", "cca3-ccb3"],
    feedback: 'Ótimas associações! Esses conceitos são chave para entender o potencial cognitivo na vida adulta com deficiência.',
    points: 15,
    estimatedTime: '3 mins',
  },
  {
    id: 'm2-e16',
    moduleId: 'mod-trilha2-0',
    title: 'Marcos da Transição para a Vida Adulta',
    type: 'association',
    question: 'Associe os marcos da transição para a vida adulta (Coluna A) com suas descrições ou exemplos (Coluna B), de acordo com a Lição 2.1.',
    options: [
      { id: 'mt1a', text: 'Coluna A: Educação Superior/Profissionalizante' }, { id: 'mt1b', text: 'Coluna B: Busca por qualificação para o mercado de trabalho.' },
      { id: 'mt2a', text: 'Coluna A: Vida Independente' }, { id: 'mt2b', text: 'Coluna B: Morar sozinho ou com pouca supervisão, gerenciar finanças.' },
      { id: 'mt3a', text: 'Coluna A: Relacionamentos Interpessoais' }, { id: 'mt3b', text: 'Coluna B: Construção de amizades duradouras e possíveis relacionamentos amorosos.' },
    ],
    correctAnswer: ["mt1a-mt1b", "mt2a-mt2b", "mt3a-mt3b"],
    feedback: 'Muito bem! A transição envolve diversas áreas da vida, buscando maior autonomia e participação social.',
    points: 15,
    estimatedTime: '3 mins',
  },
  {
    id: 'm2-e17',
    moduleId: 'mod-trilha2-0',
    title: 'Tipos de Cuidados de Longa Duração',
    type: 'association',
    question: 'Associe o tipo de cuidado de longa duração (Coluna A) com sua principal característica (Coluna B), conforme a Lição 2.8.',
    options: [
      { id: 'tcd1a', text: 'Coluna A: Cuidado Informal' }, { id: 'tcd1b', text: 'Coluna B: Prestado por familiares, amigos ou vizinhos, sem remuneração formal.' },
      { id: 'tcd2a', text: 'Coluna A: Cuidado Formal Domiciliar' }, { id: 'tcd2b', text: 'Coluna B: Prestado por profissionais remunerados no domicílio da pessoa.' },
      { id: 'tcd3a', text: 'Coluna A: Cuidado Institucional' }, { id: 'tcd3b', text: 'Coluna B: Prestado em instituições como ILPIs ou Centros-Dia.' },
    ],
    correctAnswer: ["tcd1a-tcd1b", "tcd2a-tcd2b", "tcd3a-tcd3b"],
    feedback: 'Ótimo! Compreender os tipos de cuidados é essencial para planejar o suporte necessário.',
    points: 15,
    estimatedTime: '3 mins',
  },


];

