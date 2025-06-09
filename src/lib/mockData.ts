
import type { RoadmapStep, Lesson, Exercise, DictionaryTerm, Achievement, UserProfile, Module, ExerciseOption } from './types';
import { BookOpen, Brain, Microscope, BarChart3, FileText, Scale, Landmark, Accessibility, UserCheck, PersonStanding, PackageSearch, UsersRound, GraduationCap, HelpingHand, Target, Radio, Type, Code, Puzzle, ListOrdered, MousePointerSquareDashed, Link2, ToyBrick, BookCopy } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// Importações dos arquivos de dados modulares
import { mockUserProfile as userProfileData } from './data/userProfile';
import { mockDictionaryTerms as dictionaryData } from './data/dictionary';
import { mockAchievements as achievementsData } from './data/achievements';

import { module1Lessons } from './data/module1Data';
import { module1Exercises } from './data/exercises/module1'; 

import { module2Lessons } from './data/module2Data';
import { module2Exercises } from './data/exercises/module2';

import { module3Lessons } from './data/module3Data';
import { module3Exercises } from './data/exercises/module3';

import { module4Lessons } from './data/module4Data';
import { module4Exercises } from './data/exercises/module4';

import { module5Lessons } from './data/module5Data';
import { module5Exercises } from './data/exercises/module5'; 

import { module6Lessons } from './data/module6Data';
import { module6Exercises } from './data/exercises/module6';

import { module7Lessons } from './data/module7Data';
import { module7Exercises } from './data/exercises/module7';

import { module8Lessons } from './data/module8Data';
import { module8Exercises } from './data/exercises/module8'; 

import { module9Lessons } from './data/module9Data';
import { module9Exercises } from './data/exercises/module9'; 

import { module10Lessons } from './data/module10Data';
import { module10Exercises } from './data/exercises/module10';

import { module11Lessons } from './data/module11Data'; 
import { module11Exercises } from './data/exercises/module11'; 

import { module12Lessons } from './data/module12Data';
import { module12Exercises } from './data/exercises/module12';


// Re-exportar os dados importados para que o resto do aplicativo possa acessá-los
export const mockUserProfile: UserProfile = userProfileData;
export const mockDictionaryTerms: DictionaryTerm[] = dictionaryData;
export const mockAchievements: Achievement[] = achievementsData;


