
// scripts/migrateRoadmaps.ts
import * as admin from 'firebase-admin';
// LEIA O ARQUIVO JSON PURO GERADO ANTERIORMENTE
import migrationData from './data-for-migration.json'; 
// Tipos são usados para dar forma aos dados lidos do JSON, mas não para importar componentes
import type { RoadmapStep as AppRoadmapStep, Module as AppModuleType } from '../src/lib/types'; 

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

// Define interfaces locais que refletem a estrutura esperada do JSON
interface JsonRoadmapStep {
  id: string;
  title: string;
  order?: number;
  emoji?: string;
  iconName?: string; // Esperamos que o JSON tenha iconName como string
  description: string;
  modules: JsonModule[];
  isCompleted?: boolean;
  isCurrent?: boolean;
}

interface JsonModule {
  id: string;
  title: string;
  order?: number;
  lessonCount?: number;
  exerciseCount?: number;
  lessons: any[]; // Não precisamos do tipo completo de Lesson aqui
  exercises: any[]; // Não precisamos do tipo completo de Exercise aqui
  isCompleted?: boolean;
  progress?: number;
}


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
  // Se não, podemos ordenar aqui também.
  // O TypeScript agora entende que migrationData é um array de 'any' por padrão ao ler JSON.
  // Fazemos um type assertion para JsonRoadmapStep[]
  const typedMigrationData = migrationData as JsonRoadmapStep[];
  const sortedRoadmapData = [...typedMigrationData].sort((a, b) => (a.order ?? Infinity) - (b.order ?? Infinity));


  for (const roadmap of sortedRoadmapData) {
    const roadmapRef = db.collection('roadmaps').doc(roadmap.id);
    
    // Desestrutura 'modules' e 'iconName' para salvar o resto dos dados da trilha
    // 'iconName' já é uma string do JSON. O campo 'icon' (componente) não deve mais estar no JSON.
    const { modules, iconName: roadmapIconName, ...roadmapDataToSave } = roadmap; 

    batch.set(roadmapRef, {
      ...roadmapDataToSave, // title, description, emoji, order, etc.
      iconName: roadmapIconName || "", // Salva a string do nome do ícone, ou string vazia se não existir
    });
    operationsInBatch++;
    stats.roadmaps++;
    await commitBatchIfNeeded();

    if (modules && Array.isArray(modules)) {
      const typedModules = modules as JsonModule[];
      const sortedModules = [...typedModules].sort((a, b) => (a.order ?? Infinity) - (b.order ?? Infinity));

      for (const module of sortedModules) {
        const moduleRef = roadmapRef.collection('modules').doc(module.id);
        // Desestrutura para remover lessons e exercises que não serão salvos no documento do módulo
        const { lessons, exercises, ...moduleDataToSave } = module;
        
        batch.set(moduleRef, {
          ...moduleDataToSave, // title, order, etc.
          lessonCount: module.lessonCount || 0, // Usa o valor do JSON ou 0
          exerciseCount: module.exerciseCount || 0, // Usa o valor do JSON ou 0
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
