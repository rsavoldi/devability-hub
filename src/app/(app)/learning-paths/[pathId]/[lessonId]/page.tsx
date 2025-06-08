
"use client";

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useProgress } from '@/contexts/ProgressContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle, Lightbulb } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MultipleChoiceExercise } from '@/components/exercises/MultipleChoiceExercise'; // Example exercise
import Image from 'next/image';

// Placeholder exercise data for demonstration
const MOCK_EXERCISE_DATA = {
    question: { pt: "Qual é o principal objetivo do Desenho Universal?", en: "What is the main goal of Universal Design?" },
    options: [
        { pt: "Criar produtos apenas para pessoas com deficiência.", en: "To create products only for people with disabilities." },
        { pt: "Tornar produtos e ambientes utilizáveis pelo maior número de pessoas possível.", en: "To make products and environments usable by as many people as possible." },
        { pt: "Reduzir custos de produção de tecnologias assistivas.", en: "To reduce production costs of assistive technologies." }
    ],
    correctAnswerIndex: 1
};


export default function LessonDetailPage() {
  const params = useParams();
  const router = useRouter();
  const pathId = Array.isArray(params.pathId) ? params.pathId[0] : params.pathId;
  const lessonId = Array.isArray(params.lessonId) ? params.lessonId[0] : params.lessonId;

  const { getLessonById, completeLesson, isLessonCompleted, getLearningPathById, isLoading, getCurrentLessonPath } = useProgress();
  const { language, text } = useLanguage();

  if (isLoading) {
    return <div className="container mx-auto py-8 px-4 text-center">{text('loading')}...</div>;
  }

  const lesson = getLessonById(pathId, lessonId);
  const parentPath = getLearningPathById(pathId);
  const lessonCompleted = isLessonCompleted(pathId, lessonId);

  if (!lesson || !parentPath) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <p>Lição não encontrada.</p>
        <Button onClick={() => router.push(pathId ? `/learning-paths/${pathId}` : '/learning-paths')} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> {text('backToLessons')}
        </Button>
      </div>
    );
  }

  const handleCompleteLesson = () => {
    completeLesson(pathId, lessonId);
    // Potentially navigate to next lesson or path summary
    const nextLessonInPath = getCurrentLessonPath(pathId);
    if (nextLessonInPath) {
        router.push(nextLessonInPath);
    } else {
        router.push(`/learning-paths/${pathId}`); // back to module roadmap
    }
  };

  const currentLessonIndex = parentPath.lessons.findIndex(l => l.id === lessonId);
  const nextLesson = currentLessonIndex !== -1 && currentLessonIndex < parentPath.lessons.length - 1 
    ? parentPath.lessons[currentLessonIndex + 1] 
    : null;

  const handleGoToNextLesson = () => {
    if (nextLesson) {
      router.push(`/learning-paths/${pathId}/${nextLesson.id}`);
    } else {
      router.push(`/learning-paths/${pathId}`); // Path finished, go to path page
    }
  };


  return (
    <div className="container mx-auto py-8 px-4">
      <Button onClick={() => router.push(`/learning-paths/${pathId}`)} variant="outline" className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> {text('backToLessons')}
      </Button>

      <Card className="mb-8 shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-3xl font-headline text-primary">
              {lesson.title[language]}
            </CardTitle>
            {lessonCompleted && <CheckCircle className="h-8 w-8 text-green-500" />}
          </div>
          <CardDescription className="text-muted-foreground mt-1">
            {parentPath.title[language]} - {text('lesson')} {currentLessonIndex + 1} / {parentPath.lessons.length}
          </CardDescription>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none">
          {/* Placeholder for rich lesson content */}
          <p className="mb-4">{lesson.content[language]}</p>
          
          <div className="my-6 p-4 bg-accent/10 border-l-4 border-accent rounded-md flex items-start">
            <Lightbulb className="h-6 w-6 text-accent mr-3 mt-1 flex-shrink-0" />
            <p className="text-accent-foreground">
                {language === 'pt' ? 'Este é um exemplo de conteúdo da lição. Em uma aplicação real, aqui teríamos textos, imagens, vídeos e outros elementos interativos.' : 'This is example lesson content. In a real application, this area would feature text, images, videos, and other interactive elements.'}
            </p>
          </div>

          <Image 
            src={`https://placehold.co/800x400.png`} 
            alt="Placeholder image for lesson" 
            width={800} 
            height={400}
            className="rounded-md my-4"
            data-ai-hint="education learning"
          />
          
          {/* Example Exercise */}
          <h3 className="text-xl font-headline mt-8 mb-4">{language === 'pt' ? 'Teste seu conhecimento' : 'Test Your Knowledge'}</h3>
          {!lessonCompleted && (
            <MultipleChoiceExercise
                question={MOCK_EXERCISE_DATA.question}
                options={MOCK_EXERCISE_DATA.options}
                correctAnswerIndex={MOCK_EXERCISE_DATA.correctAnswerIndex}
                onCompleted={(isCorrect) => {
                    if (isCorrect) {
                        // For this demo, completing the mock exercise completes the lesson
                        // In a real app, you might need multiple exercises or criteria
                        // completeLesson(pathId, lessonId); 
                    }
                }}
            />
          )}
          {lessonCompleted && (
            <p className="text-green-600 font-semibold flex items-center">
              <CheckCircle className="mr-2 h-5 w-5" /> {language === 'pt' ? 'Você já completou esta lição!' : 'You have already completed this lesson!'}
            </p>
          )}

        </CardContent>
        <CardFooter className="mt-6 flex justify-end gap-3">
          {!lessonCompleted ? (
            <Button onClick={handleCompleteLesson} size="lg">
              {text('completeLesson')}
            </Button>
          ) : (
            nextLesson ? (
                <Button onClick={handleGoToNextLesson} size="lg">
                    {text('nextLesson')}
                </Button>
            ) : (
                <Button onClick={() => router.push(`/learning-paths/${pathId}`)} size="lg" variant="outline">
                    {text('backToLessons')}
                </Button>
            )
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
