
"use client";

import { useState, type JSX, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronUp } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { Lesson } from '@/lib/types';
import { shuffleArray } from '@/lib/utils';

interface InteractiveFillInBlankProps {
  lesson: Lesson;
  options: string[];
  correctAnswer: string;
  interactionId: string;
  onCorrect: (interactionId: string) => void;
  onUncomplete: (interactionId: string) => void;
  isInteractionCompleted: boolean;
  isLessonCompleted?: boolean;
}

export function InteractiveFillInBlank({
  lesson,
  options,
  correctAnswer,
  interactionId,
  onCorrect,
  onUncomplete,
  isInteractionCompleted,
  isLessonCompleted
}: InteractiveFillInBlankProps) {
  
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(isInteractionCompleted ? correctAnswer : null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(isInteractionCompleted ? true : null);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  
  // A aleatorização agora acontece apenas uma vez na inicialização do estado.
  const [shuffledDisplayOptions, setShuffledDisplayOptions] = useState<string[]>(() => shuffleArray(options));

  const handleOptionClick = (option: string) => {
    if (isLessonCompleted || isInteractionCompleted) return;
    
    const currentIsCorrect = option === correctAnswer;
    setIsCorrect(currentIsCorrect);
    setSelectedAnswer(option);
    setIsPopoverOpen(false);

    if (currentIsCorrect) {
      onCorrect(interactionId);
    }
  };

  const handleTriggerClick = () => {
    if (isLessonCompleted) return;

    if (isInteractionCompleted) {
      // Logic to un-complete
      setSelectedAnswer(null);
      setIsCorrect(null);
      onUncomplete(interactionId);
    } else {
      setIsPopoverOpen(o => !o);
    }
  };
  
  const isDisabled = isLessonCompleted || false;
  let mainText = selectedAnswer || "______";
  let chevronIcon: JSX.Element | null = isPopoverOpen ? <ChevronUp className="h-4 w-4 opacity-70 shrink-0 ml-1" /> : <ChevronDown className="h-4 w-4 opacity-70 shrink-0 ml-1" />;
  let textColorClass = "text-primary dark:text-primary-foreground/80";
  let borderColorClass = "border-primary/50 hover:border-primary focus-visible:border-primary";
  let cursorClass = "cursor-pointer";
  let prefixEmoji: React.ReactNode = "✏️";
  let backgroundClass = "bg-transparent hover:bg-accent/50 dark:hover:bg-accent/20";
  
  if (isInteractionCompleted || (selectedAnswer && isCorrect)) {
    prefixEmoji = "✅";
    mainText = correctAnswer;
    textColorClass = "text-green-800 dark:text-green-200";
    borderColorClass = "border-green-600 dark:border-green-700";
    backgroundClass = "bg-green-100 dark:bg-green-900/30";
    cursorClass = isDisabled ? "cursor-default" : "cursor-pointer";
    chevronIcon = isDisabled ? null : <ChevronDown className="h-4 w-4 opacity-70 shrink-0 ml-1" />;
  } else if (selectedAnswer && isCorrect === false) {
    prefixEmoji = '❌';
    mainText = selectedAnswer;
    textColorClass = "text-red-700 dark:text-red-300";
    borderColorClass = "border-red-500 dark:border-red-700";
    backgroundClass = "bg-red-100 dark:bg-red-900/30";
    chevronIcon = <ChevronDown className="h-4 w-4 opacity-70 shrink-0 ml-1" />;
  } else if (selectedAnswer && isCorrect === null) {
     mainText = selectedAnswer;
     prefixEmoji = "";
  }
  
  const isSubmitted = isInteractionCompleted || isCorrect !== null;

  return (
    <Popover open={isPopoverOpen && !isSubmitted && !isDisabled} onOpenChange={(openState) => { if (!isSubmitted && !isDisabled) setIsPopoverOpen(openState);}}>
      <PopoverTrigger asChild disabled={isDisabled}>
        <button
            type="button"
            onClick={handleTriggerClick}
            className={cn(
              "inline-flex items-center justify-between gap-1 px-2 py-1 text-sm leading-tight transition-all duration-200 rounded group align-baseline not-prose min-w-[100px]",
              borderColorClass,
              textColorClass,
              cursorClass,
              backgroundClass,
              "border",
              !isSubmitted && !selectedAnswer && "border-dashed",
              !isSubmitted && !isDisabled && "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0 outline-none"
            )}
            style={{ height: '1.75rem' }}
            aria-expanded={isPopoverOpen && !isSubmitted}
            aria-haspopup="listbox"
        >
             <span className="flex items-center justify-between w-full">
              <span className="flex items-center overflow-hidden gap-1">
                {prefixEmoji && <span className="shrink-0">{prefixEmoji}</span>}
                <span className="truncate">{mainText}</span>
              </span>
              {chevronIcon}
            </span>
        </button>
      </PopoverTrigger>
      <PopoverContent
          className={cn("p-1.5 border-border shadow-lg flex flex-col space-y-1 w-auto min-w-[var(--radix-popover-trigger-width)]")}
          side="bottom"
          align="start"
      >
        {shuffledDisplayOptions.map((opt, index) => (
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
