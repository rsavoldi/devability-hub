
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
        // Atualiza o título do documento AQUI, quando a lição é encontrada
        document.title = `${foundLesson.title} | DevAbility Hub`;
      } else {
        setLesson(null);
        // Atualiza o título do documento AQUI, quando a lição não é encontrada
        document.title = "Lição Não Encontrada | DevAbility Hub";
      }
    } else {
      // Define um título padrão ou de carregamento se não houver lessonId ainda
      document.title = "Carregando Lição | DevAbility Hub";
    }
  }, [lessonId]); // A dependência é lessonId, pois lesson e document.title são atualizados com base nele

  if (lesson === undefined) { 
    return <div className="text-center py-10">Carregando lição...</div>;
  }

  if (lesson === null) { 
    notFound(); 
  }
  
  return <LessonView lesson={lesson} />;
}
