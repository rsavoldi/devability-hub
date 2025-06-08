
import type { Exercise } from '@/lib/types';

export const module11DragAndDropExercises: Exercise[] = [
  {
    id: 'm11-e13-new',
    moduleId: 'mod-trilha11-0',
    title: 'Barreiras vs. Facilitadores na Permanência no Ensino Superior',
    type: 'drag-and-drop',
    question: 'Categorize os seguintes elementos como "Barreiras à Permanência" ou "Facilitadores da Permanência" de estudantes com deficiência no Ensino Superior.',
    options: [
      { id: 'item_aee', text: 'Atendimento Educacional Especializado (AEE) eficaz' },
      { id: 'item_preconceito', text: 'Preconceito e baixas expectativas de professores' },
      { id: 'item_inacessibilidade', text: 'Campi com inacessibilidade arquitetônica' },
      { id: 'item_politicas', text: 'Políticas institucionais de inclusão abrangentes' },
      { id: 'item_materiais', text: 'Materiais didáticos apenas em formato impresso padrão' },
      { id: 'item_redes', text: 'Redes de apoio entre pares e mentoria' }
    ],
    targetCategories: [
      { id: 'cat_barreiras', text: 'Barreiras à Permanência' },
      { id: 'cat_facilitadores', text: 'Facilitadores da Permanência' }
    ],
    correctAnswer: {
      'item_aee': 'cat_facilitadores',
      'item_preconceito': 'cat_barreiras',
      'item_inacessibilidade': 'cat_barreiras',
      'item_politicas': 'cat_facilitadores',
      'item_materiais': 'cat_barreiras',
      'item_redes': 'cat_facilitadores'
    },
    feedback: 'Ótima categorização! Identificar o que dificulta e o que ajuda é essencial para promover a permanência com sucesso.',
    points: 20,
    estimatedTime: '3 mins'
  },
  {
    id: 'm11-e14-new',
    moduleId: 'mod-trilha11-0',
    title: 'Tipos de Acessibilidade no Ensino Superior',
    type: 'drag-and-drop',
    question: 'Categorize os exemplos de medidas de acessibilidade no ensino superior.',
    options: [
      { id: 'acess_rampa', text: 'Instalação de rampas e elevadores nos prédios.' },
      { id: 'acess_libras', text: 'Disponibilização de intérpretes de Libras em aulas e eventos.' },
      { id: 'acess_tempo', text: 'Concessão de tempo adicional para realização de provas.' },
      { id: 'acess_software', text: 'Softwares leitores de tela nos computadores da biblioteca.' },
      { id: 'acess_sensibilizacao', text: 'Programas de sensibilização para combater o capacitismo na comunidade acadêmica.' },
      { id: 'acess_material_digital', text: 'Disponibilização de materiais didáticos em formatos digitais acessíveis.' }
    ],
    targetCategories: [
      { id: 'cat_acess_fisica', text: 'Acessibilidade Arquitetônica/Física' },
      { id: 'cat_acess_comunicacional', text: 'Acessibilidade Comunicacional/Informacional' },
      { id: 'cat_acess_pedagogica', text: 'Acessibilidade Pedagógica/Metodológica' },
      { id: 'cat_acess_atitudinal', text: 'Acessibilidade Atitudinal' }
    ],
    correctAnswer: {
      'acess_rampa': 'cat_acess_fisica',
      'acess_libras': 'cat_acess_comunicacional',
      'acess_tempo': 'cat_acess_pedagogica',
      'acess_software': 'cat_acess_comunicacional',
      'acess_sensibilizacao': 'cat_acess_atitudinal',
      'acess_material_digital': 'cat_acess_pedagogica'
    },
    feedback: 'Excelente! A acessibilidade no ensino superior é multidimensional, abrangendo aspectos físicos, comunicacionais, pedagógicos e atitudinais.',
    points: 20,
    estimatedTime: '3 mins'
  }
];
