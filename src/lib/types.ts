
import type { LucideIcon } from "lucide-react";

export interface RoadmapStep {
  id: string;
  title: string;
  order?: number;
  emoji?: string;
  iconName?: string;
  icon?: LucideIcon;
  description: string;
  modules: Module[];
  isCompleted?: boolean;
  isCurrent?: boolean;
}

export interface Module {
  id: string;
  title: string;
  order?: number;
  lessons: Lesson[];
  exercises: Exercise[];
  isCompleted?: boolean;
  roadmapIcon?: any;
  progress?: number; // 0-100
}

export interface Lesson {
  id: string;
  title: string;
  order?: number;
  type: 'text' | 'video' | 'interactive' | 'quiz';
  content: string;
  estimatedTime: string;
  coverImage?: string;
  aiHint?: string;
  iconName?: string; // Campo adicionado
  references?: string[];
  moduleId?: string;
  moduleTitle?: string;
  trilhaId?: string; // Adicionado para navegação
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
  moduleId?: string;
  title: string;
  order?: number;
  type: ExerciseType;
  question: string;
  options?: ExerciseOption[];
  targetCategories?: ExerciseOption[];
  correctAnswer?: string | string[] | Record<string, string>;
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
  iconName?: string;
  icon?: LucideIcon;
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
  roles: string[]; // Novo campo para papéis
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

export interface FormedAssociation {
  itemAId: string;
  itemBId: string;
  itemAText: string;
  itemBText: string;
}

export interface SummarizeLessonInput {
  lessonContent: string;
}

export interface SummarizeLessonOutput {
  summary: string;
}
