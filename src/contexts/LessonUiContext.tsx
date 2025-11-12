'use client';
import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

interface LessonUiState {
  lessonId: string | null;
  lessonTitle: string | null;
  lessonNumber: string | null;
  totalInteractions: number;
  completedInteractions: number;
  isInteractionCompleted: (interactionId: string) => boolean;
  setLessonData: (id: string, title: string, number: string, total: number, completedIds: string[]) => void;
  setInteractionCompleted: (interactionId: string, completed: boolean) => void;
  resetLesson: () => void;
}

const LessonUiContext = createContext<LessonUiState | undefined>(undefined);

export const LessonUiProvider = ({ children }: { children: ReactNode }) => {
  const [lessonId, setLessonId] = useState<string | null>(null);
  const [lessonTitle, setLessonTitle] = useState<string | null>(null);
  const [lessonNumber, setLessonNumber] = useState<string | null>(null);
  const [totalInteractions, setTotalInteractions] = useState(0);
  const [completedInteractionsSet, setCompletedInteractionsSet] = useState<Set<string>>(new Set());

  const resetLesson = useCallback(() => {
    setLessonId(null);
    setLessonTitle(null);
    setLessonNumber(null);
    setTotalInteractions(0);
    setCompletedInteractionsSet(new Set());
  }, []);

  const setLessonData = useCallback((id: string, title: string, number: string, total: number, completedIds: string[]) => {
    // Only reset and update if it's a new lesson, to prevent loops.
    if (id !== lessonId) {
      resetLesson(); // Reset first to clear old state
      setLessonId(id);
      setLessonTitle(title);
      setLessonNumber(number);
      setTotalInteractions(total);
      setCompletedInteractionsSet(new Set(completedIds));
    } else {
      // If it's the same lesson, just ensure the completed interactions are up to date.
      // This handles cases where the user navigates back and forth.
      const newSet = new Set(completedIds);
      if (newSet.size !== completedInteractionsSet.size) {
         setCompletedInteractionsSet(newSet);
      }
    }
  }, [lessonId, resetLesson, completedInteractionsSet.size]);
  
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
  
  return (
    <LessonUiContext.Provider value={{
      lessonId,
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
  return context;
};
