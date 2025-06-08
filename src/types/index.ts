export type Language = 'pt' | 'en';

export interface TranslatedText {
  pt: string;
  en: string;
}

export interface Lesson {
  id: string;
  title: TranslatedText;
  content: TranslatedText; // Placeholder for rich content structure
  icon?: string; // Lucide icon name or emoji
  exercises?: Exercise[]; // Optional exercises
}

export interface LearningPath {
  id: string;
  title: TranslatedText;
  description: TranslatedText;
  icon: string; // Lucide icon name or emoji
  lessons: Lesson[];
}

export interface Exercise {
  id: string;
  type: 'multiple-choice' | 'fill-in-the-gap'; // Add more types later
  question: TranslatedText;
  options?: TranslatedText[]; // For multiple-choice
  correctAnswer: string | string[]; // Index or value
}

export interface DictionaryTerm {
  id: string;
  term: TranslatedText;
  definition: TranslatedText;
}

export interface LessonProgress {
  completed: boolean;
  points: number;
}

export interface PathProgress {
  lessons: Record<string, LessonProgress>; // lessonId: LessonProgress
  completed: boolean;
  points: number;
  currentLessonIndex: number;
}

export interface UserProgress {
  paths: Record<string, PathProgress>; // pathId: PathProgress
}

export interface StreakData {
  current: number;
  longest: number;
  lastActivityDate: string | null; // ISO date string
}
