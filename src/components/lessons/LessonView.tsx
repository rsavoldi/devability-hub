
"use client";

import React, { useEffect, useState, useMemo, Fragment, useCallback } from 'react';
import Image from 'next/image';
import type { Lesson } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, CheckCircle, Clock, Loader2, FileText } from 'lucide-react';
import Link from 'next/link';
import { InteractiveWordChoice } from './InteractiveWordChoice';
import { InteractiveFillInBlank } from './InteractiveFillInBlank';
import { Separator } from '../ui/separator';
import { cn, shuffleArray } from '@/lib/utils';
import { summarizeLesson, type SummarizeLessonOutput } from '@/ai/flows/summarize-lesson';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { db } from '@/lib/firebase'; // Necessário para Firestore
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore'; // Firestore imports
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { markLessonAsCompleted as markLessonCompletedAction } from '@/app/actions/userProgressActions';
import { playSound } from '@/lib/sounds';
import { useRouter } from 'next/navigation';
import { LOCAL_STORAGE_KEYS } from '@/constants';
import { mockLessons as allMockLessons, mockRoadmapData } from '@/lib/mockData'; // Para navegação de convidados

interface LessonViewProps {
  lesson: Lesson;
}

const wordChoiceRegexSource = "INTERACTIVE_WORD_CHOICE:\\s*OPTIONS=\\[(.*?)\\]";
const fillBlankRegexSource = "INTERACTIVE_FILL_IN_BLANK:\\s*\\[(.*?)\\]";
const combinedRegex = new RegExp(
  `<!--\\s*(${wordChoiceRegexSource})\\s*-->|<!--\\s*(${fillBlankRegexSource})\\s*-->`,
  "g"
);
const boldRegex = /\*\*(.*?)\*\*/g;

const renderTextWithBold = (text: string, baseKey: string): (string | JSX.Element)[] => {
  const parts: (string | JSX.Element)[] = [];
  let lastIndex = 0;
  boldRegex.lastIndex = 0;
  let match;

  while ((match = boldRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    parts.push(<strong key={`${baseKey}-bold-${match.index}`}>{match[1]}</strong>);
    lastIndex = boldRegex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }
  return parts;
};

const parseLessonContent = (content: string): (string | JSX.Element)[] => {
  const elements: (string | JSX.Element)[] = [];
  let lastIndex = 0;

  const generalCommentsRegex = /<!--(?!.*?INTERACTIVE_WORD_CHOICE:|.*?INTERACTIVE_FILL_IN_BLANK:).*?-->/gs;
  const contentWithoutGeneralComments = content.replace(generalCommentsRegex, '');

  let match;
  combinedRegex.lastIndex = 0;

  while ((match = combinedRegex.exec(contentWithoutGeneralComments)) !== null) {
    const uniqueKeyPart = match.index + (match[0]?.substring(0, 20) || '');
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
              key={`iwc-${uniqueKeyPart}`}
              options={shuffleArray(parsedOptions)}
              correctAnswer={correctAnswer}
            />
          );
        } else {
          console.warn("Error parsing INTERACTIVE_WORD_CHOICE in lesson content, check format (needs options separated by ';' and a *correctAnswer):", match[0]);
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
              key={`ifib-${uniqueKeyPart}`}
              options={allOptions}
              correctAnswer={correctAnswerFillIn}
            />
          );
        } else {
          console.warn("Error parsing INTERACTIVE_FILL_IN_BLANK in lesson content, check format (needs options separated by | with first being correct):", match[0]);
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
};

