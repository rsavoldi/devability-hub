
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { shuffleArray } from '@/lib/utils';

interface InteractiveWordChoiceProps {
  options: string[];
  correctAnswer: string;
  interactionId: string;
  onCorrect: (interactionId: string) => void;
  isCompleted?: boolean;
}

export function InteractiveWordChoice({
  options,
  correctAnswer,
  interactionId,
  onCorrect,
  isCompleted,
}: InteractiveWordChoiceProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(
    isCompleted ? correctAnswer : null
  );
  const [isCorrectSelection, setIsCorrectSelection] = useState<boolean | null>(
    isCompleted ? true : null
  );
  
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);

  useEffect(() => {
    setShuffledOptions(shuffleArray(options));
  }, [options]);

  useEffect(() => {
    if (isCompleted) {
      setSelectedOption(correctAnswer);
      setIsCorrectSelection(true);
    }
  }, [isCompleted, correctAnswer]);

  const handleOptionClick = (option: string) => {
    if (isCompleted) return;

    setSelectedOption(option);
    const isCorrect = option === correctAnswer;
    setIsCorrectSelection(isCorrect);

    if (isCorrect) {
      onCorrect(interactionId);
    }
  };

  return (
    <span className="inline-flex flex-wrap items-baseline gap-x-1.5 gap-y-1 mx-1 align-baseline not-prose">
      {shuffledOptions.map((option, index) => {
        const isSelected = selectedOption === option;
        const isCorrectAndSubmitted = isCompleted && option === correctAnswer;
        const isIncorrectAndSelected = isSelected && isCorrectSelection === false;
        
        let variant: "default" | "outline" | "secondary" | "destructive" | "link" | "ghost" = "outline";
        let prefixEmoji = "";
        let additionalClasses = "";
        let buttonIsDisabled = isCompleted;

        if (isCorrectAndSubmitted) {
          variant = "default";
          prefixEmoji = "✅";
          additionalClasses = "bg-green-500 hover:bg-green-500 text-white dark:bg-green-600 dark:hover:bg-green-600 cursor-default";
        } else if (isIncorrectAndSelected) {
          variant = "destructive";
          prefixEmoji = "❌";
          additionalClasses = "bg-red-500 hover:bg-red-600 text-white dark:bg-red-600 dark:hover:bg-red-700 focus-visible:ring-red-400";
          buttonIsDisabled = false;
        } else if (isSelected) { // Selected but not yet evaluated as correct (before onCorrect completes)
            variant = "default";
            additionalClasses = "bg-primary/80";
        } else {
             additionalClasses = "border-primary/50 text-primary/90 hover:bg-primary/10 dark:text-primary-foreground/70 dark:hover:bg-primary/20";
        }

        if (isCompleted && !isCorrectAndSubmitted) {
            additionalClasses += " opacity-60 cursor-not-allowed";
        }

        return (
          <Button
            key={index}
            variant={variant}
            size="sm"
            onClick={() => handleOptionClick(option)}
            disabled={buttonIsDisabled && !isIncorrectAndSelected}
            className={cn(
              "h-auto px-2 py-1 text-sm leading-tight transition-all duration-200 rounded focus-visible:ring-offset-0 align-baseline",
              "inline-flex items-center",
              additionalClasses
            )}
            style={{gap: '0.2rem'}}
          >
            {prefixEmoji && <span className={cn("shrink-0", "-ml-0.5")}>{prefixEmoji}</span>}
            <span>{option}</span>
          </Button>
        );
      })}
    </span>
  );
}
