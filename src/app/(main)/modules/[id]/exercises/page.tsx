
"use client";

import { use, useEffect, useState } from 'react';
import { mockExercises, mockRoadmapData } from '@/lib/mockData';
import type { Exercise, Module, RoadmapStep, ExerciseType } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { ArrowLeft, Target, ListFilter, CheckSquare } from 'lucide-react'; 
import Link from 'next/link';
import { ExerciseItemCard } from '@/components/exercises/ExerciseItemCard';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ModuleExercisesPageProps {
  params: Promise<{ 
    id: string; 
  }>;
}

const exerciseTypesList: ExerciseType[] = ['multiple-choice', 'fill-in-the-blank', 'association', 'ordering', 'drag-and-drop', 'coding'];
const typeLabels: Record<ExerciseType, string> = {
  'multiple-choice': 'Múltipla Escolha',
  'fill-in-the-blank': 'Preencher Lacunas',
  'association': 'Associação',
  'ordering': 'Ordenação',
  'drag-and-drop': 'Categorização',
  'coding': 'Programação',
};

export default function ModuleExercisesPage({ params: paramsPromise }: ModuleExercisesPageProps) {
  const actualParams = use(paramsPromise); 
  const { id: moduleId } = actualParams; 

  const [module, setModule] = useState<Module | null>(null);
  const [parentTrilha, setParentTrilha] = useState<RoadmapStep | null>(null);
  const [exercisesForModule, setExercisesForModule] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedTypes, setSelectedTypes] = useState<Set<ExerciseType>>(new Set(exerciseTypesList));
  const [numberOfQuestions, setNumberOfQuestions] = useState<string>("all");

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

    if (foundModule) {
      const moduleExs = mockExercises.filter(ex => ex.moduleId === foundModule!.id);
      setExercisesForModule(moduleExs);
    } else {
      setExercisesForModule([]);
    }
    
    setTimeout(() => setIsLoading(false), 300);
  }, [moduleId]); 

  const handleTypeFilterChange = (type: ExerciseType) => {
    setSelectedTypes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(type)) {
        newSet.delete(type);
      } else {
        newSet.add(type);
      }
      return newSet;
    });
  };

  const filteredExercises = exercisesForModule.filter(ex => 
    selectedTypes.has(ex.type)
  ).slice(0, numberOfQuestions === "all" ? undefined : parseInt(numberOfQuestions));


  if (isLoading) {
    return <div className="text-center py-10">Carregando exercícios...</div>;
  }

  if (!module || !parentTrilha) {
    return <div className="text-center py-10">Módulo ou trilha não encontrado.</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <Button variant="outline" asChild className="mb-6">
        <Link href={`/modules/${moduleId}`}> 
          <span className="flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para o Módulo: {module.title}
          </span>
        </Link>
      </Button>

      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight flex items-center">
          <Target className="w-8 h-8 mr-3 text-primary" />
          Exercícios Práticos: {module.title}
        </h1>
        <p className="mt-1 text-md text-muted-foreground">
          Trilha: {parentTrilha.title}
        </p>
      </header>

      <Card className="mb-8 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center"><ListFilter className="mr-2 h-5 w-5 text-primary"/>Filtros de Exercícios</CardTitle>
          <CardDescription>Selecione os tipos e a quantidade de exercícios que deseja praticar.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="font-semibold mb-2 text-sm">Tipos de Exercício:</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {exerciseTypesList.map(type => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={`type-${type}`}
                    checked={selectedTypes.has(type)}
                    onCheckedChange={() => handleTypeFilterChange(type)}
                  />
                  <Label htmlFor={`type-${type}`} className="text-xs sm:text-sm font-normal cursor-pointer">
                    {typeLabels[type]}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          <div>
            <Label htmlFor="num-questions" className="font-semibold text-sm mb-2 block">Quantidade de Questões:</Label>
            <Select value={numberOfQuestions} onValueChange={setNumberOfQuestions}>
              <SelectTrigger id="num-questions" className="w-full md:w-[180px]">
                <SelectValue placeholder="Selecionar quantidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="5">5 Questões</SelectItem>
                <SelectItem value="10">10 Questões</SelectItem>
                <SelectItem value="15">15 Questões</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {filteredExercises.length > 0 ? (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExercises.map((exercise) => (
            <ExerciseItemCard key={exercise.id} exercise={exercise} />
          ))}
        </div>
      ) : (
        <p className="mt-8 text-center text-muted-foreground py-8">
          Nenhum exercício encontrado para os filtros selecionados neste módulo.
        </p>
      )}

      {exercisesForModule.length > 0 && filteredExercises.length > 0 && (
         <div className="mt-12 text-center">
            <Button size="lg">
                <CheckSquare className="mr-2 h-5 w-5"/>
                Finalizar Prática (Não implementado)
            </Button>
            <p className="text-sm text-muted-foreground mt-2">Seu progresso será salvo aqui.</p>
        </div>
      )}
    </div>
  );
}
