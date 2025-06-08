
import type { Exercise } from '@/lib/types';

export const module11MultipleChoiceExercises: Exercise[] = [
  {
    id: 'm11-e1',
    moduleId: 'mod-trilha11-0',
    title: 'Fases da Inclusão no Ensino Superior Brasileiro',
    type: 'multiple-choice',
    question: 'Segundo Cabral (2017), qual fase do processo de inclusão de pessoas com deficiência no Ensino Superior brasileiro foi marcada pelo reconhecimento da responsabilidade institucional em promover condições de acesso, permanência e participação?',
    options: [
      { id: 'opt1', text: 'Fase de Exclusão (até 1980s)' },
      { id: 'opt2', text: 'Fase de Integração (1980s-1990s)' },
      { id: 'opt3', text: 'Fase de Inclusão (a partir dos 2000s)' },
      { id: 'opt4', text: 'Fase de Segregação (pós-2010)' }
    ],
    correctAnswer: 'opt3',
    feedback: 'Correto! A Fase de Inclusão, a partir dos anos 2000, é caracterizada pelo reconhecimento da responsabilidade institucional.',
    points: 10,
    estimatedTime: '2 mins'
  },
  {
    id: 'm11-e4',
    moduleId: 'mod-trilha11-0',
    title: 'Desenho Universal no Ensino Superior',
    type: 'multiple-choice',
    question: 'Qual o objetivo principal do Desenho Universal (DU) aplicado ao Ensino Superior, segundo Burgstahler (2015)?',
    options: [
      { id: 'du_opt1', text: 'Criar cursos e serviços exclusivos para estudantes com deficiência.' },
      { id: 'du_opt2', text: 'Padronizar todos os materiais e métodos para facilitar a gestão.' },
      { id: 'du_opt3', text: 'Criar ambientes, programas e serviços utilizáveis por todas as pessoas, na maior extensão possível, sem necessidade de adaptação especializada.' },
      { id: 'du_opt4', text: 'Reduzir o rigor acadêmico para facilitar a aprovação de todos.' }
    ],
    correctAnswer: 'du_opt3',
    feedback: 'Correto! O DU no Ensino Superior visa a criação de ambientes e serviços inerentemente acessíveis a todos.',
    points: 10,
    estimatedTime: '2 mins',
  },
  {
    id: 'm11-e6',
    moduleId: 'mod-trilha11-0',
    title: 'Interseccionalidade na Inclusão Universitária',
    type: 'multiple-choice',
    question: 'Por que é importante considerar a interseccionalidade (ex: deficiência e raça, deficiência e gênero) nas políticas de inclusão no ensino superior?',
    options: [
      { id: 'inter_opt1', text: 'Para focar apenas no grupo majoritário de estudantes com deficiência.' },
      { id: 'inter_opt2', text: 'Porque simplifica a criação de políticas universais, tratando todos da mesma forma.' },
      { id: 'inter_opt3', text: 'Para compreender como múltiplas dimensões de identidade e posição social interagem, criando experiências e barreiras específicas.' },
      { id: 'inter_opt4', text: 'Porque é uma exigência legal que não afeta a prática.' }
    ],
    correctAnswer: 'inter_opt3',
    feedback: 'Correto! A interseccionalidade permite desenvolver políticas e práticas mais efetivas ao reconhecer a complexidade das experiências de estudantes com múltiplas identidades marginalizadas.',
    points: 10,
    estimatedTime: '2 mins',
  },
  {
    id: 'm11-e7-new',
    moduleId: 'mod-trilha11-0',
    title: 'Programa Incluir (2005)',
    type: 'multiple-choice',
    question: 'Qual foi o principal objetivo do Programa Incluir, lançado em 2005 pelo MEC, no contexto da inclusão no ensino superior?',
    options: [
      { id: 'incluir_opt1', text: 'Criar universidades exclusivas para pessoas com deficiência.' },
      { id: 'incluir_opt2', text: 'Fomentar a criação e consolidação de núcleos de acessibilidade nas IES federais.' },
      { id: 'incluir_opt3', text: 'Oferecer bolsas de estudo integrais em instituições privadas apenas.' },
      { id: 'incluir_opt4', text: 'Padronizar o currículo de todos os cursos para facilitar o acesso.' }
    ],
    correctAnswer: 'incluir_opt2',
    feedback: 'Correto! O Programa Incluir foi fundamental para estruturar o apoio à acessibilidade nas IES federais, através dos núcleos de acessibilidade.',
    points: 10,
    estimatedTime: '2 mins'
  },
  {
    id: 'm11-e8-new',
    moduleId: 'mod-trilha11-0',
    title: 'Desafios Sociais na Permanência',
    type: 'multiple-choice',
    question: 'Além das barreiras acadêmicas e físicas, qual desafio social estudantes com deficiência frequentemente enfrentam no ensino superior, segundo Moreira (2005)?',
    options: [
      { id: 'social_opt1', text: 'Excesso de atividades extracurriculares obrigatórias.' },
      { id: 'social_opt2', text: 'Competição acirrada por bolsas de pesquisa.' },
      { id: 'social_opt3', text: 'Atitudes negativas, preconceitos e baixas expectativas, levando a isolamento ou superproteção.' },
      { id: 'social_opt4', text: 'Falta de interesse em interagir com colegas.' }
    ],
    correctAnswer: 'social_opt3',
    feedback: 'Exato! As barreiras atitudinais e o impacto no sentimento de pertencimento são desafios sociais significativos.',
    points: 10,
    estimatedTime: '2 mins'
  },
  {
    id: 'm11-e9-new',
    moduleId: 'mod-trilha11-0',
    title: 'Desenho Universal para Aprendizagem (DUA) no Ensino Superior',
    type: 'multiple-choice',
    question: 'Qual é um dos três princípios fundamentais do Desenho Universal para Aprendizagem (DUA) que pode ser aplicado para tornar o ensino superior mais inclusivo?',
    options: [
      { id: 'dua_es_opt1', text: 'Múltiplos meios de avaliação padronizada.' },
      { id: 'dua_es_opt2', text: 'Múltiplos meios de representação da informação.' },
      { id: 'dua_es_opt3', text: 'Múltiplos meios de segregação por habilidade.' },
      { id: 'dua_es_opt4', text: 'Múltiplos meios de competição entre estudantes.' }
    ],
    correctAnswer: 'dua_es_opt2',
    feedback: 'Correto! Múltiplos meios de representação, ação/expressão e engajamento são os pilares do DUA, aplicáveis também ao ensino superior.',
    points: 10,
    estimatedTime: '2 mins'
  }
];
