
import { LessonItemCard } from '@/components/lessons/LessonItemCard';
import { mockRoadmapData as fallbackRoadmapData } from '@/lib/mockData'; // Renomeado para fallback
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, ListFilter, ListChecks, type LucideIcon } from 'lucide-react'; 
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from '@/lib/utils';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy as firestoreOrderBy, collectionGroup } from 'firebase/firestore';
import type { Lesson, Module as ModuleType, RoadmapStep } from '@/lib/types'; // ModuleType importado
import { unstable_noStore as noStore } from 'next/cache';


interface LessonCategory {
  name: string;
  icon: LucideIcon; // Assumindo que o ícone do módulo/trilha será usado
  lessons: Lesson[];
  moduleId: string;
}

async function getLessonsFromFirestore(): Promise<Lesson[]> {
  noStore(); 
  try {
    const lessonsCollectionRef = collection(db, 'lessons');
    const q = query(lessonsCollectionRef, firestoreOrderBy("moduleTitle"), firestoreOrderBy("order"));
    const lessonsSnapshot = await getDocs(q);
    return lessonsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Lesson));
  } catch (error) {
    console.error("Error fetching lessons from Firestore:", error);
    return [];
  }
}

// Função para buscar módulos de TODAS as trilhas
async function getAllModulesFromFirestore(): Promise<(ModuleType & { roadmapTitle: string, roadmapIcon?: LucideIcon })[]> {
  noStore();
  const allModules: (ModuleType & { roadmapTitle: string, roadmapIcon?: LucideIcon })[] = [];
  try {
    const roadmapsCollectionRef = collection(db, 'roadmaps');
    const roadmapsQuery = query(roadmapsCollectionRef, firestoreOrderBy("order"));
    const roadmapsSnapshot = await getDocs(roadmapsQuery);

    for (const roadmapDoc of roadmapsSnapshot.docs) {
      const roadmapData = roadmapDoc.data() as RoadmapStep;
      const modulesCollectionRef = collection(db, `roadmaps/${roadmapDoc.id}/modules`);
      const modulesQuery = query(modulesCollectionRef, firestoreOrderBy("order"));
      const modulesSnapshot = await getDocs(modulesQuery);

      modulesSnapshot.docs.forEach(moduleDoc => {
        const moduleData = moduleDoc.data() as ModuleType;
        allModules.push({
          ...moduleData,
          id: moduleDoc.id, // Garante que o ID do módulo está correto
          roadmapTitle: roadmapData.title,
          roadmapIcon: roadmapData.icon || BookOpen, // Usa o ícone da trilha, se existir
        });
      });
    }
  } catch (error) {
    console.error("Error fetching modules from Firestore:", error);
    // Em caso de erro, podemos usar fallbackRoadmapData para categorias, se preferir
    // return fallbackRoadmapData.flatMap(roadmap => 
    //   roadmap.modules.map(module => ({
    //     ...module,
    //     id: module.id,
    //     roadmapTitle: roadmap.title,
    //     roadmapIcon: roadmap.icon || BookOpen,
    //   }))
    // );
  }
  return allModules;
}


export default async function LessonsPage() {
  const allLessons = await getLessonsFromFirestore();
  const allModulesFromFirestore = await getAllModulesFromFirestore();

  const lessonCategories: LessonCategory[] = allModulesFromFirestore.map(module => ({
    name: module.title,
    icon: module.roadmapIcon || BookOpen, // Usando o ícone da trilha associada ao módulo
    lessons: allLessons.filter(lesson => lesson.moduleId === module.id),
    moduleId: module.id
  }));
  
  const categoriesWithLessons = lessonCategories.filter(cat => cat.lessons.length > 0);
  const defaultTabValue = categoriesWithLessons[0]?.moduleId || 'all';


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
                  <Tooltip key={category.moduleId}>
                    <TooltipTrigger asChild>
                      <TabsTrigger
                        value={category.moduleId} // Usando moduleId como value
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
            <TabsContent key={category.moduleId} value={category.moduleId}> {/* Usando moduleId como value */}
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

