
"use client";

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import InteractiveRoadmap from '@/components/roadmap/InteractiveRoadmap';
import { useProgress } from '@/contexts/ProgressContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle, RotateCcw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from "@/components/ui/progress";
import Link from 'next/link';

export default function PathDetailPage() {
  const params = useParams();
  const router = useRouter();
  const pathId = Array.isArray(params.pathId) ? params.pathId[0] : params.pathId;
  
  const { getLearningPathById, getPathProgress, isLoading } = useProgress();
  const { language, text } = useLanguage();

  if (isLoading) {
    return <div className="container mx-auto py-8 px-4 text-center">{text('loading')}...</div>;
  }

  const learningPath = getLearningPathById(pathId);
  const pathProgressData = getPathProgress(pathId);

  if (!learningPath) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <p>Trilha de aprendizado não encontrada.</p>
        <Button onClick={() => router.push('/learning-paths')} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> {text('backToPaths')}
        </Button>
      </div>
    );
  }

  const totalLessons = learningPath.lessons.length;
  const completedLessons = pathProgressData ? Object.values(pathProgressData.lessons).filter(l => l.completed).length : 0;
  const overallProgressPercent = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  return (
    <div className="container mx-auto py-8 px-4">
      <Button onClick={() => router.push('/learning-paths')} variant="outline" className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> {text('backToPaths')}
      </Button>

      <Card className="mb-8 shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-headline text-primary">
            {learningPath.title[language]}
          </CardTitle>
          <CardDescription className="text-muted-foreground mt-1">
            {learningPath.description[language]}
          </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="mb-4">
                <div className="flex justify-between text-sm text-muted-foreground mb-1">
                    <span>{text('progress')}</span>
                    <span>{completedLessons} / {totalLessons} {text('lessons')}</span>
                </div>
                <Progress value={overallProgressPercent} className="w-full h-3" />
            </div>
            {pathProgressData?.completed && (
                <div className="flex items-center text-green-600">
                    <CheckCircle className="mr-2 h-5 w-5" />
                    <span>{text('pathComplete')}</span>
                </div>
            )}
        </CardContent>
      </Card>
      
      <h2 className="text-2xl font-headline mb-2 text-center">{text('lessons')}</h2>
      <p className="text-center text-muted-foreground mb-6">
        {language === 'pt' ? "Selecione uma lição para começar ou continuar seu aprendizado." : "Select a lesson to start or continue your learning."}
      </p>

      <InteractiveRoadmap
        items={learningPath.lessons}
        basePath={`/learning-paths/${pathId}`}
        isMainRoadmap={false}
        currentPathId={pathId}
      />
    </div>
  );
}
