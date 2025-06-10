
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { cn, shuffleArray } from '@/lib/utils'; 
import { Check, X, Edit2, ChevronDown, ChevronUp } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface InteractiveFillInBlankProps {
  options: string[]; 
  correctAnswer: string;
  interactionId: string;
  onCorrect: (interactionId: string) => void;
}

export function InteractiveFillInBlank({
  options,
  correctAnswer,
  interactionId,
  onCorrect,
}: InteractiveFillInBlankProps) {
  const [filledAnswer, setFilledAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [shuffledDisplayOptions, setShuffledDisplayOptions] = useState<string[]>([]);

  const blankPlaceholder = "______";

  useEffect(() => {
    setShuffledDisplayOptions(shuffleArray(options));
  }, [options]);

  const handleOptionClick = (option: string) => {
    if (isSubmitted) return; 

    setFilledAnswer(option);
    const currentIsCorrect = option === correctAnswer;
    setIsCorrect(currentIsCorrect);
    setIsPopoverOpen(false); 

    if (currentIsCorrect) {
      setIsSubmitted(true); 
      onCorrect(interactionId);
    }
  };
  
  const [buttonWidth, setButtonWidth] = useState('auto');

  useEffect(() => {
    const textToMeasure = filledAnswer || blankPlaceholder;
    // Ajuste para estimar melhor a largura, considerando o ícone se presente.
    // Adiciona um pouco mais de padding para o ícone.
    const baseLength = Math.max(textToMeasure.length * 7, blankPlaceholder.length * 7); // Aproximadamente 7px por caractere em text-xs
    const paddingAndIcon = 28; // Ajuste para padding e ícone
    const minWidth = 80;
    setButtonWidth(`${Math.max(baseLength + paddingAndIcon, minWidth)}px`); 
  }, [filledAnswer, blankPlaceholder]);

  const handleTriggerClick = () => {
    if (isSubmitted) return; 

    if (filledAnswer && isCorrect === false) {
      setFilledAnswer(null);
      setIsCorrect(null);
    }
    setIsPopoverOpen(o => !o); 
  };

  let triggerContent;
  let icon = isPopoverOpen ? <ChevronUp className="h-3 w-3 opacity-70 shrink-0" /> : <ChevronDown className="h-3 w-3 opacity-70 shrink-0" />;
  let textColorClass = "text-primary hover:text-primary/80 dark:text-primary-foreground/70 dark:hover:text-primary-foreground/90";
  let borderColorClass = "border-primary/50 hover:border-primary";
  let cursorClass = "cursor-pointer";
  let mainText = blankPlaceholder;
  let prefixIcon = <Edit2 className="h-3 w-3 opacity-50 group-hover:opacity-100 transition-opacity shrink-0" />;


  if (isSubmitted) { 
    prefixIcon = <Check className="h-3 w-3 mr-1 shrink-0" />;
    mainText = filledAnswer || correctAnswer; 
    textColorClass = "text-green-700 dark:text-green-200";
    borderColorClass = "border-green-500 bg-green-100 dark:bg-green-800";
    cursorClass = "cursor-default";
    icon = null; 
  } else if (filledAnswer && isCorrect === false) { 
    prefixIcon = <X className="h-3 w-3 mr-0.5 shrink-0" />;
    mainText = filledAnswer; 
    textColorClass = "text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-900";
    borderColorClass = "border-red-500 dark:border-red-600";
  } else if (filledAnswer && isCorrect === null) { 
     mainText = filledAnswer;
     prefixIcon = null; 
  }

  triggerContent = (
      <>
          {prefixIcon}
          <span className="truncate">{mainText}</span>
          {icon}
      </>
  );

  return (
    <Popover open={isPopoverOpen && !isSubmitted} onOpenChange={(openState) => { if (!isSubmitted) setIsPopoverOpen(openState);}}>
      <PopoverTrigger asChild disabled={isSubmitted}>
        <span
            role="button"
            tabIndex={isSubmitted ? -1 : 0}
            onClick={handleTriggerClick} 
            onKeyDown={(e) => { 
                if (isSubmitted) return;
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleTriggerClick(); 
                }
            }}
            className={cn(
            "inline-flex items-center justify-between gap-1 px-1.5 py-0.5 text-xs leading-tight transition-all duration-200 rounded group align-baseline not-prose", // Adicionado align-baseline
            borderColorClass,
            textColorClass,
            cursorClass,
            isSubmitted ? "border" : "border border-dashed", 
            !isSubmitted && "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0 outline-none"
            )}
            style={{ minWidth: buttonWidth }}
            aria-expanded={isPopoverOpen && !isSubmitted}
            aria-haspopup="listbox"
        >
            {triggerContent}
        </span>
      </PopoverTrigger>
      <PopoverContent
          className="w-auto p-1.5 border-border shadow-lg flex flex-col space-y-1 min-w-max"
          side="bottom"
          align="start"
          hidden={isSubmitted} 
          onOpenAutoFocus={(e) => e.preventDefault()} 
      >
        {!isSubmitted && shuffledDisplayOptions.map((opt, index) => ( 
          <Button
            key={index}
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => handleOptionClick(opt)}
            className="justify-start text-xs h-auto py-1 px-2 text-left"
          >
            {opt}
          </Button>
        ))}
      </PopoverContent>
    </Popover>
  );
}

    