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
isInteractionCompleted, // Prop vinda do AuthContext
isLessonCompleted
}: InteractiveWordChoiceProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  
  // Apenas embaralha as opções uma vez na montagem do componente.
  const [shuffledOptions] = useState(() => shuffleArray(options));

  // O estado 'isSubmitted' agora é puramente local para controle visual imediato.
  const [isSubmitted, setIsSubmitted] = useState(isInteractionCompleted || false);

  // Sincroniza o estado local se o estado global (vindo do AuthContext) mudar.
  // Isso é importante para quando a página é carregada pela primeira vez.
  useEffect(() => {
    const submitted = isInteractionCompleted || false;
    setIsSubmitted(submitted);
    if (submitted) {
      setSelectedOption(correctAnswer);
      setIsCorrect(true);
    } else {
      setSelectedOption(null);
      setIsCorrect(null);
    }
  }, [isInteractionCompleted, correctAnswer]);

  const handleOptionClick = (option: string) => {
    if (isLessonCompleted) return;

    if (isSubmitted && option === correctAnswer) {
      // Lógica de desmarcar
      setIsSubmitted(false);
      setSelectedOption(null);
      setIsCorrect(null);
      onUncomplete(interactionId); // Notifica o backend em segundo plano
    } else if (!isSubmitted) {
      // Lógica de primeira seleção
      setSelectedOption(option);
      const currentIsCorrect = option === correctAnswer;
      setIsCorrect(currentIsCorrect);

      if (currentIsCorrect) {
        setIsSubmitted(true); // Atualiza visualmente IMEDIATAMENTE
        onCorrect(interactionId); // Notifica o backend em segundo plano
      }
    }
  };

  const handleReclickWrongAnswer = (option: string) => {
    if (selectedOption === option && isCorrect === false) {
      setSelectedOption(null);
      setIsCorrect(null);
    } else {
      handleOptionClick(option);
    }
  };

  const optionsToRender = isSubmitted ? [correctAnswer] : shuffledOptions;

  return (
    <span className="inline-flex flex-wrap items-baseline gap-x-1.5 gap-y-1 mx-1 align-baseline not-prose">
      {optionsToRender.map((option, index) => {
        const isSelected = selectedOption === option;
        
        let variant: "default" | "outline" | "secondary" | "destructive" | "link" | "ghost" = "outline";
        let additionalClasses = "";
        let prefixEmoji: React.ReactNode = null;
        
        if (isSelected && isCorrect) { // Apenas se isCorrect for true (após o clique)
           prefixEmoji = '✅';
           variant = 'outline';
           additionalClasses = "border border-green-600 bg-green-100 text-green-800 dark:bg-green-900/30 dark:border-green-700 dark:text-green-200 hover:bg-green-100/90 dark:hover:bg-green-900/40";
        } else if (isSelected && isCorrect === false) {
          variant = "destructive";
          prefixEmoji = '❌';
          additionalClasses = "bg-red-100 border-red-500 text-red-700 dark:bg-red-900/30 dark:border-red-700 dark:text-red-300";
        } else if (!isSubmitted) {
          additionalClasses = "border-primary/50 text-primary/90 hover:bg-primary/10 dark:text-primary-foreground/70 dark:hover:bg-primary/20";
        }

        const isDisabled = isLessonCompleted || (isSubmitted && option !== correctAnswer);
        
        return (
          <Button
            key={index}
            type="button"
            variant={variant}
            size="sm"
            onClick={() => handleReclickWrongAnswer(option)}
            disabled={isDisabled}
            className={cn(
              "h-auto px-2 py-1 text-sm leading-tight transition-all duration-200 rounded focus-visible:ring-offset-0 align-baseline",
              "inline-flex items-center",
              additionalClasses,
              isSelected && !isCorrect && "animate-in shake",
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