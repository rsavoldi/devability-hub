
// scripts/migrateRoadmaps.ts
import * as admin from 'firebase-admin';
// LEIA O ARQUIVO JSON PURO GERADO ANTERIORMENTE
import migrationData from './data-for-migration.json'; 
import type { RoadmapStep, Module as ModuleType } from '../src/lib/types'; // Tipos ainda podem ser úteis para type assertion

// Configuração do Firebase Admin (ajuste o caminho para seu arquivo de credenciais)
const serviceAccount = require('../devability-hub-ppi4m-firebase-adminsdk-fbsvc-5ce82fb95b.json');

try {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: "https://devability-hub-ppi4m.firebaseio.com"
    });
  }
} catch (e) {
  if ((e as any).code !== 'app/duplicate-app') {
    console.error('Erro de inicialização do Firebase:', e);
    process.exit(1);
  }
}

const db = admin.firestore();
const BATCH_LIMIT = 400;

async function migrateRoadmaps() {
  console.log('Iniciando migração de Trilhas (Roadmaps) e Módulos a partir do JSON...');

  let batch = db.batch();
  let operationsInBatch = 0;
  let stats = { roadmaps: 0, modules: 0 };

  const commitBatchIfNeeded = async () => {
    if (operationsInBatch >= BATCH_LIMIT) {
      console.log(`Enviando lote de ${operationsInBatch} operações...`);
      await batch.commit();
      batch = db.batch();
      operationsInBatch = 0;
    }
  };

  // Os dados do JSON já devem estar na ordem correta se generate-data-json.ts respeitou 'order'
  // Se não, podemos ordenar aqui também:
  const sortedRoadmapData = [...(migrationData as RoadmapStep[])].sort((a, b) => (a.order ?? Infinity) - (b.order ?? Infinity));


  for (const roadmap of sortedRoadmapData) {
    const roadmapRef = db.collection('roadmaps').doc(roadmap.id);
    
    // A estrutura do roadmap vindo do JSON já é "pura"
    // e o script generate-data-json.ts deve ter tratado a transformação do ícone.
    // O 'iconName' já deve ser uma string no roadmap.
    // Removendo modules para salvar o documento principal da trilha
    const { modules, icon, ...roadmapDataToSave } = roadmap; 

    batch.set(roadmapRef, {
      ...roadmapDataToSave,
      iconName: roadmap.iconName || roadmap.icon, // Prioriza iconName, mas usa icon se iconName não estiver lá (fallback)
      order: roadmap.order ?? 0,
    });
    operationsInBatch++;
    stats.roadmaps++;
    await commitBatchIfNeeded();

    if (modules && Array.isArray(modules)) {
      const sortedModules = [...(modules as ModuleType[])].sort((a, b) => (a.order ?? Infinity) - (b.order ?? Infinity));

      for (const module of sortedModules) {
        const moduleRef = roadmapRef.collection('modules').doc(module.id);
        // O módulo vindo do JSON também deve ser "puro"
        const { lessons, exercises, roadmapIcon, ...moduleDataToSave } = module;
        
        const lessonCount = lessons ? lessons.length : 0;
        const exerciseCount = exercises ? exercises.length : 0;

        batch.set(moduleRef, {
          ...moduleDataToSave,
          lessonCount,
          exerciseCount,
          order: module.order ?? 0,
        });
        operationsInBatch++;
        stats.modules++;
        await commitBatchIfNeeded();
      }
    }
  }

  if (operationsInBatch > 0) {
    console.log(`Enviando lote final de ${operationsInBatch} operações...`);
    await batch.commit();
  }

  console.log('--- Migração de Trilhas e Módulos Concluída! ---');
  console.log(`Trilhas (Roadmaps) migradas: ${stats.roadmaps}`);
  console.log(`Módulos migrados: ${stats.modules}`);
  console.log('Verifique suas coleções no console do Firebase.');
}

migrateRoadmaps().catch(error => {
  console.error('Erro catastrófico durante a migração de roadmaps:', error);
  process.exit(1);
});
