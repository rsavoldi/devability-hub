"use client";

import React, { useEffect, useState, useMemo, Fragment, useCallback, useRef } from 'react';
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
import { ArrowLeft, ArrowRight, ArrowUpCircle, CheckCircle, Loader2, Map, Pause, Play, Volume2, VolumeX } from 'lucide-react';

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
  const { userProfile, loading: authLoading, completeLesson, saveInteractionProgress, uncompleteInteraction, resetLessonProgress, saveAudioProgress } = useAuth();
  const router = useRouter();
  const lessonUi = useLessonUi();

  const [isMarkingComplete, setIsMarkingComplete] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [prevLesson, setPrevLesson] = useState<Lesson | null>(null);
  const [nextLesson, setNextLesson] = useState<Lesson | null>(null);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const progressSaveInterval = useRef<NodeJS.Timeout | null>(null);
  
  const completedInteractions = useMemo(() => {
    return new Set(userProfile?.lessonProgress[lesson.id]?.completedInteractions || []);
  }, [userProfile, lesson.id]);
  
  const isLessonAlreadyCompletedByProfile = useMemo(() => {
    return userProfile?.completedLessons?.includes(lesson.id) || false;
  }, [userProfile, lesson.id]);

  const audioProgress = useMemo(() => userProfile?.lessonProgress[lesson.id]?.audioProgress || 0, [userProfile, lesson.id]);
  const audioCompleted = useMemo(() => audioProgress >= 100, [audioProgress]);


  const handleInteractionCorrect = useCallback((interactionId: string) => {
    if (lessonUi) lessonUi.setInteractionCompleted(interactionId, true);
    saveInteractionProgress(lesson.id, interactionId);
  }, [saveInteractionProgress, lesson.id, lessonUi]);

  const handleInteractionUncomplete = useCallback(async(interactionId: string) => {
    if (lessonUi) lessonUi.setInteractionCompleted(interactionId, false);
    uncompleteInteraction(lesson.id, interactionId);
  }, [uncompleteInteraction, lesson.id, lessonUi]);
  
  const totalInteractiveElements = useMemo(() => {
    return countInteractions(lesson.content);
  }, [lesson.content]);

  useEffect(() => {
    if (lessonUi && userProfile && lesson.id) {
        const completedIds = userProfile.lessonProgress[lesson.id]?.completedInteractions || [];
        const lessonNumber = lesson.id.replace('m', '').replace('-l', '.');
        lessonUi.setLessonData(lesson.title, lessonNumber, totalInteractiveElements, completedIds);
    }

    return () => {
      lessonUi?.resetLesson();
    };
  }, [lesson, userProfile, lessonUi, totalInteractiveElements]);


  const { progressPercentage, interactionsProgressText } = useMemo(() => {
    if (!lessonUi) return { progressPercentage: 0, interactionsProgressText: "N/A"};
    const { completedInteractions, totalInteractions } = lessonUi;
    const percentage = totalInteractions > 0 ? (completedInteractions / totalInteractions) * 100 : 0;
    const text = totalInteractions > 0
      ? `Interações: ${completedInteractions}/${totalInteractions}`
      : "Nenhuma interação nesta lição.";
    return { progressPercentage: percentage, interactionsProgressText: text };
  }, [lessonUi]);

  const allInteractionsCompleted = useMemo(() => {
    if (!lessonUi) return false;
    return lessonUi.totalInteractions > 0 && lessonUi.completedInteractions >= lessonUi.totalInteractions;
  }, [lessonUi]);
  
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
    setIsMarkingComplete(false);
    if (lesson && allMockLessons && allMockLessons.length > 0) {
      const currentIndex = allMockLessons.findIndex(l => l.id === lesson.id);
      if (currentIndex > -1) {
        setPrevLesson(currentIndex > 0 ? allMockLessons[currentIndex - 1] : null);
        setNextLesson(currentIndex < allMockLessons.length - 1 ? allMockLessons[currentIndex + 1] : null);
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
        setCurrentTime(0);
        audio.currentTime = 0;
      }
    };
  
    const updateCurrentTime = () => setCurrentTime(audio.currentTime);

    const handleAudioEnded = () => {
      setIsPlaying(false);
      saveAudioProgress(lesson.id, 100);
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
  }, [lesson.id, saveAudioProgress, audioProgress]);

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
        saveAudioProgress(lesson.id, 0); 
      }
      audio.play();
      progressSaveInterval.current = setInterval(() => {
        const progress = duration > 0 ? (audio.currentTime / duration) * 100 : 0;
        if (progress < 100) {
          saveAudioProgress(lesson.id, progress);
        }
      }, 5000);
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
      saveAudioProgress(lesson.id, (newTime / duration) * 100);
    }
  };

  const formatTime = (timeInSeconds: number) => {
    if (!isFinite(timeInSeconds)) return "0:00";
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const processedContentElements = useMemo(() => {
    if (lesson?.content && lessonUi) {
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
                  isInteractionCompleted={lessonUi.isInteractionCompleted(interactionId)}
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
                  isInteractionCompleted={lessonUi.isInteractionCompleted(interactionId)}
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
  }, [lesson.id, lesson.content, handleInteractionCorrect, handleInteractionUncomplete, isLessonAlreadyCompletedByProfile, lessonUi]);
  

  const handleMarkAsCompleted = async () => {
    if (isLessonAlreadyCompletedByProfile || isMarkingComplete || (!allInteractionsCompleted && totalInteractiveElements > 0)) return;
    setIsMarkingComplete(true);
    await completeLesson(lesson.id);
    setIsMarkingComplete(false);
  };
  
  const handleResetLesson = async () => {
      setIsResetting(true);
      await resetLessonProgress(lesson.id);
      if (lessonUi) {
          lessonUi.setLessonData(lesson.title, lesson.id.replace('m', '').replace('-l', '.'), totalInteractiveElements, []);
      }
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
    if (isMarkingComplete || isResetting) return <Loader2 className="animate-spin" />;
    if (isLessonAlreadyCompletedByProfile) return <CheckCircle />;
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

      <CardFooter className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4 p-6 bg-muted/30 rounded-lg">
        <div className="w-full sm:w-auto flex-1 sm:flex-initial flex justify-center sm:justify-start">
            {prevLesson ? (
            <Button variant="outline" size="default" asChild className="w-full sm:w-auto">
                <Link href={`/lessons/${prevLesson.id}`} title={`Anterior: ${prevLesson.title}`}>
                  <span className="flex items-center justify-center w-full">
                    <ArrowLeft className="mr-1 sm:mr-2" />
                    <span className="hidden sm:inline truncate">Anterior: {truncateTitle(prevLesson.title)}</span>
                    <span className="sm:hidden">Anterior</span>
                  </span>
                </Link>
            </Button>
            ) : <div className="w-full sm:w-auto min-w-[88px] sm:min-w-[100px]">&nbsp;</div>}
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-2 order-first sm:order-none">
          {lesson.moduleId && (
              <Button variant="ghost" size="sm" asChild>
                  <Link href={`/modules/${lesson.moduleId}`} className="flex items-center gap-2">
                      <Map className="h-4 w-4"/> Voltar ao Módulo
                  </Link>
              </Button>
          )}
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
                  {isResetting ? <Loader2 className="animate-spin" /> : <span role="img" aria-label="Reiniciar">🔄</span>}
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
                    <ArrowRight className="ml-1 sm:ml-2" />
                  </span>
                </Link>
            </Button>
            ) : <div className="w-full sm:w-auto min-w-[88px] sm:min-w-[100px]">&nbsp;</div>}
        </div>
      </CardFooter>
    </div>
  );
}