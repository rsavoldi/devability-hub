
"use client"; 

import { LessonView } from '@/components/lessons/LessonView';
import { mockLessons } from '@/lib/mockData'; 
import type { Lesson } from '@/lib/types';
import { notFound, useParams } from 'next/navigation'; 
import { useEffect, useState } from 'react';
import { LessonUiProvider } from '@/contexts/LessonUiContext';

export default function LessonPage() {
  const params = useParams<{ id: string }>(); 
  const lessonId = params?.id;
  const [lesson, setLesson] = useState<Lesson | null | undefined>(undefined); 

  useEffect(() => {
    if (lessonId) {
      const foundLesson = mockLessons.find(l => l.id === lessonId);
      if (foundLesson) {
        setLesson(foundLesson);
        document.title = `${foundLesson.title} | DevAbility Hub`;
      } else {
        setLesson(null);
        document.title = "Lição Não Encontrada | DevAbility Hub";
      }
    } else {
      document.title = "Carregando Lição | DevAbility Hub";
    }
  }, [lessonId]);

  if (lesson === undefined) { 
    return <div className="text-center py-10">Carregando lição...</div>;
  }

  if (lesson === null) { 
    notFound(); 
  }
  
  return (
    <LessonUiProvider>
      <LessonView lesson={lesson} />
    </LessonUiProvider>
  );
}
