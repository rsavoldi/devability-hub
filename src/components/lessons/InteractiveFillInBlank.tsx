
"use client";

import { useState, useEffect, type JSX } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronUp } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { Lesson } from '@/lib/types';
import { useAuth } from '@/contexts/AuthContext';
import { shuffleArray } from '@/lib/utils';

interface InteractiveFillInBlankProps {
  lesson: Lesson;
  options: string[];
  correctAnswer: string;
  interactionId: string;
  onCorrect: (interactionId: string) => void;
  onUncomplete: (interactionId: string) => void;
  isInteractionCompleted?: boolean;
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
  const [filledAnswer, setFilledAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);
  const isSubmitted = isInteractionCompleted || false;

  useEffect(() => {
    setShuffledOptions(shuffleArray(options));
  }, [options]);

  useEffect(() => {
    if (isInteractionCompleted) {
      setFilledAnswer(correctAnswer);
      setIsCorrect(true);
    } else {
      setFilledAnswer(null);
      setIsCorrect(null);
    }
  }, [isInteractionCompleted, correctAnswer]);

  const handleOptionClick = (option: string) => {
    if (isLessonCompleted) return;
    
    setFilledAnswer(option);
    const currentIsCorrect = option === correctAnswer;
    setIsCorrect(currentIsCorrect);
    setIsPopoverOpen(false);

    if (currentIsCorrect) {
      onCorrect(interactionId);
    }
  };

  const handleTriggerClick = () => {
    if (isLessonCompleted) return;

    if (isSubmitted) {
      // Deselect logic
      setFilledAnswer(null);
      setIsCorrect(null);
      onUncomplete(interactionId);
      setIsPopoverOpen(true);
    } else if (filledAnswer && isCorrect === false) {
      // Reset incorrect answer
      setFilledAnswer(null);
      setIsCorrect(null);
      setIsPopoverOpen(true);
    } else {
      // Default toggle popover
      setIsPopoverOpen(o => !o);
    }
  };

  let chevronIcon: JSX.Element | null = isPopoverOpen ? <ChevronUp className="h-4 w-4 opacity-70 shrink-0 ml-1" /> : <ChevronDown className="h-4 w-4 opacity-70 shrink-0 ml-1" />;
  let textColorClass = "text-primary dark:text-primary-foreground/80";
  let borderColorClass = "border-primary/50 hover:border-primary focus-visible:border-primary";
  let cursorClass = "cursor-pointer";
  let mainText = "______";
  let prefixEmoji: React.ReactNode = "✏️";

  if (isSubmitted) {
    prefixEmoji = '✅';
    mainText = correctAnswer;
    textColorClass = "text-green-800 dark:text-green-200";
    borderColorClass = "border-green-600 bg-green-100 dark:bg-green-900 dark:border-green-700 hover:bg-green-200/80 dark:hover:bg-green-800/80";
    cursorClass = isLessonCompleted ? "cursor-default" : "cursor-pointer";
    chevronIcon = null;
  } else if (filledAnswer && isCorrect === false) {
    prefixEmoji = '❌';
    mainText = filledAnswer;
    textColorClass = "text-red-700 dark:text-red-300";
    borderColorClass = "border-red-500 bg-red-100 dark:bg-red-900/30 dark:border-red-700";
  } else if (filledAnswer && isCorrect === null) {
     mainText = filledAnswer;
     prefixEmoji = "";
  }
  
  if (isLessonCompleted && isSubmitted) {
    chevronIcon = null;
  }
  
  const popoverWidthClass = options.reduce((longest, current) => current.length > longest.length ? current : longest, "").length > 20
    ? 'w-auto'
    : 'min-w-[150px]';

  const triggerContent = (
    <span className="flex items-center justify-between w-full">
      <span className="flex items-center overflow-hidden gap-1">
        {prefixEmoji && <span className="shrink-0">{prefixEmoji}</span>}
        <span className="truncate">{mainText}</span>
      </span>
      {chevronIcon}
    </span>
  );

  return (
    <Popover open={isPopoverOpen && !isSubmitted && !isLessonCompleted} onOpenChange={(openState) => { if (!isSubmitted && !isLessonCompleted) setIsPopoverOpen(openState);}}>
      <PopoverTrigger asChild disabled={isLessonCompleted}>
        <button
            type="button"
            onClick={handleTriggerClick}
            className={cn(
            "w-auto inline-flex items-center justify-between gap-1 px-2 py-1 text-sm leading-tight transition-all duration-200 rounded group align-baseline not-prose min-w-[96px]",
            borderColorClass,
            textColorClass,
            cursorClass,
            isSubmitted ? "border" : "border border-dashed",
            !isSubmitted && !isLessonCompleted && "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0 outline-none hover:bg-accent/50 dark:hover:bg-accent/20"
            )}
            style={{ height: '1.75rem' }}
            aria-expanded={isPopoverOpen && !isSubmitted}
            aria-haspopup="listbox"
        >
            {triggerContent}
        </button>
      </PopoverTrigger>
      <PopoverContent
          className={cn("p-1.5 border-border shadow-lg flex flex-col space-y-1", popoverWidthClass)}
          side="bottom"
          align="start"
          hidden={isSubmitted || isLessonCompleted}
          onOpenAutoFocus={(e) => e.preventDefault()}
      >
        {!isSubmitted && shuffledOptions.map((opt, index) => (
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