// --- Trilhas de Conhecimento (Roadmap Steps) ---
export const mockRoadmapData: RoadmapStep[] = [
  {
    id: 'trilha1',
    title: 'Desenvolvimento Físico, Cognitivo, Social e Afetivo de crianças e adolescentes com deficiência.',
    order: 1,
    iconName: "UsersRound", 
    icon: UsersRound,
    description: 'Explore o desenvolvimento integral de crianças e adolescentes com deficiência em suas múltiplas dimensões: física, cognitiva, social e afetiva, e as intervenções que promovem seu bem-estar e inclusão.',
    modules: [{
      id: 'mod-trilha1-0',
      title: 'Compreendendo o Desenvolvimento Infanto-Juvenil com Deficiência',
      order: 1,
      lessons: module1Lessons,
      exercises: module1Exercises, 
      isCompleted: false, 
      progress: 0, 
    }],
    isCompleted: false, 
    isCurrent: false, 
  },
  {
    id: 'trilha2',
    title: 'Pessoas Adultas com Deficiência: Desenvolvimento, Direitos e Perspectivas.',
    order: 2,
    iconName: "UserCheck", 
    icon: UserCheck,
    description: 'Compreenda as particularidades do desenvolvimento, os direitos, a cidadania e as perspectivas de envelhecimento de pessoas adultas com deficiência.',
    modules: [{
      id: 'mod-trilha2-0',
      title: 'A Pessoa Adulta com Deficiência: Trajetórias e Desafios',
      order: 2,
      lessons: module2Lessons,
      exercises: module2Exercises,
      isCompleted: false,
      progress: 0,
    }],
    isCompleted: false,
    isCurrent: false,
  },
  {
    id: 'trilha3',
    title: 'Modelos de intervenção para o favorecimento do desenvolvimento de pessoas com deficiência.',
    order: 3,
    iconName: "ToyBrick", 
    icon: ToyBrick,
    description: 'Conheça e analise diferentes modelos de intervenção que visam promover o desenvolvimento e a inclusão de pessoas com deficiência em diversos contextos.',
    modules: [{
      id: 'mod-trilha3-0',
      title: 'Explorando Modelos de Intervenção em Deficiência',
      order: 3,
      lessons: module3Lessons, 
      exercises: module3Exercises, 
      isCompleted: false,
      progress: 0,
    }],
    isCompleted: false,
    isCurrent: false,
  },
  {
    id: 'trilha4',
    title: 'Principais abordagens teóricas relativas ao desenvolvimento da pessoa com deficiência.',
    order: 4,
    iconName: "Brain", 
    icon: Brain,
    description: 'Aprofunde-se nas principais teorias que fundamentam a compreensão do desenvolvimento de pessoas com deficiência, desde perspectivas clássicas até contemporâneas.',
    modules: [{
      id: 'mod-trilha4-0',
      title: 'Fundamentos Teóricos do Desenvolvimento na Deficiência',
      order: 4,
      lessons: module4Lessons,
      exercises: module4Exercises,
      isCompleted: false, 
      progress: 0,    
    }],
    isCompleted: false, 
    isCurrent: false, 
  },
  {
    id: 'trilha5',
    title: 'Contribuições da neuropsicologia para a compreensão dos fenômenos desenvolvimentais da Pessoa com Deficiência.',
    order: 5,
    iconName: "Microscope", 
    icon: Microscope,
    description: 'Descubra como a neuropsicologia contribui para entender os processos de desenvolvimento, as funções cognitivas e os comportamentos em pessoas com deficiência.',
    modules: [{
      id: 'mod-trilha5-0',
      title: 'Neuropsicologia Aplicada à Deficiência: Compreensão e Intervenção',
      order: 5,
      lessons: module5Lessons, 
      exercises: module5Exercises, 
      isCompleted: false,
      progress: 0,     
    }],
    isCompleted: false, 
    isCurrent: false,  
  },
  {
    id: 'trilha6',
    title: 'Fundamentos da Avaliação Psicológica e do Psicodiagnóstico da pessoa com deficiência.',
    order: 6,
    iconName: "BarChart3", 
    icon: BarChart3,
    description: 'Estude os fundamentos da avaliação psicológica e do psicodiagnóstico aplicados a pessoas com deficiência, considerando suas especificidades, instrumentos e ética.',
    modules: [{
      id: 'mod-trilha6-0',
      title: 'Avaliação Psicológica e Psicodiagnóstico em Pessoas com Deficiência',
      order: 6,
      lessons: module6Lessons, 
      exercises: module6Exercises, 
      isCompleted: false,
      progress: 0,
    }],
    isCompleted: false,
    isCurrent: false, 
  },
  {
    id: 'trilha7',
    title: 'Pesquisa com Pessoas com Deficiência: Tópicos, Métodos e Ética.',
    order: 7,
    iconName: "FileText", 
    icon: FileText,
    description: 'Explore temas de pesquisa, métodos de coleta e análise de dados (qualitativos, quantitativos e mistos), e as considerações éticas envolvidas na investigação científica sobre deficiência.',
    modules: [{
      id: 'mod-trilha7-0',
      title: 'Pesquisa Científica em Deficiência: Métodos e Ética',
      order: 7,
      lessons: module7Lessons,
      exercises: module7Exercises,
      isCompleted: false,
      progress: 0,
    }],
    isCompleted: false,
    isCurrent: false,
  },
  {
    id: 'trilha8',
    title: 'Implicações éticas da avaliação e intervenção com pessoas com deficiência.',
    order: 8,
    iconName: "Scale", 
    icon: Scale,
    description: 'Analise as implicações éticas relacionadas à avaliação e intervenção junto a pessoas com deficiência, promovendo práticas responsáveis e respeitosas.',
    modules: [{
      id: 'mod-trilha8-0',
      title: 'Ética Profissional na Atuação com Pessoas com Deficiência',
      order: 8,
      lessons: module8Lessons,
      exercises: module8Exercises, 
      isCompleted: false,
      progress: 0,
    }],
    isCompleted: false,
    isCurrent: false,
  },
  {
    id: 'trilha9',
    title: 'Políticas e Processos de inclusão da pessoa com deficiência nos contextos educacionais, laborais e sociais.',
    order: 9,
    iconName: "Landmark", 
    icon: Landmark,
    description: 'Conheça as políticas e os processos que visam a inclusão de pessoas com deficiência em diversos contextos, como educação, trabalho e sociedade.',
    modules: [{
      id: 'mod-trilha9-0',
      title: 'Políticas e Práticas de Inclusão: Educação, Trabalho e Sociedade',
      order: 9,
      lessons: module9Lessons,
      exercises: module9Exercises, 
      isCompleted: false,
      progress: 0,
    }],
    isCompleted: false,
    isCurrent: false,
  },
  {
    id: 'trilha10',
    title: 'Debates contemporâneos sobre processos de inclusão: desenho universal, neurodivergências, tecnologias assistivas e deficiência oculta.',
    order: 10,
    iconName: "Accessibility", 
    icon: Accessibility,
    description: 'Participe de debates atuais sobre inclusão, abordando temas como desenho universal, neurodivergência, tecnologias assistivas e deficiências ocultas.',
    modules: [{
      id: 'mod-trilha10-0',
      title: 'Temas Emergentes em Inclusão, Acessibilidade e Neurodiversidade',
      order: 10,
      lessons: module10Lessons,
      exercises: module10Exercises, 
      isCompleted: false,
      progress: 0,
    }],
    isCompleted: false,
    isCurrent: false,
  },
  {
    id: 'trilha11',
    title: 'Acesso, permanência e participação de pessoas com deficiência no Ensino Superior.',
    order: 11,
    iconName: "GraduationCap", 
    icon: GraduationCap,
    description: 'Discuta os desafios e os progressos relacionados ao acesso, permanência e participação de pessoas com deficiência no ensino superior.',
    modules: [{
      id: 'mod-trilha11-0',
      title: 'Inclusão e Acessibilidade no Contexto do Ensino Superior',
      order: 11,
      lessons: module11Lessons, 
      exercises: module11Exercises, 
      isCompleted: false,
      progress: 0,
    }],
    isCompleted: false,
    isCurrent: false,
  },
  {
    id: 'trilha12',
    title: 'Envelhecimento humano, funcionalidade, autonomia e qualidade de vida de pessoas idosas com deficiência e combate ao etarismo.',
    order: 12,
    iconName: "HelpingHand", 
    icon: HelpingHand,
    description: 'Aborde o envelhecimento humano, funcionalidade, autonomia, qualidade de vida de pessoas idosas (incluindo aquelas com deficiência) e estratégias de combate ao etarismo.',
    modules: [{
      id: 'mod-trilha12-0',
      title: 'Envelhecimento, Deficiência, Direitos e Combate ao Etarismo',
      order: 12,
      lessons: module12Lessons,
      exercises: module12Exercises,
      isCompleted: false,
      progress: 0,
    }],
    isCompleted: false,
    isCurrent: false,
  }
];

