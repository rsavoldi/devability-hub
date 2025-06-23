
"use client";

import React, { useEffect, useState, useMemo, Fragment, useCallback } from 'react';
import Image from 'next/image';
import type { Lesson, UserProfile } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, CheckCircle, Clock, Loader2, FileText, Info, Trophy } from 'lucide-react';
import Link from 'next/link';
import { InteractiveWordChoice } from './InteractiveWordChoice';
import { InteractiveFillInBlank } from './InteractiveFillInBlank';
import { Separator } from '../ui/separator';
import { cn, shuffleArray } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { playSound } from '@/lib/sounds';
import { useRouter } from 'next/navigation';
import { LOCAL_STORAGE_KEYS } from '@/constants';
import { mockLessons as allMockLessons, mockAchievements } from '@/lib/mockData';

interface LessonViewProps {
  lesson: Lesson;
}

const wordChoiceRegexSource = "INTERACTIVE_WORD_CHOICE:\\s*OPTIONS=\\[(.*?)\\]";
const fillBlankRegexSource = "INTERACTIVE_FILL_IN_BLANK:\\s*\\[(.*?)\\]";
const combinedRegex = new RegExp(
  `<!--\\s*(${wordChoiceRegexSource})\\s*-->|<!--\\s*(${fillBlankRegexSource})\\s*-->`,
  "g"
);

// Regex para **bold** e *italic* que não captura espaços adjacentes aos delimitadores.
const boldRegex = /\*\*(\S(?:.*?\S)?)\*\*/g;
const italicRegex = /\*(\S(?:.*?\S)?)\*/g;

// Função para renderizar itálico dentro de um segmento de texto
const renderWithItalics = (text: string, baseKey: string): React.ReactNode[] => {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  italicRegex.lastIndex = 0; // Reseta o estado do regex global
  let match;
  while ((match = italicRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    // match[1] é o conteúdo capturado entre os asteriscos
    parts.push(<em key={`${baseKey}-i-${match.index}`}>{match[1]}</em>);
    lastIndex = italicRegex.lastIndex;
  }
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }
  return parts;
};

// Nova função principal para formatação, que lida com negrito e chama a função de itálico
const renderTextWithFormatting = (text: string, baseKey: string): React.ReactNode[] => {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  boldRegex.lastIndex = 0; // Reseta o estado do regex global
  let match;
  while ((match = boldRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      // Processa o texto antes da parte em negrito para itálico
      parts.push(...renderWithItalics(text.substring(lastIndex, match.index), `${baseKey}-pre-${match.index}`));
    }
    // Processa o conteúdo dentro da tag de negrito para itálico (suporta aninhamento)
    const boldContent = renderWithItalics(match[1], `${baseKey}-in-${match.index}`);
    parts.push(<strong key={`${baseKey}-b-${match.index}`}>{boldContent}</strong>);
    lastIndex = boldRegex.lastIndex;
  }
  if (lastIndex < text.length) {
    // Processa o restante do texto para itálico
    parts.push(...renderWithItalics(text.substring(lastIndex), `${baseKey}-post`));
  }
  return parts;
};


const renderContentWithParagraphs = (elements: (string | JSX.Element)[], baseKey: string): JSX.Element[] => {
  const outputParagraphs: JSX.Element[] = [];
  let currentParagraphChildren: React.ReactNode[] = [];
  let paragraphKeyCounter = 0;

  const finalizeParagraph = () => {
    if (currentParagraphChildren.length > 0) {
      outputParagraphs.push(
        <p key={`${baseKey}-p-${paragraphKeyCounter++}`} className="mb-4 last:mb-0">
          {currentParagraphChildren}
        </p>
      );
      currentParagraphChildren = [];
    }
  };

  elements.forEach((element, elementIdx) => {
    const elementKey = `${baseKey}-el-${elementIdx}`;
    if (typeof element === 'string') {
      const textSegments = element.split(/(\\n|\n)/g);
      textSegments.forEach((segment, segmentIdx) => {
        const segmentKey = `${elementKey}-seg-${segmentIdx}`;
        if (segment === '\\n' || segment === '\n') {
          finalizeParagraph();
        } else if (segment && segment.trim() !== '') {
          // Chama a nova função que lida com negrito e itálico
          currentParagraphChildren.push(...renderTextWithFormatting(segment, segmentKey));
        }
      });
    } else if (React.isValidElement(element)) {
      currentParagraphChildren.push(React.cloneElement(element, { key: elementKey }));
    }
  });

  finalizeParagraph();

  if (outputParagraphs.length === 0 && currentParagraphChildren.length > 0) {
     outputParagraphs.push(
      <p key={`${baseKey}-p-singlefinal`} className="mb-4 last:mb-0">
        {currentParagraphChildren}
      </p>
    );
  }
  return outputParagraphs;
};


