
"use client";

import { useEffect, useState, useMemo, useCallback } from 'react';
import { mockExercises, mockAchievements } from '@/lib/mockData';
import type { Exercise, ExerciseOption, FormedAssociation, Achievement } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, XCircle, Loader2, Send, Link2, Shuffle, MousePointerSquareDashed, PlusCircle, Trash2, ListOrdered, ArrowUpCircle, ArrowDownCircle, Code, Type, Radio as RadioIcon, Puzzle, GripVertical, Star, Trophy } from 'lucide-react';
import { useToast } from "@/hooks/use-toast"
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  UniqueIdentifier,
  useDraggable,
  useDroppable,
  DragStartEvent,
} from '@dnd-kit/core';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import { playSound } from '@/lib/sounds';
import { useAuth } from '@/contexts/AuthContext'; // Import useAuth

interface ExerciseViewProps {
  exerciseId: string;
}

function DraggableItem({ id, children, isSubmitted, isCorrect }: { id: string; children: React.ReactNode; isSubmitted?: boolean; isCorrect?: boolean }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: id,
    disabled: isSubmitted && isCorrect,
  });
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn(
        "p-2 border rounded-md bg-card flex items-center touch-none",
        isDragging && "opacity-50 shadow-lg z-50",
        isSubmitted && isCorrect === true && "bg-green-100 dark:bg-green-900 border-green-500",
        isSubmitted && isCorrect === false && "bg-red-100 dark:bg-red-900 border-red-500",
        isSubmitted && isCorrect && "cursor-not-allowed"
      )}
    >
      <GripVertical className="h-4 w-4 mr-2 text-muted-foreground cursor-grab active:cursor-grabbing" />
      {children}
    </div>
  );
}

function DroppableCategory({ id, children, title }: { id: string; children: React.ReactNode; title: string }) {
  const { isOver, setNodeRef } = useDroppable({
    id: id,
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "p-4 border rounded-lg min-h-[100px] bg-muted/30 transition-colors",
        isOver && "bg-primary/20 border-primary ring-2 ring-primary"
      )}
    >
      <h5 className="font-semibold mb-2 text-center text-sm text-muted-foreground">{title}</h5>
      <div className="space-y-2">
        {children}
      </div>
    </div>
  );
}


