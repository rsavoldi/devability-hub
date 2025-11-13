
"use client";

import { useState, useEffect } from 'react';
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
  isInteractionCompleted: boolean;
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
  
  const [selectedOption, setSelectedOption] = useState<string | null>(isInteractionCompleted ? correctAnswer : null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(isInteractionCompleted ? true : null);

  // A aleatorização agora acontece apenas uma vez na inicialização do estado.
  const [shuffledOptions, setShuffledOptions] = useState<string[]>(() => shuffleArray(options));

  const handleOptionClick = (option: string) => {
    if (isLessonCompleted) return;

    if (isInteractionCompleted && option === correctAnswer) {
      setSelectedOption(null);
      setIsCorrect(null);
      onUncomplete(interactionId);
    } else if (!isInteractionCompleted) {
      const currentIsCorrect = option === correctAnswer;
      setSelectedOption(option);
      setIsCorrect(currentIsCorrect);
      
      if (currentIsCorrect) {
        onCorrect(interactionId);
      }
    }
  };

  const optionsToRender = isInteractionCompleted ? [correctAnswer] : shuffledOptions;
  const isDisabled = isLessonCompleted || false;

  return (
    <span className="inline-flex flex-wrap items-baseline gap-x-1.5 gap-y-1 mx-1 align-baseline not-prose">
      {optionsToRender.map((option, index) => {
        const isSelected = selectedOption === option;
        let variant: "outline" | "default" | "secondary" | "destructive" | "ghost" | "link" | null | undefined = "outline";
        let prefixEmoji: React.ReactNode = null;
        let additionalClasses = "";

        const isCurrentlyCorrectlySelected = isSelected && isCorrect;

        if (isCurrentlyCorrectlySelected || (isInteractionCompleted && option === correctAnswer)) {
           prefixEmoji = '✅';
           variant = "default";
           additionalClasses = "border border-green-600 bg-green-100 text-green-800 dark:bg-green-900/30 dark:border-green-700 dark:text-green-200 hover:bg-green-100/90 dark:hover:bg-green-900/40";
        } else if (isSelected && !isCorrect) {
          prefixEmoji = '❌';
          variant = "destructive";
          additionalClasses = "bg-red-100 border border-red-500 text-red-700 dark:bg-red-900/30 dark:border-red-700 dark:text-red-300 animate-in shake";
        } else if (!isInteractionCompleted) {
          additionalClasses = "border-primary/50 text-primary/90 hover:bg-primary/10 dark:text-primary-foreground/70 dark:hover:bg-primary/20";
        }

        const isButtonDisabled = isDisabled || (isInteractionCompleted && option !== correctAnswer);
        
        return (
          <Button
            key={option} // Usar a opção como chave garante estabilidade se a ordem não mudar
            type="button"
            variant={variant}
            size="sm"
            onClick={() => handleOptionClick(option)}
            disabled={isButtonDisabled}
            className={cn(
              "h-auto px-2 py-1 text-sm leading-tight transition-all duration-200 rounded focus-visible:ring-offset-0 align-baseline",
              "inline-flex items-center",
              additionalClasses,
              isButtonDisabled && "cursor-not-allowed opacity-60",
              !isButtonDisabled && "cursor-pointer"
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
