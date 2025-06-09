
"use client"; 

import { LessonItemCard } from '@/components/lessons/LessonItemCard';
import { mockLessons, finalLessonCategories } from '@/lib/mockData'; // Importa finalLessonCategories
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, ListFilter, ListChecks, type LucideIcon } from 'lucide-react'; 
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from '@/lib/utils';
import type { Lesson } from '@/lib/types'; // Não precisamos de ModuleType ou RoadmapStep aqui
import { useState, useEffect } from 'react'; 
import { lucideIconMap } from '@/components/roadmap/RoadmapDisplay'; 

interface LessonCategory {
  name: string;
  iconName: string; 
  lessons: Lesson[];
  moduleId: string;
}

export default function LessonsPage() {
  const allLessons = mockLessons; 
  
  // Usa finalLessonCategories diretamente de mockData.ts, que já está processado
  const categoriesWithLessons = finalLessonCategories.filter(cat => cat.lessons.length > 0);
  
  // Define o valor padrão da aba de forma mais robusta
  const getDefaultTabValue = () => {
    if (categoriesWithLessons.length > 0) {
      return categoriesWithLessons[0].moduleId;
    }
    return 'all';
  };

  const [activeTab, setActiveTab] = useState(getDefaultTabValue());
  
  // Ajusta a aba ativa se a atual se tornar inválida
  useEffect(() => {
    const currentTabIsValid = activeTab === 'all' || categoriesWithLessons.some(cat => cat.moduleId === activeTab);
    if (!currentTabIsValid) {
      setActiveTab(getDefaultTabValue());
    }
  }, [categoriesWithLessons, activeTab]);


  return (
    <div className="container mx-auto py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight flex items-center">
          <BookOpen className="w-10 h-10 mr-3 text-primary" />
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
                const CategoryIcon = lucideIconMap[category.iconName] || BookOpen; 
                return (
                  <Tooltip key={category.moduleId}>
                    <TooltipTrigger asChild>
                      <TabsTrigger
                        value={category.moduleId}
                        className={cn(
                            "h-10 w-10 p-0 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground", 
                            "rounded-md border-transparent hover:bg-accent hover:text-accent-foreground data-[state=active]:shadow-lg data-[state=active]:ring-2 data-[state=active]:ring-ring"
                        )}
                        aria-label={category.name}
                      >
                        <CategoryIcon className="h-5 w-5" />
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
                    <LessonItemCard key={lesson.id} lesson={lesson} />
                  ))}
                </div>
              ) : (
                 <p className="text-muted-foreground text-center py-8">Nenhuma lição encontrada no momento.</p>
              )}
          </TabsContent>

          {categoriesWithLessons.map((category) => {
            const CategoryIcon = lucideIconMap[category.iconName] || BookOpen;
            return (
            <TabsContent key={category.moduleId} value={category.moduleId}>
              <h2 className="text-2xl font-semibold mb-6 mt-4 flex items-center">
                <CategoryIcon className="w-6 h-6 mr-2 text-primary shrink-0" />
                {category.name} ({category.lessons.length})
              </h2>
              {category.lessons.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {category.lessons.map((lesson) => (
                    <LessonItemCard key={lesson.id} lesson={lesson} categoryName={category.name} />
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
