
"use client";

import React, { useEffect, useState, useMemo, Fragment, useCallback } from 'react';
import Image from 'next/image';
import type { Lesson } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { InteractiveWordChoice } from './InteractiveWordChoice';
import { InteractiveFillInBlank } from './InteractiveFillInBlank';
import { Separator } from '../ui/separator';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { mockLessons as allMockLessons } from '@/lib/mockData';
import { countInteractions } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { useLessonUi } from '@/contexts/LessonUiContext';
import { Loader2 } from 'lucide-react';

interface LessonViewProps {
  lesson: Lesson;
}

const renderTextWithFormatting = (text: string, baseKey: string): React.ReactNode[] => {
  const markdownRegex = /(\*\*\*.*?\*\*\*|\*\*.*?\*\*|\*.*?\*)/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  
  let match;
  
  while ((match = markdownRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    
    const matchedText = match[0];

    if (matchedText.startsWith('***')) {
      parts.push(<strong key={`${baseKey}-bi-${match.index}`}><em>{matchedText.slice(3, -3)}</em></strong>);
    } 
    else if (matchedText.startsWith('**')) {
      parts.push(<strong key={`${baseKey}-b-${match.index}`}>{matchedText.slice(2, -2)}</strong>);
    } 
    else if (matchedText.startsWith('*')) {
       const preChar = text[match.index - 1];
       const postChar = text[match.index + matchedText.length];
       if ((!preChar || /[\s.,:;?!()]/.test(preChar)) && (!postChar || /[\s.,:;?!()]/.test(postChar))) {
          parts.push(<em key={`${baseKey}-i-${match.index}`}>{matchedText.slice(1, -1)}</em>);
       } else {
         parts.push(matchedText);
       }
    }
    
    lastIndex = markdownRegex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
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

const parseMarkdownForHTML = (text: string): string => {
  return text
    .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>');
};

export function LessonView({ lesson }: LessonViewProps) {
  const { userProfile, loading: authLoading, completeLesson, saveInteractionProgress, uncompleteInteraction, resetLessonProgress, isUpdatingProgress } = useAuth();
  const router = useRouter();
  const lessonUi = useLessonUi();

  const completedInteractions = useMemo(() => {
    return new Set(userProfile?.lessonProgress[lesson.id]?.completedInteractions || []);
  }, [userProfile, lesson.id]);

  const totalInteractiveElements = useMemo(() => {
    return countInteractions(lesson.content);
  }, [lesson.content]);

  const handleInteractionCorrect = useCallback(async (interactionId: string) => {
    if (!completedInteractions.has(interactionId)) {
        await saveInteractionProgress(lesson.id, interactionId);
    }
  }, [completedInteractions, saveInteractionProgress, lesson.id]);

  const handleInteractionUncomplete = useCallback(async(interactionId: string) => {
    if(completedInteractions.has(interactionId)) {
        await uncompleteInteraction(lesson.id, interactionId);
    }
  }, [completedInteractions, uncompleteInteraction, lesson.id]);
  
  useEffect(() => {
    if (lessonUi && userProfile && lesson.id) {
      const completedCount = userProfile.lessonProgress[lesson.id]?.completedInteractions.length || 0;
      const lessonNumberMatch = lesson.id.match(/^m(\d+)-l(\d+)$/);
      const lessonNumber = lessonNumberMatch ? `${lessonNumberMatch[1]}.${lessonNumberMatch[2]}` : lesson.id;
      lessonUi.setLessonData(lesson.title, lessonNumber, totalInteractiveElements, completedCount);
    }

    return () => {
      lessonUi?.resetLesson();
    };
  }, [lesson, userProfile, lessonUi, totalInteractiveElements]);


  const { progressPercentage, interactionsProgressText } = useMemo(() => {
    const completedCount = completedInteractions.size;
    const totalCount = totalInteractiveElements;
    const percentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
    const text = totalCount > 0
      ? `Interações concluídas: ${completedCount} de ${totalCount}`
      : "Nenhuma interação nesta lição.";
    return { progressPercentage: percentage, interactionsProgressText: text };
  }, [completedInteractions.size, totalInteractiveElements]);

  const allInteractionsCompleted = useMemo(() => {
    return totalInteractiveElements > 0 ? completedInteractions.size >= totalInteractiveElements : true;
  }, [totalInteractiveElements, completedInteractions]);

  const [prevLesson, setPrevLesson] = useState<Lesson | null>(null);
  const [nextLesson, setNextLesson] = useState<Lesson | null>(null);

  useEffect(() => {
    if (lesson && allMockLessons && allMockLessons.length > 0) {
      const currentIndex = allMockLessons.findIndex(l => l.id === lesson.id);
      if (currentIndex > -1) {
        setPrevLesson(currentIndex > 0 ? allMockLessons[currentIndex - 1] : null);
        setNextLesson(currentIndex < allMockLessons.length - 1 ? allMockLessons[currentIndex + 1] : null);
      }
    }
  }, [lesson]);
  
  const isLessonAlreadyCompletedByProfile = useMemo(() => {
    return userProfile?.lessonProgress[lesson.id]?.completed || false;
  }, [userProfile, lesson.id]);

  const handleMarkAsCompleted = async () => {
    if (isLessonAlreadyCompletedByProfile || isUpdatingProgress || !allInteractionsCompleted) return;
    await completeLesson(lesson.id);
  };
  
  const handleResetLesson = async () => {
      if (isUpdatingProgress) return;
      await resetLessonProgress(lesson.id);
  };
  
  const processedContentElements = useMemo(() => {
    if (!lesson?.content) return [];
    
    const interactiveRegex = /(<!--\\s*INTERACTIVE_WORD_CHOICE:.*?-->|<!--\\s*INTERACTIVE_FILL_IN_BLANK:.*?-->)/g;
    const parts = lesson.content.split(interactiveRegex);

    return parts.map((part, index) => {
      const wordChoiceMatch = /<!--\\s*INTERACTIVE_WORD_CHOICE:\\s*OPTIONS=\\[(.*?)\\]\\s*-->/.exec(part);
      if (wordChoiceMatch) {
        const optionsString = wordChoiceMatch[1];
        const options = optionsString.split(';').map(opt => opt.trim());
        const correctAnswer = options.find(opt => opt.startsWith('*'))?.substring(1) || '';
        const cleanOptions = options.map(opt => opt.startsWith('*') ? opt.substring(1) : opt);
        const interactionId = `wc-${lesson.id}-${index}`;
        
        return (
          <InteractiveWordChoice
            key={interactionId}
            lesson={lesson}
            options={cleanOptions}
            correctAnswer={correctAnswer}
            interactionId={interactionId}
            onCorrect={handleInteractionCorrect}
            onUncomplete={handleInteractionUncomplete}
            isInteractionCompleted={completedInteractions.has(interactionId)}
            isLessonCompleted={isLessonAlreadyCompletedByProfile}
          />
        );
      }

      const fillBlankMatch = /<!--\\s*INTERACTIVE_FILL_IN_BLANK:\\s*\\[(.*?)\\]\\s*-->/.exec(part);
      if (fillBlankMatch) {
        const optionsString = fillBlankMatch[1];
        const options = optionsString.split('|').map(opt => opt.trim());
        const correctAnswer = options[0];
        const interactionId = `fib-${lesson.id}-${index}`;

        return (
          <InteractiveFillInBlank
            key={interactionId}
            lesson={lesson}
            options={options}
            correctAnswer={correctAnswer}
            interactionId={interactionId}
            onCorrect={handleInteractionCorrect}
            onUncomplete={handleInteractionUncomplete}
            isInteractionCompleted={completedInteractions.has(interactionId)}
            isLessonCompleted={isLessonAlreadyCompletedByProfile}
          />
        );
      }

      return part;
    });
  }, [lesson, completedInteractions, handleInteractionCorrect, handleInteractionUncomplete, isLessonAlreadyCompletedByProfile]);


  if (authLoading || !lesson) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="text-xl mr-3" role="img" aria-label="Carregando">⏳</span>
        Carregando...
      </div>
    );
  }

  const truncateTitle = (title: string, maxLength: number = 20) => {
    if (title.length > maxLength) {
      return title.substring(0, maxLength) + "...";
    }
    return title;
  };
  
  const canComplete = allInteractionsCompleted || totalInteractiveElements === 0;
  const isButtonDisabled = isLessonAlreadyCompletedByProfile || isUpdatingProgress || !canComplete;

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
                data-ai-hint={lesson.aiHint || "visualização dados estatisticos"}
                priority
              />
             </div>
          )}
          <CardTitle className="text-3xl font-bold tracking-tight md:text-4xl">{lesson.title}</CardTitle>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
            <div className="flex items-center">
              <span className="text-lg mr-1" role="img" aria-label="Relógio">⏰</span>
              <span>{lesson.estimatedTime}</span>
            </div>
            {lesson.type && <span className="capitalize">Tipo: {lesson.type}</span>}
            {lesson.points && <span className="font-semibold text-primary">+{lesson.points}pts</span>}
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between items-center text-sm text-primary">
              <div className="flex items-center">
                  <span className="text-lg mr-1.5 shrink-0" role="img" aria-label="Informação">ℹ️</span>
                  <span>{interactionsProgressText}</span>
              </div>
              <span>{progressPercentage.toFixed(0)}%</span>
            </div>
            <Progress value={progressPercentage} aria-label={`${progressPercentage.toFixed(0)}% de progresso na lição`} />
          </div>
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
                          dangerouslySetInnerHTML={{ __html: parseMarkdownForHTML(ref) }}
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
                    <span role="img" aria-label="Seta para Esquerda" className="mr-1 sm:mr-2 shrink-0">⬅️</span>
                    <span className="hidden sm:inline truncate">Anterior: {truncateTitle(prevLesson.title)}</span>
                    <span className="sm:hidden">Anterior</span>
                  </span>
                </Link>
            </Button>
            ) : <div className="w-full sm:w-auto min-w-[88px] sm:min-w-[100px]">&nbsp;</div>}
        </div>

        <div className="w-full sm:w-auto flex-1 sm:flex-initial flex items-center justify-center flex-col sm:flex-row gap-2 my-2 sm:my-0 order-first sm:order-none">
             <Button
                size="lg"
                className={cn(
                  "w-full max-w-xs sm:w-auto",
                  isLessonAlreadyCompletedByProfile ? "bg-green-500 hover:bg-green-600 cursor-not-allowed" :
                  !canComplete ? "bg-gray-300 hover:bg-gray-400 text-gray-600 cursor-not-allowed" : ""
                )}
                onClick={handleMarkAsCompleted}
                disabled={isButtonDisabled}
                variant={isLessonAlreadyCompletedByProfile ? "default" : "secondary"}
             >
                {isUpdatingProgress ? (
                    <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Processando...
                    </>
                ) : isLessonAlreadyCompletedByProfile ? (
                    <>
                        <span role="img" aria-label="Concluído">✅</span>
                        Lição Concluída
                    </>
                ) : !canComplete ? (
                    <>
                        <span role="img" aria-label="Bloqueado">🔒</span>
                        Complete as Interações
                    </>
                ) : (
                    <>
                        <span role="img" aria-label="Finalizar">🏁</span>
                        Marcar como Concluída
                    </>
                )}
             </Button>
            {isLessonAlreadyCompletedByProfile && (
                <Button
                    variant="outline"
                    size="sm"
                    className="w-full max-w-xs sm:w-auto"
                    onClick={handleResetLesson}
                    disabled={isUpdatingProgress}
                >
                    {isUpdatingProgress ? <Loader2 className="h-5 w-5 animate-spin" /> : <span role="img" aria-label="Reiniciar">🔄</span>}
                    Reiniciar Lição
                </Button>
            )}
        </div>

        <div className="w-full sm:w-auto flex-1 sm:flex-initial flex justify-center sm:justify-end">
            {nextLesson ? (
            <Button variant="outline" size="default" asChild className="w-full sm:w-auto">
                <Link href={`/lessons/${nextLesson.id}`} title={`Próxima: ${nextLesson.title}`}>
                  <span className="flex items-center justify-center w-full">
                    <span className="hidden sm:inline truncate">Próxima: {truncateTitle(nextLesson.title)}</span>
                    <span className="sm:hidden">Próxima</span>
                    <span role="img" aria-label="Seta para Direita" className="ml-1 sm:ml-2 shrink-0">➡️</span>
                  </span>
                </Link>
            </Button>
            ) : <div className="w-full sm:w-auto min-w-[88px] sm:min-w-[100px]">&nbsp;</div>}
        </div>
      </CardFooter>
    </div>
  );
}
