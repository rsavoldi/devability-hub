// scripts/migrateRoadmaps.ts
import * as admin from 'firebase-admin';
import { mockRoadmapData } from '../src/lib/mockData'; // Ajuste o caminho se necessário
import type { RoadmapStep as RoadmapStepType, Module as ModuleType, Lesson as LessonType } from '../src/lib/types'; // Ajuste o caminho

// ----- INÍCIO DA CONFIGURAÇÃO -----
const serviceAccount = require('../serviceAccountKey.json'); // Ajuste o caminho para sua chave

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const ROADMAPS_COLLECTION_NAME = 'roadmaps';
const roadmapsCollection = db.collection(ROADMAPS_COLLECTION_NAME);
// ----- FIM DA CONFIGURAÇÃO -----

interface RoadmapStepFirestoreData extends Omit<RoadmapStepType, 'modules' | 'icon'> {
  iconName?: string; // Para armazenar o nome do ícone, se você usar strings
  order: number;
}

interface ModuleFirestoreData extends Omit<ModuleType, 'lessons' | 'exercises'> {
  order: number;
  lessonCount: number; // Para facilitar a exibição
  exerciseCount: number; // Para facilitar a exibição
}

async function migrateRoadmapsAndModules() {
  console.log('Iniciando migração de trilhas (roadmaps) e módulos...');
  let roadmapsMigratedCount = 0;
  let modulesMigratedCount = 0;
  
  const BATCH_LIMIT = 400;
  let batch = db.batch();
  let operationsInBatch = 0;

  for (let i = 0; i < mockRoadmapData.length; i++) {
    const roadmap = mockRoadmapData[i];

    if (!roadmap.id || !roadmap.title) {
        console.warn(`Trilha sem ID ou título. Índice: ${i}. Pulando.`);
        continue;
    }

    const roadmapData: RoadmapStepFirestoreData = {
      id: roadmap.id,
      title: roadmap.title,
      description: roadmap.description,
      emoji: roadmap.emoji || '',
      iconName: roadmap.iconName || (typeof roadmap.icon === 'string' ? roadmap.icon : roadmap.icon?.displayName) || '',
      order: roadmap.order !== undefined ? roadmap.order : i + 1,
      isCompleted: roadmap.isCompleted || false,
      isCurrent: roadmap.isCurrent || false,
    };

    const roadmapRef = roadmapsCollection.doc(roadmap.id);
    batch.set(roadmapRef, roadmapData);
    operationsInBatch++;
    roadmapsMigratedCount++;

    if (roadmap.modules && roadmap.modules.length > 0) {
      const modulesSubcollection = roadmapRef.collection('modules');
      for (let j = 0; j < roadmap.modules.length; j++) {
        const module = roadmap.modules[j];

        if (!module.id || !module.title) {
            console.warn(`Módulo sem ID ou título na trilha "${roadmap.title}". Índice: ${j}. Pulando.`);
            continue;
        }
        
        // Contar lições e exercícios para o módulo (opcional, mas pode ser útil)
        const lessonCount = module.lessons ? module.lessons.length : 0;
        const exerciseCount = module.exercises ? module.exercises.length : 0;


        const moduleData: ModuleFirestoreData = {
          id: module.id,
          title: module.title,
          order: module.order !== undefined ? module.order : j + 1,
          isCompleted: module.isCompleted || false,
          progress: module.progress || 0,
          lessonCount: lessonCount,
          exerciseCount: exerciseCount,
        };
        const moduleRef = modulesSubcollection.doc(module.id);
        batch.set(moduleRef, moduleData);
        operationsInBatch++;
        modulesMigratedCount++;

        if (operationsInBatch >= BATCH_LIMIT) {
          console.log(`Enviando lote de ${operationsInBatch} operações (trilhas/módulos)...`);
          await batch.commit();
          batch = db.batch();
          operationsInBatch = 0;
        }
      }
    }

    if (operationsInBatch >= BATCH_LIMIT) {
        console.log(`Enviando lote de ${operationsInBatch} operações (trilhas/módulos)...`);
        await batch.commit();
        batch = db.batch();
        operationsInBatch = 0;
    }
  }

  if (operationsInBatch > 0) {
    console.log(`Enviando lote final de ${operationsInBatch} operações (trilhas/módulos)...`);
    await batch.commit();
  }

  console.log(`Migração concluída! ${roadmapsMigratedCount} trilhas e ${modulesMigratedCount} módulos foram processados.`);
  console.log(`Verifique as coleções '${ROADMAPS_COLLECTION_NAME}' e suas subcoleções 'modules' no console do Firebase.`);
}

migrateRoadmapsAndModules().catch(error => {
  console.error('Erro durante a migração de trilhas e módulos:', error);
  process.exit(1);
});
