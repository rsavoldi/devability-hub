'use client';
import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

interface LessonUiState {
  lessonTitle: string | null;
  lessonNumber: string | null;
  totalInteractions: number;
  completedInteractions: number;
  setLessonData: (title: string, number: string, total: number, completed: number) => void;
  incrementCompleted: () => void;
  decrementCompleted: () => void;
  resetLesson: () => void;
}

const LessonUiContext = createContext<LessonUiState | undefined>(undefined);

export const LessonUiProvider = ({ children }: { children: ReactNode }) => {
  const [lessonTitle, setLessonTitle] = useState<string | null>(null);
  const [lessonNumber, setLessonNumber] = useState<string | null>(null);
  const [totalInteractions, setTotalInteractions] = useState(0);
  const [completedInteractions, setCompletedInteractions] = useState(0);

  const setLessonData = useCallback((title: string, number: string, total: number, completed: number) => {
    setLessonTitle(title);
    setLessonNumber(number);
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
    setLessonNumber(null);
    setTotalInteractions(0);
    setCompletedInteractions(0);
  }, []);

  return (
    <LessonUiContext.Provider value={{
      lessonTitle,
      lessonNumber,
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
