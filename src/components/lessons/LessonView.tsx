
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

interface LessonViewProps {
  lesson: Lesson;
}

const renderTextWithFormatting = (text: string, baseKey: string): React.ReactNode[] => {
  // Regex atualizada para priorizar ***, depois **, depois *
  const markdownRegex = /(\*\*\*.*?\*\*\*|\*\*.*?\*\*|\*.*?\*)/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  
  let match;
  
  while ((match = markdownRegex.exec(text)) !== null) {
    // Adiciona o texto antes da correspondência
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    
    const matchedText = match[0];

    // Lida com negrito e itálico: ***texto***
    if (matchedText.startsWith('***')) {
      parts.push(<strong key={`${baseKey}-bi-${match.index}`}><em>{matchedText.slice(3, -3)}</em></strong>);
    } 
    // Lida com negrito: **texto**
    else if (matchedText.startsWith('**')) {
      parts.push(<strong key={`${baseKey}-b-${match.index}`}>{matchedText.slice(2, -2)}</strong>);
    } 
    // Lida com itálico: *texto*
    else if (matchedText.startsWith('*')) {
       // Verifica os caracteres ao redor para evitar itálico incorreto (ex: no meio de palavras)
       // Agora inclui parênteses nos caracteres permitidos ao redor.
       const preChar = text[match.index - 1];
       const postChar = text[match.index + matchedText.length];
       if ((!preChar || /[\s.,:;?!()]/.test(preChar)) && (!postChar || /[\s.,:;?!()]/.test(postChar))) {
          parts.push(<em key={`${baseKey}-i-${match.index}`}>{matchedText.slice(1, -1)}</em>);
       } else {
         // Se não for um itálico válido, envia o texto como está
         parts.push(matchedText);
       }
    }
    
    lastIndex = markdownRegex.lastIndex;
  }

  // Adiciona qualquer texto restante após a última correspondência
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
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>');
};