export function LessonView({ lesson }: LessonViewProps) {
  const { userProfile, loading: authLoading, completeLesson } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const [isMarkingComplete, setIsMarkingComplete] = useState(false);

  const [prevLesson, setPrevLesson] = useState<Lesson | null>(null);
  const [nextLesson, setNextLesson] = useState<Lesson | null>(null);

  const [totalInteractiveElements, setTotalInteractiveElements] = useState(0);
  const [completedInteractionIds, setCompletedInteractionIds] = useState<Set<string>>(new Set());

  const isLessonAlreadyCompletedByProfile = useMemo(() => {
    if (authLoading || !userProfile || !lesson) return false;
    return userProfile.completedLessons.includes(lesson.id);
  }, [userProfile, lesson, authLoading]);


  const handleInteractionCorrect = useCallback((interactionId: string) => {
    setCompletedInteractionIds(prev => {
      const newSet = new Set(prev);
      newSet.add(interactionId);
      if (typeof window !== 'undefined' && lesson) {
          const currentLessonInteractionsKey = `${LOCAL_STORAGE_KEYS.GUEST_COMPLETED_LESSONS}_interactions_${lesson.id}_${userProfile?.id || 'guest'}`;
          localStorage.setItem(currentLessonInteractionsKey, JSON.stringify(Array.from(newSet)));
      }
      return newSet;
    });
  }, [lesson, userProfile?.id]);

  const parseLessonContentAndCountInteractions = useCallback((content: string): (string | JSX.Element)[] => {
    const elements: (string | JSX.Element)[] = [];
    let lastIndex = 0;
    let interactionCounter = 0;

    const generalCommentsRegex = /<!--(?!.*?INTERACTIVE_WORD_CHOICE:|.*?INTERACTIVE_FILL_IN_BLANK:).*?-->/gs;
    const contentWithoutGeneralComments = content.replace(generalCommentsRegex, '');

    let match;
    combinedRegex.lastIndex = 0;

    while ((match = combinedRegex.exec(contentWithoutGeneralComments)) !== null) {
      const interactionId = `lesson-${lesson.id}-interaction-${interactionCounter}`;
      interactionCounter++;

      if (match.index > lastIndex) {
        elements.push(contentWithoutGeneralComments.substring(lastIndex, match.index));
      }

      if (match[2]) { // INTERACTIVE_WORD_CHOICE
        const optionsString = match[2];
        if (optionsString) {
          const rawOptions = optionsString.split(';');
          let correctAnswer = "";
          const parsedOptions = rawOptions.map(opt => {
            const trimmedOpt = opt.trim();
            if (trimmedOpt.startsWith('*')) {
              correctAnswer = trimmedOpt.substring(1).trim();
              return trimmedOpt.substring(1).trim();
            }
            return trimmedOpt;
          }).filter(opt => opt.length > 0);

          if (parsedOptions.length > 0 && correctAnswer) {
            elements.push(
              <InteractiveWordChoice
                key={interactionId}
                interactionId={interactionId}
                options={shuffleArray(parsedOptions)}
                correctAnswer={correctAnswer}
                onCorrect={handleInteractionCorrect}
                isLessonAlreadyCompleted={isLessonAlreadyCompletedByProfile}
              />
            );
          } else {
            elements.push(`<!-- WC PARSE ERROR: ${match[0]} -->`);
          }
        } else {
           elements.push(`<!-- WC PARSE ERROR (no options string): ${match[0]} -->`);
        }
      } else if (match[4]) { // INTERACTIVE_FILL_IN_BLANK
        const optionsString = match[4];
        if (optionsString) {
          const allOptions = optionsString.split('|').map(opt => opt.trim()).filter(opt => opt.length > 0);
          if (allOptions.length > 0) {
            const correctAnswerFillIn = allOptions[0];
            elements.push(
              <InteractiveFillInBlank
                key={interactionId}
                interactionId={interactionId}
                options={allOptions}
                correctAnswer={correctAnswerFillIn}
                onCorrect={handleInteractionCorrect}
                isLessonAlreadyCompleted={isLessonAlreadyCompletedByProfile}
              />
            );
          } else {
             elements.push(`<!-- FB PARSE ERROR: ${match[0]} -->`);
          }
        } else {
          elements.push(`<!-- FB PARSE ERROR (no options string): ${match[0]} -->`);
        }
      }
      lastIndex = combinedRegex.lastIndex;
    }

    if (lastIndex < contentWithoutGeneralComments.length) {
      elements.push(contentWithoutGeneralComments.substring(lastIndex));
    }
    return elements;
  }, [lesson?.id, handleInteractionCorrect, isLessonAlreadyCompletedByProfile]);


  const processedContentElements = useMemo(() => {
    if (lesson?.content) {
      return parseLessonContentAndCountInteractions(lesson.content);
    }
    return [];
  }, [lesson?.content, parseLessonContentAndCountInteractions]);

  useEffect(() => {
      let count = 0;
      const interactionIdsFromContent: string[] = [];
      processedContentElements.forEach(el => {
          if (React.isValidElement(el) && (el.type === InteractiveWordChoice || el.type === InteractiveFillInBlank)) {
              count++;
              if(el.props.interactionId) {
                interactionIdsFromContent.push(el.props.interactionId);
              }
          }
      });
      setTotalInteractiveElements(count);

      if (isLessonAlreadyCompletedByProfile) {
        setCompletedInteractionIds(new Set(interactionIdsFromContent));
      }

  }, [processedContentElements, isLessonAlreadyCompletedByProfile]);


  const allInteractionsCompletedThisSessionOrPreviously = useMemo(() => {
    if (isLessonAlreadyCompletedByProfile) return true;
    return totalInteractiveElements === 0 || completedInteractionIds.size === totalInteractiveElements;
  }, [totalInteractiveElements, completedInteractionIds, isLessonAlreadyCompletedByProfile]);


  useEffect(() => {
    if (typeof window !== 'undefined' && lesson && userProfile && !isLessonAlreadyCompletedByProfile) {
        const currentLessonInteractionsKey = `${LOCAL_STORAGE_KEYS.GUEST_COMPLETED_LESSONS}_interactions_${lesson.id}_${userProfile.id}`;
        const storedInteractions = localStorage.getItem(currentLessonInteractionsKey);
        if (storedInteractions) {
            try {
                const parsedInteractions = JSON.parse(storedInteractions);
                if (Array.isArray(parsedInteractions)) {
                    setCompletedInteractionIds(new Set(parsedInteractions));
                }
            } catch (error) {
                console.error("Error parsing stored interactions:", error);
            }
        } else {
           setCompletedInteractionIds(new Set());
        }
    } else if (!isLessonAlreadyCompletedByProfile) {
        setCompletedInteractionIds(new Set());
    }

    setIsMarkingComplete(false);

    if (lesson && allMockLessons && allMockLessons.length > 0) {
      const currentIndex = allMockLessons.findIndex(l => l.id === lesson.id);
      if (currentIndex > -1) {
        setPrevLesson(currentIndex > 0 ? allMockLessons[currentIndex - 1] : null);
        setNextLesson(currentIndex < allMockLessons.length - 1 ? allMockLessons[currentIndex + 1] : null);
      } else {
        setPrevLesson(null);
        setNextLesson(null);
      }
    } else {
      setPrevLesson(null);
      setNextLesson(null);
    }
  }, [lesson, userProfile, isLessonAlreadyCompletedByProfile]);


  const handleMarkAsCompleted = async () => {
    if (isLessonAlreadyCompletedByProfile || isMarkingComplete || !allInteractionsCompletedThisSessionOrPreviously || !lesson || !userProfile) return;
    setIsMarkingComplete(true);
    await completeLesson(lesson.id);
    setIsMarkingComplete(false);
  };

  if (authLoading || !lesson) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  const interactionsProgressText = totalInteractiveElements > 0
    ? `Interações concluídas: ${completedInteractionIds.size} de ${totalInteractiveElements}`
    : "Nenhuma interação nesta lição.";

  const truncateTitle = (title: string, maxLength: number = 20) => {
    if (title.length > maxLength) {
      return title.substring(0, maxLength) + "...";
    }
    return title;
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <Card className="overflow-hidden shadow-xl">
        <CardHeader>
          {lesson.coverImage && (
             <div className="relative aspect-video mb-6 rounded-lg overflow-hidden max-h-[300px]">
               <Image
                src={lesson.coverImage}
                alt={lesson.title || "Imagem da lição"}
                fill
                style={{objectFit:"cover"}}
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="transition-transform duration-500 hover:scale-105"
                data-ai-hint={lesson.aiHint || "visualização dados estatisticos"}
                priority
              />
             </div>
          )}
          <CardTitle className="text-3xl font-bold tracking-tight md:text-4xl">{lesson.title}</CardTitle>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>{lesson.estimatedTime}</span>
            </div>
            <span className="capitalize">Tipo: {lesson.type}</span>
            {lesson.points && <span className="font-semibold text-primary">+{lesson.points}pts</span>}
          </div>
           {totalInteractiveElements > 0 && (
            <div className="mt-3 text-sm text-primary flex items-center">
                <Info className="h-4 w-4 mr-1.5 shrink-0" />
                <span>{interactionsProgressText}</span>
            </div>
           )}
        </CardHeader>
        <CardContent className="prose prose-lg dark:prose-invert max-w-none p-6">
          {renderContentWithParagraphs(processedContentElements, `lesson-${lesson.id}`)}
        </CardContent>
          {lesson.references && lesson.references.length > 0 && (
            <>
              <div className="px-6 pb-6">
                  <Separator className="my-6" />
                  <div className="not-prose">
                      <h3 className="text-xl font-semibold mb-4 text-foreground">Referências</h3>
                      <ul className="list-none p-0 space-y-2">
                      {lesson.references.map((ref, index) => (
                          <li
                          key={`ref-${index}`}
                          className="text-sm text-muted-foreground"
                          dangerouslySetInnerHTML={{ __html: ref }}
                          />
                      ))}
                      </ul>
                  </div>
              </div>
            </>
          )}
      </Card>

      <CardFooter className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4 p-6 bg-muted/30 rounded-lg">
        <div className="w-full sm:w-auto flex-1 sm:flex-initial flex justify-center sm:justify-start">
            {prevLesson ? (
            <Button variant="outline" size="default" asChild className="w-full sm:w-auto">
                <Link href={`/lessons/${prevLesson.id}`} title={`Anterior: ${prevLesson.title}`}>
                  <span className="flex items-center justify-center w-full">
                    <ArrowLeft className="h-4 w-4 mr-1 sm:mr-2 shrink-0" />
                    <span className="hidden sm:inline truncate">Anterior: {truncateTitle(prevLesson.title)}</span>
                    <span className="sm:hidden">Anterior</span>
                  </span>
                </Link>
            </Button>
            ) : <div className="w-full sm:w-auto min-w-[88px] sm:min-w-[100px]">&nbsp;</div>}
        </div>

        <div className="w-full sm:w-auto flex-1 sm:flex-initial flex justify-center my-2 sm:my-0 order-first sm:order-none">
            <Button
              variant={isLessonAlreadyCompletedByProfile ? "default" : "secondary"}
              size="lg"
              className={cn(
                "w-full max-w-xs sm:w-auto",
                isLessonAlreadyCompletedByProfile ? "bg-green-500 hover:bg-green-600" :
                (!allInteractionsCompletedThisSessionOrPreviously && totalInteractiveElements > 0) ? "bg-gray-300 hover:bg-gray-400 text-gray-600 cursor-not-allowed" : ""
              )}
              onClick={handleMarkAsCompleted}
              disabled={isLessonAlreadyCompletedByProfile || isMarkingComplete || (!allInteractionsCompletedThisSessionOrPreviously && totalInteractiveElements > 0)}
            >
                {isMarkingComplete ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : isLessonAlreadyCompletedByProfile ? (
                    <CheckCircle className="mr-2 h-5 w-5" />
                ) : (
                    <CheckCircle className="mr-2 h-5 w-5" />
                )}
                {isMarkingComplete
                    ? "Marcando..."
                    : isLessonAlreadyCompletedByProfile
                        ? "Concluída"
                        : (!allInteractionsCompletedThisSessionOrPreviously && totalInteractiveElements > 0)
                            ? "Complete Interações"
                            : "Marcar Concluída"
                }
            </Button>
        </div>

        <div className="w-full sm:w-auto flex-1 sm:flex-initial flex justify-center sm:justify-end">
            {nextLesson ? (
            <Button variant="outline" size="default" asChild className="w-full sm:w-auto">
                <Link href={`/lessons/${nextLesson.id}`} title={`Próxima: ${nextLesson.title}`}>
                  <span className="flex items-center justify-center w-full">
                    <span className="hidden sm:inline truncate">Próxima: {truncateTitle(nextLesson.title)}</span>
                    <span className="sm:hidden">Próxima</span>
                    <ArrowRight className="h-4 w-4 ml-1 sm:ml-2 shrink-0" />
                  </span>
                </Link>
            </Button>
            ) : <div className="w-full sm:w-auto min-w-[88px] sm:min-w-[100px]">&nbsp;</div>}
        </div>
      </CardFooter>
    </div>
  );
}
