
"use client";

import { use, useEffect, useState, useMemo } from 'react';
import { mockRoadmapData, mockExercises as allMockExercises, mockLessons as allMockLessons } from '@/lib/mockData';
import type { Module, Lesson, Exercise, RoadmapStep } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle, ExternalLink, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface ModulePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ModulePage({ params: paramsPromise }: ModulePageProps) {
  const actualParams = use(paramsPromise);
  const { id: moduleId } = actualParams;

  const { userProfile, loading: authLoading, completeModule } = useAuth();

  const [module, setModule] = useState<Module | null>(null);
  const [parentTrilha, setParentTrilha] = useState<RoadmapStep | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMarkingModuleComplete, setIsMarkingModuleComplete] = useState(false);

  const moduleLessons = useMemo(() => {
    return allMockLessons.filter(lesson => lesson.moduleId === moduleId);
  }, [moduleId]);

  const moduleExercises = useMemo(() => {
    return allMockExercises.filter(exercise => exercise.moduleId === moduleId);
  }, [moduleId]);

  useEffect(() => {
    setIsLoading(true);
    let foundModule: Module | null = null;
    let foundTrilha: RoadmapStep | null = null;

    for (const trilha of mockRoadmapData) {
      const mod = trilha.modules.find(m => m.id === moduleId);
      if (mod) {
        foundModule = {
            ...mod,
            lessons: moduleLessons,
            exercises: moduleExercises
        };
        foundTrilha = trilha;
        break;
      }
    }

    setModule(foundModule);
    setParentTrilha(foundTrilha);
    setTimeout(() => setIsLoading(false), 300);
  }, [moduleId, moduleLessons, moduleExercises]);

  const { moduleProgress, allItemsCompleted } = useMemo(() => {
    if (!userProfile || !module || (!module.lessons && !module.exercises)) {
      return { moduleProgress: 0, allItemsCompleted: false };
    }

    const totalModuleLessons = module.lessons?.length || 0;
    const completedLessonsCount = module.lessons?.filter(l => userProfile.lessonProgress[l.id]?.completed).length || 0;
    
    const totalModuleExercises = module.exercises?.length || 0;
    const completedExercisesCount = module.exercises?.filter(e => userProfile.completedExercises.includes(e.id)).length || 0;

    const totalModuleItems = totalModuleLessons + totalModuleExercises;
    if (totalModuleItems === 0) return { moduleProgress: 0, allItemsCompleted: true };

    const completedItems = completedLessonsCount + completedExercisesCount;
    const progress = (completedItems / totalModuleItems) * 100;
    
    return { moduleProgress: progress, allItemsCompleted: completedItems === totalModuleItems };
  }, [module, userProfile]);

  const moduleIsCompletedByProfile = useMemo(() => {
    if (!userProfile || !module) return false;
    return userProfile.completedModules.includes(module.id);
  }, [userProfile, module]);

  const handleMarkModuleAsCompleted = async () => {
    if (moduleIsCompletedByProfile || isMarkingModuleComplete || !allItemsCompleted || !module) return;

    setIsMarkingComplete(true);
    await completeModule(module.id);
    setIsMarkingModuleComplete(false);
  };

  if (isLoading || authLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!module || !parentTrilha) {
    return <div className="text-center py-10">Módulo ou trilha não encontrado.</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <Button variant="outline" asChild className="mb-6">
        <Link href="/">
          <span className="flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Trilhas
          </span>
        </Link>
      </Button>

      <Card className="shadow-xl overflow-hidden">
        <CardHeader className="bg-muted/30 p-6">
          <p className="text-sm font-medium text-primary mb-1 flex items-center">
            <span role="img" aria-label="Trilha" className="mr-2 text-lg">{parentTrilha.emoji || '🗺️'}</span>
            Trilha: {parentTrilha.title}
          </p>
          <CardTitle className="text-3xl font-bold tracking-tight md:text-4xl">{module.title}</CardTitle>
          <CardDescription className="mt-1 text-lg">
            {module.lessons?.length || 0} lições
            {module.exercises && module.exercises.length > 0 && `, ${module.exercises.length} exercícios`}
          </CardDescription>
          <div className="mt-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-muted-foreground">Progresso do Módulo (Lições e Exercícios)</span>
              <Badge variant={moduleIsCompletedByProfile ? "default" : "secondary"} className={cn(moduleIsCompletedByProfile ? "bg-green-500 hover:bg-green-600" : "bg-secondary hover:bg-secondary/80")}>
                {moduleProgress.toFixed(0)}% {moduleIsCompletedByProfile ? "Concluído" : ""}
              </Badge>
            </div>
            <Progress value={moduleProgress} aria-label={`${moduleProgress.toFixed(0)}% progresso do módulo`} />
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <span role="img" aria-label="Livro Aberto" className="text-2xl mr-2">📖</span>
              Lições
            </h2>
            {(module.lessons?.length || 0) > 0 ? (
              <div className="space-y-4">
                {module.lessons.map(lesson => {
                  const isCompleted = userProfile?.lessonProgress[lesson.id]?.completed || false;
                  return (
                    <Card key={lesson.id} className={cn("hover:shadow-md transition-shadow", isCompleted ? "bg-green-50 dark:bg-green-900/20 border-green-500/50" : "")}>
                      <CardHeader className="flex flex-row items-center justify-between p-4">
                        <div>
                          <CardTitle className="text-lg">{lesson.title}</CardTitle>
                          <CardDescription>{lesson.estimatedTime} • {lesson.points && `+${lesson.points}pts`}</CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          {isCompleted && <CheckCircle className="h-5 w-5 text-green-500" />}
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/lessons/${lesson.id}`}>
                              <span className="flex items-center">
                                Ver <ExternalLink className="ml-1 h-3 w-3"/>
                              </span>
                            </Link>
                          </Button>
                        </div>
                      </CardHeader>
                    </Card>
                  )
                })}
              </div>
            ) : (
              <p className="text-muted-foreground">Nenhuma lição neste módulo ainda.</p>
            )}
          </section>

          {(module.exercises?.length || 0) > 0 && (
            <section>
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <span role="img" aria-label="Alvo" className="text-2xl mr-2">🎯</span>
                Exercícios Práticos
              </h2>
              <Button asChild className="w-full md:w-auto">
                <Link href={`/modules/${moduleId}/exercises`}>
                  <span className="flex items-center">
                    <span role="img" aria-label="Lista de Verificação" className="mr-2">📋</span>
                    Acessar Exercícios do Módulo ({module.exercises.length})
                  </span>
                </Link>
              </Button>
               <p className="text-sm text-muted-foreground mt-2">
                Teste seus conhecimentos com os exercícios práticos deste módulo.
              </p>
            </section>
          )}
        </CardContent>
        <CardFooter className="p-6 bg-muted/30">
             <Button
                size="lg"
                className="w-full"
                onClick={handleMarkModuleAsCompleted}
                disabled={moduleIsCompletedByProfile || !allItemsCompleted || isMarkingModuleComplete}
                variant={moduleIsCompletedByProfile ? "default" : (allItemsCompleted ? "secondary" : "outline")}
             >
                {isMarkingModuleComplete ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <CheckCircle className="mr-2 h-5 w-5"/>}
                {moduleIsCompletedByProfile ? "Módulo Concluído!" :
                 (allItemsCompleted ? "Marcar Módulo como Concluído" : "Complete todas as lições e exercícios para finalizar")}
             </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
