
import { LessonView } from '@/components/lessons/LessonView';
import { db } from '@/lib/firebase';
import type { Lesson } from '@/lib/types';
import { doc, getDoc } from 'firebase/firestore';
import { notFound } from 'next/navigation';
import type { Metadata, ResolvingMetadata } from 'next'

interface LessonPageProps {
  params: { // Params não é mais uma Promise aqui, Next.js resolve isso para Server Components
    id: string;
  };
}

async function getLessonFromFirestore(lessonId: string): Promise<Lesson | null> {
  try {
    const lessonDocRef = doc(db, 'lessons', lessonId);
    const lessonDocSnap = await getDoc(lessonDocRef);

    if (lessonDocSnap.exists()) {
      return { id: lessonDocSnap.id, ...lessonDocSnap.data() } as Lesson;
    } else {
      console.warn(`Lesson with ID ${lessonId} not found in Firestore.`);
      return null;
    }
  } catch (error) {
    console.error("Error fetching lesson from Firestore:", error);
    return null;
  }
}

// Metadata para SEO e compartilhamento social
export async function generateMetadata(
  { params }: LessonPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const lesson = await getLessonFromFirestore(params.id);

  if (!lesson) {
    return {
      title: 'Lição Não Encontrada',
      description: 'A lição que você está procurando não foi encontrada.',
    }
  }
  
  const previousImages = (await parent).openGraph?.images || []

  return {
    title: `${lesson.title} | DevAbility Hub`,
    description: lesson.content.substring(0, 160).replace(/\*\*(.*?)\*\*/g, '$1').replace(/<!--.*?-->/g, '').trim() + "...", // Sumário simples
    openGraph: {
      title: lesson.title,
      description: lesson.content.substring(0, 100).replace(/\*\*(.*?)\*\*/g, '$1').replace(/<!--.*?-->/g, '').trim() + "...",
      images: lesson.coverImage ? [lesson.coverImage, ...previousImages] : [...previousImages],
      url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:9002'}/lessons/${lesson.id}`,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: lesson.title,
      description: lesson.content.substring(0, 100).replace(/\*\*(.*?)\*\*/g, '$1').replace(/<!--.*?-->/g, '').trim() + "...",
      images: lesson.coverImage ? [lesson.coverImage] : [],
    },
  }
}


export default async function LessonPage({ params }: LessonPageProps) {
  const lesson = await getLessonFromFirestore(params.id);

  if (!lesson) {
    notFound();
  }

  return <LessonView lesson={lesson} />; // Passa o objeto da lição completo
}

// Opcional: Gerar caminhos estáticos se você tiver um conjunto fixo de lições
// e quiser otimizar o build. Por enquanto, manteremos dinâmico.
// export async function generateStaticParams() {
//   // const lessonsSnapshot = await getDocs(collection(db, 'lessons'));
//   // return lessonsSnapshot.docs.map(doc => ({ id: doc.id }));
//   return [];
// }
