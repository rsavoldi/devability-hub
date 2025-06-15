
"use client";

import { useState, useEffect, type JSX } from 'react';
import { Button } from '@/components/ui/button';
import { cn, shuffleArray } from '@/lib/utils';
import { ChevronDown, ChevronUp } from 'lucide-react'; // Check, X, Edit2 removidos
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
    const emojiPlaceholderWidth = isSubmitted || (filledAnswer && isCorrect === false) ? 12 : 12; // Estimativa para largura do emoji e pequeno espaço
    const baseLength = Math.max(textToMeasure.length * 6, blankPlaceholder.length * 7);
    const paddingAndChevron = 20;
    const minWidth = 80; // Largura mínima para acomodar placeholder e chevrons
    setButtonWidth(`${Math.max(baseLength + emojiPlaceholderWidth + paddingAndChevron, minWidth)}px`);
  }, [filledAnswer, blankPlaceholder, isSubmitted, isCorrect]);


  const handleTriggerClick = () => {
    if (isSubmitted) return;

    if (filledAnswer && isCorrect === false) {
      setFilledAnswer(null);
      setIsCorrect(null);
    }
    setIsPopoverOpen(o => !o);
  };

  let triggerContent;
  let chevronIcon: JSX.Element | null = isPopoverOpen ? <ChevronUp className="h-3 w-3 opacity-70 shrink-0 ml-1" /> : <ChevronDown className="h-3 w-3 opacity-70 shrink-0 ml-1" />;
  let textColorClass = "text-primary dark:text-primary-foreground/80"; // Removido hover de cor de texto para evitar sublinhado herdado
  let borderColorClass = "border-primary/50 hover:border-primary focus-visible:border-primary"; // Adicionado focus-visible
  let cursorClass = "cursor-pointer";
  let mainText = blankPlaceholder;
  let prefixEmoji = "✏️"; // Emoji de lápis para estado inicial/edição

  if (isSubmitted) {
    prefixEmoji = "✅"; // Emoji de check para submetido e correto
    mainText = filledAnswer || correctAnswer;
    textColorClass = "text-green-700 dark:text-green-300";
    borderColorClass = "border-green-500 bg-green-100 dark:bg-green-800/30 dark:border-green-700";
    cursorClass = "cursor-default";
    chevronIcon = null;
  } else if (filledAnswer && isCorrect === false) {
    prefixEmoji = "❌"; // Emoji de X para resposta incorreta
    mainText = filledAnswer;
    textColorClass = "text-red-700 dark:text-red-300";
    borderColorClass = "border-red-500 bg-red-100 dark:bg-red-900/30 dark:border-red-700";
  } else if (filledAnswer && isCorrect === null) {
     mainText = filledAnswer;
     prefixEmoji = ""; // Sem emoji se apenas preenchido mas não verificado (ou pode ser ✏️)
  }


  triggerContent = (
    <span className="flex items-center justify-between w-full">
      <span className="flex items-center overflow-hidden">
        {prefixEmoji && <span className="mr-1 shrink-0">{prefixEmoji}</span>}
        <span className="truncate">{mainText}</span>
      </span>
      {chevronIcon}
    </span>
  );

  return (
    <Popover open={isPopoverOpen && !isSubmitted} onOpenChange={(openState) => { if (!isSubmitted) setIsPopoverOpen(openState);}}>
      <PopoverTrigger asChild disabled={isSubmitted}>
        <button // Mudado para button para melhor semântica e controle de foco/estilo
            type="button" // Garante que não submete formulários
            onClick={handleTriggerClick}
            className={cn(
            "inline-flex items-center justify-between gap-1 px-1.5 py-0.5 text-xs leading-tight transition-all duration-200 rounded group align-baseline not-prose",
            borderColorClass,
            textColorClass,
            cursorClass,
            isSubmitted ? "border" : "border border-dashed",
            !isSubmitted && "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0 outline-none hover:bg-accent/50 dark:hover:bg-accent/20" // Adicionado hover background
            )}
            style={{ minWidth: buttonWidth, height: '1.5rem' }} // altura fixa para consistência
            aria-expanded={isPopoverOpen && !isSubmitted}
            aria-haspopup="listbox"
        >
            {triggerContent}
        </button>
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
