
"use client";

import React, { useEffect, useState, useMemo, Fragment, useCallback } from 'react';
import Image from 'next/image';
import type { Lesson } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, CheckCircle, Clock, Loader2, FileText, Info, HelpCircle } from 'lucide-react';
import Link from 'next/link';
import { InteractiveWordChoice } from './InteractiveWordChoice';
import { InteractiveFillInBlank } from './InteractiveFillInBlank';
import { Separator } from '../ui/separator';
import { cn, shuffleArray } from '@/lib/utils';
import { generateLessonQA, type GenerateLessonQAOutput } from '@/ai/flows/generate-lesson-qa';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { markLessonAsCompleted as markLessonCompletedAction } from '@/app/actions/userProgressActions';
import { playSound } from '@/lib/sounds';
import { useRouter } from 'next/navigation';
import { LOCAL_STORAGE_KEYS } from '@/constants';
import { mockLessons as allMockLessons, mockRoadmapData } from '@/lib/mockData';

interface LessonViewProps {
  lesson: Lesson;
}

const wordChoiceRegexSource = "INTERACTIVE_WORD_CHOICE:\\s*OPTIONS=\\[(.*?)\\]";
const fillBlankRegexSource = "INTERACTIVE_FILL_IN_BLANK:\\s*\\[(.*?)\\]";
const combinedRegex = new RegExp(
  `<!--\\s*(${wordChoiceRegexSource})\\s*-->|<!--\\s*(${fillBlankRegexSource})\\s*-->`,
  "g"
);
const boldRegexGlobal = /\*\*(.*?)\*\*/g;