const renderContentWithParagraphs = (elements: (string | JSX.Element)[], baseKey: string): JSX.Element[] => {
  const paragraphs: JSX.Element[] = [];
  let currentParagraphAccumulator: (string | JSX.Element)[] = [];

  elements.forEach((element, elIndex) => {
    const elementKeyPrefix = `${baseKey}-el-${elIndex}`;
    if (typeof element === 'string') {
      const textSegments = element.split(/(\\n)/g);

      textSegments.forEach((segment, segIndex) => {
        const segmentKey = `${elementKeyPrefix}-seg-${segIndex}`;
        if (segment === '\\n' || segment === '\n') {
          if (currentParagraphAccumulator.length > 0 && currentParagraphAccumulator.some(p => (typeof p === 'string' && p.trim() !== '') || React.isValidElement(p))) {
            paragraphs.push(
              <p key={`para-${paragraphs.length}-${segmentKey}`} className="mb-4 leading-relaxed">
                {currentParagraphAccumulator.map((part, idx) => <Fragment key={idx}>{part}</Fragment>)}
              </p>
            );
          }
          currentParagraphAccumulator = [];
        } else if (segment) {
          currentParagraphAccumulator.push(...renderTextWithBold(segment, segmentKey));
        }
      });
    } else if (React.isValidElement(element)) {
      currentParagraphAccumulator.push(React.cloneElement(element, { key: `${elementKeyPrefix}-interactive-${elIndex}` }));
    }
  });

  if (currentParagraphAccumulator.length > 0 && currentParagraphAccumulator.some(p => (typeof p === 'string' && p.trim() !== '') || React.isValidElement(p))) {
    paragraphs.push(
      <p key={`para-last-${paragraphs.length}-${baseKey}`} className="mb-4 leading-relaxed">
        {currentParagraphAccumulator.map((part, idx) => <Fragment key={idx}>{part}</Fragment>)}
      </p>
    );
  }

  if (paragraphs.length === 0) {
    if (elements.length === 0 || (elements.length === 1 && typeof elements[0] === 'string' && elements[0].trim() === '')) {
      return [<p key="empty-lesson" className="text-muted-foreground">Conteúdo da lição indisponível ou em processamento.</p>];
    }
  }
  return paragraphs;
};


