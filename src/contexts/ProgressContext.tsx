
"use client";

import type { UserProgress, StreakData, Language, LearningPath, Lesson, PathProgress, LessonProgress } from '@/types';
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { LOCAL_STORAGE_KEYS } from '@/constants';
import { learningPaths as allLearningPaths } from '@/content/learningPaths';
import { useToast } from "@/hooks/use-toast";
import { uiTexts } from '@/content/translations'; // For toast messages

interface ProgressContextType {
  progress: UserProgress;
  streakData: StreakData;
  isLoading: boolean;
  completeLesson: (pathId: string, lessonId: string) => void;
  getPathProgress: (pathId: string) => PathProgress | undefined;
  getLessonProgress: (pathId: string, lessonId: string) => LessonProgress | undefined;
  getPointsForPath: (pathId: string) => number;
  getTotalPoints: () => number;
  isLessonCompleted: (pathId: string, lessonId: string) => boolean;
  isPathCompleted: (pathId: string) => boolean;
  getLearningPathById: (pathId: string) => LearningPath | undefined;
  getLessonById: (pathId: string, lessonId: string) => Lesson | undefined;
  getCurrentLessonPath: (pathId: string) => string | null;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

const initialProgress: UserProgress = { paths: {} };
const initialStreakData: StreakData = { current: 0, longest: 0, lastActivityDate: null };

export const ProgressProvider = ({ children }: { children: ReactNode }) => {
  const [progress, setProgress] = useState<UserProgress>(initialProgress);
  const [streakData, setStreakData] = useState<StreakData>(initialStreakData);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  // Assuming LanguageContext is available or toast messages are handled externally
  // For simplicity, using a fixed language for toasts here or pass language context
  const currentLanguage: Language = (typeof window !== 'undefined' && localStorage.getItem(LOCAL_STORAGE_KEYS.LANGUAGE) as Language) || 'pt';


  useEffect(() => {
    try {
      const storedProgress = localStorage.getItem(LOCAL_STORAGE_KEYS.PROGRESS);
      if (storedProgress) {
        setProgress(JSON.parse(storedProgress));
      } else {
        // Initialize progress for all paths and lessons
        const emptyProgress: UserProgress = { paths: {} };
        allLearningPaths.forEach(path => {
          emptyProgress.paths[path.id] = {
            lessons: {},
            completed: false,
            points: 0,
            currentLessonIndex: 0,
          };
          path.lessons.forEach(lesson => {
            emptyProgress.paths[path.id].lessons[lesson.id] = { completed: false, points: 0 };
          });
        });
        setProgress(emptyProgress);
        localStorage.setItem(LOCAL_STORAGE_KEYS.PROGRESS, JSON.stringify(emptyProgress));
      }

      const storedStreak = localStorage.getItem(LOCAL_STORAGE_KEYS.STREAKS);
      if (storedStreak) {
        setStreakData(JSON.parse(storedStreak));
      } else {
        localStorage.setItem(LOCAL_STORAGE_KEYS.STREAKS, JSON.stringify(initialStreakData));
      }
    } catch (error) {
      console.error("Failed to load progress from localStorage:", error);
      // Fallback to initial if parsing fails or localStorage is unavailable
      setProgress(initialProgress);
      setStreakData(initialStreakData);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateLocalStorage = (newProgress: UserProgress, newStreakData: StreakData) => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.PROGRESS, JSON.stringify(newProgress));
    localStorage.setItem(LOCAL_STORAGE_KEYS.STREAKS, JSON.stringify(newStreakData));
  };
  
  const updateStreak = useCallback(() => {
    setStreakData(prevStreak => {
      const today = new Date().toISOString().split('T')[0];
      let newStreak = { ...prevStreak };

      if (prevStreak.lastActivityDate !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        if (prevStreak.lastActivityDate === yesterdayStr) {
          newStreak.current += 1;
        } else {
          newStreak.current = 1; // Reset streak
        }
        newStreak.lastActivityDate = today;
        if (newStreak.current > newStreak.longest) {
          newStreak.longest = newStreak.current;
        }
      }
      return newStreak;
    });
  }, []);

  const completeLesson = useCallback((pathId: string, lessonId: string) => {
    setProgress(prevProgress => {
      const newProgress = JSON.parse(JSON.stringify(prevProgress)) as UserProgress; // Deep copy
      const pathData = allLearningPaths.find(p => p.id === pathId);
      if (!pathData) return prevProgress;

      const lessonIndex = pathData.lessons.findIndex(l => l.id === lessonId);
      if (lessonIndex === -1) return prevProgress;
      
      if (!newProgress.paths[pathId]) {
        newProgress.paths[pathId] = { lessons: {}, completed: false, points: 0, currentLessonIndex: 0 };
      }
      if (!newProgress.paths[pathId].lessons[lessonId]) {
        newProgress.paths[pathId].lessons[lessonId] = { completed: false, points: 0 };
      }

      if (!newProgress.paths[pathId].lessons[lessonId].completed) {
        newProgress.paths[pathId].lessons[lessonId].completed = true;
        newProgress.paths[pathId].lessons[lessonId].points = 10; // Award 10 points per lesson
        newProgress.paths[pathId].points = (newProgress.paths[pathId].points || 0) + 10;
        
        // Update currentLessonIndex
        if (lessonIndex >= newProgress.paths[pathId].currentLessonIndex) {
            newProgress.paths[pathId].currentLessonIndex = lessonIndex + 1;
        }

        toast({
          title: uiTexts[currentLanguage]?.lessonComplete || "Lesson Complete!",
          description: `${uiTexts[currentLanguage]?.pointsEarned || "Points Earned"}: 10`,
        });

        // Check if all lessons in the path are completed
        const allLessonsCompleted = pathData.lessons.every(
          lesson => newProgress.paths[pathId]?.lessons[lesson.id]?.completed
        );

        if (allLessonsCompleted && !newProgress.paths[pathId].completed) {
          newProgress.paths[pathId].completed = true;
          newProgress.paths[pathId].points = (newProgress.paths[pathId].points || 0) + 50; // Bonus for path completion
          toast({
            title: uiTexts[currentLanguage]?.pathComplete || "Path Complete!",
            description: `${uiTexts[currentLanguage]?.pointsEarned || "Points Earned"}: 50 (Bonus)`,
          });
        }
        updateStreak();
        // Update localStorage after state update via useEffect dependency on progress and streakData
      }
      return newProgress;
    });
  }, [updateStreak, toast, currentLanguage]);

  useEffect(() => {
    if (!isLoading) { // Ensure we don't overwrite initial load with empty data
        updateLocalStorage(progress, streakData);
    }
  }, [progress, streakData, isLoading]);


  const getPathProgress = (pathId: string): PathProgress | undefined => progress.paths[pathId];
  
  const getLessonProgress = (pathId: string, lessonId: string): LessonProgress | undefined => 
    progress.paths[pathId]?.lessons[lessonId];

  const getPointsForPath = (pathId: string): number => progress.paths[pathId]?.points || 0;

  const getTotalPoints = (): number => 
    Object.values(progress.paths).reduce((sum, path) => sum + (path.points || 0), 0);

  const isLessonCompleted = (pathId: string, lessonId: string): boolean => 
    !!progress.paths[pathId]?.lessons[lessonId]?.completed;

  const isPathCompleted = (pathId: string): boolean => !!progress.paths[pathId]?.completed;

  const getLearningPathById = (pathId: string): LearningPath | undefined => {
    return allLearningPaths.find(p => p.id === pathId);
  };
  
  const getLessonById = (pathId: string, lessonId: string): Lesson | undefined => {
    const path = getLearningPathById(pathId);
    return path?.lessons.find(l => l.id === lessonId);
  };

  const getCurrentLessonPath = (pathId: string): string | null => {
    const pathData = allLearningPaths.find(p => p.id === pathId);
    const pathProg = progress.paths[pathId];

    if (!pathData || !pathProg) return null;

    if (pathProg.currentLessonIndex < pathData.lessons.length) {
      const currentLessonId = pathData.lessons[pathProg.currentLessonIndex].id;
      return `/learning-paths/${pathId}/${currentLessonId}`;
    }
    // If all lessons completed or index out of bounds, maybe link to path summary or next path?
    // For now, if all done, no specific "current" lesson.
    return null; 
  };


  return (
    <ProgressContext.Provider value={{ 
      progress, 
      streakData, 
      isLoading,
      completeLesson,
      getPathProgress,
      getLessonProgress,
      getPointsForPath,
      getTotalPoints,
      isLessonCompleted,
      isPathCompleted,
      getLearningPathById,
      getLessonById,
      getCurrentLessonPath
    }}>
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = (): ProgressContextType => {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};
