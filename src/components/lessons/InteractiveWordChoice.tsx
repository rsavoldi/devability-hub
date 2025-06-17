
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface InteractiveWordChoiceProps {
  options: string[];
  correctAnswer: string;
  interactionId: string;
  onCorrect: (interactionId: string) => void;
  isLessonAlreadyCompleted?: boolean; // Nova prop
}

export function InteractiveWordChoice({
  options,
  correctAnswer,
  interactionId,
  onCorrect,
  isLessonAlreadyCompleted, // Nova prop
}: InteractiveWordChoiceProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(
    isLessonAlreadyCompleted ? correctAnswer : null
  );
  const [isCorrectSelection, setIsCorrectSelection] = useState<boolean | null>(
    isLessonAlreadyCompleted ? true : null
  );
  const [isSubmitted, setIsSubmitted] = useState<boolean>(
    isLessonAlreadyCompleted || false
  );

  useEffect(() => {
    if (isLessonAlreadyCompleted) {
      setSelectedOption(correctAnswer);
      setIsCorrectSelection(true);
      setIsSubmitted(true);
    }
  }, [isLessonAlreadyCompleted, correctAnswer]);

  const handleOptionClick = (option: string) => {
    if (isSubmitted) return; // Se já submetido (ou lição já completa), não faz nada

    if (selectedOption === option && isCorrectSelection === false) {
      setSelectedOption(null);
      setIsCorrectSelection(null);
    } else {
      setSelectedOption(option);
      const isCorrect = option === correctAnswer;
      setIsCorrectSelection(isCorrect);

      if (isCorrect) {
        setIsSubmitted(true);
        onCorrect(interactionId);
      }
    }
  };

  return (
    <span className="inline-flex flex-wrap items-baseline gap-x-1.5 gap-y-1 mx-1 align-baseline not-prose">
      {options.map((option, index) => {
        const isSelected = selectedOption === option;
        const isCorrectAndSubmitted = isSubmitted && option === correctAnswer;
        const isIncorrectAndSelected = isSelected && isCorrectSelection === false && !isSubmitted; // Apenas antes da submissão correta

        let variant: "default" | "outline" | "secondary" | "destructive" | "link" | "ghost" = "outline";
        let prefixEmoji = "";
        let additionalClasses = "";
        let buttonIsDisabled = isSubmitted && option !== correctAnswer; // Desabilita outras opções após submissão correta

        if (isCorrectAndSubmitted) {
          variant = "default";
          prefixEmoji = "✅";
          additionalClasses = "bg-green-500 hover:bg-green-500 text-white dark:bg-green-600 dark:hover:bg-green-600 cursor-default";
          buttonIsDisabled = true; // Bloqueia a opção correta também
        } else if (isSubmitted && option !== correctAnswer) {
           additionalClasses = "opacity-60 cursor-not-allowed text-muted-foreground";
        } else { // Antes da submissão final (ou seja, quando isSubmitted é false, ou lição não completa inicialmente)
          if (isSelected) {
            if (isCorrectSelection === true) { // Selecionou a correta, vai submeter
              variant = "default";
              prefixEmoji = "✅";
              additionalClasses = "bg-green-500 hover:bg-green-600 text-white dark:bg-green-600 dark:hover:bg-green-700 focus-visible:ring-green-400";
            } else if (isIncorrectAndSelected) { // Selecionou a errada
              variant = "destructive";
              prefixEmoji = "❌";
              additionalClasses = "bg-red-500 hover:bg-red-600 text-white dark:bg-red-600 dark:hover:bg-red-700 focus-visible:ring-red-400";
            }
          } else {
             additionalClasses = "border-primary/50 text-primary/90 hover:bg-primary/10 dark:text-primary-foreground/70 dark:hover:bg-primary/20";
          }
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
            style={{gap: (prefixEmoji && isCorrectAndSubmitted) ? '0.1rem' : (prefixEmoji ? '0.2rem' : '0')}}
          >
            {prefixEmoji && <span className={cn("shrink-0", (isCorrectAndSubmitted) ? "mr-0.5" : "-ml-0.5")}>{prefixEmoji}</span>}
            <span>{option}</span>
          </Button>
        );
      })}
    </span>
  );
}