export function LessonView({ lesson }: LessonViewProps) {
  const { userProfile, loading: authLoading, completeLesson, saveInteractionProgress, uncompleteInteraction, resetLessonProgress } = useAuth();
  const router = useRouter();
  const lessonUi = useLessonUi();

  const [isMarkingComplete, setIsMarkingComplete] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const [prevLesson, setPrevLesson] = useState<Lesson | null>(null);
  const [nextLesson, setNextLesson] = useState<Lesson | null>(null);
  
  const completedInteractions = useMemo(() => {
    return new Set(userProfile?.lessonProgress[lesson.id]?.completedInteractions || []);
  }, [userProfile, lesson.id]);
  
  const isLessonAlreadyCompletedByProfile = useMemo(() => {
    return userProfile?.lessonProgress[lesson.id]?.completed || false;
  }, [userProfile, lesson.id]);

  const handleInteractionCorrect = useCallback(async (interactionId: string) => {
    if (!completedInteractions.has(interactionId)) {
        await saveInteractionProgress(lesson.id, interactionId);
        lessonUi?.incrementCompleted();
    }
  }, [completedInteractions, saveInteractionProgress, lesson.id, lessonUi]);

  const handleInteractionUncomplete = useCallback(async(interactionId: string) => {
    if(completedInteractions.has(interactionId)) {
        await uncompleteInteraction(lesson.id, interactionId);
        lessonUi?.decrementCompleted();
    }
  }, [completedInteractions, uncompleteInteraction, lesson.id, lessonUi]);
  
  const totalInteractiveElements = useMemo(() => {
    return countInteractions(lesson.content);
  }, [lesson.content]);

  useEffect(() => {
    if (lessonUi && userProfile && lesson.id) {
      const completedCount = userProfile.lessonProgress[lesson.id]?.completedInteractions.length || 0;
      const lessonNumber = lesson.id.replace(/^[a-z]+(\d+)-l(\d+)$/, '$1.$2'); // ex: "m1-l2" -> "1.2"
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
    return totalInteractiveElements > 0 && completedInteractions.size >= totalInteractiveElements;
  }, [totalInteractiveElements, completedInteractions]);

  useEffect(() => {
    setIsMarkingComplete(false);
    if (lesson && allMockLessons && allMockLessons.length > 0) {
      const currentIndex = allMockLessons.findIndex(l => l.id === lesson.id);
      if (currentIndex > -1) {
        setPrevLesson(currentIndex > 0 ? allMockLessons[currentIndex - 1] : null);
        setNextLesson(currentIndex < allMockLessons.length - 1 ? allMockLessons[currentIndex + 1] : null);
      }
    }
  }, [lesson]);

  const processedContentElements = useMemo(() => {
    if (lesson?.content) {
      const elements: (string | JSX.Element)[] = [];
      let lastIndex = 0;
      let interactionCounter = 0;
  
      const wordChoiceRegexSource = "INTERACTIVE_WORD_CHOICE:\\s*OPTIONS=\\[(.*?)\\]";
      const fillBlankRegexSource = "INTERACTIVE_FILL_IN_BLANK:\\s*\\[(.*?)\\]";
      const combinedRegex = new RegExp(
        `<!--\\s*(${wordChoiceRegexSource})\\s*-->|<!--\\s*(${fillBlankRegexSource})\\s*-->`,
        "g"
      );

      const generalCommentsRegex = /<!--(?!.*?INTERACTIVE_WORD_CHOICE:|.*?INTERACTIVE_FILL_IN_BLANK:).*?-->/gs;
      const contentWithoutGeneralComments = lesson.content.replace(generalCommentsRegex, '');
  
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
            const rawOptions = optionsString.split(';').map(opt => opt.trim()).filter(Boolean);
            let correctAnswer = "";
            const parsedOptions = rawOptions.map(opt => {
              if (opt.startsWith('*')) {
                correctAnswer = opt.substring(1).trim();
                return correctAnswer;
              }
              return opt;
            });
  
            if (parsedOptions.length > 0 && correctAnswer) {
              elements.push(
                <InteractiveWordChoice
                  key={interactionId}
                  lesson={lesson}
                  interactionId={interactionId}
                  options={parsedOptions}
                  correctAnswer={correctAnswer}
                  onCorrect={handleInteractionCorrect}
                  onUncomplete={handleInteractionUncomplete}
                  isInteractionCompleted={completedInteractions.has(interactionId)}
                  isLessonCompleted={isLessonAlreadyCompletedByProfile}
                />
              );
            }
          }
        } else if (match[4]) { // INTERACTIVE_FILL_IN_BLANK
          const optionsString = match[4];
          if (optionsString) {
            const allOptions = optionsString.split('|').map(opt => opt.trim()).filter(Boolean);
            if (allOptions.length > 0) {
              const correctAnswerFillIn = allOptions[0];
              elements.push(
                <InteractiveFillInBlank
                  key={interactionId}
                  lesson={lesson}
                  interactionId={interactionId}
                  options={allOptions}
                  correctAnswer={correctAnswerFillIn}
                  onCorrect={handleInteractionCorrect}
                  onUncomplete={handleInteractionUncomplete}
                  isInteractionCompleted={completedInteractions.has(interactionId)}
                  isLessonCompleted={isLessonAlreadyCompletedByProfile}
                />
              );
            }
          }
        }
        lastIndex = combinedRegex.lastIndex;
      }
  
      if (lastIndex < contentWithoutGeneralComments.length) {
        elements.push(contentWithoutGeneralComments.substring(lastIndex));
      }
      return elements;
    }
    return [];
  }, [lesson.id, lesson.content, handleInteractionCorrect, handleInteractionUncomplete, completedInteractions, isLessonAlreadyCompletedByProfile]);
  

  const handleMarkAsCompleted = async () => {
    if (isLessonAlreadyCompletedByProfile || isMarkingComplete || !allInteractionsCompleted) return;
    setIsMarkingComplete(true);
    await completeLesson(lesson.id);
    setIsMarkingComplete(false);
  };
  
  const handleResetLesson = async () => {
      setIsResetting(true);
      await resetLessonProgress(lesson.id);
      lessonUi?.resetLesson(); 
      setIsResetting(false);
  };

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
  
  const getButtonText = () => {
    if (isMarkingComplete || isResetting) return "Processando...";
    if (isLessonAlreadyCompletedByProfile) return "Lição Concluída!";
    if (!allInteractionsCompleted && totalInteractiveElements > 0) return "Complete as Interações";
    return "Marcar como Concluída";
  };

  const getButtonEmoji = () => {
    if (isMarkingComplete || isResetting) return <span className="text-xl animate-spin" role="img" aria-label="Processando">⏳</span>;
    if (isLessonAlreadyCompletedByProfile) return <span role="img" aria-label="Concluído">✅</span>;
    if (!allInteractionsCompleted && totalInteractiveElements > 0) return <span role="img" aria-label="Bloqueado">🔒</span>;
    return <span role="img" aria-label="Finalizar">🏁</span>;
  }


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
              variant={isLessonAlreadyCompletedByProfile ? "default" : "secondary"}
              size="lg"
              className={cn(
                "w-full max-w-xs sm:w-auto",
                isLessonAlreadyCompletedByProfile ? "bg-green-500 hover:bg-green-600" :
                (!allInteractionsCompleted && totalInteractiveElements > 0) ? "bg-gray-300 hover:bg-gray-400 text-gray-600 cursor-not-allowed" : ""
              )}
              onClick={handleMarkAsCompleted}
              disabled={isLessonAlreadyCompletedByProfile || isMarkingComplete || isResetting || (!allInteractionsCompleted && totalInteractiveElements > 0)}
            >
                {getButtonEmoji()}
                {getButtonText()}
            </Button>
            {isLessonAlreadyCompletedByProfile && (
                <Button
                    variant="outline"
                    size="sm"
                    className="w-full max-w-xs sm:w-auto"
                    onClick={handleResetLesson}
                    disabled={isResetting || isMarkingComplete}
                >
                    {isResetting ? <span className="text-xl animate-spin" role="img" aria-label="Processando">⏳</span> : <span role="img" aria-label="Reiniciar">🔄</span>}
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

