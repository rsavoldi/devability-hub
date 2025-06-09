// NOVO ARQUIVO ÚNICO: scripts/migrateAll.ts

import * as admin from 'firebase-admin';
// LEIA O ARQUIVO JSON PURO GERADO ANTERIORMENTE
import migrationData from './data-for-migration.json';

// ----- INÍCIO DA CONFIGURAÇÃO -----
const serviceAccount = require('../devability-hub-ppi4m-firebase-adminsdk-fbsvc-5ce82fb95b.json');

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://devability-hub-ppi4m.firebaseio.com"
  });
} catch (e) {
  if ((e as any).code !== 'app/duplicate-app') {
    console.error('Erro de inicialização do Firebase:', e);
  }
}

const db = admin.firestore();
const BATCH_LIMIT = 400; // Limite de operações por lote
// ----- FIM DA CONFIGURAÇÃO -----

async function migrateAllData() {
  console.log('Iniciando migração completa de Trilhas, Módulos, Lições e Exercícios...');

  let batch = db.batch();
  let operationsInBatch = 0;
  let stats = { roadmaps: 0, modules: 0, lessons: 0, exercises: 0 };

  const commitBatchIfNeeded = async () => {
    if (operationsInBatch >= BATCH_LIMIT) {
      console.log(`Enviando lote de ${operationsInBatch} operações...`);
      await batch.commit();
      batch = db.batch(); // Inicia um novo lote
      operationsInBatch = 0;
    }
  };

  for (const roadmap of migrationData) {
    // 1. Migrar a Trilha (Roadmap)
    const roadmapRef = db.collection('roadmaps').doc(roadmap.id);
    const { modules, ...roadmapDataToSave } = roadmap; // Separa os módulos
    batch.set(roadmapRef, roadmapDataToSave);
    operationsInBatch++;
    stats.roadmaps++;
    await commitBatchIfNeeded();

    if (modules && Array.isArray(modules)) {
      for (const module of modules) {
        // 2. Migrar o Módulo como subcoleção
        const moduleRef = roadmapRef.collection('modules').doc(module.id);
        const { lessons, exercises, ...moduleDataToSave } = module; // Separa lições/exercícios
        batch.set(moduleRef, moduleDataToSave);
        operationsInBatch++;
        stats.modules++;
        await commitBatchIfNeeded();

        if (lessons && Array.isArray(lessons)) {
            for (const lesson of lessons) {
              // 3. Migrar a Lição como sub-sub-coleção
              const lessonRef = moduleRef.collection('lessons').doc(lesson.id);
              
              // O objeto 'lesson' vindo do JSON já é puro.
              // Não precisamos remover nada. Podemos passá-lo diretamente.
              batch.set(lessonRef, lesson); // <<--- CORREÇÃO AQUI
              
              operationsInBatch++;
              stats.lessons++;
              await commitBatchIfNeeded();
            }
          }

        if (exercises && Array.isArray(exercises)) {
            for (const exercise of exercises) {
                // 4. Migrar o Exercício como sub-sub-coleção
                const exerciseRef = moduleRef.collection('exercises').doc(exercise.id);
                batch.set(exerciseRef, exercise); // Assumindo que o exercício já é um dado puro
                operationsInBatch++;
                stats.exercises++;
                await commitBatchIfNeeded();
            }
        }
      }
    }
  }

  // Enviar o lote final com as operações restantes
  if (operationsInBatch > 0) {
    console.log(`Enviando lote final de ${operationsInBatch} operações...`);
    await batch.commit();
  }

  console.log('--- Migração Concluída! ---');
  console.log(`Trilhas (Roadmaps): ${stats.roadmaps}`);
  console.log(`Módulos: ${stats.modules}`);
  console.log(`Lições: ${stats.lessons}`);
  console.log(`Exercícios: ${stats.exercises}`);
  console.log('Verifique suas coleções no console do Firebase.');
}

migrateAllData().catch(error => {
  console.error('Erro catastrófico durante a migração:', error);
  process.exit(1);
});