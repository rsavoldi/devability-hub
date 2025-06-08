
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Exercise, ExerciseType } from '@/lib/types';
import { Clock, Zap, Puzzle, Radio, Type, Code, Link2, ListOrdered, MousePointerSquareDashed } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ExerciseItemCardProps {
  exercise: Exercise;
  categoryName?: string;
}

const getExerciseIcon = (type: ExerciseType) => {
  switch (type) {
    case 'multiple-choice': return <Radio className="h-4 w-4 mr-2" />;
    case 'fill-in-the-blank': return <Type className="h-4 w-4 mr-2" />;
    case 'coding': return <Code className="h-4 w-4 mr-2" />;
    case 'association': return <Link2 className="h-4 w-4 mr-2" />;
    case 'ordering': return <ListOrdered className="h-4 w-4 mr-2" />;
    case 'drag-and-drop': return <MousePointerSquareDashed className="h-4 w-4 mr-2" />;
    default: return <Puzzle className="h-4 w-4 mr-2" />;
  }
}

const getExerciseTypeLabel = (type: ExerciseType): string => {
  const labels: Record<ExerciseType, string> = {
    'multiple-choice': 'Múltipla Escolha',
    'fill-in-the-blank': 'Preencher Lacunas',
    'coding': 'Programação',
    'association': 'Associação',
    'ordering': 'Ordenação',
    'drag-and-drop': 'Categorização',
  };
  return labels[type] || type.replace('-', ' ');
}


export function ExerciseItemCard({ exercise, categoryName }: ExerciseItemCardProps) {
  return (
    <Card className="flex flex-col h-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-semibold mb-1 line-clamp-2">{exercise.title}</CardTitle>
          <Badge variant="outline" className="capitalize flex items-center whitespace-nowrap">
            {getExerciseIcon(exercise.type)}
            {getExerciseTypeLabel(exercise.type)}
          </Badge>
        </div>
        {categoryName && <CardDescription className="text-primary">{categoryName}</CardDescription>}
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-3"> 
          {exercise.question}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="h-4 w-4 mr-1" />
          {exercise.estimatedTime} • {exercise.points} pts
        </div>
        <Button asChild variant="default" size="sm">
          <Link href={`/exercises/${exercise.id}`}>
            <span className="flex items-center">
              <Zap className="h-4 w-4 mr-2" /> Praticar
            </span>
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
