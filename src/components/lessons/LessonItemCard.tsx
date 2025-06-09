
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Lesson } from '@/lib/types';
import { Clock, Eye } from 'lucide-react';

interface LessonItemCardProps {
  lesson: Lesson;
  categoryName?: string;
}

export function LessonItemCard({ lesson, categoryName }: LessonItemCardProps) {
  // Primeiro remove todos os comentários HTML, incluindo os interativos
  const contentWithoutComments = lesson.content.replace(/<!--[\s\S]*?-->/g, '');
  // Depois remove a marcação de negrito (**) do conteúdo limpo para o resumo
  const cleanContentSummary = contentWithoutComments.replace(/\*\*(.*?)\*\*/g, '$1');

  return (
    <Card className="flex flex-col h-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="p-4">
        <CardTitle className="text-md font-semibold leading-tight line-clamp-2 min-h-[2.5em]">{lesson.title}</CardTitle>
        {categoryName && <CardDescription className="text-xs text-primary mt-1">{categoryName}</CardDescription>}
      </CardHeader>
      <CardContent className="flex-grow p-4 pt-0 min-h-[4.5em]">
        <p className="text-xs text-muted-foreground line-clamp-3">
          {cleanContentSummary.substring(0, 100)}{cleanContentSummary.length > 100 ? '...' : ''}
        </p>
      </CardContent>
      <CardFooter className="p-3 flex justify-between items-center">
        <div className="flex items-center text-xs text-muted-foreground">
          <Clock className="h-3 w-3 mr-1" />
          {lesson.estimatedTime}
        </div>
        <Button asChild variant="default" size="xs" className="px-2 py-1 h-auto">
          <Link href={`/lessons/${lesson.id}`}>
            <span className="flex items-center">
              <Eye className="h-3 w-3 mr-1" /> Ver
            </span>
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
