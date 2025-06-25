
"use client"; 

import { LessonItemCard } from '@/components/lessons/LessonItemCard';
import { mockLessons, finalLessonCategories } from '@/lib/mockData'; 
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ListFilter, ListChecks, BookOpen as DefaultCategoryIcon } from 'lucide-react'; 
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from '@/lib/utils';
import type { Lesson } from '@/lib/types'; 
import { useState, useEffect, useMemo, useCallback } from 'react'; 
import { useAuth } from '@/contexts/AuthContext';
import { countInteractions } from '@/lib/utils';

interface LessonCategoryWithEmoji {
  name: string;
  emoji: string;
  lessons: Lesson[];
  moduleId: string;
}

export default function LessonsPage() {
  const { userProfile } = useAuth();
  const allLessons = mockLessons; 
  
  const categoriesWithLessons: LessonCategoryWithEmoji[] = finalLessonCategories
    .filter(cat => cat.lessons.length > 0)
    .map(cat => ({
        ...cat,
        emoji: cat.emoji || "📚"
    }));
  
  const getDefaultTabValue = () => {
    if (categoriesWithLessons.length > 0) {
      return categoriesWithLessons[0].moduleId;
    }
    return 'all';
  };

  const [activeTab, setActiveTab] = useState(getDefaultTabValue());
  
  useEffect(() => {
    const currentTabIsValid = activeTab === 'all' || categoriesWithLessons.some(cat => cat.moduleId === activeTab);
    if (!currentTabIsValid) {
      setActiveTab(getDefaultTabValue());
    }
  }, [categoriesWithLessons, activeTab]);

  const getLessonProgress = useCallback((lessonId: string, lessonContent: string): number => {
    if (!userProfile) return 0;
    const progress = userProfile.lessonProgress[lessonId];
    if (progress?.completed) return 100;
    
    const totalInteractions = countInteractions(lessonContent);
    if (totalInteractions === 0) {
      return progress?.completed ? 100 : 0;
    }
    
    const completedCount = progress?.completedInteractions.length || 0;
    return (completedCount / totalInteractions) * 100;
  }, [userProfile]);


  return (
    <div className="container mx-auto py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight flex items-center">
          <span role="img" aria-label="livro" className="text-4xl mr-3">📖</span>
          Explore as Lições
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Mergulhe em diversos tópicos e aprimore suas habilidades de desenvolvimento e inclusão.
        </p>
      </header>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <Card className="mb-8 bg-card text-card-foreground rounded-lg border-0 shadow-none">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <ListFilter className="w-6 h-6 mr-3 text-primary" />
              Navegue pelos Módulos
            </CardTitle>
            <CardDescription>
              Selecione um módulo abaixo (passe o mouse para ver o nome completo) para ver as lições correspondentes.
            </CardDescription>
          </CardHeader>
          
          <TooltipProvider delayDuration={0}>
            <TabsList className="h-auto flex flex-wrap w-full content-start items-start gap-2 p-4 mx-6 mb-6 bg-muted rounded-md">
              <Tooltip>
                <TooltipTrigger asChild>
                  <TabsTrigger
                    value="all"
                    className={cn(
                        "h-10 w-10 p-0 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground", 
                        "rounded-md border-transparent hover:bg-accent hover:text-accent-foreground data-[state=active]:shadow-lg data-[state=active]:ring-2 data-[state=active]:ring-ring"
                    )}
                    aria-label="Todas as Lições"
                  >
                    <ListChecks className="h-5 w-5" />
                  </TabsTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Todas as Lições</p>
                </TooltipContent>
              </Tooltip>

              {categoriesWithLessons.map((category) => {
                return (
                  <Tooltip key={category.moduleId}>
                    <TooltipTrigger asChild>
                      <TabsTrigger
                        value={category.moduleId}
                        className={cn(
                            "h-10 w-10 p-0 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground", 
                            "rounded-md border-transparent hover:bg-accent hover:text-accent-foreground data-[state=active]:shadow-lg data-[state=active]:ring-2 data-[state=active]:ring-ring",
                            "flex items-center justify-center text-xl leading-none"
                        )}
                        aria-label={category.name}
                      >
                        {category.emoji}
                      </TabsTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{category.name}</p>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </TabsList>
          </TooltipProvider>
        </Card>

        <div className="mt-8">
          <TabsContent value="all">
              <h2 className="text-2xl font-semibold mb-6 mt-4 flex items-center">
                <ListChecks className="w-6 h-6 mr-2 text-primary shrink-0" />
                Todas as Lições ({allLessons.length})
              </h2>
              {allLessons.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {allLessons.map((lesson) => (
                    <LessonItemCard key={lesson.id} lesson={lesson} progress={getLessonProgress(lesson.id, lesson.content)} />
                  ))}
                </div>
              ) : (
                 <p className="text-muted-foreground text-center py-8">Nenhuma lição encontrada no momento.</p>
              )}
          </TabsContent>

          {categoriesWithLessons.map((category) => {
            return (
            <TabsContent key={category.moduleId} value={category.moduleId}>
              <h2 className="text-2xl font-semibold mb-6 mt-4 flex items-center">
                <span className="text-2xl mr-2 leading-none">{category.emoji}</span>
                {category.name} ({category.lessons.length})
              </h2>
              {category.lessons.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {category.lessons.map((lesson) => (
                    <LessonItemCard 
                      key={lesson.id} 
                      lesson={lesson} 
                      categoryName={category.name} 
                      progress={getLessonProgress(lesson.id, lesson.content)}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">Nenhuma lição nesta categoria ainda.</p>
              )}
            </TabsContent>
            );
          })}
        </div>
      </Tabs>
    </div>
  );
}
