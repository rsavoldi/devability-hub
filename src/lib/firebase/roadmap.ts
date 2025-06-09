
// src/lib/firebase/roadmap.ts
import { collection, getDocs, query, orderBy, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { RoadmapStep, Module as ModuleType } from '@/lib/types'; // Usando ModuleType para evitar conflito

export async function getRoadmapDataFromFirestore(): Promise<RoadmapStep[]> {
  try {
    const roadmapsQuery = query(collection(db, 'roadmaps'), orderBy('order', 'asc'));
    const roadmapsSnapshot = await getDocs(roadmapsQuery);
    
    const roadmapSteps: RoadmapStep[] = [];

    for (const roadmapDoc of roadmapsSnapshot.docs) {
      const roadmapData = roadmapDoc.data() as Omit<RoadmapStep, 'id' | 'modules'>;
      
      const modulesQuery = query(collection(db, 'roadmaps', roadmapDoc.id, 'modules'), orderBy('order', 'asc'));
      const modulesSnapshot = await getDocs(modulesQuery);
      
      const modules: ModuleType[] = [];
      for (const moduleDoc of modulesSnapshot.docs) {
        // Para os módulos, estamos buscando apenas os metadados, não as lições/exercícios internos aqui.
        // A contagem de lições/exercícios já foi salva durante a migração.
        const moduleData = moduleDoc.data() as Omit<ModuleType, 'id' | 'lessons' | 'exercises'>;
        modules.push({
          id: moduleDoc.id,
          title: moduleData.title,
          order: moduleData.order,
          // lessonCount e exerciseCount virão do Firestore
          lessonCount: (moduleData as any).lessonCount || 0,
          exerciseCount: (moduleData as any).exerciseCount || 0,
          lessons: [], // As lições serão carregadas na página do módulo
          exercises: [], // Os exercícios serão carregados na página do módulo/exercícios
          isCompleted: false, // Será determinado no cliente com base no UserProfile
          progress: 0, // Será determinado no cliente
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
        isCompleted: false, // Será determinado no cliente
        isCurrent: false, // Será determinado no cliente
      });
    }
    return roadmapSteps;
  } catch (error) {
    console.error("Error fetching roadmap data from Firestore:", error);
    return []; // Retorna array vazio em caso de erro para não quebrar a página
  }
}
