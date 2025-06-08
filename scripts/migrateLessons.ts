// scripts/migrateLessons.ts
import * as admin from 'firebase-admin';
// CORREÇÃO AQUI: Ajuste o caminho se mockRoadmapData estiver diretamente em mockData.ts ou dentro de uma estrutura específica
import { mockRoadmapData } from '../src/lib/mockData'; // Caminho correto para mockData.ts
import type { Lesson as LessonType, Module as ModuleType, RoadmapStep } from '../src/lib/types'; // Caminho para seus tipos

// ----- INÍCIO DA CONFIGURAÇÃO -----
// TODO: Substitua pelo caminho para o seu arquivo de chave de conta de serviço
const serviceAccount = require('../serviceAccountKey.json'); // Assumindo que está na raiz do projeto

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const LESSONS_COLLECTION_NAME = 'lessons'; // Nome da coleção para as lições
const lessonsCollection = db.collection(LESSONS_COLLECTION_NAME);
// ----- FIM DA CONFIGURAÇÃO -----

// Interface para os dados da lição como serão salvos no Firestore
// Inclui campos de contexto e garante que campos opcionais sejam tratados
interface LessonFirestoreData extends Omit<LessonType, 'icon'> { // Removendo 'icon' se for um componente React
  iconName?: string; // Adicionando iconName se você usa strings para ícones
  moduleId: string;
  moduleTitle: string;
  // roadmapId: string; // Removido - o contexto do módulo já é suficiente
  // roadmapTitle: string; // Removido
  order: number; // Ordem da lição dentro do módulo
}


async function migrateLessons() {
  console.log('Iniciando migração de lições...');
  let lessonsMigratedCount = 0;
  let batch = db.batch();
  let operationsInBatch = 0;
  const BATCH_LIMIT = 400; // Limite de operações por lote no Firestore

  const processedLessonIds = new Set<string>();

  for (const roadmap of mockRoadmapData) {
    if (roadmap.modules && roadmap.modules.length > 0) {
      for (const module of roadmap.modules) {
        if (module.lessons && module.lessons.length > 0) {
          for (let i = 0; i < module.lessons.length; i++) {
            const lesson = module.lessons[i];

            if (!lesson.id || !lesson.title || !module.id || !module.title) {
                console.warn(`Lição com dados incompletos ou ID do módulo ausente. Roadmap: ${roadmap.title}, Módulo: ${module.title}, Lição: ${lesson.title || lesson.id}. Pulando.`);
                continue;
            }

            if (processedLessonIds.has(lesson.id)) {
                console.warn(`ID de lição duplicado encontrado: ${lesson.id} (${lesson.title}). A primeira ocorrência será usada. Pulando esta duplicata.`);
                continue;
            }
            processedLessonIds.add(lesson.id);


            const lessonData: LessonFirestoreData = {
              ...lesson,
              // id: lesson.id, // Já está no spread de lesson
              moduleId: module.id,
              moduleTitle: module.title,
              order: lesson.order !== undefined ? lesson.order : i + 1,
              // Tratar campos opcionais para evitar 'undefined' no Firestore
              coverImage: lesson.coverImage || '',
              aiHint: lesson.aiHint || '',
              references: lesson.references || [],
              iconName: lesson.iconName || '', // Adicionado se você usar iconName
            };

            // Removendo o campo 'icon' se ele for um componente React e não uma string
            delete (lessonData as any).icon;


            const lessonRef = lessonsCollection.doc(lesson.id);
            batch.set(lessonRef, lessonData);
            operationsInBatch++;
            lessonsMigratedCount++;

            if (operationsInBatch >= BATCH_LIMIT) {
              console.log(`Enviando lote de ${operationsInBatch} lições...`);
              await batch.commit();
              batch = db.batch();
              operationsInBatch = 0;
            }
          }
        } else {
          console.log(`Módulo "${module.title}" no roadmap "${roadmap.title}" não possui lições.`);
        }
      }
    } else {
        console.log(`Roadmap "${roadmap.title}" não possui módulos.`);
    }
  }

  if (operationsInBatch > 0) {
    console.log(`Enviando lote final de ${operationsInBatch} lições...`);
    await batch.commit();
  }

  if (lessonsMigratedCount !== processedLessonIds.size) {
    console.warn(`AVISO: ${lessonsMigratedCount} lições foram processadas, mas apenas ${processedLessonIds.size} IDs únicos foram encontrados. Verifique duplicatas nos seus dados mockados.`);
  }

  console.log(`Migração concluída! ${lessonsMigratedCount} lições foram processadas para a coleção '${LESSONS_COLLECTION_NAME}'.`);
  console.log("Verifique sua coleção no console do Firebase.");
}

migrateLessons().catch(error => {
  console.error('Erro durante a migração de lições:', error);
  process.exit(1);
});
