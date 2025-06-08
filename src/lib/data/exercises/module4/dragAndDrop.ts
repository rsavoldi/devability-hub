
import type { Exercise } from '@/lib/types';

export const module4DragAndDropExercises: Exercise[] = [
  {
    id: 'm4-e13',
    moduleId: 'mod-trilha4-0',
    title: 'Modelo Médico vs. Modelo Social',
    type: 'drag-and-drop',
    question: 'Categorize as seguintes afirmações como pertencentes ao "Modelo Médico" ou ao "Modelo Social" da deficiência:',
    options: [
      { id: 'mmvs_opt1', text: 'A deficiência é um problema individual.' },
      { id: 'mmvs_opt2', text: 'A sociedade é o principal problema incapacitante.' },
      { id: 'mmvs_opt3', text: 'O foco é na cura ou reabilitação do indivíduo.' },
      { id: 'mmvs_opt4', text: 'O foco é na remoção de barreiras e na mudança social.' },
      { id: 'mmvs_opt5', text: 'A pessoa com deficiência é vista como paciente.' },
      { id: 'mmvs_opt6', text: 'A pessoa com deficiência é vista como cidadão com direitos.' },
    ],
    targetCategories: [
      { id: 'cat-medico', text: 'Modelo Médico' },
      { id: 'cat-social', text: 'Modelo Social' },
    ],
    correctAnswer: {
      'mmvs_opt1': 'cat-medico',
      'mmvs_opt2': 'cat-social',
      'mmvs_opt3': 'cat-medico',
      'mmvs_opt4': 'cat-social',
      'mmvs_opt5': 'cat-medico',
      'mmvs_opt6': 'cat-social',
    },
    feedback: 'Excelente categorização! É fundamental distinguir as premissas e focos de cada modelo para entender a evolução das abordagens sobre deficiência.',
    points: 20,
    estimatedTime: '3 mins'
  },
  {
    id: 'm4-e14',
    moduleId: 'mod-trilha4-0',
    title: 'Fatores Ambientais da CIF: Barreiras vs. Facilitadores',
    type: 'drag-and-drop',
    question: 'Categorize os seguintes exemplos de Fatores Ambientais (CIF) como "Barreiras" ou "Facilitadores" para a funcionalidade:',
    options: [
      { id: 'cif_env_opt1', text: 'Rampas de acesso em edifícios públicos.' },
      { id: 'cif_env_opt2', text: 'Preconceito e estigma na comunidade.' },
      { id: 'cif_env_opt3', text: 'Disponibilidade de tecnologia assistiva adequada.' },
      { id: 'cif_env_opt4', text: 'Falta de legendas em vídeos informativos.' },
      { id: 'cif_env_opt5', text: 'Leis e políticas públicas inclusivas.' },
      { id: 'cif_env_opt6', text: 'Transporte público inacessível.' },
    ],
    targetCategories: [
      { id: 'cat-barreiras', text: 'Barreiras Ambientais' },
      { id: 'cat-facilitadores', text: 'Facilitadores Ambientais' },
    ],
    correctAnswer: {
      'cif_env_opt1': 'cat-facilitadores',
      'cif_env_opt2': 'cat-barreiras',
      'cif_env_opt3': 'cat-facilitadores',
      'cif_env_opt4': 'cat-barreiras',
      'cif_env_opt5': 'cat-facilitadores',
      'cif_env_opt6': 'cat-barreiras',
    },
    feedback: 'Ótima categorização! Reconhecer barreiras e facilitadores no ambiente é essencial na abordagem da CIF para promover a funcionalidade.',
    points: 20,
    estimatedTime: '3 mins'
  }
];