const renderTextWithBold = (text: string, baseKey: string): (string | JSX.Element)[] => {
  const parts: (string | JSX.Element)[] = [];
  let lastIndex = 0;
  let match;
  boldRegexGlobal.lastIndex = 0;

  while ((match = boldRegexGlobal.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    parts.push(<strong key={`${baseKey}-bold-${match.index}`}>{match[1]}</strong>);
    lastIndex = boldRegexGlobal.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }
  return parts;
};

const renderContentWithParagraphs = (elements: (string | JSX.Element)[], baseKey: string) => {
  const paragraphs: JSX.Element[] = [];
  let currentParagraphContent: (string | JSX.Element)[] = [];

  elements.forEach((element, index) => {
    if (typeof element === 'string') {
      const stringParts = element.split(/\\n|\n/g);
      stringParts.forEach((part, partIndex) => {
        if (part.trim() !== "") {
          currentParagraphContent.push(...renderTextWithBold(part, `${baseKey}-p${paragraphs.length}-s${index}-pt${partIndex}`));
        }
        if (partIndex < stringParts.length - 1 || (part.trim() !== "" && index === elements.length -1 && stringParts.length === 1 && !elements[index+1])) {
          if (currentParagraphContent.length > 0) {
            paragraphs.push(
              <p key={`${baseKey}-p${paragraphs.length}`} className="mb-4 last:mb-0">
                {currentParagraphContent.map((content, i) => <Fragment key={i}>{content}</Fragment>)}
              </p>
            );
            currentParagraphContent = [];
          }
        }
      });
    } else {
      if (currentParagraphContent.length > 0) {
        paragraphs.push(
          <p key={`${baseKey}-p${paragraphs.length}-text`} className="mb-4 last:mb-0">
            {currentParagraphContent.map((content, i) => <Fragment key={i}>{content}</Fragment>)}
          </p>
        );
        currentParagraphContent = [];
      }
      paragraphs.push(<span key={`${baseKey}-jsx-${index}`} className="inline">{element}</span>);
    }
  });

  if (currentParagraphContent.length > 0) {
    paragraphs.push(
      <p key={`${baseKey}-p${paragraphs.length}-final`} className="mb-4 last:mb-0">
        {currentParagraphContent.map((content, i) => <Fragment key={i}>{content}</Fragment>)}
      </p>
    );
  }

  if (paragraphs.length === 0 && elements.some(el => (typeof el === 'string' && el.trim() !== '') || React.isValidElement(el))) {
     return <p>{elements.map((el, i) => <Fragment key={i}>{el}</Fragment>)}</p>;
  }

  return paragraphs;
};


export function LessonView({ lesson }: LessonViewProps) {
  const { currentUser, userProfile, loading: authLoading, refreshUserProfile } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const [lessonQA, setLessonQA] = useState<{ question: string; answer: string }[] | null>(null);
  const [isLoadingQA, setIsLoadingQA] = useState(false);
  const [qaError, setQAError] = useState<string | null>(null);

  const [isMarkingComplete, setIsMarkingComplete] = useState(false);
  const [isLocallyCompleted, setIsLocallyCompleted] = useState(false);

  const [prevLesson, setPrevLesson] = useState<Lesson | null>(null);
  const [nextLesson, setNextLesson] = useState<Lesson | null>(null);

  const [totalInteractiveElements, setTotalInteractiveElements] = useState(0);
  const [completedInteractionIds, setCompletedInteractionIds] = useState<Set<string>>(new Set());

  const handleInteractionCorrect = useCallback((interactionId: string) => {
    setCompletedInteractionIds(prev => {
      const newSet = new Set(prev);
      newSet.add(interactionId);
      return newSet;
    });
  }, []);

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

      if (match[2]) {
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
              />
            );
          } else {
            console.warn("Error parsing INTERACTIVE_WORD_CHOICE:", match[0]);
            elements.push(`<!-- WC PARSE ERROR: ${match[0]} -->`);
          }
        } else {
           elements.push(`<!-- WC PARSE ERROR (no options string): ${match[0]} -->`);
        }
      } else if (match[4]) {
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
              />
            );
          } else {
            console.warn("Error parsing INTERACTIVE_FILL_IN_BLANK:", match[0]);
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
    setTotalInteractiveElements(interactionCounter);
    return elements;
  }, [lesson.id, handleInteractionCorrect]);


  const processedContentElements = useMemo(() => {
    if (lesson?.content) {
      return parseLessonContentAndCountInteractions(lesson.content);
    }
    return [];
  }, [lesson?.content, parseLessonContentAndCountInteractions]);

  const allInteractionsCompleted = useMemo(() => {
    return totalInteractiveElements > 0 && completedInteractionIds.size === totalInteractiveElements;
  }, [totalInteractiveElements, completedInteractionIds]);

  const isCompleted = useMemo(() => {
    if (authLoading && !currentUser) return isLocallyCompleted;
    if (currentUser && userProfile) {
      return userProfile.completedLessons.includes(lesson.id);
    }
    if (typeof window !== 'undefined') {
      const guestProgress = localStorage.getItem(LOCAL_STORAGE_KEYS.GUEST_COMPLETED_LESSONS);
      if (guestProgress) {
        const completedLessonIds: string[] = JSON.parse(guestProgress);
        return completedLessonIds.includes(lesson.id);
      }
    }
    return isLocallyCompleted;
  }, [currentUser, userProfile, lesson.id, authLoading, isLocallyCompleted]);


  useEffect(() => {
    setCompletedInteractionIds(new Set());

    if (typeof window !== 'undefined' && !currentUser) {
      const guestProgress = localStorage.getItem(LOCAL_STORAGE_KEYS.GUEST_COMPLETED_LESSONS);
      setIsLocallyCompleted(guestProgress ? JSON.parse(guestProgress).includes(lesson.id) : false);
    } else {
      setIsLocallyCompleted(false);
    }

    setLessonQA(null);
    setQAError(null);
    setIsLoadingQA(false);
    setIsMarkingComplete(false);

    const findAdjacentMockLessons = () => {
      if (!lesson || typeof lesson.order === 'undefined' || !lesson.moduleId) return;

      const currentModule = mockRoadmapData
        .flatMap(trilha => trilha.modules)
        .find(mod => mod.id === lesson.moduleId);

      if (!currentModule || !currentModule.lessons) return;
      
      const sortedLessonsInModule = [...currentModule.lessons].sort((a, b) => (a.order ?? Infinity) - (b.order ?? Infinity));
      const currentIndex = sortedLessonsInModule.findIndex(l => l.id === lesson.id);

      if (currentIndex > -1) {
        setPrevLesson(currentIndex > 0 ? sortedLessonsInModule[currentIndex - 1] : null);
        setNextLesson(currentIndex < sortedLessonsInModule.length - 1 ? sortedLessonsInModule[currentIndex + 1] : null);
      } else {
        setPrevLesson(null);
        setNextLesson(null);
      }
    };
    
    const fetchAdjacentFirestoreLessons = async () => {
      if (!lesson || typeof lesson.order === 'undefined' || !lesson.moduleId) {
        setPrevLesson(null);
        setNextLesson(null);
        return;
      }
      const pathParts = lesson.moduleId.split('-mod-');
      if (pathParts.length < 2) {
        console.warn("Module ID format unexpected for fetching adjacent lessons from Firestore:", lesson.moduleId);
        findAdjacentMockLessons();
        return;
      }
      const trilhaId = pathParts[0];
      const moduleIdForFirestore = lesson.moduleId;

      try {
        const prevQuery = query(
          collection(db, 'roadmaps', trilhaId, 'modules', moduleIdForFirestore, 'lessons'),
          where('order', '<', lesson.order),
          orderBy('order', 'desc'),
          limit(1)
        );
        const prevSnapshot = await getDocs(prevQuery);
        setPrevLesson(prevSnapshot.empty ? null : { id: prevSnapshot.docs[0].id, ...prevSnapshot.docs[0].data() } as Lesson);

        const nextQuery = query(
          collection(db, 'roadmaps', trilhaId, 'modules', moduleIdForFirestore, 'lessons'),
          where('order', '>', lesson.order),
          orderBy('order', 'asc'),
          limit(1)
        );
        const nextSnapshot = await getDocs(nextQuery);
        setNextLesson(nextSnapshot.empty ? null : { id: nextSnapshot.docs[0].id, ...nextSnapshot.docs[0].data() } as Lesson);
      } catch (error) {
        console.error("Error fetching adjacent lessons from Firestore, falling back to mock data:", error);
        findAdjacentMockLessons();
      }
    };

    if (currentUser) {
      fetchAdjacentFirestoreLessons();
    } else {
      findAdjacentMockLessons();
    }

  }, [lesson, currentUser]);

  const handleGenerateQA = async () => {
    if (!lesson?.content) return;
    setIsLoadingQA(true);
    setLessonQA(null);
    setQAError(null);
    try {
      const result: GenerateLessonQAOutput = await generateLessonQA({
        lessonContent: lesson.content,
        numberOfPairs: 3,
      });
      setLessonQA(result.qaPairs);
    } catch (error) {
      console.error("Failed to generate Q&A:", error);
      if (error instanceof Error) {
        setQAError('Desculpe, não foi possível gerar o resumo. Erro: ' + error.message);
      } else {
        setQAError("Desculpe, não foi possível gerar o resumo no momento devido a um erro desconhecido. Tente novamente mais tarde.");
      }
    } finally {
      setIsLoadingQA(false);
    }
  };

  const handleMarkAsCompleted = async () => {
    if (isCompleted || isMarkingComplete || !allInteractionsCompleted) return;
    setIsMarkingComplete(true);

    if (currentUser) {
      try {
        const result = await markLessonCompletedAction(currentUser.uid, lesson.id);
        if (result.success) {
          playSound('pointGain');
          let toastMessage = result.message;
          if (result.unlockedAchievementsDetails && result.unlockedAchievementsDetails.length > 0) {
            const achievementTitles = result.unlockedAchievementsDetails.map(a => a.title).join(', ');
            toastMessage += ' Você desbloqueou: ' + achievementTitles + '!';
             playSound('achievementUnlock');
          }
          toast({
            title: "Lição Concluída! 🎉",
            description: toastMessage,
            className: "bg-green-500 dark:bg-green-700 text-white dark:text-white",
          });
          refreshUserProfile(); // Atualiza o perfil para refletir as mudanças
        } else {
          toast({
            title: "Erro",
            description: result.message,
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Erro ao marcar lição (logado):", error);
        toast({
          title: "Erro Inesperado",
          description: "Não foi possível marcar a lição como concluída. Tente novamente.",
          variant: "destructive",
        });
      }
    } else {
      if (typeof window !== 'undefined') {
        try {
          const guestProgressRaw = localStorage.getItem(LOCAL_STORAGE_KEYS.GUEST_COMPLETED_LESSONS);
          let guestCompletedLessons: string[] = guestProgressRaw ? JSON.parse(guestProgressRaw) : [];
          if (!guestCompletedLessons.includes(lesson.id)) {
            guestCompletedLessons.push(lesson.id);
            localStorage.setItem(LOCAL_STORAGE_KEYS.GUEST_COMPLETED_LESSONS, JSON.stringify(guestCompletedLessons));
          }
          setIsLocallyCompleted(true);
          playSound('pointGain');
          toast({
            title: "Lição Marcada! 🎉",
            description: "Seu progresso foi salvo localmente. Crie uma conta para salvar na nuvem!",
            className: "bg-blue-500 dark:bg-blue-700 text-white dark:text-white",
          });
        } catch (error) {
          console.error("Erro ao marcar lição (convidado):", error);
          toast({
            title: "Erro ao Salvar Localmente",
            description: "Não foi possível salvar seu progresso localmente.",
            variant: "destructive",
          });
        }
      }
    }
    setIsMarkingComplete(false);
  };

  if (authLoading && !currentUser) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  const interactionsProgressText = totalInteractiveElements > 0
    ? `Interações concluídas: ${completedInteractionIds.size} de ${totalInteractiveElements}`
    : "Nenhuma interação nesta lição.";

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

          {lesson.references && lesson.references.length > 0 && (
            <>
              <Separator className="my-8" />
              <div className="not-prose">
                <h3 className="text-xl font-semibold mb-4">Referências</h3>
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
            </>
          )}
        </CardContent>
      </Card>

      <Card className="mt-6 shadow-lg">
        <CardHeader>
            <CardTitle className="text-xl flex items-center">
                <HelpCircle className="mr-2 h-5 w-5 text-primary" />
                Perguntas e Respostas (IA)
            </CardTitle>
        </CardHeader>
        <CardContent>
            {(!lessonQA && !qaError) && !isLoadingQA && (
                 <p className="text-sm text-muted-foreground mb-4">
                    Clique no botão abaixo para gerar perguntas e respostas sobre esta lição usando Inteligência Artificial.
                </p>
            )}
            <Button
                onClick={handleGenerateQA}
                disabled={isLoadingQA || !lesson?.content}
                className="w-full sm:w-auto"
            >
              {isLoadingQA ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <HelpCircle className="mr-2 h-4 w-4" />
              )}
              {(lessonQA || qaError) ? "Gerar Novas P&R" : "Gerar P&R"}
            </Button>

            {isLoadingQA && (
              <div className="mt-4 flex items-center text-muted-foreground">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span>Gerando P&R...</span>
              </div>
            )}

            {qaError && !isLoadingQA && (
              <Alert className="mt-4" variant="destructive">
                <AlertTitle>Erro ao Gerar P&R</AlertTitle>
                <AlertDescription>
                    {qaError}
                </AlertDescription>
              </Alert>
            )}

            {lessonQA && lessonQA.length > 0 && !isLoadingQA && !qaError && (
              <Accordion type="single" collapsible className="w-full mt-4 space-y-2">
                {lessonQA.map((pair, index) => (
                  <AccordionItem value={`item-${index}`} key={index} className="border rounded-md">
                    <AccordionTrigger className="p-4 text-left hover:no-underline">
                      <span className="font-medium">{index + 1}. {pair.question}</span>
                    </AccordionTrigger>
                    <AccordionContent className="p-4 pt-0">
                      <p className="text-sm text-muted-foreground">{pair.answer}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
            {lessonQA && lessonQA.length === 0 && !isLoadingQA && !qaError && (
                <p className="mt-4 text-sm text-muted-foreground">Nenhuma pergunta e resposta foi gerada.</p>
            )}
        </CardContent>
      </Card>

      <CardFooter className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4 p-6 bg-muted/30 rounded-lg">
        <div className="w-full sm:flex-1 flex justify-center sm:justify-start">
            {prevLesson ? (
            <Button variant="outline" size="default" asChild className="w-full sm:w-auto">
                <Link href={`/lessons/${prevLesson.id}`}>
                  <span className="flex items-center justify-center w-full">
                    <ArrowLeft className="h-4 w-4 mr-1 sm:mr-2" />
                    <span className="truncate hidden sm:inline">Anterior: {prevLesson.title.length > 15 ? prevLesson.title.substring(0,15) + '...' : prevLesson.title}</span>
                    <span className="sm:hidden">Anterior</span>
                  </span>
                </Link>
            </Button>
            ) : <div className="hidden sm:block sm:flex-1"></div>}
        </div>

        <div className="w-full sm:w-auto flex-shrink-0 my-2 sm:my-0">
            <Button
              variant={isCompleted ? "default" : "secondary"}
              size="lg"
              className={cn(
                "w-full sm:w-auto",
                isCompleted ? "bg-green-500 hover:bg-green-600" :
                (!allInteractionsCompleted && totalInteractiveElements > 0) ? "bg-gray-300 hover:bg-gray-400 text-gray-600 cursor-not-allowed" : ""
              )}
              onClick={handleMarkAsCompleted}
              disabled={isCompleted || isMarkingComplete || (!allInteractionsCompleted && totalInteractiveElements > 0)}
            >
                {isMarkingComplete ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : isCompleted ? (
                    <CheckCircle className="mr-2 h-5 w-5" />
                ) : (
                    <CheckCircle className="mr-2 h-5 w-5" />
                )}
                {isMarkingComplete
                    ? "Marcando..."
                    : isCompleted
                        ? "Lição Concluída"
                        : (!allInteractionsCompleted && totalInteractiveElements > 0)
                            ? "Complete as interações"
                            : "Marcar como Concluída"
                }
            </Button>
        </div>

        <div className="w-full sm:flex-1 flex justify-center sm:justify-end">
            {nextLesson ? (
            <Button variant="outline" size="default" asChild className="w-full sm:w-auto">
                <Link href={`/lessons/${nextLesson.id}`}>
                  <span className="flex items-center justify-center w-full">
                    <span className="truncate hidden sm:inline">Próxima: {nextLesson.title.length > 15 ? nextLesson.title.substring(0,15) + '...' : nextLesson.title}</span>
                    <span className="sm:hidden">Próxima</span>
                    <ArrowRight className="h-4 w-4 ml-1 sm:ml-2" />
                  </span>
                </Link>
            </Button>
            ) : <div className="hidden sm:block sm:flex-1"></div>}
        </div>
      </CardFooter>
    </div>
  );
}

    