
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Check, X } from 'lucide-react';

interface InteractiveWordChoiceProps {
  options: string[];
  correctAnswer: string;
  interactionId: string; // Nova prop
  onCorrect: (interactionId: string) => void; // Nova prop
}

export function InteractiveWordChoice({
  options,
  correctAnswer,
  interactionId, // Nova prop
  onCorrect, // Nova prop
}: InteractiveWordChoiceProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrectSelection, setIsCorrectSelection] = useState<boolean | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false); 

  const handleOptionClick = (option: string) => {
    if (isSubmitted) return; 

    if (selectedOption === option) { 
      setSelectedOption(null); 
      setIsCorrectSelection(null); 
    } else { 
      setSelectedOption(option);
      const isCorrect = option === correctAnswer;
      setIsCorrectSelection(isCorrect);

      if (isCorrect) {
        setIsSubmitted(true); 
        onCorrect(interactionId); // Chama o callback quando correto
      }
    }
  };

  return (
    <span className="inline-flex flex-wrap items-baseline gap-x-1 mx-1 align-baseline not-prose"> 
      {options.map((option, index) => {
        const isSelected = selectedOption === option;
        // const isCurrentAttemptCorrect = isSelected && isCorrectSelection === true; // Simplificado abaixo
        // const isCurrentAttemptIncorrect = isSelected && isCorrectSelection === false; // Simplificado abaixo

        let variant: "default" | "outline" | "secondary" | "destructive" | "link" | "ghost" = "outline";
        let icon = null;
        let additionalClasses = "";

        if (isSubmitted) { // After correct submission (which means isCorrectSelection was true)
          if (option === correctAnswer) {
            variant = "default";
            icon = <Check className="h-3 w-3 mr-1" />;
            additionalClasses = "bg-green-500 hover:bg-green-500 text-white dark:bg-green-600 dark:hover:bg-green-600 cursor-default";
          } else {
            // Para opções não corretas após a submissão (quando a correta foi escolhida)
            additionalClasses = "opacity-60 cursor-not-allowed text-muted-foreground";
          }
        } else { // Before correct submission
          if (isSelected) {
            if (isCorrectSelection === true) { // Este estado é transitório, pois logo isSubmitted será true
              variant = "default";
              icon = <Check className="h-3 w-3 mr-1" />;
              additionalClasses = "bg-green-500 hover:bg-green-600 text-white dark:bg-green-600 dark:hover:bg-green-700 focus-visible:ring-green-400";
            } else if (isCorrectSelection === false) { // Tentativa incorreta
              variant = "destructive";
              icon = <X className="h-3 w-3 mr-1" />;
              additionalClasses = "bg-red-500 hover:bg-red-600 text-white dark:bg-red-600 dark:hover:bg-red-700 focus-visible:ring-red-400";
            }
          } else {
             // Opções não selecionadas antes da submissão
             additionalClasses = "border-primary/50 text-primary/90 hover:bg-primary/10 dark:text-primary-foreground/70 dark:hover:bg-primary/20";
          }
        }

        return (
          <Button
            key={index}
            variant={variant}
            size="sm" 
            onClick={() => handleOptionClick(option)}
            disabled={isSubmitted && option !== correctAnswer} 
            className={cn(
              "h-auto px-1.5 py-0.5 text-xs leading-tight transition-all duration-200 rounded focus-visible:ring-offset-0",
              additionalClasses,
            )}
          >
            {icon}
            {option}
          </Button>
        );
      })}
    </span>
  );
}
    
