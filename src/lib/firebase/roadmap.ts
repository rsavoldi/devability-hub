
// src/lib/firebase/roadmap.ts
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { RoadmapStep, Module as ModuleType } from '@/lib/types';
import { mockRoadmapData as fallbackRoadmapData } from '@/lib/mockData'; // Importando os dados mockados

export async function getRoadmapDataFromFirestore(): Promise<RoadmapStep[]> {
  try {
    const roadmapsQuery = query(collection(db, 'roadmaps'), orderBy('order', 'asc'));
    const roadmapsSnapshot = await getDocs(roadmapsQuery);
    
    if (roadmapsSnapshot.empty) {
      console.warn("Nenhuma trilha encontrada no Firestore. Retornando dados mockados.");
      return fallbackRoadmapData;
    }
    
    const roadmapSteps: RoadmapStep[] = [];

    for (const roadmapDoc of roadmapsSnapshot.docs) {
      const roadmapData = roadmapDoc.data() as Omit<RoadmapStep, 'id' | 'modules'>;
      
      const modulesQuery = query(collection(db, 'roadmaps', roadmapDoc.id, 'modules'), orderBy('order', 'asc'));
      const modulesSnapshot = await getDocs(modulesQuery);
      
      const modules: ModuleType[] = [];
      for (const moduleDoc of modulesSnapshot.docs) {
        const moduleData = moduleDoc.data() as Omit<ModuleType, 'id' | 'lessons' | 'exercises'>;
        modules.push({
          id: moduleDoc.id,
          title: moduleData.title,
          order: moduleData.order,
          lessonCount: (moduleData as any).lessonCount || 0,
          exerciseCount: (moduleData as any).exerciseCount || 0,
          lessons: [], 
          exercises: [], 
          isCompleted: false, 
          progress: 0, 
        });
      }

      roadmapSteps.push({
        id: roadmapDoc.id,
        title: roadmapData.title,
        order: roadmapData.order,
        emoji: roadmapData.emoji,
        iconName: roadmapData.iconName,
        description: roadmapData.description,
        modules,
        isCompleted: false, 
        isCurrent: false, 
      });
    }
    return roadmapSteps;
  } catch (error) {
    console.error("Erro ao buscar dados do roadmap do Firestore:", error);
    console.warn("Retornando dados mockados devido a erro na busca do Firestore.");
    // Em caso de erro (ex: permissão negada para não logados), retorna os dados mockados.
    // Em um ambiente de produção, você pode querer tratar isso de forma diferente
    // ou garantir que as regras do Firestore permitam leitura pública.
    return fallbackRoadmapData;
  }
}

