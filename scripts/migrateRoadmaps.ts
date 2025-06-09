
// scripts/migrateRoadmaps.ts
import * as admin from 'firebase-admin';
import { mockRoadmapData } from '../src/lib/mockData'; // Ajuste o caminho se necessário
import type { RoadmapStep, Module as ModuleType } from '../src/lib/types';

// Configuração do Firebase Admin (ajuste o caminho para seu arquivo de credenciais)
const serviceAccount = require('../../devability-hub-ppi4m-firebase-adminsdk-fbsvc-5ce82fb95b.json');

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
  console.log('Iniciando migração de Trilhas (Roadmaps) e Módulos...');

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

  // Ordena as trilhas pela propriedade 'order' antes de migrar
  const sortedRoadmapData = [...mockRoadmapData].sort((a, b) => (a.order ?? Infinity) - (b.order ?? Infinity));

  for (const roadmap of sortedRoadmapData) {
    const roadmapRef = db.collection('roadmaps').doc(roadmap.id);
    // Excluímos 'modules' e 'icon' (o componente React) dos dados da trilha a serem salvos.
    // Garantimos que 'iconName' e 'order' estejam presentes.
    const { modules, icon, ...roadmapDataToSave } = roadmap; 
    
    batch.set(roadmapRef, {
      ...roadmapDataToSave,
      iconName: roadmap.iconName || '', // Garante que iconName seja salvo
      order: roadmap.order ?? 0, // Garante que order seja salvo
    });
    operationsInBatch++;
    stats.roadmaps++;
    await commitBatchIfNeeded();

    if (modules && Array.isArray(modules)) {
      // Ordena os módulos pela propriedade 'order' antes de migrar
      const sortedModules = [...modules].sort((a, b) => (a.order ?? Infinity) - (b.order ?? Infinity));

      for (const module of sortedModules) {
        const moduleRef = roadmapRef.collection('modules').doc(module.id);
        // Excluímos 'lessons', 'exercises' e 'roadmapIcon' (se existir) dos dados do módulo.
        const { lessons, exercises, roadmapIcon, ...moduleDataToSave } = module;
        
        const lessonCount = lessons ? lessons.length : 0;
        const exerciseCount = exercises ? exercises.length : 0;

        batch.set(moduleRef, {
          ...moduleDataToSave,
          lessonCount,
          exerciseCount,
          order: module.order ?? 0, // Garante que order seja salvo
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
