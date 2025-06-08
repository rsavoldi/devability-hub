
import { LessonItemCard } from '@/components/lessons/LessonItemCard';
// import { mockLessons, lessonCategories as mockLessonCategoriesFromData } from '@/lib/mockData'; // Removido mockLessons
import { mockRoadmapData } from '@/lib/mockData'; // Mantido para ícones e nomes de categorias
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, ListFilter, ListChecks, type LucideIcon } from 'lucide-react'; 
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from '@/lib/utils';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy as firestoreOrderBy } from 'firebase/firestore'; // Renomeado orderBy para evitar conflito
import type { Lesson } from '@/lib/types';
import { unstable_noStore as noStore } from 'next/cache';


interface LessonCategory {
  name: string;
  icon: LucideIcon;
  lessons: Lesson[];
}

async function getLessonsFromFirestore(): Promise<Lesson[]> {
  noStore(); // Impede o cache estático para esta busca, garantindo dados frescos
  try {
    const lessonsCollectionRef = collection(db, 'lessons');
    // Adicionando ordenação, se os documentos tiverem um campo 'order' e 'moduleTitle'
    const q = query(lessonsCollectionRef, firestoreOrderBy("moduleTitle"), firestoreOrderBy("order"));
    const lessonsSnapshot = await getDocs(q);
    return lessonsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Lesson));
  } catch (error) {
    console.error("Error fetching lessons from Firestore:", error);
    return [];
  }
}

export default async function LessonsPage() {
  const allLessons = await getLessonsFromFirestore();

  // Recriar lessonCategories com base nos módulos de mockRoadmapData e nas lições do Firestore
  const lessonCategories: LessonCategory[] = mockRoadmapData.map(roadmapStep => ({
    name: roadmapStep.modules[0]?.title || roadmapStep.title, // Usa o título do primeiro módulo ou da trilha
    icon: roadmapStep.icon || BookOpen, // Usa o ícone da trilha ou um padrão
    lessons: allLessons.filter(lesson => lesson.moduleId === roadmapStep.modules[0]?.id || lesson.moduleTitle === roadmapStep.modules[0]?.title)
  }));
  
  // Adicionar uma categoria "Todas as Lições" se necessário, ou filtrar as categorias que realmente têm lições
  const categoriesWithLessons = lessonCategories.filter(cat => cat.lessons.length > 0);
  const defaultTabValue = categoriesWithLessons[0]?.name.toLowerCase().replace(/\s+/g, '-') || 'all';


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

      <Tabs defaultValue={defaultTabValue} className="w-full">
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
                  <Tooltip key={category.name}>
                    <TooltipTrigger asChild>
                      <TabsTrigger
                        value={category.name.toLowerCase().replace(/\s+/g, '-')}
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
            <TabsContent key={category.name} value={category.name.toLowerCase().replace(/\s+/g, '-')}>
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
