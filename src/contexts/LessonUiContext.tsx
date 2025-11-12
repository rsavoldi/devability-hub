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
}

const LessonUiContext = createContext<LessonUiState | undefined>(undefined);

export const LessonUiProvider = ({ children }: { children: ReactNode }) => {
  const [lessonId, setLessonId] = useState<string | null>(null);
  const [lessonTitle, setLessonTitle] = useState<string | null>(null);
  const [lessonNumber, setLessonNumber] = useState<string | null>(null);
  const [totalInteractions, setTotalInteractions] = useState(0);
  const [completedInteractionsSet, setCompletedInteractionsSet] = useState<Set<string>>(new Set());

  const setLessonData = useCallback((id: string, title: string, number: string, total: number, completedIds: string[]) => {
    // Atualiza diretamente os dados da lição atual.
    // A lógica de reset foi removida para evitar a perda de estado entre navegações.
    setLessonId(id);
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
      resetLesson: () => {} // Função vazia para não quebrar chamadas antigas, mas não faz nada
    }}>
      {children}
    </LessonUiContext.Provider>
  );
};

export const useLessonUi = () => {
  const context = useContext(LessonUiContext);
  // Não redefinimos mais o estado no desmontar, então o retorno pode ser nulo
  // if (context === undefined) {
  //   throw new Error('useLessonUi must be used within a LessonUiProvider');
  // }
  return context;
};
