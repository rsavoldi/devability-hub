
// src/app/(main)/page.tsx
"use client"; 

import { RoadmapDisplay } from "@/components/roadmap/RoadmapDisplay";
import { useEffect, useState } from 'react';
import { mockRoadmapData as fallbackRoadmapData } from '@/lib/mockData'; 
import type { RoadmapStep } from '@/lib/types';
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

export default function HomePage() {
  const { userProfile, loading: authLoading } = useAuth();
  const [roadmapData, setRoadmapData] = useState<RoadmapStep[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      const completedModules = userProfile?.completedModules || [];
      const lessonProgress = userProfile?.lessonProgress || {};

      const processedData = fallbackRoadmapData.map(trilha => {
        let allModulesInTrilhaCompleted = true;
        const updatedModules = trilha.modules.map(module => {
          let moduleCompletedBasedOnProfile = userProfile?.completedModules.includes(module.id);
          
          let completedLessonsInModule = 0;
          if (module.lessons && module.lessons.length > 0) {
            completedLessonsInModule = module.lessons.filter(l => lessonProgress[l.id]?.completed).length;
          }
          
          if (!moduleCompletedBasedOnProfile) {
            allModulesInTrilhaCompleted = false;
          }
          
          return {
            ...module,
            isCompleted: moduleCompletedBasedOnProfile,
            progress: module.lessons && module.lessons.length > 0 
                        ? (completedLessonsInModule / module.lessons.length) * 100 
                        : (moduleCompletedBasedOnProfile ? 100 : 0),
          };
        });

        return {
          ...trilha,
          modules: updatedModules,
          isCompleted: allModulesInTrilhaCompleted,
        };
      });
      
      let currentFound = false;
      const finalRoadmapData = processedData.map(trilha => {
        if (!trilha.isCompleted && !currentFound) {
          currentFound = true;
          return { ...trilha, isCurrent: true };
        }
        return { ...trilha, isCurrent: false };
      });

      if (!currentFound && finalRoadmapData.length > 0) {
        finalRoadmapData[finalRoadmapData.length-1].isCurrent = true;
      }

      setRoadmapData(finalRoadmapData);
      setIsLoadingData(false);
    }
  }, [authLoading, userProfile]);

  if (isLoadingData || authLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)] w-full">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg">Carregando trilhas...</p>
      </div>
    );
  }
  
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
      <RoadmapDisplay initialRoadmapData={roadmapData} />
    </div>
  );
}
