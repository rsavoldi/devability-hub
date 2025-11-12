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
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  
  // A ordem só é embaralhada uma vez, quando o componente é montado.
  const [shuffledOptions] = useState(() => shuffleArray(options));

  const isSubmitted = isInteractionCompleted || false;

  useEffect(() => {
    if (isSubmitted) {
      setSelectedOption(correctAnswer);
    } else {
      setSelectedOption(null);
    }
  }, [isSubmitted, correctAnswer]);
  
  const handleOptionClick = (option: string) => {
    if (isLessonCompleted) return;

    // Se o usuário clicar na resposta certa já selecionada, permite desmarcar.
    if (isSubmitted && selectedOption === option) {
      onUncomplete(interactionId);
      setSelectedOption(null);
    } 
    // Se o usuário clicar numa opção errada (estando ou não já submetido)
    else if (option !== correctAnswer) {
      setSelectedOption(option);
    }
    // Se o usuário clicar na resposta certa e ainda não estiver submetido
    else if (option === correctAnswer && !isSubmitted) {
      setSelectedOption(option);
      onCorrect(interactionId);
    }
  };

  const optionsToRender = isSubmitted 
    ? shuffledOptions.filter(opt => opt === correctAnswer)
    : shuffledOptions;

  return (
    <span className="inline-flex flex-wrap items-baseline gap-x-1.5 gap-y-1 mx-1 align-baseline not-prose">
      {optionsToRender.map((option, index) => {
        const isSelected = selectedOption === option;
        const isCorrectSelection = isSelected && option === correctAnswer;
        
        let variant: "default" | "outline" | "secondary" | "destructive" | "link" | "ghost" = "outline";
        let prefixEmoji: React.ReactNode = null;
        let additionalClasses = "";
        
        if (isSelected && isCorrectSelection) {
           variant = "default";
           prefixEmoji = '✅';
           additionalClasses = "border-green-600 bg-green-100 text-green-800 dark:bg-green-900/30 dark:border-green-700 dark:text-green-200 hover:bg-green-100/90 dark:hover:bg-green-900/40";
        } else if (isSelected && !isCorrectSelection) {
          variant = "destructive";
          prefixEmoji = '❌';
          additionalClasses = "bg-red-100 border-red-500 text-red-700 dark:bg-red-900/30 dark:border-red-700 dark:text-red-300";
        } else {
          additionalClasses = "border-primary/50 text-primary/90 hover:bg-primary/10 dark:text-primary-foreground/70 dark:hover:bg-primary/20";
        }

        const isDisabled = isLessonCompleted || (isSubmitted && !isCorrectSelection);

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
              isSelected && !isCorrectSelection && "animate-in shake",
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
