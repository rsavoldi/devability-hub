'use client';
import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

interface LessonUiState {
  lessonTitle: string | null;
  lessonNumber: string | null;
  totalInteractions: number;
  completedInteractions: number;
  isInteractionCompleted: (interactionId: string) => boolean;
  setLessonData: (title: string, number: string, total: number, completedIds: string[]) => void;
  setInteractionCompleted: (interactionId: string, completed: boolean) => void;
  resetLesson: () => void;
}

const LessonUiContext = createContext<LessonUiState | undefined>(undefined);

export const LessonUiProvider = ({ children }: { children: ReactNode }) => {
  const [lessonTitle, setLessonTitle] = useState<string | null>(null);
  const [lessonNumber, setLessonNumber] = useState<string | null>(null);
  const [totalInteractions, setTotalInteractions] = useState(0);
  const [completedInteractionsSet, setCompletedInteractionsSet] = useState<Set<string>>(new Set());

  const setLessonData = useCallback((title: string, number: string, total: number, completedIds: string[]) => {
    setLessonTitle(title);
    setLessonNumber(number);
    setTotalInteractions(total);
    setCompletedInteractionsSet(new Set(completedIds));
  }, []);
  
  const setInteractionCompleted = useCallback((interactionId: string, completed: boolean) => {
    setCompletedInteractionsSet(prevSet => {
      const newSet = new Set(prevSet);
      if (completed) {
        newSet.add(interactionId);
      } else {
        newSet.delete(interactionId);
      }
      return newSet;
    });
  }, []);

  const isInteractionCompleted = useCallback((interactionId: string) => {
    return completedInteractionsSet.has(interactionId);
  }, [completedInteractionsSet]);
  
  const resetLesson = useCallback(() => {
    setLessonTitle(null);
    setLessonNumber(null);
    setTotalInteractions(0);
    setCompletedInteractionsSet(new Set());
  }, []);

  return (
    <LessonUiContext.Provider value={{
      lessonTitle,
      lessonNumber,
      totalInteractions,
      completedInteractions: completedInteractionsSet.size, // Derivado do Set
      setLessonData,
      setInteractionCompleted,
      isInteractionCompleted,
      resetLesson
    }}>
      {children}
    </LessonUiContext.Provider>
  );
};

export const useLessonUi = () => {
  const context = useContext(LessonUiContext);
  // Não lançamos mais erro aqui, pode ser nulo se não estiver em uma LessonView
  return context;
};