
"use client";

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Lesson } from '@/lib/types';
import { useAuth } from '@/contexts/AuthContext';
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
  const [isCorrectSelection, setIsCorrectSelection] = useState<boolean | null>(null);
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);

  const isSubmitted = useMemo(() => isInteractionCompleted || false, [isInteractionCompleted]);

  useEffect(() => {
    // Apenas embaralha no mount ou se as opções mudarem
    setShuffledOptions(shuffleArray(options));
  }, [options]);

  useEffect(() => {
    if (isSubmitted) {
      setSelectedOption(correctAnswer);
      setIsCorrectSelection(true);
    } else {
      setSelectedOption(null);
      setIsCorrectSelection(null);
    }
  }, [isSubmitted, correctAnswer]);

  const handleOptionClick = (option: string) => {
    if (isLessonCompleted) return;

    const isCurrentlySelected = selectedOption === option;

    // Lógica para desmarcar qualquer opção clicada novamente
    if (isCurrentlySelected) {
      setSelectedOption(null);
      setIsCorrectSelection(null);
      // Se era a correta, precisamos "descompletar" a interação
      if (option === correctAnswer) {
        onUncomplete(interactionId);
      }
      return;
    }

    // Lógica para selecionar uma nova opção
    setSelectedOption(option);
    const isCorrect = option === correctAnswer;
    setIsCorrectSelection(isCorrect);
    
    if (isCorrect) {
      onCorrect(interactionId);
    }
  };

  if (isSubmitted && selectedOption === correctAnswer) {
    return (
        <span className="inline-flex items-baseline gap-x-1.5 gap-y-1 mx-1 align-baseline not-prose">
             <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleOptionClick(correctAnswer)}
                disabled={isLessonCompleted}
                className={cn(
                    "h-auto px-2 py-1 text-sm leading-tight transition-all duration-200 rounded focus-visible:ring-offset-0 align-baseline",
                    "inline-flex items-center",
                    "border-green-600 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 dark:border-green-700 hover:bg-green-200/80 dark:hover:bg-green-800/80",
                    isLessonCompleted && 'cursor-pointer'
                )}
                style={{gap: '0.2rem'}}
             >
                <span className="shrink-0 -ml-0.5 mr-0.5">✅</span>
                <span>{correctAnswer}</span>
             </Button>
        </span>
    );
  }

  return (
    <span className="inline-flex flex-wrap items-baseline gap-x-1.5 gap-y-1 mx-1 align-baseline not-prose">
      {shuffledOptions.map((option, index) => {
        const isSelected = selectedOption === option;
        
        let variant: "default" | "outline" | "secondary" | "destructive" | "link" | "ghost" = "outline";
        let prefixEmoji: React.ReactNode = null;
        let additionalClasses = "";
        
        if (isSelected && !isCorrectSelection) {
          variant = "destructive";
          prefixEmoji = '❌';
          additionalClasses = "bg-red-500 hover:bg-red-600 text-white dark:bg-red-600 dark:hover:bg-red-700 focus-visible:ring-red-400";
        } else if (isSelected) {
            variant = "default";
            additionalClasses = "ring-2 ring-ring";
        } else {
             additionalClasses = "border-primary/50 text-primary/90 hover:bg-primary/10 dark:text-primary-foreground/70 dark:hover:bg-primary/20";
        }

        return (
          <Button
            key={index}
            type="button"
            variant={variant}
            size="sm"
            onClick={() => handleOptionClick(option)}
            disabled={isLessonCompleted}
            className={cn(
              "h-auto px-2 py-1 text-sm leading-tight transition-all duration-200 rounded focus-visible:ring-offset-0 align-baseline",
              "inline-flex items-center",
              additionalClasses,
              (isLessonCompleted) && 'cursor-pointer'
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
