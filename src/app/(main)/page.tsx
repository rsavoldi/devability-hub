// src/app/(main)/page.tsx

import { RoadmapDisplay } from "@/components/roadmap/RoadmapDisplay";
import { Suspense } from 'react';

export default function HomePage() {
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

      {/* 
        O Suspense mostra uma mensagem de "carregando" enquanto o RoadmapDisplay, 
        que agora pode buscar dados no servidor, faz seu trabalho.
        É uma boa prática para uma melhor experiência do usuário.
      */}
      <Suspense fallback={
        <div className="flex justify-center items-center min-h-[300px] w-full">
          <p className="text-lg text-muted-foreground">Carregando trilhas...</p>
        </div>
      }>
        <RoadmapDisplay />
      </Suspense>
      
    </div>
  );
}