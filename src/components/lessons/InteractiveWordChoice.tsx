"use client";

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Lesson } from '@/lib/types';
import { useAuth } from '@/contexts/AuthContext';

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
  
  const shuffledOptions = useMemo(() => {
    // Only shuffle once on component mount, or if options change.
    const tempOptions = [...options];
    for (let i = tempOptions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [tempOptions[i], tempOptions[j]] = [tempOptions[j], tempOptions[i]];
    }
    return tempOptions;
  }, [options]);


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

    const isCurrentlySelected = selectedOption === option;

    if (isCurrentlySelected) {
      setSelectedOption(null);
      setIsCorrectSelection(null);
      if (option === correctAnswer) {
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
  
  const isSubmitted = isInteractionCompleted || false;

  if (isSubmitted) {
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
                    // Consistent correct answer styling with solid colors and better contrast
                    "border-green-600 bg-green-100 text-green-800 dark:border-green-700 dark:bg-green-900 dark:text-green-200",
                    // Override hover effect when correct by keeping the same background color
                    "hover:bg-green-100 dark:hover:bg-green-900",
                    !isLessonCompleted && "cursor-pointer" // Allow click to un-complete
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
        
        if (isSelected && isCorrectSelection === false) {
          variant = "destructive";
          prefixEmoji = '❌';
          additionalClasses = "bg-red-500 hover:bg-red-600 text-white dark:bg-red-600 dark:hover:bg-red-700 focus-visible:ring-red-400";
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