// --- Consolidar todos os dados e atualizar estados ---

const allModuleLessonsAggregated = mockRoadmapData.reduce((acc, step) => {
  step.modules.forEach(mod => {
    if (mod.lessons && Array.isArray(mod.lessons)) {
      acc.push(...mod.lessons);
    }
  });
  return acc;
}, [] as Lesson[]);


const allModuleExercisesAggregated = mockRoadmapData.reduce((acc, step) => {
  step.modules.forEach(mod => {
    if (mod.exercises && Array.isArray(mod.exercises)) {
      acc.push(...mod.exercises);
    }
  });
  return acc;
}, [] as Exercise[]);

export const mockLessons: Lesson[] = [...new Map(allModuleLessonsAggregated.map(item => [item.id, item])).values()];
export const mockExercises: Exercise[] = [...new Map(allModuleExercisesAggregated.map(item => [item.id, item])).values()];
export const mockModules: Module[] = mockRoadmapData.flatMap(step => step.modules);


// --- Categorias de Lições e Exercícios ---
// Esta variável é usada pela página de Lições para agrupar por módulo/trilha.
// Ela agora usa iconName diretamente.
export const finalLessonCategories: { name: string; iconName: string; lessons: Lesson[]; moduleId: string;}[] = mockRoadmapData.reduce((acc, roadmap) => {
  if (roadmap.modules && roadmap.modules.length > 0) {
    // Agrupa todas as lições de todos os módulos de uma trilha sob o título do primeiro módulo como nome da categoria.
    // Usa o iconName da trilha.
    const allLessonsInRoadmap = roadmap.modules.flatMap(mod => mod.lessons);
    if (allLessonsInRoadmap.length > 0) {
      acc.push({
        name: roadmap.modules[0].title || `Trilha ${roadmap.order}`, // Nome da categoria é o título do primeiro módulo
        iconName: roadmap.iconName || "BookOpen", // Usa o iconName da trilha
        lessons: [...new Map(allLessonsInRoadmap.map(item => [item.id, item])).values()],
        moduleId: roadmap.modules[0].id || roadmap.id, // ID da categoria para a aba
      });
    }
  }
  return acc;
}, [] as { name: string; iconName: string; lessons: Lesson[]; moduleId: string; }[]);