export function LessonView({ lesson }: LessonViewProps) {
  const { currentUser, userProfile, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const [summary, setSummary] = useState<string | null>(null);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);
  const [isMarkingComplete, setIsMarkingComplete] = useState(false);
  const [isLocallyCompleted, setIsLocallyCompleted] = useState(false);

  const [prevLesson, setPrevLesson] = useState<Lesson | null>(null);
  const [nextLesson, setNextLesson] = useState<Lesson | null>(null);

  const isCompleted = useMemo(() => {
    if (authLoading && !currentUser) return isLocallyCompleted; // Show local state while auth might still be loading for guest
    if (currentUser && userProfile) {
      return userProfile.completedLessons.includes(lesson.id);
    }
    // For guest users, check localStorage or isLocallyCompleted
    if (typeof window !== 'undefined') {
      const guestProgress = localStorage.getItem(LOCAL_STORAGE_KEYS.GUEST_COMPLETED_LESSONS);
      if (guestProgress) {
        const completedLessonIds: string[] = JSON.parse(guestProgress);
        return completedLessonIds.includes(lesson.id);
      }
    }
    return isLocallyCompleted;
  }, [currentUser, userProfile, lesson.id, authLoading, isLocallyCompleted]);

  const processedContentElements = useMemo(() => {
    if (lesson?.content) {
      return parseLessonContent(lesson.content);
    }
    return [];
  }, [lesson?.content]);

  useEffect(() => {
    if (typeof window !== 'undefined' && !currentUser) {
      const guestProgress = localStorage.getItem(LOCAL_STORAGE_KEYS.GUEST_COMPLETED_LESSONS);
      setIsLocallyCompleted(guestProgress ? JSON.parse(guestProgress).includes(lesson.id) : false);
    } else {
      setIsLocallyCompleted(false);
    }

    setSummary(null);
    setSummaryError(null);
    setIsLoadingSummary(false);
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
        console.warn("Module ID format unexpected for fetching adjacent lessons:", lesson.moduleId);
        findAdjacentMockLessons(); // Fallback to mock data if Firestore path is problematic
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
        findAdjacentMockLessons(); // Fallback in case of Firestore error
      }
    };

    if (currentUser) {
      fetchAdjacentFirestoreLessons();
    } else {
      findAdjacentMockLessons(); // Use mock data for guest navigation
    }

  }, [lesson, currentUser]);

  const handleGenerateSummary = async () => {
    if (!lesson?.content) return;
    setIsLoadingSummary(true);
    setSummary(null);
    setSummaryError(null);
    try {
      const result: SummarizeLessonOutput = await summarizeLesson({ lessonContent: lesson.content });
      setSummary(result.summary);
    } catch (error) {
      console.error("Failed to generate summary:", error);
      if (error instanceof Error) {
        setSummaryError(`Desculpe, não foi possível gerar o resumo. Erro: ${error.message}`);
      } else {
        setSummaryError("Desculpe, não foi possível gerar o resumo no momento devido a um erro desconhecido. Tente novamente mais tarde.");
      }
    } finally {
      setIsLoadingSummary(false);
    }
  };

  const handleMarkAsCompleted = async () => {
    if (isCompleted || isMarkingComplete) return;
    setIsMarkingComplete(true);

    if (currentUser) {
      try {
        const result = await markLessonCompletedAction(currentUser.uid, lesson.id);
        if (result.success) {
          playSound('pointGain');
          let toastMessage = result.message;
          if (result.unlockedAchievementsDetails && result.unlockedAchievementsDetails.length > 0) {
            const achievementTitles = result.unlockedAchievementsDetails.map(a => a.title).join(', ');
            toastMessage += ` Você desbloqueou: ${achievementTitles}!`;
             playSound('achievementUnlock');
          }
          toast({
            title: "Lição Concluída! 🎉",
            description: toastMessage,
            className: "bg-green-500 dark:bg-green-700 text-white dark:text-white",
          });
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
                <FileText className="mr-2 h-5 w-5 text-primary" />
                Resumo da Lição (IA)
            </CardTitle>
        </CardHeader>
        <CardContent>
            {(!summary && !summaryError) && !isLoadingSummary && (
                 <p className="text-sm text-muted-foreground mb-4">
                    Clique no botão abaixo para gerar um resumo desta lição usando Inteligência Artificial.
                </p>
            )}
            <Button
                onClick={handleGenerateSummary}
                disabled={isLoadingSummary || !lesson?.content}
                className="w-full sm:w-auto"
            >
              {isLoadingSummary ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <FileText className="mr-2 h-4 w-4" />
              )}
              {(summary || summaryError) ? "Gerar Novo Resumo" : "Gerar Resumo"}
            </Button>

            {isLoadingSummary && (
              <div className="mt-4 flex items-center text-muted-foreground">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span>Gerando resumo...</span>
              </div>
            )}

            {summaryError && !isLoadingSummary && (
              <Alert className="mt-4" variant="destructive">
                <AlertTitle>Erro ao Gerar Resumo</AlertTitle>
                <AlertDescription>
                    {summaryError}
                </AlertDescription>
              </Alert>
            )}

            {summary && !isLoadingSummary && !summaryError && (
              <Alert className="mt-4 prose dark:prose-invert max-w-none text-sm" variant="default">
                <AlertTitle>Resultado do Resumo:</AlertTitle>
                <AlertDescription>
                    {summary.split(/\\n|\n/g).map((paragraph, index) => (
                        <p key={index} className="mb-2 last:mb-0">{paragraph}</p>
                    ))}
                </AlertDescription>
              </Alert>
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
              className={cn("w-full sm:w-auto", isCompleted ? "bg-green-500 hover:bg-green-600" : "")}
              onClick={handleMarkAsCompleted}
              disabled={isCompleted || isMarkingComplete}
            >
                {isMarkingComplete ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : isCompleted ? (
                    <CheckCircle className="mr-2 h-5 w-5" />
                ) : (
                    <CheckCircle className="mr-2 h-5 w-5" />
                )}
                {isMarkingComplete ? "Marcando..." : isCompleted ? "Lição Concluída" : "Marcar como Concluída"}
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
