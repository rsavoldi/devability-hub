
"use client"; 

import { LessonView } from '@/components/lessons/LessonView';
import { mockLessons } from '@/lib/mockData'; 
import type { Lesson } from '@/lib/types';
import { notFound, useParams } from 'next/navigation'; 
import { useEffect, useState } from 'react';

export default function LessonPage() {
  const params = useParams<{ id: string }>(); 
  const lessonId = params?.id;
  const [lesson, setLesson] = useState<Lesson | null | undefined>(undefined); 

  useEffect(() => {
    if (lessonId) {
      const foundLesson = mockLessons.find(l => l.id === lessonId);
      if (foundLesson) {
        setLesson(foundLesson);
        if (typeof window !== 'undefined') {
          document.title = `${foundLesson.title} | DevAbility Hub`;
        }
      } else {
        setLesson(null);
        if (typeof window !== 'undefined') {
          document.title = "Lição Não Encontrada | DevAbility Hub";
        }
      }
    } else {
      if (typeof window !== 'undefined') {
        document.title = "Carregando Lição | DevAbility Hub";
      }
    }
  }, [lessonId]);

  if (lesson === undefined) { 
    return <div className="text-center py-10">Carregando lição...</div>;
  }

  if (lesson === null) { 
    notFound(); 
  }
  
  return <LessonView lesson={lesson} />;
}