const allCategorizedLessonIds = new Set(finalLessonCategories.flatMap(cat => cat.lessons.map(l => l.id)));
const uncategorizedLessons = mockLessons.filter(l => !allCategorizedLessonIds.has(l.id));
if (uncategorizedLessons.length > 0) {
  const geralCategory = finalLessonCategories.find(cat => cat.moduleId === "geral-outros");
  if (geralCategory) {
    geralCategory.lessons.push(...uncategorizedLessons);
    geralCategory.lessons = [...new Map(geralCategory.lessons.map(item => [item.id, item])).values()];
  } else {
    finalLessonCategories.push({
      name: "Geral/Outros",
      iconName: "PackageSearch",
      lessons: [...new Map(uncategorizedLessons.map(item => [item.id, item])).values()],
      moduleId: "geral-outros"
    });
  }
}


export const exerciseCategories: { name: string; icon: LucideIcon; exercises: Exercise[] }[] = [
  { name: "Múltipla Escolha", icon: Radio, exercises: mockExercises.filter(e => e.type === 'multiple-choice') },
  { name: "Preencher Lacunas", icon: Type, exercises: mockExercises.filter(e => e.type === 'fill-in-the-blank') },
  { name: "Associação", icon: Link2, exercises: mockExercises.filter(e => e.type === 'association') },
  { name: "Ordenação", icon: ListOrdered, exercises: mockExercises.filter(e => e.type === 'ordering') },
  { name: "Categorização (Drag & Drop)", icon: MousePointerSquareDashed, exercises: mockExercises.filter(e => e.type === 'drag-and-drop') },
  { name: "Estudo de Caso/Análise", icon: BookCopy, exercises: [] }, 
  { name: "Programação (Placeholder)", icon: Code, exercises: mockExercises.filter(e => e.type === 'coding') },
  { name: "Outros Tipos", icon: Puzzle, exercises: mockExercises.filter(e => !['multiple-choice', 'fill-in-the-blank', 'association', 'ordering', 'drag-and-drop', 'coding'].includes(e.type))},
];

exerciseCategories.forEach(cat => cat.exercises = [...new Map(cat.exercises.map(item => [item.id, item])).values()]);