export function ExerciseView({ exerciseId }: ExerciseViewProps) {
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userAnswer, setUserAnswer] = useState<string | string[] | Record<string, string> | undefined>(undefined);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const { toast } = useToast();
  const { completeExercise, userProfile, loading: authLoading } = useAuth(); // Get completeExercise from context

  const [itemsA, setItemsA] = useState<ExerciseOption[]>([]);
  const [itemsB, setItemsB] = useState<ExerciseOption[]>([]);
  const [selectedItemA, setSelectedItemA] = useState<string | null>(null);
  const [selectedItemB, setSelectedItemB] = useState<string | null>(null);
  const [formedAssociations, setFormedAssociations] = useState<FormedAssociation[]>([]);

  const [orderedItems, setOrderedItems] = useState<ExerciseOption[]>([]);

  const [unassignedItems, setUnassignedItems] = useState<ExerciseOption[]>([]);
  const [categorizedItemsMap, setCategorizedItemsMap] = useState<Record<string, ExerciseOption[]>>({});
  const [userCategorizations, setUserCategorizations] = useState<Record<string, string>>({});
  const [activeDragId, setActiveDragId] = useState<UniqueIdentifier | null>(null);
  const [itemFeedback, setItemFeedback] = useState<Record<string, boolean>>({});

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const isExerciseAlreadyCompleted = useMemo(() => {
    if (authLoading || !userProfile || !exercise) return false;
    return userProfile.completedExercises.includes(exercise.id);
  }, [userProfile, exercise, authLoading]);


  useEffect(() => {
    setIsLoading(true);
    const foundExercise = mockExercises.find(e => e.id === exerciseId);
    if (foundExercise) {
      setExercise(foundExercise);
      setUserAnswer(undefined);
      setFormedAssociations([]);
      setSelectedItemA(null);
      setSelectedItemB(null);
      setOrderedItems([]);
      setItemFeedback({});
      setUserCategorizations({});
      setUnassignedItems([]);
      setCategorizedItemsMap({});


      if (foundExercise.type === 'association' && foundExercise.options) {
        const colA: ExerciseOption[] = [];
        const colB: ExerciseOption[] = [];
        foundExercise.options.forEach(opt => {
          if (opt.text.toLowerCase().startsWith('coluna a:')) {
            colA.push({ id: opt.id, text: opt.text.replace(/Coluna A:\s*/i, '') });
          } else if (opt.text.toLowerCase().startsWith('coluna b:')) {
            colB.push({ id: opt.id, text: opt.text.replace(/Coluna B:\s*/i, '') });
          }
        });
        setItemsA(colA);
        setItemsB(colB);
      } else if (foundExercise.type === 'ordering' && foundExercise.options) {
        const shuffled = [...foundExercise.options].sort(() => Math.random() - 0.5);
        setOrderedItems(shuffled);
        setUserAnswer(shuffled.map(item => item.id));
      } else if (foundExercise.type === 'drag-and-drop' && foundExercise.options) {
        setUnassignedItems([...foundExercise.options]);
        const initialMap: Record<string, ExerciseOption[]> = {};
        foundExercise.targetCategories?.forEach(cat => initialMap[cat.id] = []);
        setCategorizedItemsMap(initialMap);
        setUserCategorizations({});
      }
    }
    // Se o exercício já foi completado, mostrar como submetido e correto
    if (userProfile && foundExercise && userProfile.completedExercises.includes(foundExercise.id)) {
        setIsSubmitted(true);
        setIsCorrect(true); 
        // Restaurar o estado da resposta correta seria ideal aqui, mas complexo sem salvar a resposta do usuário.
        // Por ora, apenas marcamos como correto se já estiver no perfil.
        // A lógica de mostrar o feedback visual correto para cada tipo precisaria ser mais elaborada
        // se quisermos mostrar a resposta correta salva.
    } else {
        setIsSubmitted(false);
        setIsCorrect(null);
    }
    setTimeout(() => setIsLoading(false), 300);
  }, [exerciseId, userProfile]); // Adicionado userProfile à dependência


  const handleAddAssociation = () => {
    if (isSubmitted && isCorrect) return;
    if (selectedItemA && selectedItemB && exercise) {
      const itemAExists = itemsA.find(item => item.id === selectedItemA);
      const itemBExists = itemsB.find(item => item.id === selectedItemB);

      if (itemAExists && itemBExists) {
        const alreadyAssociatedA = formedAssociations.some(assoc => assoc.itemAId === selectedItemA);
        const alreadyAssociatedB = formedAssociations.some(assoc => assoc.itemBId === selectedItemB);

        if (alreadyAssociatedA || alreadyAssociatedB) {
            toast({
                title: "Item já associado",
                description: "Um ou ambos os itens selecionados já fazem parte de uma associação.",
                variant: "destructive",
            });
            return;
        }

        setFormedAssociations(prev => [
          ...prev,
          {
            itemAId: selectedItemA,
            itemBId: selectedItemB,
            itemAText: itemAExists.text,
            itemBText: itemBExists.text,
          },
        ]);
        setSelectedItemA(null);
        setSelectedItemB(null);
        if(isSubmitted) { setIsSubmitted(false); setIsCorrect(null); }
      }
    }
  };

  const handleRemoveAssociation = (indexToRemove: number) => {
    if (isSubmitted && isCorrect) return;
    setFormedAssociations(prev => prev.filter((_, index) => index !== indexToRemove));
    if(isSubmitted) { setIsSubmitted(false); setIsCorrect(null); }
  };

  const handleMoveItem = (index: number, direction: 'up' | 'down') => {
    if (isSubmitted && isCorrect) return;
    setOrderedItems(prevItems => {
      const newItems = [...prevItems];
      const itemToMove = newItems[index];
      if (direction === 'up' && index > 0) {
        newItems.splice(index, 1);
        newItems.splice(index - 1, 0, itemToMove);
      } else if (direction === 'down' && index < newItems.length - 1) {
        newItems.splice(index, 1);
        newItems.splice(index + 1, 0, itemToMove);
      }
      setUserAnswer(newItems.map(item => item.id));
      if(isSubmitted) { setIsSubmitted(false); setIsCorrect(null); }
      return newItems;
    });
  };

  const handleDragStart = (event: DragStartEvent) => {
    if (isSubmitted && isCorrect) return;
    setActiveDragId(event.active.id);
    if (isSubmitted) { setIsSubmitted(false); setIsCorrect(null); setItemFeedback({}); }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    if (isSubmitted && isCorrect) return;
    setActiveDragId(null);
    const { active, over } = event;

    if (active && over && exercise && exercise.options) {
      const draggedItemId = active.id as string;
      const targetContainerId = over.id as string;

      let itemToMove: ExerciseOption | undefined;
      let newUnassignedItems = [...unassignedItems];
      const newCategorizedItemsMap = { ...categorizedItemsMap };

      // Tenta remover de unassignedItems
      const unassignedIndex = newUnassignedItems.findIndex(item => item.id === draggedItemId);
      if (unassignedIndex > -1) {
        itemToMove = newUnassignedItems[unassignedIndex];
        newUnassignedItems.splice(unassignedIndex, 1);
      } else { // Se não estava em unassigned, procura nas categorias
        Object.keys(newCategorizedItemsMap).forEach(catId => {
          const catIndex = newCategorizedItemsMap[catId].findIndex(item => item.id === draggedItemId);
          if (catIndex > -1) {
            itemToMove = newCategorizedItemsMap[catId][catIndex];
            newCategorizedItemsMap[catId].splice(catIndex, 1);
          }
        });
      }
      
      if (!itemToMove) return;

      // Adiciona ao novo local
      if (targetContainerId === 'unassigned-items-droppable') {
        newUnassignedItems.push(itemToMove);
        const newCategorizations = { ...userCategorizations };
        delete newCategorizations[draggedItemId];
        setUserCategorizations(newCategorizations);
      } else if (exercise.targetCategories?.some(cat => cat.id === targetContainerId)) {
        newCategorizedItemsMap[targetContainerId] = [...(newCategorizedItemsMap[targetContainerId] || []), itemToMove];
        setUserCategorizations(prev => ({ ...prev, [draggedItemId]: targetContainerId }));
      } else {
        newUnassignedItems.push(itemToMove);
        const newCategorizations = { ...userCategorizations };
        delete newCategorizations[draggedItemId];
        setUserCategorizations(newCategorizations);
      }
      setCategorizedItemsMap(newCategorizedItemsMap);
      setUnassignedItems(newUnassignedItems);
      setUserAnswer(userCategorizations); // Mantenha userAnswer atualizado se for usar para submit
    }
  };


  const draggedItem = useMemo(() => {
    if (!activeDragId || !exercise || !exercise.options) return null;
    return unassignedItems.find(i => i.id === activeDragId) ||
           Object.values(categorizedItemsMap).flat().find(i => i.id === activeDragId);
  }, [activeDragId, unassignedItems, categorizedItemsMap, exercise]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!exercise || (isSubmitted && isCorrect) || isExerciseAlreadyCompleted) return; // Não submete se já completou

    let answerProvided = false;
    if (exercise.type === 'association') {
      answerProvided = formedAssociations.length > 0;
    } else if (exercise.type === 'ordering') {
      answerProvided = Array.isArray(userAnswer) && userAnswer.length > 0;
    } else if (exercise.type === 'drag-and-drop') {
      answerProvided = exercise.options ? Object.keys(userCategorizations).length === exercise.options.length : false;
      if (!answerProvided && exercise.options && Object.keys(userCategorizations).length > 0 && Object.keys(userCategorizations).length < exercise.options.length) {
        toast({
          title: "Categorização Incompleta",
          description: "Por favor, categorize todos os itens antes de enviar.",
          variant: "destructive",
        });
        return;
      }
    } else {
      answerProvided = userAnswer !== undefined && userAnswer !== "" && (!Array.isArray(userAnswer) || userAnswer.length > 0);
    }

    if (!answerProvided && exercise.type !== 'coding'){ // Coding pode ser enviado em branco para "concluir" placeholder
        toast({
          title: "Resposta Incompleta",
          description: `Por favor, ${exercise.type === 'drag-and-drop' ? 'categorize todos os itens' : 'forneça uma resposta'} antes de enviar.`,
          variant: "destructive",
        });
        return;
    }

    setIsSubmitted(true);
    setItemFeedback({});
    // await new Promise(resolve => setTimeout(resolve, 500)); // Removido delay desnecessário

    let correct = false;
    let currentItemFeedback: Record<string, boolean> = {};

    if (exercise.type === 'multiple-choice' && typeof exercise.correctAnswer === 'string') {
      correct = userAnswer === exercise.correctAnswer;
    } else if (exercise.type === 'fill-in-the-blank' && typeof exercise.correctAnswer === 'string') {
      const answerToCompare = exercise.options && exercise.options.length > 0 ? userAnswer : (userAnswer as string)?.trim().toLowerCase();
      const correctAnswerToCompare = exercise.options && exercise.options.length > 0 ? exercise.correctAnswer : exercise.correctAnswer.trim().toLowerCase();
      correct = answerToCompare === correctAnswerToCompare;
    } else if (exercise.type === 'association' && typeof exercise.correctAnswer === 'object' && Array.isArray(exercise.correctAnswer)) {
        const correctAnswersArray = exercise.correctAnswer as string[];
        if (formedAssociations.length !== correctAnswersArray.length) {
            correct = false;
        } else {
            const userFormattedAssociations = formedAssociations.map(assoc => `${assoc.itemAId}-${assoc.itemBId}`).sort();
            const correctFormattedAnswers = [...correctAnswersArray].sort();
            correct = userFormattedAssociations.every((val, index) => val === correctFormattedAnswers[index]);
        }
    } else if (exercise.type === 'ordering' && Array.isArray(exercise.correctAnswer) && Array.isArray(userAnswer)) {
        if (userAnswer.length !== exercise.correctAnswer.length) {
            correct = false;
        } else {
            correct = userAnswer.every((val, index) => val === (exercise.correctAnswer as string[])[index]);
        }
    } else if (exercise.type === 'drag-and-drop' && typeof exercise.correctAnswer === 'object' && !Array.isArray(exercise.correctAnswer) && exercise.options) {
        const correctAnswersMap = exercise.correctAnswer as Record<string, string>;
        let allCorrect = true;

        if (Object.keys(userCategorizations).length !== exercise.options.length) {
             allCorrect = false;
        } else {
            for (const itemId of Object.keys(userCategorizations)) {
                 const isItemCorrect = userCategorizations[itemId] === correctAnswersMap[itemId];
                 currentItemFeedback[itemId] = isItemCorrect;
                 if (!isItemCorrect) {
                     allCorrect = false;
                 }
            }
            for (const correctItemId of Object.keys(correctAnswersMap)) {
                if (!userCategorizations[correctItemId]) {
                    allCorrect = false;
                    currentItemFeedback[correctItemId] = false;
                }
            }
        }
        setItemFeedback(currentItemFeedback);
        correct = allCorrect;
    } else if (['coding'].includes(exercise.type)) {
      correct = true; // Placeholder
      toast({
        title: "Exercício de Código Enviado",
        description: "Este tipo de exercício está em construção e será considerado completo por agora.",
        className: "bg-blue-500 dark:bg-blue-700 text-white dark:text-white",
      });
    }

    setIsCorrect(correct);

    if (correct && !isExerciseAlreadyCompleted) {
      await completeExercise(exercise.id); // Chama a função do AuthContext
      // Toasts de pontos e conquistas são tratados pelo AuthContext
    } else if (!correct) {
      toast({
          title: "Incorreto 😕",
          description: "Tente novamente ou verifique o feedback.",
          variant: "destructive",
      });
    } else if (isExerciseAlreadyCompleted && correct) {
        toast({
            title: "Já Concluído!",
            description: "Você já acertou este exercício anteriormente.",
            className: "bg-blue-500 text-white dark:bg-blue-600"
        });
    }
  };


  if (isLoading || authLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!exercise) {
    return <div className="text-center py-10">Exercício não encontrado.</div>;
  }

  const renderExerciseContent = () => {
    switch (exercise.type) {
      case 'multiple-choice':
        return exercise.options && (
          <RadioGroup
            value={userAnswer as string}
            onValueChange={(value) => {
              if (!isSubmitted || (isSubmitted && !isCorrect)) {
                setUserAnswer(value);
                if(isSubmitted) { setIsSubmitted(false); setIsCorrect(null); }
              }
            }}
            disabled={(isSubmitted && isCorrect === true) || isExerciseAlreadyCompleted}
          >
            {exercise.options.map((option: ExerciseOption) => (
              <div key={option.id} className="flex items-center space-x-2 mb-2 p-3 border rounded-md hover:bg-muted/50 has-[[data-state=checked]]:bg-muted">
                <RadioGroupItem value={option.id} id={`ex-${exercise.id}-opt-${option.id}`} />
                <Label htmlFor={`ex-${exercise.id}-opt-${option.id}`} className="flex-1 cursor-pointer">{option.text}</Label>
              </div>
            ))}
          </RadioGroup>
        );
      case 'fill-in-the-blank':
        if (exercise.options && exercise.options.length > 0) {
          return (
            <RadioGroup
              value={userAnswer as string}
              onValueChange={(value) => {
                if (!isSubmitted || (isSubmitted && !isCorrect)) {
                  setUserAnswer(value);
                  if(isSubmitted) { setIsSubmitted(false); setIsCorrect(null); }
                }
              }}
              disabled={(isSubmitted && isCorrect === true) || isExerciseAlreadyCompleted}
              className="space-y-2"
            >
              {exercise.options.map((option: ExerciseOption) => (
                <div key={option.id} className="flex items-center space-x-2 p-3 border rounded-md hover:bg-muted/50 has-[[data-state=checked]]:bg-muted">
                  <RadioGroupItem value={option.text} id={`ex-${exercise.id}-fillopt-${option.id}`} />
                  <Label htmlFor={`ex-${exercise.id}-fillopt-${option.id}`} className="flex-1 cursor-pointer">{option.text}</Label>
                </div>
              ))}
            </RadioGroup>
          );
        }
        return (
          <Input
            type="text"
            value={userAnswer as string || ""}
            onChange={(e) => {
              if (!isSubmitted || (isSubmitted && !isCorrect)) {
                setUserAnswer(e.target.value);
                if(isSubmitted) { setIsSubmitted(false); setIsCorrect(null); }
              }
            }}
            placeholder="Sua resposta aqui..."
            className="text-base"
            disabled={(isSubmitted && isCorrect === true) || isExerciseAlreadyCompleted}
          />
        );
      case 'coding':
        return (
          <div className="bg-muted p-4 rounded-md">
            <div className="flex items-center text-primary-foreground/80 mb-2 bg-primary/80 p-2 rounded-md">
                <Code className="h-5 w-5 mr-2 text-primary-foreground"/>
                <h4 className="font-semibold text-primary-foreground">Exercício de Código (Placeholder)</h4>
            </div>
            <p className="text-sm text-muted-foreground mb-2">Este tipo de exercício está em construção. Envie sua resposta para ser considerada completa.</p>
            <textarea
              className="w-full h-40 p-2 border rounded font-mono text-sm bg-background"
              placeholder="// Seu código aqui"
              onChange={(e) => {
                setUserAnswer(e.target.value);
                if(isSubmitted) { setIsSubmitted(false); setIsCorrect(null); }
              }}
              value={userAnswer as string || ""}
              disabled={(isSubmitted && isCorrect === true) || isExerciseAlreadyCompleted}
            />
          </div>
        );
      case 'association':
        return (
          <div className="space-y-6">
            <div className="flex items-center text-primary-foreground/80 mb-2 bg-primary/80 p-2 rounded-md">
              <Link2 className="h-5 w-5 mr-2 text-primary-foreground"/>
              <h4 className="font-semibold text-primary-foreground">Exercício de Associação</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              Clique em um item da Coluna A e depois em um item da Coluna B para formar um par.
              Em seguida, clique em "Formar Par".
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
              <div>
                <h5 className="font-semibold mb-2 text-center border-b pb-1">Coluna A</h5>
                <div className="space-y-2">
                  {itemsA.map(item => (
                    <Button
                      key={item.id}
                      variant={selectedItemA === item.id ? "default" : "outline"}
                      className={cn("w-full justify-start text-left h-auto py-2 px-3 whitespace-normal",
                                   formedAssociations.some(fa => fa.itemAId === item.id) && "opacity-50 cursor-not-allowed"
                      )}
                      onClick={() => {
                        if (!isSubmitted || (isSubmitted && !isCorrect)) {
                          if (!formedAssociations.some(fa => fa.itemAId === item.id)) setSelectedItemA(item.id);
                        }
                      }}
                      disabled={(isSubmitted && isCorrect === true) || formedAssociations.some(fa => fa.itemAId === item.id) || isExerciseAlreadyCompleted}
                    >
                      {item.text}
                    </Button>
                  ))}
                </div>
              </div>
              <div>
                <h5 className="font-semibold mb-2 text-center border-b pb-1">Coluna B</h5>
                <div className="space-y-2">
                  {itemsB.map(item => (
                    <Button
                      key={item.id}
                      variant={selectedItemB === item.id ? "default" : "outline"}
                      className={cn("w-full justify-start text-left h-auto py-2 px-3 whitespace-normal",
                                   formedAssociations.some(fa => fa.itemBId === item.id) && "opacity-50 cursor-not-allowed"
                      )}
                      onClick={() => {
                        if (!isSubmitted || (isSubmitted && !isCorrect)) {
                          if (!formedAssociations.some(fa => fa.itemBId === item.id)) setSelectedItemB(item.id);
                        }
                      }}
                      disabled={(isSubmitted && isCorrect === true) || formedAssociations.some(fa => fa.itemBId === item.id) || isExerciseAlreadyCompleted}
                    >
                      {item.text}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-center mt-4">
              <Button
                type="button"
                onClick={handleAddAssociation}
                disabled={!selectedItemA || !selectedItemB || (isSubmitted && isCorrect === true) || isExerciseAlreadyCompleted}
                variant="secondary"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Formar Par
              </Button>
            </div>
            {formedAssociations.length > 0 && (
              <div className="mt-6">
                <h5 className="font-semibold mb-2">Pares Formados:</h5>
                <ul className="space-y-2">
                  {formedAssociations.map((assoc, index) => (
                    <li key={index} className="flex items-center justify-between p-2 border rounded-md bg-muted/50 text-sm">
                      <span>{assoc.itemAText} <Link2 className="inline h-3 w-3 mx-1 text-primary"/> {assoc.itemBText}</span>
                      {(!isSubmitted || (isSubmitted && !isCorrect)) && !isExerciseAlreadyCompleted && (
                        <Button variant="ghost" size="icon" onClick={() => handleRemoveAssociation(index)} className="h-6 w-6">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );
      case 'ordering':
        return (
          <div className="space-y-4">
            <div className="flex items-center text-primary-foreground/80 mb-2 bg-primary/80 p-2 rounded-md">
              <ListOrdered className="h-5 w-5 mr-2 text-primary-foreground"/>
              <h4 className="font-semibold text-primary-foreground">Exercício de Ordenação</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              Use os botões para mover os itens para a ordem correta.
            </p>
            <ul className="space-y-2">
              {orderedItems.map((item, index) => (
                <li key={item.id} className="flex items-center justify-between p-3 border rounded-md bg-muted/30 hover:bg-muted/50">
                  <span className="flex-grow">{index + 1}. {item.text}</span>
                  {(!isSubmitted || (isSubmitted && !isCorrect)) && !isExerciseAlreadyCompleted && (
                    <div className="flex gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleMoveItem(index, 'up')}
                        disabled={index === 0 || (isSubmitted && isCorrect === true) || isExerciseAlreadyCompleted}
                        className="h-7 w-7"
                        aria-label={`Mover ${item.text} para cima`}
                      >
                        <ArrowUpCircle className="h-5 w-5" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleMoveItem(index, 'down')}
                        disabled={index === orderedItems.length - 1 || (isSubmitted && isCorrect === true) || isExerciseAlreadyCompleted}
                        className="h-7 w-7"
                        aria-label={`Mover ${item.text} para baixo`}
                      >
                        <ArrowDownCircle className="h-5 w-5" />
                      </Button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        );
      case 'drag-and-drop':
        if (!exercise.options || !exercise.targetCategories) return <p>Configuração de exercício incompleta.</p>;
        return (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToWindowEdges]}
          >
            <div className="space-y-6">
              <div className="flex items-center text-primary-foreground/80 mb-2 bg-primary/80 p-2 rounded-md">
                <MousePointerSquareDashed className="h-5 w-5 mr-2 text-primary-foreground" />
                <h4 className="font-semibold text-primary-foreground">Exercício de Categorização</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Arraste os itens abaixo para as categorias corretas.
              </p>

              <DroppableCategory id="unassigned-items-droppable" title="Itens para Categorizar">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {unassignedItems.map(item => (
                     <DraggableItem
                        key={item.id}
                        id={item.id}
                        isSubmitted={isSubmitted || isExerciseAlreadyCompleted}
                        isCorrect={isSubmitted && itemFeedback[item.id] !== undefined ? itemFeedback[item.id] : (isExerciseAlreadyCompleted ? true : undefined)}
                     >
                      {item.text}
                      {(isSubmitted || isExerciseAlreadyCompleted) && itemFeedback[item.id] !== undefined && (
                          itemFeedback[item.id] || isExerciseAlreadyCompleted ?
                          <CheckCircle className="h-4 w-4 ml-auto text-green-500" /> :
                          <XCircle className="h-4 w-4 ml-auto text-red-500" />
                      )}
                    </DraggableItem>
                  ))}
                  {unassignedItems.length === 0 && <p className="text-xs text-muted-foreground col-span-full text-center">Nenhum item aqui.</p>}
                </div>
              </DroppableCategory>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {exercise.targetCategories.map(category => (
                  <DroppableCategory key={category.id} id={category.id} title={category.text}>
                     <div className="grid grid-cols-1 gap-2">
                        {(categorizedItemsMap[category.id] || []).map(item => (
                          <DraggableItem
                            key={item.id}
                            id={item.id}
                            isSubmitted={isSubmitted || isExerciseAlreadyCompleted}
                            isCorrect={isSubmitted && itemFeedback[item.id] !== undefined ? itemFeedback[item.id] : (isExerciseAlreadyCompleted ? true : undefined)}
                          >
                            {item.text}
                            {(isSubmitted || isExerciseAlreadyCompleted) && itemFeedback[item.id] !== undefined && (
                                itemFeedback[item.id] || isExerciseAlreadyCompleted ?
                                <CheckCircle className="h-4 w-4 ml-auto text-green-500" /> :
                                <XCircle className="h-4 w-4 ml-auto text-red-500" />
                            )}
                          </DraggableItem>
                        ))}
                        {(categorizedItemsMap[category.id] || []).length === 0 && <p className="text-xs text-muted-foreground text-center">Arraste itens para esta categoria.</p>}
                      </div>
                  </DroppableCategory>
                ))}
              </div>
            </div>
            <DragOverlay>
              {activeDragId && draggedItem ? (
                <div className="p-2 border rounded-md bg-popover shadow-md flex items-center">
                  <GripVertical className="h-4 w-4 mr-2 text-muted-foreground" />
                  {draggedItem.text}
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        );
      default:
        return (
            <div className="bg-muted p-4 rounded-md">
                 <div className="flex items-center text-primary-foreground/80 mb-2 bg-yellow-500/80 p-2 rounded-md">
                    <Puzzle className="h-5 w-5 mr-2 text-primary-foreground"/>
                    <h4 className="font-semibold text-primary-foreground">Tipo de Exercício Desconhecido</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                    Este tipo de exercício ({exercise.type}) não é suportado ou está em construção.
                </p>
            </div>
        );
    }
  };

  const allowRetry = isSubmitted && !isCorrect && !isExerciseAlreadyCompleted;
  const buttonText = isLoading && isSubmitted ? "Verificando..." :
                     isExerciseAlreadyCompleted ? "Já Concluído" :
                     (isSubmitted && isCorrect === true && exercise.type !== 'coding') ? "Correto!" :
                     allowRetry ? "Tentar Novamente" : "Enviar Resposta";


  return (
    <div className="max-w-2xl mx-auto py-8">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{exercise.title}</CardTitle>
          <CardDescription>
            Tipo: <span className="capitalize">{exercise.type.replace(/-/g, ' ')}</span> | Pontos: {exercise.points} | Tempo Estimado: {exercise.estimatedTime}
            {isExerciseAlreadyCompleted && <Badge variant="default" className="ml-2 bg-green-500">Concluído</Badge>}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <p className="text-lg mb-6">{exercise.question}</p>
            {renderExerciseContent()}
            {isSubmitted && isCorrect !== null && exercise.type !== 'coding' && exercise.type !== 'drag-and-drop' && !isExerciseAlreadyCompleted && (
              <Alert variant={isCorrect ? "default" : "destructive"} className={`mt-6 ${isCorrect ? 'border-green-500 bg-green-50 dark:bg-green-900/30' : 'border-red-500 bg-red-50 dark:bg-red-900/30'}`}>
                {isCorrect ? <CheckCircle className="h-5 w-5 text-green-600" /> : <XCircle className="h-5 w-5 text-red-600" />}
                <AlertTitle className={isCorrect ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}>{isCorrect ? "Correto!" : "Incorreto"}</AlertTitle>
                <AlertDescription className={isCorrect ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}>
                  {exercise.feedback}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="w-full"
              disabled={(isSubmitted && isCorrect === true && exercise.type !== 'coding') || isExerciseAlreadyCompleted}
            >
              {isLoading && isSubmitted ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
              {buttonText}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
