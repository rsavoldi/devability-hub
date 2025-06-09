
import type { RoadmapStep, Lesson, Exercise, DictionaryTerm, Achievement, UserProfile, Module, ExerciseOption } from './types';
import { BookOpen, Brain, Microscope, BarChart3, FileText, Scale, Landmark, Accessibility, UserCheck, PersonStanding, PackageSearch, UsersRound, GraduationCap, HelpingHand, Target, Radio, Type, Code, Puzzle, ListOrdered, MousePointerSquareDashed, Link2, ToyBrick } from 'lucide-react';
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
    iconName: "UsersRound", // Removido emoji, iconName é a fonte
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
    iconName: "UserCheck", // Removido emoji, iconName é a fonte
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
    iconName: "ToyBrick", // Removido emoji, iconName é a fonte
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
    iconName: "Brain", // Removido emoji, iconName é a fonte
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
    iconName: "Microscope", // Removido emoji, iconName é a fonte
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
    iconName: "BarChart3", // Removido emoji, iconName é a fonte
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
    iconName: "FileText", // Removido emoji, iconName é a fonte
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
    iconName: "Scale", // Removido emoji, iconName é a fonte
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
    iconName: "Landmark", // Removido emoji, iconName é a fonte
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
    iconName: "Accessibility", // Removido emoji, iconName é a fonte
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
    iconName: "GraduationCap", // Removido emoji, iconName é a fonte
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
    iconName: "HelpingHand", // Removido emoji, iconName é a fonte
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
export const lessonCategories: { name: string; iconName: string; lessons: Lesson[] }[] = mockRoadmapData.map(roadmap => ({
  name: roadmap.modules[0]?.title || `Trilha ${roadmap.order}`, // Usa o título do primeiro módulo ou um fallback
  iconName: roadmap.iconName || "BookOpen", // Usa o iconName da trilha
  lessons: roadmap.modules.flatMap(mod => mod.lessons),
  moduleId: roadmap.modules[0]?.id || roadmap.id, // Para o TabsTrigger
}));

// Filtra categorias que podem ter ficado sem lições após o flatMap, se módulos podem não ter lições
const filteredLessonCategories = lessonCategories.filter(cat => cat.lessons.length > 0);

// Se você precisar de uma categoria "Geral/Outros" caso alguma lição não se encaixe, adicione aqui.
const allCategorizedLessonIds = new Set(filteredLessonCategories.flatMap(cat => cat.lessons.map(l => l.id)));
const uncategorizedLessons = mockLessons.filter(l => !allCategorizedLessonIds.has(l.id));
if (uncategorizedLessons.length > 0) {
  filteredLessonCategories.push({
    name: "Geral/Outros",
    iconName: "PackageSearch",
    lessons: [...new Map(uncategorizedLessons.map(item => [item.id, item])).values()],
    moduleId: "geral-outros"
  });
}
export const finalLessonCategories = filteredLessonCategories;


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

// Ensure unique items in categories after initial population
exerciseCategories.forEach(cat => cat.exercises = [...new Map(cat.exercises.map(item => [item.id, item])).values()]);

const allCategorizedExerciseIds = new Set(exerciseCategories.flatMap(cat => cat.exercises.map(e => e.id)));
const uncategorizedExercises = mockExercises.filter(e => !allCategorizedExerciseIds.has(e.id));
const outrosExercisesCategory = exerciseCategories.find(cat => cat.name === "Outros Tipos");
if (outrosExercisesCategory && uncategorizedExercises.length > 0) {
  outrosExercisesCategory.exercises.push(...uncategorizedExercises);
  outrosExercisesCategory.exercises = [...new Map(outrosExercisesCategory.exercises.map(item => [item.id, item])).values()];
}


// Update User Profile and Roadmap states
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
        module.isCompleted = mockUserProfile.completedModules.includes(module.id);
      }
      
      if (!module.isCompleted) {
        allModulesInTrilhaCompleted = false;
      }
    });
    trilha.isCompleted = allModulesInTrilhaCompleted;
  } else {
    trilha.isCompleted = true; 
  }

  if (!trilha.isCompleted && !firstUncompletedTrilhaFound) {
      trilha.isCurrent = true;
      firstUncompletedTrilhaFound = true;
  } else {
      trilha.isCurrent = false;
  }
});

if (mockRoadmapData.length > 0 && mockRoadmapData.every(t => t.isCompleted)) {
    mockRoadmapData.forEach(t => t.isCurrent = false); 
} else if (!firstUncompletedTrilhaFound && mockRoadmapData.length > 0) { 
    const firstNotDone = mockRoadmapData.find(t => !t.isCompleted);
    if (firstNotDone) {
        firstNotDone.isCurrent = true;
    } else {
        if (mockRoadmapData.length > 0 && !mockRoadmapData[0].isCompleted && !mockRoadmapData.some(t => t.isCurrent)) {
             mockRoadmapData[0].isCurrent = true;
        }
    }
}

    