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
  const [isCorrectSelection, setIsCorrectSelection] = useState<boolean | null>(null);
  
  // Initialize shuffled options only once when the component mounts
  const [shuffledOptions] = useState(() => shuffleArray(options));

  const isSubmitted = isInteractionCompleted || false;

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

    if (isCurrentlySelected) {
      setSelectedOption(null);
      setIsCorrectSelection(null);
      if (isSubmitted) {
        onUncomplete(interactionId);
      }
      return;
    }
    
    setSelectedOption(option);
    const isCorrect = option === correctAnswer;
    setIsCorrectSelection(isCorrect);
    
    if (isCorrect) {
      onCorrect(interactionId);
    }
  };

  if (isSubmitted) {
    // Only show the correct answer button when submitted
    const remainingOptions = shuffledOptions.filter(opt => isCorrectSelection ? opt === correctAnswer : true);

    return (
        <span className="inline-flex flex-wrap items-baseline gap-x-1.5 gap-y-1 mx-1 align-baseline not-prose">
          {remainingOptions.map((option, index) => (
            <Button
                key={index}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleOptionClick(option)}
                disabled={isLessonCompleted}
                className={cn(
                  "h-auto px-2 py-1 text-sm leading-tight transition-all duration-200 rounded focus-visible:ring-offset-0 align-baseline",
                  "inline-flex items-center gap-1",
                  "border-green-600 bg-green-500/90 text-primary-foreground hover:bg-green-500/90 dark:bg-green-600/90 dark:hover:bg-green-600/90",
                  !isLessonCompleted && "cursor-pointer",
                   isLessonCompleted && "cursor-default"
                )}
            >
              <span className="shrink-0 -ml-0.5 mr-0.5">✅</span>
              <span>{option}</span>
            </Button>
          ))}
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
        
        if (isSelected && isCorrectSelection === false) {
          variant = "destructive";
          prefixEmoji = '❌';
          additionalClasses = "bg-red-100 border-red-500 text-red-700 dark:bg-red-900/30 dark:border-red-700 dark:text-red-300";
        } else if (isSelected) {
           additionalClasses = "bg-primary/10 border-primary text-primary dark:bg-primary/20 dark:text-primary-foreground/80 ring-2 ring-primary";
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
              isSelected && "ring-2 ring-ring"
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