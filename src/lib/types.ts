
import type { LucideIcon } from "lucide-react";

export interface RoadmapStep {
  id: string;
  title: string;
  order?: number; // Added for ordering from Firestore
  emoji?: string;
  iconName?: string; // Changed from icon: LucideIcon to store the name
  icon?: LucideIcon; // Keep for direct use if available, but prioritize iconName for Firestore
  description: string;
  modules: Module[];
  isCompleted?: boolean;
  isCurrent?: boolean;
}

export interface Module {
  id: string;
  title: string;
  order?: number; // Added for ordering from Firestore
  lessons: Lesson[];
  exercises: Exercise[];
  isCompleted?: boolean;
  progress?: number; // 0-100
}

export interface Lesson {
  id: string;
  title: string;
  order?: number; // Added for ordering from Firestore
  type: 'text' | 'video' | 'interactive' | 'quiz';
  content: string;
  estimatedTime: string;
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
  moduleId?: string;
  title: string;
  order?: number; // Added for ordering from Firestore
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
  iconName?: string; // Changed from icon: LucideIcon
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
