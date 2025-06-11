
// src/app/(main)/modules/[id]/page.tsx
"use client";

import { use, useEffect, useState, useMemo, useCallback } from 'react'; 
import { mockRoadmapData, mockExercises as allMockExercises } from '@/lib/mockData'; 
import type { Module, Lesson, Exercise, RoadmapStep } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle, ExternalLink, Loader2 } from 'lucide-react'; // Removido BookOpen, Target, ListChecks
import Link from 'next/link';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext'; 
import { cn } from '@/lib/utils';
import { LOCAL_STORAGE_KEYS } from '@/constants';
import { useToast } from '@/hooks/use-toast';

interface ModulePageProps {
  params: Promise<{ 
    id: string;
  }>;
}

export default function ModulePage({ params: paramsPromise }: ModulePageProps) {
  const actualParams = use(paramsPromise); 
  const { id: moduleId } = actualParams; 

  const { userProfile, loading: authLoading, updateUserProfile } = useAuth(); 
  const { toast } = useToast();

  const [module, setModule] = useState<Module | null>(null);
  const [parentTrilha, setParentTrilha] = useState<RoadmapStep | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMarkingModuleComplete, setIsMarkingModuleComplete] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    let foundModule: Module | null = null;
    let foundTrilha: RoadmapStep | null = null;

    for (const trilha of mockRoadmapData) {
      const mod = trilha.modules.find(m => m.id === moduleId); 
      if (mod) {
        foundModule = mod;
        foundTrilha = trilha;
        break;
      }
    }
    
    setModule(foundModule);
    setParentTrilha(foundTrilha);
    setTimeout(() => setIsLoading(false), 300); 
  }, [moduleId]); 

  const isLessonCompleted = useCallback((lessonId: string) => {
    if (authLoading || !userProfile) return false;
    return userProfile.completedLessons.includes(lessonId);
  }, [userProfile, authLoading]);
  
  const { moduleProgress, moduleIsCompleted, allLessonsCompleted } = useMemo(() => {
    if (authLoading || !userProfile || !module?.lessons) {
      return { 
        moduleProgress: module?.progress || 0, 
        moduleIsCompleted: userProfile?.completedModules.includes(module?.id || "") || module?.isCompleted || false,
        allLessonsCompleted: false
      };
    }
    
    const totalModuleLessons = module.lessons.length;
    if (totalModuleLessons === 0) {
      const isActuallyCompleted = userProfile.completedModules.includes(module.id) || module.isCompleted || false;
      return { moduleProgress: isActuallyCompleted ? 100: 0, moduleIsCompleted: isActuallyCompleted, allLessonsCompleted: true }; 
    }

    const completedLessonsCount = module.lessons.filter(l =>
      userProfile.completedLessons.includes(l.id)
    ).length;
    
    const progress = (completedLessonsCount / totalModuleLessons) * 100;
    const allLessonsDone = completedLessonsCount === totalModuleLessons;
    const isCompletedByProfile = userProfile.completedModules.includes(module.id);

    return { 
        moduleProgress: progress, 
        moduleIsCompleted: isCompletedByProfile, 
        allLessonsCompleted: allLessonsDone
    };
  }, [module, userProfile, authLoading]);

  const handleMarkModuleAsCompleted = () => {
    if (!userProfile || !module || moduleIsCompleted || !allLessonsCompleted) return;

    setIsMarkingModuleComplete(true);
    const newCompletedModules = [...new Set([...userProfile.completedModules, module.id])];
    const pointsForModuleCompletion = 50; 
    
    updateUserProfile({
      completedModules: newCompletedModules,
      points: (userProfile.points || 0) + pointsForModuleCompletion
    });

    toast({
      title: "Módulo Concluído! 🚀",
      description: `Você ganhou ${pointsForModuleCompletion} pontos por completar o módulo "${module.title}"!`,
      className: "bg-primary text-primary-foreground",
    });
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

  const exercisesForThisModule = allMockExercises.filter(ex => ex.moduleId === module.id);

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
            {module.lessons.length} lições
            {exercisesForThisModule.length > 0 && `, ${exercisesForThisModule.length} exercícios`}
          </CardDescription>
          <div className="mt-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-muted-foreground">Progresso do Módulo (Lições)</span>
              <Badge variant={moduleIsCompleted ? "default" : "secondary"} className={cn(moduleIsCompleted ? "bg-green-500 hover:bg-green-600" : "bg-secondary hover:bg-secondary/80")}>
                {moduleProgress.toFixed(0)}% {moduleIsCompleted ? "Concluído" : ""}
              </Badge>
            </div>
            <Progress value={moduleProgress} aria-label={`${moduleProgress.toFixed(0)}% progresso do módulo`} />
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <span role="img" aria-label="Livro Aberto" className="text-2xl mr-2">📖</span> {/* Substituído BookOpen por emoji */}
              Lições
            </h2>
            {module.lessons.length > 0 ? (
              <div className="space-y-4">
                {module.lessons.map(lesson => (
                  <Card key={lesson.id} className={cn("hover:shadow-md transition-shadow", isLessonCompleted(lesson.id) ? "bg-green-50 dark:bg-green-900/20 border-green-500/50" : "")}>
                    <CardHeader className="flex flex-row items-center justify-between p-4">
                      <div>
                        <CardTitle className="text-lg">{lesson.title}</CardTitle>
                        <CardDescription>{lesson.estimatedTime} • {lesson.type}</CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                         {isLessonCompleted(lesson.id) && <CheckCircle className="h-5 w-5 text-green-500" />}
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
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">Nenhuma lição neste módulo ainda.</p>
            )}
          </section>

          {exercisesForThisModule.length > 0 && (
            <section>
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <span role="img" aria-label="Alvo" className="text-2xl mr-2">🎯</span> {/* Substituído Target por emoji */}
                Exercícios Práticos
              </h2>
              <Button asChild className="w-full md:w-auto">
                <Link href={`/modules/${moduleId}/exercises`}> 
                  <span className="flex items-center">
                    <span role="img" aria-label="Lista de Verificação" className="mr-2">📋</span> {/* Substituído ListChecks */}
                    Acessar Exercícios do Módulo ({exercisesForThisModule.length})
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
                disabled={moduleIsCompleted || !allLessonsCompleted || isMarkingModuleComplete}
                variant={moduleIsCompleted ? "default" : (allLessonsCompleted ? "secondary" : "outline")}
             >
                {isMarkingModuleComplete ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <CheckCircle className="mr-2 h-5 w-5"/>}
                {moduleIsCompleted ? "Módulo Concluído!" : 
                 (allLessonsCompleted ? "Marcar Módulo como Concluído" : "Complete todas as lições para finalizar")}
             </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
