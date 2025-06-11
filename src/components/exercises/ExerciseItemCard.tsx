
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Exercise, ExerciseType } from '@/lib/types';
import { Clock } from 'lucide-react'; // Zap removido
import { Badge } from '@/components/ui/badge';

interface ExerciseItemCardProps {
  exercise: Exercise;
  categoryName?: string;
}

const getExerciseEmoji = (type: ExerciseType): string => {
  switch (type) {
    case 'multiple-choice': return '🔘'; // Ou '📻'
    case 'fill-in-the-blank': return '✍️';
    case 'coding': return '💻';
    case 'association': return '🔗';
    case 'ordering': return '🔢';
    case 'drag-and-drop': return '🖐️';
    default: return '🧩';
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
  const emoji = getExerciseEmoji(exercise.type);

  return (
    <Card className="flex flex-col h-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-semibold mb-1 line-clamp-2">{exercise.title}</CardTitle>
          <Badge variant="outline" className="capitalize flex items-center whitespace-nowrap">
            <span className="mr-2 text-lg">{emoji}</span>
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
              <span role="img" aria-label="Praticar" className="mr-2">⚡</span> {/* Substituído Zap por emoji */}
              Praticar
            </span>
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
