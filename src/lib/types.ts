
import type { LucideIcon } from "lucide-react";

export interface RoadmapStep {
  id: string;
  title: string;
  emoji?: string;
  icon?: LucideIcon;
  description: string;
  modules: Module[];
  isCompleted?: boolean;
  isCurrent?: boolean;
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
  exercises: Exercise[];
  isCompleted?: boolean;
  progress?: number; // 0-100
}

export interface Lesson {
  id: string;
  title: string;
  type: 'text' | 'video' | 'interactive' | 'quiz';
  content: string;
  estimatedTime: string;
  // Removido: SummarizeLessonOutput: string; 
  coverImage?: string;
  aiHint?: string;
  references?: string[];
}

export type ExerciseType =
  | 'multiple-choice'
  | 'fill-in-the-blank'
  | 'coding'
  | 'association'
  | 'ordering'
  | 'drag-and-drop';

export interface ExerciseOption {
  id: string;
  text: string;
}

export interface Exercise {
  id:string;
  moduleId?: string; // Adicionado para associar exercício a um módulo
  title: string;
  type: ExerciseType;
  question: string;
  options?: ExerciseOption[];
  targetCategories?: ExerciseOption[]; // For drag-and-drop (categorization)
  correctAnswer?: string | string[] | Record<string, string>; // string for MC/Fill, string[] for Ordering, Record for Association/DragDrop
  feedback?: string;
  points: number;
  estimatedTime: string;
}

export interface DictionaryTerm {
  id: string;
  term: string;
  definition: string;
  category?: string;
  relatedTerms?: string[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon | string;
  isUnlocked: boolean;
  dateUnlocked?: string;
  criteria: string;
}

export interface UserProfile {
  id: string;
  name: string;
  avatarUrl?: string;
  points: number;
  completedLessons: string[];
  completedExercises: string[];
  unlockedAchievements: string[];
  completedModules: string[];
}

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  disabled?: boolean;
  external?: boolean;
  badge?: string;
  items?: NavItem[];
}

// Para o exercício de associação em ExerciseView.tsx
export interface FormedAssociation {
  itemAId: string;
  itemBId: string;
  itemAText: string;
  itemBText: string;
}

// Tipos para o flow summarizeLesson (já existem em src/ai/flows/summarize-lesson.ts, mas podem ser centralizados aqui se preferir)
// Por ora, vamos assumir que são importados do flow específico.
export interface SummarizeLessonInput {
  lessonContent: string;
}

export interface SummarizeLessonOutput {
  summary: string;
}
