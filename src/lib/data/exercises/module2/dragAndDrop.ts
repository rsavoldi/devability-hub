
import type { Exercise } from '@/lib/types';

export const module2DragAndDropExercises: Exercise[] = [
  {
    id: 'm2-e11',
    moduleId: 'mod-trilha2-0',
    title: 'Categorização de Tipos de Cuidados de Longa Duração',
    type: 'drag-and-drop',
    question: 'Categorize os seguintes exemplos como "Cuidados Informais", "Cuidados Formais Domiciliares" ou "Cuidados Institucionais" (Lição 2.8):',
    options: [
      { id: 'cld_item1', text: 'Filha cuidando da mãe idosa em casa' },
      { id: 'cld_item2', text: 'Enfermeira visitando para aplicar medicação em casa (serviço contratado)' },
      { id: 'cld_item3', text: 'Idoso residindo em uma Instituição de Longa Permanência (ILPI)' },
      { id: 'cld_item4', text: 'Vizinho ajudando com compras semanalmente' },
      { id: 'cld_item5', text: 'Idoso frequentando um Centro-Dia' },
      { id: 'cld_item6', text: 'Fisioterapeuta atendendo em domicílio (plano de saúde)' },
    ],
    targetCategories: [
      { id: 'cat-informal', text: 'Cuidados Informais' },
      { id: 'cat-formal-dom', text: 'Cuidados Formais Domiciliares' },
      { id: 'cat-institucional', text: 'Cuidados Institucionais' },
    ],
    correctAnswer: {
      'cld_item1': 'cat-informal',
      'cld_item2': 'cat-formal-dom',
      'cld_item3': 'cat-institucional',
      'cld_item4': 'cat-informal',
      'cld_item5': 'cat-institucional', // Centro-Dia é um tipo de cuidado institucional/semi-institucional
      'cld_item6': 'cat-formal-dom',
    },
    feedback: 'Boa categorização! Cuidados informais são geralmente por familiares/amigos. Formais domiciliares são por profissionais em casa. Institucionais são em locais como ILPIs ou Centros-Dia.',
    points: 20,
    estimatedTime: '3 mins'
  },
  {
    id: 'm2-e15', // Novo ID
    moduleId: 'mod-trilha2-0',
    title: 'Direitos vs. Desafios do Idoso com Deficiência',
    type: 'drag-and-drop',
    question: 'Categorize os itens a seguir como "Direitos Garantidos (Legalmente)" ou "Desafios Comuns Enfrentados" por idosos com deficiência (Lições 2.6, 2.9):',
    options: [
      { id: 'dd_itemA', text: 'Prioridade no atendimento em serviços públicos (Estatuto do Idoso)' },
      { id: 'dd_itemB', text: 'Acesso limitado a serviços de reabilitação adequados' },
      { id: 'dd_itemC', text: 'Discriminação múltipla (etarismo + capacitismo)' },
      { id: 'dd_itemD', text: 'Direito à acessibilidade (LBI)' },
      { id: 'dd_itemE', text: 'Risco aumentado de institucionalização por falta de suporte comunitário' },
      { id: 'dd_itemF', text: 'Direito ao Benefício de Prestação Continuada (BPC), se elegível' },
    ],
    targetCategories: [
      { id: 'cat-direitos', text: 'Direitos Garantidos (Legalmente)' },
      { id: 'cat-desafios', text: 'Desafios Comuns Enfrentados' },
    ],
    correctAnswer: {
      'dd_itemA': 'cat-direitos',
      'dd_itemB': 'cat-desafios',
      'dd_itemC': 'cat-desafios',
      'dd_itemD': 'cat-direitos',
      'dd_itemE': 'cat-desafios',
      'dd_itemF': 'cat-direitos',
    },
    feedback: 'Excelente! É importante distinguir os direitos assegurados dos desafios que ainda persistem na prática.',
    points: 20,
    estimatedTime: '3 mins'
  },
  {
    id: 'm2-e19',
    moduleId: 'mod-trilha2-0',
    title: 'Recursos para Autonomia e Vida Independente',
    type: 'drag-and-drop',
    question: 'Categorize os recursos a seguir como \"Tecnologia Assistiva\", \"Serviços Comunitários\" ou \"Suporte Individualizado\" no contexto da autonomia de adultos com deficiência (Lições 2.1, 2.4):',
    options: [
      { id: 'rec_item1', text: 'Cadeira de rodas motorizada' },
      { id: 'rec_item2', text: 'Programa de vida independente subsidiado' },
      { id: 'rec_item3', text: 'Assistente pessoal para atividades diárias' },
      { id: 'rec_item4', text: 'Aplicativo de comunicação alternativa' },
      { id: 'rec_item5', text: 'Centro de convivência para pessoas com deficiência' },
      { id: 'rec_item6', text: 'Intérprete de Libras para consultas médicas' },
    ],
    targetCategories: [
      { id: 'cat-tecnologia', text: 'Tecnologia Assistiva' },
      { id: 'cat-servicos', text: 'Serviços Comunitários' },
      { id: 'cat-suporte', text: 'Suporte Individualizado' },
    ],
    correctAnswer: {
      'rec_item1': 'cat-tecnologia',
      'rec_item2': 'cat-servicos',
      'rec_item3': 'cat-suporte',
      'rec_item4': 'cat-tecnologia',
      'rec_item5': 'cat-servicos',
      'rec_item6': 'cat-suporte',
    },
    feedback: 'Muito bem! Conhecer os diferentes tipos de recursos é fundamental para promover a autonomia e a vida independente.',
    points: 20,
    estimatedTime: '3 mins'
  },
  {
    id: 'm2-e20',
    moduleId: 'mod-trilha2-0',
    title: 'Impacto da Multimorbidade',
    type: 'drag-and-drop',
    question: 'Categorize os impactos da multimorbidade em idosos com deficiência como \"Saúde Física\", \"Bem-estar Psicossocial\" ou \"Necessidades de Cuidado\" (Lição 2.6):',
    options: [
      { id: 'multi_item1', text: 'Aumento da fragilidade' },
      { id: 'multi_item2', text: 'Maior risco de isolamento social' },
      { id: 'multi_item3', text: 'Necessidade de múltiplos medicamentos' },
      { id: 'multi_item4', text: 'Dificuldade em manter a independência nas AVDs' },
      { id: 'multi_item5', text: 'Aumento do estresse para cuidadores' },
      { id: 'multi_item6', text: 'Declínio na qualidade de vida percebida' },
    ],
    targetCategories: [
      { id: 'cat-fisica', text: 'Saúde Física' },
      { id: 'cat-psicossocial', text: 'Bem-estar Psicossocial' },
      { id: 'cat-cuidado', text: 'Necessidades de Cuidado' },
    ],
    correctAnswer: {
      'multi_item1': 'cat-fisica',
      'multi_item2': 'cat-psicossocial',
      'multi_item3': 'cat-cuidado',
      'multi_item4': 'cat-fisica',
      'multi_item5': 'cat-cuidado',
      'multi_item6': 'cat-psicossocial',
    },
    feedback: 'Correto! A multimorbidade afeta diversos aspectos da vida, exigindo uma abordagem de cuidado integral.',
    points: 20,
    estimatedTime: '3 mins'
  }
];
