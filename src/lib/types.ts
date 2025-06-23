
import type { LucideIcon } from "lucide-react";

export interface RoadmapStep {
  id: string;
  title: string;
  order?: number;
  emoji?: string;
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
  emoji?: string;
  references?: string[];
  moduleId?: string;
  moduleTitle?: string;
  trilhaId?: string;
  points?: number; 
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
  emoji?: string;
  icon?: LucideIcon;
  isUnlocked: boolean;
  dateUnlocked?: string; 
  criteria: string;
  pointsAwarded?: number;
  hasAwardedPoints?: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email?: string | null;
  avatarUrl?: string;
  points: number;
  completedLessons: string[];
  completedExercises: string[];
  unlockedAchievements: string[];
  completedModules: string[];
  roles: string[];
}

export interface NavItem {
  href: string;
  label: string;
  emoji?: string;
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
