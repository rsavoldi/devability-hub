
"use client";

import { useState, useEffect, type JSX } from 'react';
import { Button } from '@/components/ui/button';
import { cn, shuffleArray } from '@/lib/utils';
import { ChevronDown, ChevronUp } from 'lucide-react';
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
  isLessonAlreadyCompleted?: boolean; // Nova prop
}

export function InteractiveFillInBlank({
  options,
  correctAnswer,
  interactionId,
  onCorrect,
  isLessonAlreadyCompleted, // Nova prop
}: InteractiveFillInBlankProps) {
  const [filledAnswer, setFilledAnswer] = useState<string | null>(
    isLessonAlreadyCompleted ? correctAnswer : null
  );
  const [isCorrect, setIsCorrect] = useState<boolean | null>(
    isLessonAlreadyCompleted ? true : null
  );
  const [isSubmitted, setIsSubmitted] = useState<boolean>(
    isLessonAlreadyCompleted || false
  );
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [shuffledDisplayOptions, setShuffledDisplayOptions] = useState<string[]>([]);

  const blankPlaceholder = "______";

  useEffect(() => {
    if (isLessonAlreadyCompleted) {
      setFilledAnswer(correctAnswer);
      setIsCorrect(true);
      setIsSubmitted(true);
      setIsPopoverOpen(false); // Popover deve estar fechado se já está correto
    } else {
      setShuffledDisplayOptions(shuffleArray(options));
    }
  }, [isLessonAlreadyCompleted, correctAnswer, options]);


  const handleOptionClick = (option: string) => {
    if (isSubmitted) return; // Se já submetido (ou lição já completa), não faz nada

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
    const textToMeasure = (isLessonAlreadyCompleted ? correctAnswer : filledAnswer) || blankPlaceholder;
    const emojiPlaceholderWidth = (isSubmitted || (filledAnswer && isCorrect === false)) ? 16 : 16;
    const baseLength = Math.max(textToMeasure.length * 8, blankPlaceholder.length * 8);
    const paddingAndChevron = 28;
    const minWidth = 100;
    setButtonWidth(`${Math.max(baseLength + emojiPlaceholderWidth + paddingAndChevron, minWidth)}px`);
  }, [filledAnswer, blankPlaceholder, isSubmitted, isCorrect, isLessonAlreadyCompleted, correctAnswer]);


  const handleTriggerClick = () => {
    if (isSubmitted) return; // Se já submetido (ou lição já completa), não faz nada

    if (filledAnswer && isCorrect === false) {
      setFilledAnswer(null);
      setIsCorrect(null);
    }
    setIsPopoverOpen(o => !o);
  };

  let chevronIcon: JSX.Element | null = isPopoverOpen ? <ChevronUp className="h-4 w-4 opacity-70 shrink-0 ml-1" /> : <ChevronDown className="h-4 w-4 opacity-70 shrink-0 ml-1" />;
  let textColorClass = "text-primary dark:text-primary-foreground/80";
  let borderColorClass = "border-primary/50 hover:border-primary focus-visible:border-primary";
  let cursorClass = "cursor-pointer";
  let mainText = blankPlaceholder;
  let prefixEmoji = "✏️";

  if (isSubmitted) { // Cobre o caso de isLessonAlreadyCompleted também
    prefixEmoji = "✅";
    mainText = correctAnswer; // Mostra a resposta correta
    textColorClass = "text-green-700 dark:text-green-300";
    borderColorClass = "border-green-500 bg-green-100 dark:bg-green-800/30 dark:border-green-700";
    cursorClass = "cursor-default";
    chevronIcon = null; // Remover chevron quando submetido e correto
  } else if (filledAnswer && isCorrect === false) {
    prefixEmoji = "❌";
    mainText = filledAnswer;
    textColorClass = "text-red-700 dark:text-red-300";
    borderColorClass = "border-red-500 bg-red-100 dark:bg-red-900/30 dark:border-red-700";
  } else if (filledAnswer && isCorrect === null) {
     mainText = filledAnswer;
     prefixEmoji = "";
  }

  const triggerContent = (
    <span className="flex items-center justify-between w-full">
      <span className="flex items-center overflow-hidden">
        {prefixEmoji && <span className={cn("shrink-0", prefixEmoji === "✅" ? "mr-0.5" : "mr-1")}>{prefixEmoji}</span>}
        <span className="truncate">{mainText}</span>
      </span>
      {chevronIcon}
    </span>
  );

  return (
    <Popover open={isPopoverOpen && !isSubmitted} onOpenChange={(openState) => { if (!isSubmitted) setIsPopoverOpen(openState);}}>
      <PopoverTrigger asChild disabled={isSubmitted}>
        <button
            type="button"
            onClick={handleTriggerClick}
            className={cn(
            "inline-flex items-center justify-between gap-1 px-2 py-1 text-sm leading-tight transition-all duration-200 rounded group align-baseline not-prose",
            borderColorClass,
            textColorClass,
            cursorClass,
            isSubmitted ? "border" : "border border-dashed",
            !isSubmitted && "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0 outline-none hover:bg-accent/50 dark:hover:bg-accent/20"
            )}
            style={{ minWidth: buttonWidth, height: '1.75rem' }}
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
            className="justify-start text-sm h-auto py-1.5 px-2.5 text-left"
          >
            {opt}
          </Button>
        ))}
      </PopoverContent>
    </Popover>
  );
}
