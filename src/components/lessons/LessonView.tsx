
"use client";

import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
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
import { mockLessons } from '@/lib/mockData';
import { countInteractions } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { useLessonUi } from '@/contexts/LessonUiContext';
import { ArrowLeft, ArrowRight, ArrowUpCircle, CheckCircle, Loader2, Map, Pause, Play, RefreshCw, Volume2, VolumeX, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface LessonViewProps {
  lesson: Lesson;
}

const renderTextWithFormatting = (text: string, baseKey: string): React.ReactNode[] => {
  const markdownRegex = /(\*\*\*.*?\*\*\*|\*\*.*?\*\*|\*.*?\*|\[.*?\]\(.*?\))/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;

  while ((match = markdownRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }

    const matchedText = match[0];
    const matchKey = `${baseKey}-${match.index}`;

    if (matchedText.startsWith('***') && matchedText.endsWith('***')) {
      parts.push(<strong key={`${matchKey}-bi`}><em >{matchedText.slice(3, -3)}</em></strong>);
    } else if (matchedText.startsWith('**')) {
      parts.push(<strong key={`${matchKey}-b`}>{matchedText.slice(2, -2)}</strong>);
    } else if (matchedText.startsWith('*')) {
       parts.push(<em key={`${matchKey}-i`}>{matchedText.slice(1, -1)}</em>);
    } else if (matchedText.startsWith('[')) {
      const linkRegex = /\[(.*?)\]\((.*?)\)/;
      const linkMatch = matchedText.match(linkRegex);
      if (linkMatch && linkMatch.length === 3) {
        const linkText = linkMatch[1];
        const linkUrl = linkMatch[2];
        parts.push(
          <a
            key={`${matchKey}-a`}
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline font-medium"
          >
            {renderTextWithFormatting(linkText, `${matchKey}-linktext`)}
          </a>
        );
      } else {
        parts.push(matchedText);
      }
    } else {
      parts.push(matchedText);
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
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline font-medium">$1</a>');
};

export function LessonView({ lesson }: LessonViewProps) {
  const { userProfile, loading: authLoading, saveInteractionProgress, uncompleteInteraction, resetLessonProgress, completeLesson, isUpdatingProgress } = useAuth();
  const router = useRouter();
  const lessonUi = useLessonUi();
  const { toast } = useToast();

  const [showBackToTop, setShowBackToTop] = useState(false);
  const [prevLesson, setPrevLesson] = useState<Lesson | null>(null);
  const [nextLesson, setNextLesson] = useState<Lesson | null>(null);
  
  const [localCompletedInteractions, setLocalCompletedInteractions] = useState<Set<string>>(new Set());
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const progressSaveInterval = useRef<NodeJS.Timeout | null>(null);
  
  const isLessonAlreadyCompletedByProfile = useMemo(() => {
    if (!userProfile || !lesson) return false;
    const progress = userProfile.lessonProgress[lesson.id];
    return progress?.completed || userProfile.completedLessons.includes(lesson.id) || false;
  }, [userProfile, lesson.id]);

  useEffect(() => {
    if (userProfile && lesson.id) {
        const completedIds = userProfile.lessonProgress[lesson.id]?.completedInteractions || [];
        setLocalCompletedInteractions(new Set(completedIds));
    }
  }, [userProfile, lesson.id]);

  const audioProgress = useMemo(() => userProfile?.lessonProgress[lesson.id]?.audioProgress || 0, [userProfile, lesson.id]);
  const audioCompleted = useMemo(() => audioProgress >= 100, [audioProgress]);

  const totalInteractiveElements = useMemo(() => countInteractions(lesson.content), [lesson.content]);

  const allInteractionsCompleted = useMemo(() => {
    return totalInteractiveElements > 0 && localCompletedInteractions.size >= totalInteractiveElements;
  }, [totalInteractiveElements, localCompletedInteractions]);

  useEffect(() => {
    if (lessonUi && lesson.id) {
        const lessonNumber = lesson.id.replace('m', '').replace('-l', '.');
        lessonUi.setLessonData(lesson.id, lesson.title, lessonNumber, totalInteractiveElements, Array.from(localCompletedInteractions));
    }
  }, [lesson.id, lesson.title, totalInteractiveElements, localCompletedInteractions, lessonUi]);


  const { progressPercentage, interactionsProgressText } = useMemo(() => {
    const completedCount = localCompletedInteractions.size;
    const total = totalInteractiveElements;
    const percentage = total > 0 ? Math.round((completedCount / total) * 100) : 0;
    const text = total > 0
      ? `Interações: ${completedCount}/${total}`
      : "Nenhuma interação nesta lição.";
    return { progressPercentage: percentage, interactionsProgressText: text };
  }, [localCompletedInteractions.size, totalInteractiveElements]);

  const handleInteractionCorrect = useCallback((interactionId: string) => {
    if (isUpdatingProgress) return;
    setLocalCompletedInteractions(prev => {
        const newSet = new Set(prev);
        newSet.add(interactionId);
        return newSet;
    });
    saveInteractionProgress(lesson.id, interactionId);
  }, [saveInteractionProgress, lesson.id, isUpdatingProgress]);

  const handleInteractionUncomplete = useCallback((interactionId: string) => {
    if (isUpdatingProgress) return;
    setLocalCompletedInteractions(prev => {
      const newSet = new Set(prev);
      newSet.delete(interactionId);
      return newSet;
    });
    uncompleteInteraction(lesson.id, interactionId);
  }, [uncompleteInteraction, lesson.id, isUpdatingProgress]);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  useEffect(() => {
    const checkScroll = () => {
      if (window.scrollY > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };
    window.addEventListener('scroll', checkScroll);
    return () => window.removeEventListener('scroll', checkScroll);
  }, []);

  useEffect(() => {
    if (lesson && mockLessons && mockLessons.length > 0) {
      const currentIndex = mockLessons.findIndex(l => l.id === lesson.id);
      if (currentIndex > -1) {
        setPrevLesson(currentIndex > 0 ? mockLessons[currentIndex - 1] : null);
        setNextLesson(currentIndex < mockLessons.length - 1 ? mockLessons[currentIndex + 1] : null);
      }
    }
  }, [lesson]);
  

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
  
    const setAudioData = () => {
      setDuration(audio.duration);
      if (audioProgress > 0 && audioProgress < 100) {
        const startTime = (audioProgress / 100) * audio.duration;
        if (isFinite(startTime)) {
            audio.currentTime = startTime;
            setCurrentTime(startTime);
        }
      } else {
        setCurrentTime(audioProgress >= 100 ? audio.duration : 0);
        audio.currentTime = audioProgress >= 100 ? audio.duration : 0;
      }
    };
  
    const updateCurrentTime = () => setCurrentTime(audio.currentTime);

    const handleAudioEnded = () => {
      setIsPlaying(false);
      if (progressSaveInterval.current) {
        clearInterval(progressSaveInterval.current);
      }
    };
  
    audio.addEventListener('loadedmetadata', setAudioData);
    audio.addEventListener('timeupdate', updateCurrentTime);
    audio.addEventListener('ended', handleAudioEnded);
  
    return () => {
      audio.removeEventListener('loadedmetadata', setAudioData);
      audio.removeEventListener('timeupdate', updateCurrentTime);
      audio.removeEventListener('ended', handleAudioEnded);
      if (progressSaveInterval.current) {
        clearInterval(progressSaveInterval.current);
      }
    };
  }, [lesson.id, audioProgress]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;
  
    if (isPlaying) {
      audio.pause();
      if (progressSaveInterval.current) clearInterval(progressSaveInterval.current);
    } else {
      if (audio.ended || audioProgress >= 100) {
        audio.currentTime = 0;
        setCurrentTime(0);
      }
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };
  
  const handleProgressChange = (e: React.MouseEvent<HTMLDivElement>) => {
    const progressBar = e.currentTarget;
    const clickPosition = e.clientX - progressBar.getBoundingClientRect().left;
    const newTime = (clickPosition / progressBar.offsetWidth) * duration;
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatTime = (timeInSeconds: number) => {
    if (!isFinite(timeInSeconds)) return "0:00";
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const processedContentElements = useMemo(() => {
    const elements: (string | JSX.Element)[] = [];
    if (lesson?.content) {
      let lastIndex = 0;
      let interactionCounter = 0;
      const wordChoiceRegexSource = "INTERACTIVE_WORD_CHOICE:\\s*OPTIONS=\\[(.*?)\\]";
      const fillBlankRegexSource = "INTERACTIVE_FILL_IN_BLANK:\\s*\\[(.*?)\\]";
      const combinedRegex = new RegExp(
        `<!--\\s*(${wordChoiceRegexSource})\\s*-->|<!--\\s*(${fillBlankRegexSource})\\s*-->`, "g"
      );
      const contentWithoutGeneralComments = lesson.content.replace(/<!--(?!.*?INTERACTIVE_WORD_CHOICE:|.*?INTERACTIVE_FILL_IN_BLANK:).*?-->/gs, '');
  
      let match;
      while ((match = combinedRegex.exec(contentWithoutGeneralComments)) !== null) {
        const interactionId = `lesson-${lesson.id}-interaction-${interactionCounter++}`;
        if (match.index > lastIndex) {
          elements.push(contentWithoutGeneralComments.substring(lastIndex, match.index));
        }
  
        if (match[2]) {
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
                  isInteractionCompleted={localCompletedInteractions.has(interactionId)}
                  isLessonCompleted={isLessonAlreadyCompletedByProfile}
                />
              );
            }
          }
        } else if (match[4]) { 
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
                  isInteractionCompleted={localCompletedInteractions.has(interactionId)}
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
    }
    return elements;
  }, [lesson, localCompletedInteractions, handleInteractionCorrect, handleInteractionUncomplete, isLessonAlreadyCompletedByProfile]);
  

  const handleMarkAsCompleted = async () => {
    if (isUpdatingProgress || (!allInteractionsCompleted && totalInteractiveElements > 0)) return;
    await completeLesson(lesson.id, 'complete');
  };
  
  const handleUncompleteLesson = async () => {
    if (isUpdatingProgress) return;
    await completeLesson(lesson.id, 'uncomplete');
  };

  const handleResetLesson = async () => {
      if (isUpdatingProgress) return;
      if(confirm("Tem certeza que deseja reiniciar o progresso desta lição? Todas as suas interações serão perdidas.")){
        await resetLessonProgress(lesson.id);
      }
  };

  if (authLoading || !lesson) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="text-xl mr-3" role="img" aria-label="Carregando">⏳</span>
        Carregando...
      </div>
    );
  }
  
  const lessonModuleId = lesson.moduleId;


  return (
    <div className="max-w-4xl mx-auto py-8">
      <TooltipProvider>
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
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground mt-2">
              <div className="flex items-center">
                <span className="text-lg mr-1" role="img" aria-label="Relógio">⏰</span>
                <span>{lesson.estimatedTime}</span>
              </div>
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

            {lesson.audioSrc && (
              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <audio ref={audioRef} src={lesson.audioSrc} className="hidden" />
                <div className="flex items-center gap-4">
                  <Button onClick={togglePlayPause} size="icon" variant="secondary" className="flex-shrink-0">
                    {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                  </Button>
                  <div className="flex-grow flex items-center gap-2">
                    <span className="text-xs font-mono text-muted-foreground w-10 text-center">{formatTime(currentTime)}</span>
                    <div className="w-full bg-border h-2 rounded-full cursor-pointer" onClick={handleProgressChange}>
                      <div
                        className="bg-primary h-full rounded-full"
                        style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : audioProgress}%` }}
                      />
                    </div>
                    <span className="text-xs font-mono text-muted-foreground w-10 text-center">{formatTime(duration)}</span>
                  </div>
                  <Button
                      onClick={() => {
                          if(audioRef.current) {
                              audioRef.current.muted = !isMuted;
                              setIsMuted(!isMuted);
                          }
                      }}
                      size="icon"
                      variant="ghost"
                      className="flex-shrink-0"
                  >
                      {isMuted ? <VolumeX className="h-5 w-5 text-muted-foreground" /> : <Volume2 className="h-5 w-5 text-muted-foreground" />}
                  </Button>
                </div>
                {audioCompleted && (
                  <div className="mt-2 flex items-center justify-center text-sm text-green-600 dark:text-green-400">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    <span>Áudio concluído!</span>
                  </div>
                )}
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
                            dangerouslySetInnerHTML={{ __html: parseMarkdownForHTML(ref) }}
                            />
                        ))}
                        </ul>
                    </div>
                </div>
              </>
            )}
        </Card>
        
        {showBackToTop && (
          <Button
            onClick={handleScrollToTop}
            className="fixed bottom-8 right-8 z-50 h-14 w-14 rounded-full p-0 shadow-lg animate-in fade-in zoom-in-90"
            aria-label="Voltar ao topo"
            variant="secondary"
          >
            <ArrowUpCircle className="h-8 w-8" />
          </Button>
        )}

        <CardFooter className="mt-8 flex flex-wrap items-center justify-between gap-4 p-6 bg-muted/30 rounded-lg">
          <div className="flex justify-start w-full sm:w-auto sm:flex-1">
              {prevLesson ? (
              <Button variant="outline" size="default" asChild className="w-full sm:w-auto">
                  <Link href={`/lessons/${prevLesson.id}`} title={`Anterior: ${prevLesson.title}`}>
                    <span className="flex items-center justify-center w-full">
                      <ArrowLeft className="mr-1 sm:mr-2" />
                      <span className="hidden sm:inline truncate">Anterior</span>
                      <span className="sm:hidden">Anterior</span>
                    </span>
                  </Link>
              </Button>
              ) : <div className="w-full sm:w-auto min-w-[88px] sm:min-w-[100px]">&nbsp;</div>}
          </div>
          
          <div className="w-full md:w-auto flex flex-col sm:flex-row items-center gap-2 order-first sm:order-none">
            {lessonModuleId && (
                <Button variant="ghost" size="sm" asChild className="w-full sm:w-auto">
                    <Link href={`/modules/${lessonModuleId}`} className="flex items-center gap-2">
                        <Map className="h-4 w-4"/> Voltar ao Módulo
                    </Link>
                </Button>
            )}
            
            {isLessonAlreadyCompletedByProfile ? (
              <Button
                variant="destructive" size="lg"
                className="w-full sm:w-auto"
                onClick={handleUncompleteLesson}
                disabled={isUpdatingProgress}
              >
                {isUpdatingProgress ? <Loader2 className="animate-spin" /> : <XCircle />}
                Desmarcar Conclusão
              </Button>
            ) : (
              <Button
                  variant="secondary" size="lg"
                  className="w-full sm:w-auto"
                  onClick={handleMarkAsCompleted}
                  disabled={isUpdatingProgress || (!allInteractionsCompleted && totalInteractiveElements > 0)}
              >
                  {isUpdatingProgress ? <Loader2 className="animate-spin" /> : <CheckCircle/>}
                  {(!allInteractionsCompleted && totalInteractiveElements > 0) ? "Complete as Interações" : "Marcar como Concluída"}
              </Button>
            )}
            
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant="outline" size="icon"
                        onClick={handleResetLesson}
                        disabled={isUpdatingProgress}
                        aria-label="Reiniciar progresso da lição"
                    >
                        {isUpdatingProgress ? <Loader2 className="h-5 w-5 animate-spin" /> : <RefreshCw className="h-5 w-5"/>}
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Reiniciar Progresso da Lição</p>
                </TooltipContent>
            </Tooltip>
          </div>

          <div className="flex justify-end w-full sm:w-auto sm:flex-1">
              {nextLesson ? (
              <Button variant="outline" size="default" asChild className="w-full sm:w-auto">
                  <Link href={`/lessons/${nextLesson.id}`} title={`Próxima: ${nextLesson.title}`}>
                    <span className="flex items-center justify-center w-full">
                      <span className="hidden sm:inline truncate">Próxima</span>
                      <span className="sm:hidden">Próxima</span>
                      <ArrowRight className="ml-1 sm:ml-2" />
                    </span>
                  </Link>
              </Button>
              ) : <div className="w-full sm:w-auto min-w-[88px] sm:min-w-[100px]">&nbsp;</div>}
          </div>
        </CardFooter>
      </TooltipProvider>
    </div>
  );
}
