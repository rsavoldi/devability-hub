
// src/app/(main)/page.tsx
import { RoadmapDisplay } from "@/components/roadmap/RoadmapDisplay";
import { Suspense } from 'react';
import { getRoadmapDataFromFirestore } from '@/lib/firebase/roadmap'; // Importar a função
import type { RoadmapStep } from '@/lib/types';

// Esta página agora é um Server Component assíncrono
export default async function HomePage() {
  const initialRoadmapData: RoadmapStep[] = await getRoadmapDataFromFirestore();

  return (
    <div className="w-full">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Trilhas de Conhecimento <span role="img" aria-label="trilhas">🗺️</span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Navegue pelas trilhas e expanda seus conhecimentos sobre desenvolvimento e inclusão.
        </p>
      </header>

      <Suspense fallback={
        <div className="flex justify-center items-center min-h-[300px] w-full">
          <p className="text-lg text-muted-foreground">Carregando trilhas...</p>
        </div>
      }>
        {/* Passa os dados buscados do Firestore para o RoadmapDisplay */}
        <RoadmapDisplay initialRoadmapData={initialRoadmapData} />
      </Suspense>
      
    </div>
  );
}
