
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface InteractiveWordChoiceProps {
  options: string[];
  correctAnswer: string;
  interactionId: string;
  onCorrect: (interactionId: string) => void;
}

export function InteractiveWordChoice({
  options,
  correctAnswer,
  interactionId,
  onCorrect,
}: InteractiveWordChoiceProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrectSelection, setIsCorrectSelection] = useState<boolean | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleOptionClick = (option: string) => {
    if (isSubmitted) return;

    if (selectedOption === option) {
      // Se clicou na mesma opção, desmarca (se não for correta e submetida)
      // Ou se for correta mas ainda não submetida, permite desmarcar
      setSelectedOption(null);
      setIsCorrectSelection(null);
    } else {
      setSelectedOption(option);
      const isCorrect = option === correctAnswer;
      setIsCorrectSelection(isCorrect);

      if (isCorrect) {
        setIsSubmitted(true); // Marca como submetido APENAS se a seleção for correta
        onCorrect(interactionId);
      }
    }
  };

  return (
    <span className="inline-flex flex-wrap items-baseline gap-x-1.5 gap-y-1 mx-1 align-baseline not-prose">
      {options.map((option, index) => {
        const isSelected = selectedOption === option;

        let variant: "default" | "outline" | "secondary" | "destructive" | "link" | "ghost" = "outline";
        let prefixEmoji = "";
        let additionalClasses = "";

        if (isSubmitted && option === correctAnswer) { // Apenas a opção correta fica destacada após submissão
          variant = "default";
          prefixEmoji = "✅";
          additionalClasses = "bg-green-500 hover:bg-green-500 text-white dark:bg-green-600 dark:hover:bg-green-600 cursor-default";
        } else if (isSubmitted && option !== correctAnswer) { // Outras opções ficam desabilitadas e menos destacadas
            additionalClasses = "opacity-60 cursor-not-allowed text-muted-foreground";
        } else { // Antes da submissão final (ou seja, quando isSubmitted é false)
          if (isSelected) {
            if (isCorrectSelection === true) { // Selecionou a correta, vai submeter
              variant = "default";
              prefixEmoji = "✅";
              additionalClasses = "bg-green-500 hover:bg-green-600 text-white dark:bg-green-600 dark:hover:bg-green-700 focus-visible:ring-green-400";
            } else if (isCorrectSelection === false) { // Selecionou a errada
              variant = "destructive";
              prefixEmoji = "❌";
              additionalClasses = "bg-red-500 hover:bg-red-600 text-white dark:bg-red-600 dark:hover:bg-red-700 focus-visible:ring-red-400";
            }
          } else { // Não selecionada
             additionalClasses = "border-primary/50 text-primary/90 hover:bg-primary/10 dark:text-primary-foreground/70 dark:hover:bg-primary/20";
          }
        }

        return (
          <Button
            key={index}
            variant={variant}
            size="sm"
            onClick={() => handleOptionClick(option)}
            disabled={isSubmitted && option !== correctAnswer} // Desabilita outras opções após submissão correta
            className={cn(
              "h-auto px-2 py-1 text-sm leading-tight transition-all duration-200 rounded focus-visible:ring-offset-0 align-baseline",
              "inline-flex items-center",
              additionalClasses
            )}
            style={{gap: prefixEmoji && option === correctAnswer ? '0' : (prefixEmoji ? '0.2rem' : '0')}} // Remove gap para opção correta
          >
            {prefixEmoji && <span className={cn("shrink-0", option === correctAnswer && isSubmitted ? "mr-0.5" : "-ml-0.5")}>{prefixEmoji}</span>}
            <span>{option}</span>
          </Button>
        );
      })}
    </span>
  );
}

    