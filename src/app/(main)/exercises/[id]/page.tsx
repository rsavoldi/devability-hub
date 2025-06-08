
import { ExerciseView } from '@/components/exercises/ExerciseView';

interface ExercisePageProps {
  params: Promise<{ // Updated type: params is a Promise
    id: string;
  }>;
}

// Component is now async to allow awaiting params
export default async function ExercisePage({ params: paramsPromise }: ExercisePageProps) {
  const params = await paramsPromise; // Await the params Promise
  return <ExerciseView exerciseId={params.id} />;
}

// Optional: Generate static paths if you have a fixed set of exercises
// export async function generateStaticParams() {
//   // const exercises = await fetchExercises(); // Fetch your exercise list
//   // return exercises.map(exercise => ({ id: exercise.id }));
//   return [];
// }
