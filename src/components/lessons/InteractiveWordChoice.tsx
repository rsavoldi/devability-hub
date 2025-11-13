
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
  
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    if (isInteractionCompleted) {
      setSelectedOption(correctAnswer);
      setIsCorrect(true);
    } else {
      setSelectedOption(null);
      setIsCorrect(null);
    }
  }, [isInteractionCompleted, correctAnswer]);

  const [shuffledOptions] = useState<string[]>(() => shuffleArray(options));

  const handleOptionClick = (option: string) => {
    if (isLessonCompleted) return;

    if (isInteractionCompleted) {
      onUncomplete(interactionId);
      return;
    }
    
    if (selectedOption === option) {
      setSelectedOption(null);
      setIsCorrect(null);
      return;
    }

    const currentIsCorrect = option === correctAnswer;
    setSelectedOption(option);
    setIsCorrect(currentIsCorrect);
    
    if (currentIsCorrect) {
      onCorrect(interactionId);
    }
  };
  
  const isDisabled = isLessonCompleted || false;
  
  if (isInteractionCompleted) {
    return (
        <span className="inline-flex flex-wrap items-baseline gap-x-1.5 gap-y-1 mx-1 align-baseline not-prose">
            <Button
                type="button"
                variant="default"
                size="sm"
                onClick={() => handleOptionClick(correctAnswer)}
                disabled={isDisabled}
                className={cn(
                    "h-auto px-2 py-1 text-sm leading-tight transition-all duration-200 rounded focus-visible:ring-offset-0 align-baseline",
                    "inline-flex items-center",
                    "border border-green-600 bg-green-100 text-green-800 dark:bg-green-900/30 dark:border-green-700 dark:text-green-200 hover:bg-green-100/90 dark:hover:bg-green-900/40",
                    !isDisabled && "cursor-pointer"
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
      {shuffledOptions.map((option) => {
        const isSelected = selectedOption === option;
        let variant: "outline" | "default" | "secondary" | "destructive" | "ghost" | "link" | null | undefined = "outline";
        let prefixEmoji: React.ReactNode = null;
        let additionalClasses = "";

        if (isSelected && isCorrect === false) {
          prefixEmoji = '❌';
          variant = "destructive";
          additionalClasses = "border border-red-500 bg-red-100 text-red-700 dark:bg-red-900/30 dark:border-red-700 dark:text-red-300 animate-in shake";
        } else if (isSelected && isCorrect === true) {
           prefixEmoji = '✅';
           variant = "default";
           additionalClasses = "border border-green-600 bg-green-100 text-green-800 dark:bg-green-900/30 dark:border-green-700 dark:text-green-200 hover:bg-green-100/90 dark:hover:bg-green-900/40";
        } else {
          additionalClasses = "border-primary/50 text-primary/90 hover:bg-primary/10 dark:text-primary-foreground/70 dark:hover:bg-primary/20";
        }
        
        return (
          <Button
            key={option}
            type="button"
            variant={variant}
            size="sm"
            onClick={() => handleOptionClick(option)}
            disabled={isDisabled}
            className={cn(
              "h-auto px-2 py-1 text-sm leading-tight transition-all duration-200 rounded focus-visible:ring-offset-0 align-baseline",
              "inline-flex items-center",
              additionalClasses,
              !isDisabled && "cursor-pointer"
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