const allCategorizedExerciseIds = new Set(exerciseCategories.flatMap(cat => cat.exercises.map(e => e.id)));
const uncategorizedExercises = mockExercises.filter(e => !allCategorizedExerciseIds.has(e.id));
const outrosExercisesCategory = exerciseCategories.find(cat => cat.name === "Outros Tipos");
if (outrosExercisesCategory && uncategorizedExercises.length > 0) {
  outrosExercisesCategory.exercises.push(...uncategorizedExercises);
  outrosExercisesCategory.exercises = [...new Map(outrosExercisesCategory.exercises.map(item => [item.id, item])).values()];
}


mockUserProfile.completedLessons = [...new Set(mockUserProfile.completedLessons)];
mockUserProfile.completedExercises = [...new Set(mockUserProfile.completedExercises)];
mockUserProfile.completedModules = [...new Set(mockUserProfile.completedModules)];

let firstUncompletedTrilhaFound = false;
mockRoadmapData.forEach(trilha => {
  let allModulesInTrilhaCompleted = true;
  if (trilha.modules && trilha.modules.length > 0) {
    trilha.modules.forEach(module => {
      const totalModuleLessons = module.lessons ? module.lessons.length : 0;
      const completedModuleLessons = module.lessons ? module.lessons.filter(l => mockUserProfile.completedLessons.includes(l.id)).length : 0;
      
      const exercisesForThisModule = mockExercises.filter(ex => ex.moduleId === module.id);
      const totalModuleExercises = exercisesForThisModule.length;
      const completedModuleExercises = exercisesForThisModule.filter(e => mockUserProfile.completedExercises.includes(e.id)).length;
      
      const totalModuleItems = totalModuleLessons + totalModuleExercises;
      const completedModuleItems = completedModuleLessons + completedModuleExercises;

      module.progress = totalModuleItems > 0 ? Math.round((completedModuleItems / totalModuleItems) * 100) : 0;
      
      if (totalModuleItems > 0) {
        module.isCompleted = module.progress === 100;
      } else {
        // Se não há itens, considera completo se o módulo estiver na lista de completados do usuário
        // ou se não há itens E já estava marcado como completo (para persistir um estado manual se necessário)
        module.isCompleted = mockUserProfile.completedModules.includes(module.id);
      }
      
      if (!module.isCompleted) {
        allModulesInTrilhaCompleted = false;
      }
    });
    trilha.isCompleted = allModulesInTrilhaCompleted;
  } else {
    // Trilha sem módulos é considerada não completa por padrão, a menos que queiramos outra lógica
    trilha.isCompleted = false; 
  }

  if (!trilha.isCompleted && !firstUncompletedTrilhaFound) {
      trilha.isCurrent = true;
      firstUncompletedTrilhaFound = true;
  } else {
      trilha.isCurrent = false;
  }
});

if (mockRoadmapData.length > 0 && mockRoadmapData.every(t => t.isCompleted)) {
    // Se todas as trilhas estão completas, nenhuma é "atual"
    mockRoadmapData.forEach(t => t.isCurrent = false); 
} else if (!firstUncompletedTrilhaFound && mockRoadmapData.length > 0) { 
    // Se nenhuma "atual" foi encontrada (ex: todas não completas mas nenhuma explicitamente marcada como atual)
    // e há trilhas, marca a primeira não completa como atual.
    // Se todas estiverem completas, este bloco não é executado, mas o anterior já tratou disso.
    // Se todas foram marcadas como completas exceto a última, e a última não foi marcada como atual, este bloco corrige.
    const firstNotDone = mockRoadmapData.find(t => !t.isCompleted);
    if (firstNotDone) {
        firstNotDone.isCurrent = true;
    } else {
        // Caso de fallback extremo: se não há trilhas não completas, mas o loop não marcou
        // nenhuma como current (o que não deveria acontecer se houver trilhas),
        // marca a primeira como current, assumindo que não está completa.
        // Esta lógica pode ser redundante com a de cima.
        if (mockRoadmapData.length > 0 && !mockRoadmapData[0].isCompleted && !mockRoadmapData.some(t => t.isCurrent)) {
             mockRoadmapData[0].isCurrent = true;
        }
    }
}
