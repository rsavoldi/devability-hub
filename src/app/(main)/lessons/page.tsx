
"use client"; // Adicionado "use client" para hooks

import { LessonItemCard } from '@/components/lessons/LessonItemCard';
import { mockRoadmapData, mockLessons } from '@/lib/mockData'; // Usando dados mockados
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, ListFilter, ListChecks, type LucideIcon } from 'lucide-react'; 
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from '@/lib/utils';
import type { Lesson, Module as ModuleType } from '@/lib/types';
import { useMemo, useState } from 'react'; // Importado useState

interface LessonCategory {
  name: string;
  icon: LucideIcon;
  lessons: Lesson[];
  moduleId: string;
}

// Não precisamos mais buscar do Firestore por enquanto
// async function getLessonsFromFirestore(): Promise<Lesson[]> { ... }
// async function getAllModulesFromFirestore(): Promise<(ModuleType & { roadmapTitle: string, roadmapIcon?: LucideIcon })[]> { ... }

export default function LessonsPage() {
  // Utilizando os dados mockados diretamente
  const allLessons = mockLessons;
  const allModulesFromMockData = mockRoadmapData.flatMap(roadmap => 
    roadmap.modules.map(module => ({
      ...module,
      id: module.id,
      roadmapTitle: roadmap.title,
      roadmapIcon: roadmap.icon || BookOpen, 
    }))
  );

  const lessonCategories: LessonCategory[] = useMemo(() => {
    return allModulesFromMockData.map(module => ({
      name: module.title,
      icon: module.roadmapIcon || BookOpen,
      lessons: allLessons.filter(lesson => lesson.moduleId === module.id),
      moduleId: module.id
    }));
  }, [allModulesFromMockData, allLessons]);
  
  const categoriesWithLessons = lessonCategories.filter(cat => cat.lessons.length > 0);
  const defaultTabValue = categoriesWithLessons[0]?.moduleId || 'all';

  // Estado para a aba ativa, para garantir consistência na renderização inicial no cliente
  const [activeTab, setActiveTab] = useState(defaultTabValue);
  
  // Efeito para definir a aba ativa após a montagem, se necessário
  // useEffect(() => {
  //   if (categoriesWithLessons.length > 0 && !activeTab) {
  //     setActiveTab(categoriesWithLessons[0].moduleId);
  //   } else if (categoriesWithLessons.length === 0 && activeTab !== 'all') {
  //     setActiveTab('all');
  //   }
  // }, [categoriesWithLessons, activeTab]);


  return (
    <div className="container mx-auto py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight flex items-center">
          <BookOpen className="w-10 h-10 mr-3 text-primary" />
          Explore as Lições <span role="img" aria-label="livros">📚</span>
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
                const CategoryIcon = category.icon;
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
            const CategoryIcon = category.icon;
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
