
"use client";

import { useState } from 'react';
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
  const [shuffledOptions] = useState<string[]>(() => shuffleArray(options));

  const handleOptionClick = (option: string) => {
    if (isLessonCompleted || isInteractionCompleted) return;

    // Se a opção clicada já está selecionada, desmarque-a.
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
  const isPermanentlyLocked = isLessonCompleted || isInteractionCompleted;

  return (
    <span className="inline-flex flex-wrap items-baseline gap-x-1.5 gap-y-1 mx-1 align-baseline not-prose">
      {shuffledOptions.map((option) => {
        const isSelected = selectedOption === option;
        let variant: "outline" | "default" | "secondary" | "destructive" | "ghost" | "link" | null | undefined = "outline";
        let prefixEmoji: React.ReactNode = null;
        let additionalClasses = "";

        const isCorrectlySelectedAndLocked = isPermanentlyLocked && option === correctAnswer;
        
        // Lógica CORRIGIDA: Se a interação está travada como correta, SÓ renderize a opção correta.
        if (isPermanentlyLocked && option !== correctAnswer) {
          return null;
        }

        if (isCorrectlySelectedAndLocked) {
           prefixEmoji = '✅';
           variant = "default";
           additionalClasses = "border border-green-600 bg-green-100 text-green-800 dark:bg-green-900/30 dark:border-green-700 dark:text-green-200 hover:bg-green-100/90 dark:hover:bg-green-900/40";
        } else if (isSelected && isCorrect === false) { // Estado de erro (temporário)
          prefixEmoji = '❌';
          variant = "destructive";
          // Adicionando a borda vermelha que faltava
          additionalClasses = "border border-red-500 bg-red-100 text-red-700 dark:bg-red-900/30 dark:border-red-700 dark:text-red-300 animate-in shake";
        } else if (isSelected && isCorrect === true) { // Estado de acerto (antes de travar)
           prefixEmoji = '✅';
           variant = "default";
           additionalClasses = "border border-green-600 bg-green-100 text-green-800 dark:bg-green-900/30 dark:border-green-700 dark:text-green-200 hover:bg-green-100/90 dark:hover:bg-green-900/40";
        } else { // Estado padrão
          additionalClasses = "border-primary/50 text-primary/90 hover:bg-primary/10 dark:text-primary-foreground/70 dark:hover:bg-primary/20";
        }

        const isButtonDisabled = isPermanentlyLocked && option !== correctAnswer;
        
        return (
          <Button
            key={option}
            type="button"
            variant={variant}
            size="sm"
            onClick={() => handleOptionClick(option)}
            disabled={isButtonDisabled || isPermanentlyLocked}
            className={cn(
              "h-auto px-2 py-1 text-sm leading-tight transition-all duration-200 rounded focus-visible:ring-offset-0 align-baseline",
              "inline-flex items-center",
              additionalClasses,
              (isButtonDisabled || isPermanentlyLocked) && "cursor-not-allowed",
              !isPermanentlyLocked && "cursor-pointer"
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
