
"use client";

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ExerciseItemCard } from '@/components/exercises/ExerciseItemCard';
import { exerciseCategories, mockRoadmapData, mockExercises } from '@/lib/mockData';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from '@/components/ui/button';
// import { Target, ListChecks, Brain, Wand2, ArrowRight, RefreshCw } from 'lucide-react'; // Removido
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import type { Module as ModuleType, Exercise, ExerciseType } from '@/lib/types'; // Adicionado ExerciseType
import { QuickChallengeDisplay } from '@/components/exercises/QuickChallengeDisplay';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from '@/components/ui/label';

type ViewMode = 'byType' | 'byModule' | 'randomChallenge';

// Mapeamento de tipos de exercício para emojis
const exerciseTypeToEmoji: Record<ExerciseType, string> = {
  'multiple-choice': '🔘', // Ou '📻'
  'fill-in-the-blank': '✍️',
  'coding': '💻',
  'association': '🔗',
  'ordering': '🔢',
  'drag-and-drop': '🖐️',
};


export default function ExercisesPage() {
  const [activeViewMode, setActiveViewMode] = useState<ViewMode>('byType');
  const [quickChallengeExercises, setQuickChallengeExercises] = useState<Exercise[]>([]);
  const [isQuickChallengeActive, setIsQuickChallengeActive] = useState(false);
  const [selectedChallengeSize, setSelectedChallengeSize] = useState<string>("3");

  const allModules: (ModuleType & { trilhaTitle: string, trilhaEmoji?: string })[] = useMemo(() => { // Adicionado trilhaEmoji
    return mockRoadmapData.reduce((acc, trilha) => {
      trilha.modules.forEach(module => {
        acc.push({ ...module, trilhaTitle: trilha.title, trilhaEmoji: trilha.emoji }); // Passando emoji da trilha
      });
      return acc;
    }, [] as (ModuleType & { trilhaTitle: string, trilhaEmoji?: string })[]);
  }, []);

  const handleStartQuickChallenge = () => {
    const numberOfQuestions = parseInt(selectedChallengeSize, 10);
    if (isNaN(numberOfQuestions) || numberOfQuestions <= 0) {
        return;
    }
    const shuffledExercises = [...mockExercises].sort(() => 0.5 - Math.random());
    setQuickChallengeExercises(shuffledExercises.slice(0, numberOfQuestions));
    setIsQuickChallengeActive(true);
    setActiveViewMode('randomChallenge');
  };

  const handleFinishQuickChallenge = () => {
    setIsQuickChallengeActive(false);
    setQuickChallengeExercises([]);
    setActiveViewMode('byType');
  };

  // Atualizando exerciseCategories em mockData.ts para incluir emoji
  // Esta parte da lógica deve ser feita no arquivo mockData.ts.
  // Aqui, assumimos que exerciseCategories já tem um campo 'emoji'.
  // Se não tiver, precisará de um mapeamento local ou ajuste em mockData.

  return (
    <div className="container mx-auto py-8">
      {!isQuickChallengeActive && (
        <>
          <header className="mb-8">
            <h1 className="text-4xl font-bold tracking-tight flex items-center">
              <span role="img" aria-label="Alvo" className="text-4xl mr-3">🎯</span> {/* Substituído Target por emoji */}
              Exercícios Práticos
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
              Teste seus conhecimentos e aprimore suas habilidades.
            </p>
          </header>

          <Card className="mb-8 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <span role="img" aria-label="Varinha Mágica" className="text-2xl mr-3">🪄</span> {/* Substituído Wand2 por emoji */}
                Como você gostaria de praticar hoje?
              </CardTitle>
              <CardDescription>
                Escolha um modo de estudo ou explore os exercícios por tipo.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Button
                variant={activeViewMode === 'byType' ? 'default' : 'outline'}
                onClick={() => setActiveViewMode('byType')}
                className="w-full"
              >
                <span role="img" aria-label="Lista de Verificação" className="mr-2">📋</span> {/* Substituído ListChecks */}
                Explorar por Tipo
              </Button>
              <Button
                variant={activeViewMode === 'byModule' ? 'default' : 'outline'}
                onClick={() => setActiveViewMode('byModule')}
                className="w-full"
              >
                <span role="img" aria-label="Cérebro" className="mr-2">🧠</span> {/* Substituído Brain */}
                Prática por Módulo
              </Button>
              <div className="space-y-2">
                 <Label htmlFor="challenge-size" className="text-sm font-medium">Tamanho do Desafio:</Label>
                 <Select value={selectedChallengeSize} onValueChange={setSelectedChallengeSize}>
                    <SelectTrigger id="challenge-size" className="w-full">
                        <SelectValue placeholder="Nº de questões" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="3">3 Questões</SelectItem>
                        <SelectItem value="5">5 Questões</SelectItem>
                        <SelectItem value="10">10 Questões</SelectItem>
                    </SelectContent>
                 </Select>
                <Button
                    variant={activeViewMode === 'randomChallenge' ? 'default' : 'secondary'}
                    onClick={handleStartQuickChallenge}
                    className="w-full"
                >
                    <span role="img" aria-label="Atualizar" className="mr-2">🔄</span> {/* Substituído RefreshCw */}
                    Iniciar Desafio Rápido
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {activeViewMode === 'byType' && !isQuickChallengeActive && (
        <Accordion type="multiple" className="w-full space-y-4" defaultValue={exerciseCategories.length > 0 ? [`category-${exerciseCategories[0].name}`] : []}>
          {exerciseCategories.map((category) => (
            category.exercises.length > 0 && (
              <AccordionItem value={`category-${category.name}`} key={category.name} className="border rounded-lg overflow-hidden shadow-sm bg-card">
                <AccordionTrigger className="px-6 py-4 text-lg font-semibold hover:no-underline hover:bg-muted/50 transition-colors">
                  <div className="flex items-center">
                    {/* Assumindo que exerciseCategories terá um campo emoji */}
                    <span className="text-xl mr-3">{category.emoji || '🧩'}</span>
                    {category.name} ({category.exercises.length})
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6 pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4 border-t">
                    {category.exercises.map((exercise) => (
                      <ExerciseItemCard key={exercise.id} exercise={exercise} categoryName={category.name} />
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )
          ))}
          {exerciseCategories.every(cat => cat.exercises.length === 0) && (
            <p className="text-center text-muted-foreground py-10">
              Nenhuma categoria de exercício disponível no momento.
            </p>
          )}
        </Accordion>
      )}

      {activeViewMode === 'byModule' && !isQuickChallengeActive && (
        <div className="pt-6">
          <h2 className="text-2xl font-semibold mb-6 text-center">Pratique por Módulos das Trilhas</h2>
          {allModules.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allModules.map((module) => {
                return (
                  <Card key={module.id} className="flex flex-col shadow-md hover:shadow-lg transition-shadow">
                    <CardHeader>
                      {module.trilhaEmoji && <span className="text-2xl mb-2 opacity-70">{module.trilhaEmoji}</span>}
                      <CardTitle className="text-xl">{module.title}</CardTitle>
                      <CardDescription>Trilha: {module.trilhaTitle.length > 50 ? module.trilhaTitle.substring(0, 50) + '...' : module.trilhaTitle}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-sm text-muted-foreground">
                        Acesse os exercícios específicos para este módulo.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button asChild className="w-full">
                        <Link href={`/modules/${module.id}/exercises`}>
                          <span role="img" aria-label="Lista de Verificação" className="mr-2">📋</span> {/* Substituído ListChecks */}
                          Praticar Exercícios
                          <span role="img" aria-label="Seta para Direita" className="ml-2">➡️</span> {/* Substituído ArrowRight */}
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-10">
              Nenhum módulo disponível para prática no momento.
            </p>
          )}
        </div>
      )}

      {isQuickChallengeActive && activeViewMode === 'randomChallenge' && (
        <QuickChallengeDisplay
          exercises={quickChallengeExercises}
          onFinish={handleFinishQuickChallenge}
        />
      )}
    </div>
  );
}
