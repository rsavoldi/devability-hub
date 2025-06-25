
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Lesson } from '@/lib/types';

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
  
  const [selectedOption, setSelectedOption] = useState<string | null>(isInteractionCompleted ? correctAnswer : null);
  const [isCorrectSelection, setIsCorrectSelection] = useState<boolean | null>(isInteractionCompleted ? true : null);

  useEffect(() => {
    if (isInteractionCompleted) {
      setSelectedOption(correctAnswer);
      setIsCorrectSelection(true);
    } else {
      setSelectedOption(null);
      setIsCorrectSelection(null);
    }
  }, [isInteractionCompleted, correctAnswer]);

  const handleOptionClick = (option: string) => {
    if (isLessonCompleted) return;

    if (selectedOption === option) {
      // Deselect logic
      setSelectedOption(null);
      setIsCorrectSelection(null);
      if (isInteractionCompleted) {
        onUncomplete(interactionId);
      }
    } else {
      // Select logic
      setSelectedOption(option);
      const isCorrect = option === correctAnswer;
      setIsCorrectSelection(isCorrect);
      
      if (isCorrect) {
        onCorrect(interactionId);
      }
    }
  };

  const isSubmitted = isInteractionCompleted || false;

  return (
    <span className="inline-flex flex-wrap items-baseline gap-x-1.5 gap-y-1 mx-1 align-baseline not-prose">
      {options.map((option, index) => {
        const isSelected = selectedOption === option;
        const isCorrectChoice = option === correctAnswer;
        
        if (isSubmitted && !isCorrectChoice) {
          return null;
        }

        let variant: "default" | "outline" | "secondary" | "destructive" | "link" | "ghost" = "outline";
        let prefixEmoji: React.ReactNode = null;
        let additionalClasses = "";
        
        if (isSubmitted && isCorrectChoice) {
          prefixEmoji = '✅';
          additionalClasses = "border-green-500 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700 cursor-default hover:bg-green-100 dark:hover:bg-green-800/30";
        } else if (isSelected && !isCorrectSelection) {
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
              additionalClasses
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
