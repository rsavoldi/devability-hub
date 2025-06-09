
"use client"; // Adicionado "use client" para hooks e state

import { LessonView } from '@/components/lessons/LessonView';
import { mockLessons } from '@/lib/mockData'; // Usando dados mockados
import type { Lesson } from '@/lib/types';
import { notFound, useParams } from 'next/navigation'; // useParams para client component
import type { Metadata } from 'next'; // Metadata não é usada diretamente em client components dessa forma
import { useEffect, useState } from 'react';

// Metadata para SEO não é gerada dinamicamente assim em client components.
// Isso seria feito em um Server Component pai ou através de outras estratégias.
// Por ora, manteremos a lógica de busca da lição no cliente.

export default function LessonPage() {
  const params = useParams<{ id: string }>(); // Hook para pegar params em Client Component
  const lessonId = params?.id;
  const [lesson, setLesson] = useState<Lesson | null | undefined>(undefined); // undefined para estado inicial

  useEffect(() => {
    if (lessonId) {
      const foundLesson = mockLessons.find(l => l.id === lessonId);
      if (foundLesson) {
        setLesson(foundLesson);
      } else {
        setLesson(null); // Indica que não foi encontrada
      }
    }
  }, [lessonId]);

  if (lesson === undefined) {
    // Ainda carregando ou ID não disponível
    return <div className="text-center py-10">Carregando lição...</div>;
  }

  if (lesson === null) {
    notFound(); // Chama a página not-found do Next.js
  }
  
  // Atualiza o título do documento
  useEffect(() => {
    if (lesson?.title) {
      document.title = `${lesson.title} | DevAbility Hub`;
    } else if (lesson === null) {
      document.title = "Lição Não Encontrada | DevAbility Hub";
    }
  }, [lesson]);


  return <LessonView lesson={lesson} />;
}
