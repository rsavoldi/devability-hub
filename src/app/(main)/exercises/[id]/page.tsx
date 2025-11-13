// src/app/(main)/exercises/[id]/page.tsx
"use client";

import { use } from 'react';
import { ExerciseView } from '@/components/exercises/ExerciseView';

interface ExercisePageProps {
  params: Promise<{ // Updated type: params is a Promise
    id: string;
  }>;
}

// Component is now a client component
export default function ExercisePage({ params: paramsPromise }: ExercisePageProps) {
  const params = use(paramsPromise); // Await the params Promise using the `use` hook
  return <ExerciseView exerciseId={params.id} />;
}
