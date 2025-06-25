
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Lesson } from '@/lib/types';
import { Clock, Eye } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface LessonItemCardProps {
  lesson: Lesson;
  categoryName?: string;
  progress?: number;
}

export function LessonItemCard({ lesson, categoryName, progress = 0 }: LessonItemCardProps) {
  const contentWithoutComments = lesson.content.replace(/<!--[\s\S]*?-->/g, '');
  const cleanContentSummary = contentWithoutComments.replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*(.*?)\*/g, '$1');

  return (
    <Card className={cn(
      "flex flex-col h-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300",
      progress === 100 && "border-green-500/50 bg-green-50 dark:bg-green-900/20"
    )}>
      <CardHeader className="p-4">
        <CardTitle className="text-md font-semibold leading-tight line-clamp-2 min-h-[2.5em]">{lesson.title}</CardTitle>
        {categoryName && <CardDescription className="text-xs text-primary mt-1">{categoryName}</CardDescription>}
      </CardHeader>
      <CardContent className="flex-grow p-4 pt-0 min-h-[4.5em]">
        <p className="text-xs text-muted-foreground line-clamp-3">
          {cleanContentSummary.substring(0, 100)}{cleanContentSummary.length > 100 ? '...' : ''}
        </p>
      </CardContent>
      <CardFooter className="p-3 flex flex-col items-stretch gap-2">
        {progress > 0 && progress < 100 && (
          <div className="w-full px-1">
             <Progress value={progress} className="h-1.5" />
          </div>
        )}
        <div className="flex justify-between items-center w-full">
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
        </div>
      </CardFooter>
    </Card>
  );
}
