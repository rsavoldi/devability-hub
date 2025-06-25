
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

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
  
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrectSelection, setIsCorrectSelection] = useState<boolean | null>(isCompleted ? true : null);
  const [isSubmitted, setIsSubmitted] = useState(isCompleted);

  useEffect(() => {
    if (isCompleted) {
      setSelectedOption(correctAnswer);
      setIsCorrectSelection(true);
      setIsSubmitted(true);
    } else {
      // This part handles the reset logic if the lesson progress is cleared externally
      setSelectedOption(null);
      setIsCorrectSelection(null);
      setIsSubmitted(false);
    }
  }, [isCompleted, correctAnswer]);

  const handleOptionClick = (option: string) => {
    if (isSubmitted) return;

    setSelectedOption(option);
    const isCorrect = option === correctAnswer;
    setIsCorrectSelection(isCorrect);
    
    if (isCorrect) {
      setIsSubmitted(true);
      onCorrect(interactionId);
    }
  };

  return (
    <span className="inline-flex flex-wrap items-baseline gap-x-1.5 gap-y-1 mx-1 align-baseline not-prose">
      {options.map((option, index) => {
        const isSelected = selectedOption === option;
        const isCorrectChoice = option === correctAnswer;
        
        // Hide incorrect options once the correct answer is submitted
        if (isSubmitted && !isCorrectChoice) {
          return null;
        }

        let variant: "default" | "outline" | "secondary" | "destructive" | "link" | "ghost" = "outline";
        let prefixEmoji: React.ReactNode = null;
        let additionalClasses = "";
        let buttonIsDisabled = isSubmitted;

        if (isSubmitted && isCorrectChoice) {
          variant = "outline";
          prefixEmoji = '✅';
          // Style copied from InteractiveFillInBlank for consistency
          additionalClasses = "border-green-500 bg-green-100 text-green-700 dark:bg-green-800/30 dark:text-green-300 dark:border-green-700 cursor-default hover:bg-green-100 dark:hover:bg-green-800/30";
        } else if (isSelected && !isCorrectSelection) {
          variant = "destructive";
          prefixEmoji = '❌';
          additionalClasses = "bg-red-500 hover:bg-red-600 text-white dark:bg-red-600 dark:hover:bg-red-700 focus-visible:ring-red-400";
          buttonIsDisabled = false; // Allow user to try again
        } else if (isSelected) {
            variant = "ghost"; // Use ghost to remove default button styles
            additionalClasses = "bg-primary/20 text-primary dark:bg-primary/30 dark:text-primary-foreground ring-2 ring-primary ring-offset-2 ring-offset-background";
        } else {
             additionalClasses = "border-primary/50 text-primary/90 hover:bg-primary/10 dark:text-primary-foreground/70 dark:hover:bg-primary/20";
        }

        return (
          <Button
            key={index}
            variant={variant}
            size="sm"
            onClick={() => handleOptionClick(option)}
            disabled={buttonIsDisabled}
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
