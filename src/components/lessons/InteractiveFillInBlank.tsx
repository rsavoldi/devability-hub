
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
  interactionId: string; // Nova prop
  onCorrect: (interactionId: string) => void; // Nova prop
}

export function InteractiveFillInBlank({
  options,
  correctAnswer,
  interactionId, // Nova prop
  onCorrect, // Nova prop
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
      onCorrect(interactionId); // Chama o callback quando correto
    }
  };
  
  const [buttonWidth, setButtonWidth] = useState('auto');

  useEffect(() => {
    const textToMeasure = filledAnswer || blankPlaceholder;
    const estimated = `${Math.max(textToMeasure.length * 8 + 24, 80)}px`; 
    setButtonWidth(estimated);
  }, [filledAnswer, blankPlaceholder]);

  const handleTriggerClick = () => {
    if (isSubmitted) return; 

    if (filledAnswer && isCorrect === false) {
      setFilledAnswer(null);
      setIsCorrect(null);
    }
    // Sempre alterna o popover se não estiver submetido corretamente
    setIsPopoverOpen(o => !o); 
  };

  let triggerContent;
  let icon = isPopoverOpen ? <ChevronUp className="h-3 w-3 opacity-70" /> : <ChevronDown className="h-3 w-3 opacity-70" />;
  let textColorClass = "text-primary hover:text-primary/80 dark:text-primary-foreground/70 dark:hover:text-primary-foreground/90";
  let borderColorClass = "border-primary/50 hover:border-primary";
  let cursorClass = "cursor-pointer";
  let mainText = blankPlaceholder;
  let prefixIcon = <Edit2 className="h-3 w-3 opacity-50 group-hover:opacity-100 transition-opacity" />;


  if (isSubmitted) { // Após submissão correta
    prefixIcon = <Check className="h-3 w-3 mr-1" />;
    mainText = filledAnswer || correctAnswer; // Mostra a resposta correta
    textColorClass = "text-green-700 dark:text-green-200";
    borderColorClass = "border-green-500 bg-green-100 dark:bg-green-800";
    cursorClass = "cursor-default";
    icon = null; // Sem ícone de dropdown
  } else if (filledAnswer && isCorrect === false) { // Tentativa incorreta
    prefixIcon = <X className="h-3 w-3 mr-0.5" />;
    mainText = filledAnswer; // Mostra a tentativa incorreta, sem riscar
    textColorClass = "text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-900";
    borderColorClass = "border-red-500 dark:border-red-600";
  } else if (filledAnswer && isCorrect === null) { // Selecionou, mas ainda não verificou (ou limpou incorreta)
     mainText = filledAnswer;
     prefixIcon = null; // Sem ícone de lápis se algo já foi preenchido e não é erro
  }


  triggerContent = (
      <>
          {prefixIcon}
          <span>{mainText}</span>
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
            "inline-flex items-center gap-1 px-1.5 py-0.5 text-xs leading-tight transition-all duration-200 rounded group",
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
