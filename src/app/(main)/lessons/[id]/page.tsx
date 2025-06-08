
import { LessonView } from '@/components/lessons/LessonView';

interface LessonPageProps {
  params: Promise<{ // Updated type: params is a Promise
    id: string;
  }>;
}

// Component is now async to allow awaiting params
export default async function LessonPage({ params: paramsPromise }: LessonPageProps) {
  const params = await paramsPromise; // Await the params Promise
  return <LessonView lessonId={params.id} />;
}

// Optional: Generate static paths if you have a fixed set of lessons
// export async function generateStaticParams() {
//   // const lessons = await fetchLessons(); // Fetch your lesson list
//   // return lessons.map(lesson => ({ id: lesson.id }));
//   return []; 
// }
