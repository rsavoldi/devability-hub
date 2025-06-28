
'use client';
import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

interface LessonUiState {
  lessonTitle: string | null;
  totalInteractions: number;
  completedInteractions: number;
  setLessonData: (title: string, total: number, completed: number) => void;
  incrementCompleted: () => void;
  decrementCompleted: () => void;
  resetLesson: () => void;
}

const LessonUiContext = createContext<LessonUiState | undefined>(undefined);

export const LessonUiProvider = ({ children }: { children: ReactNode }) => {
  const [lessonTitle, setLessonTitle] = useState<string | null>(null);
  const [totalInteractions, setTotalInteractions] = useState(0);
  const [completedInteractions, setCompletedInteractions] = useState(0);

  const setLessonData = useCallback((title: string, total: number, completed: number) => {
    setLessonTitle(title);
    setTotalInteractions(total);
    setCompletedInteractions(completed);
  }, []);
  
  const incrementCompleted = useCallback(() => {
    setCompletedInteractions(c => c + 1);
  }, []);

  const decrementCompleted = useCallback(() => {
    setCompletedInteractions(c => Math.max(0, c - 1));
  }, []);
  
  const resetLesson = useCallback(() => {
    setLessonTitle(null);
    setTotalInteractions(0);
    setCompletedInteractions(0);
  }, []);

  return (
    <LessonUiContext.Provider value={{
      lessonTitle,
      totalInteractions,
      completedInteractions,
      setLessonData,
      incrementCompleted,
      decrementCompleted,
      resetLesson
    }}>
      {children}
    </LessonUiContext.Provider>
  );
};

export const useLessonUi = () => {
  const context = useContext(LessonUiContext);
  return context;
};
