"use client";

import { useState, useEffect, useMemo, type JSX } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Lesson } from '@/lib/types';
import { shuffleArray } from '@/lib/utils';

interface InteractiveWordChoiceProps {
  lesson: Lesson;
  options: string[];
  correctAnswer: string;
  interactionId: string;
  onCorrect: (interactionId: string) => void;
  onUncomplete: (interactionId: string) => void;
  isInteractionCompleted?: boolean;
  isLessonCompleted?: boolean;
}

export function InteractiveWordChoice({
  lesson,
  options,
  correctAnswer,
  interactionId,
  onCorrect,
  onUncomplete,
  isInteractionCompleted,
  isLessonCompleted
}: InteractiveWordChoiceProps) {
  
  const getInitialState = () => ({
    isSubmitted: isInteractionCompleted || false,
    selectedOption: isInteractionCompleted ? correctAnswer : null,
    isCorrect: isInteractionCompleted ? true : null,
  });

  const [state, setState] = useState(getInitialState);
  const [shuffledOptions] = useState(() => shuffleArray(options));

  useEffect(() => {
    // Sincroniza o estado se a propriedade global mudar (ex: ao reiniciar lição)
    setState(getInitialState());
  }, [isInteractionCompleted, correctAnswer]);


  const handleOptionClick = (option: string) => {
    if (isLessonCompleted) return;

    if (state.isSubmitted && option === correctAnswer) {
      // Lógica de desmarcar
      setState({ isSubmitted: false, selectedOption: null, isCorrect: null });
      onUncomplete(interactionId);
    } else if (!state.isSubmitted) {
      // Lógica de primeira seleção
      const currentIsCorrect = option === correctAnswer;
      setState({ selectedOption: option, isCorrect: currentIsCorrect, isSubmitted: currentIsCorrect });
      
      if (currentIsCorrect) {
        onCorrect(interactionId);
      }
    } else if (state.isSubmitted && !state.isCorrect && state.selectedOption === option) {
      // Permite desmarcar uma resposta errada para tentar outra
      setState(prevState => ({ ...prevState, selectedOption: null, isCorrect: null }));
    }
  };

  const optionsToRender = state.isSubmitted ? [correctAnswer] : shuffledOptions;

  return (
    <span className="inline-flex flex-wrap items-baseline gap-x-1.5 gap-y-1 mx-1 align-baseline not-prose">
      {optionsToRender.map((option, index) => {
        const isSelected = state.selectedOption === option;
        let prefixEmoji: React.ReactNode = null;
        let variant: "outline" | "default" | "secondary" | "destructive" | "ghost" | "link" | null | undefined = "outline";
        let additionalClasses = "";

        if (isSelected && state.isCorrect) {
           prefixEmoji = '✅';
           variant = "default";
           additionalClasses = "border border-green-600 bg-green-100 text-green-800 dark:bg-green-900/30 dark:border-green-700 dark:text-green-200 hover:bg-green-100/90 dark:hover:bg-green-900/40";
        } else if (isSelected && !state.isCorrect) {
          prefixEmoji = '❌';
          variant = "destructive";
          additionalClasses = "bg-red-100 border-red-500 text-red-700 dark:bg-red-900/30 dark:border-red-700 dark:text-red-300 animate-in shake";
        } else if (!state.isSubmitted) {
          additionalClasses = "border-primary/50 text-primary/90 hover:bg-primary/10 dark:text-primary-foreground/70 dark:hover:bg-primary/20";
        }

        const isCorrectSelection = state.isCorrect && isSelected;
        const isDisabled = isLessonCompleted || (state.isSubmitted && !isCorrectSelection);
        
        return (
          <Button
            key={index}
            type="button"
            variant={variant}
            size="sm"
            onClick={() => handleOptionClick(option)}
            disabled={isDisabled}
            className={cn(
              "h-auto px-2 py-1 text-sm leading-tight transition-all duration-200 rounded focus-visible:ring-offset-0 align-baseline",
              "inline-flex items-center",
              additionalClasses,
              isDisabled && "cursor-not-allowed opacity-100"
            )}
            style={{gap: prefixEmoji ? '0.2rem' : '0'}}
          >
            {prefixEmoji && <span className="shrink-0 -ml-0.5 mr-0.5">{prefixEmoji}</span>}
            <span>{option}</span>
          </Button>
        );
      })}
    </span>
  );
}
