
// scripts/migrateLessons.ts
import * as admin from 'firebase-admin';
// TODO: Ajuste o caminho para seu mockData.ts se necessário.
// Ele deve exportar mockRoadmapData que é um array de RoadmapStep.
import { mockRoadmapData } from '../src/lib/mockData'; 
// TODO: Ajuste o caminho para seus tipos se necessário.
import type { Lesson as LessonType, Module as ModuleType, RoadmapStep } from '../src/lib/types'; 

// ----- INÍCIO DA CONFIGURAÇÃO -----
// TODO: Certifique-se de que este caminho para o seu serviceAccountKey.json está correto.
// LEMBRE-SE: Adicione o arquivo 'serviceAccountKey.json' ao seu .gitignore!
const serviceAccount = require('../serviceAccountKey.json'); 

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
  // TODO: Se você já inicializou o app em outro lugar, pode precisar de:
  // admin.initializeApp({ credential: admin.credential.cert(serviceAccount) }, 'migrateLessonsApp');
  // const db = admin.app('migrateLessonsApp').firestore();
});

const db = admin.firestore();

// TODO: Confirme se o nome da coleção no Firestore é 'lessons'.
const LESSONS_COLLECTION_NAME = 'lessons';
const lessonsCollection = db.collection(LESSONS_COLLECTION_NAME);
// ----- FIM DA CONFIGURAÇÃO -----

// Interface para os dados que serão salvos no Firestore, garantindo que campos opcionais sejam tratados.
interface LessonFirestoreData extends Omit<LessonType, 'id' | 'order' | 'moduleId' | 'moduleTitle' | 'coverImage' | 'aiHint' | 'references'> {
  id: string;
  moduleId: string;
  moduleTitle: string;
  order: number;
  title: string; // Garantir que campos obrigatórios de LessonType estejam aqui
  type: 'text' | 'video' | 'interactive' | 'quiz';
  content: string;
  estimatedTime: string;
  coverImage?: string; // Opcional
  aiHint?: string;     // Opcional
  references?: string[]; // Opcional
}


async function migrateLessons() {
  console.log('Iniciando migração de lições...');
  let lessonsMigratedCount = 0;
  let batch = db.batch();
  let operationsInBatch = 0;
  const BATCH_LIMIT = 400; // O Firestore recomenda lotes de até 500 operações

  const allLessonIds = new Set<string>();

  for (const roadmap of mockRoadmapData) {
    if (roadmap.modules && roadmap.modules.length > 0) {
      for (const module of roadmap.modules) {
        if (module.lessons && module.lessons.length > 0) {
          for (let i = 0; i < module.lessons.length; i++) {
            const lesson = module.lessons[i];

            // **IMPORTANTE: Validação de ID da Lição**
            // Certifique-se de que cada lesson.id seja ÚNICO em todo o seu mockData.
            // Se houver IDs duplicados, uma lição sobrescreverá a outra no Firestore.
            if (!lesson.id) {
              console.warn(`Lição sem ID encontrada no módulo '${module.title}'. Pulando.`);
              continue;
            }
            if (allLessonIds.has(lesson.id)) {
              console.warn(`ID de lição duplicado encontrado: '${lesson.id}' no módulo '${module.title}'. Verifique seus dados mockados. Esta lição pode sobrescrever uma anterior.`);
            }
            allLessonIds.add(lesson.id);

            // Tratamento do campo 'order'
            // Se 'lesson.order' existir no mock, usa ele. Senão, usa o índice do loop + 1.
            const order = lesson.order !== undefined && typeof lesson.order === 'number' ? lesson.order : i + 1;

            const lessonData: LessonFirestoreData = {
              // Campos obrigatórios de LessonType
              id: lesson.id,
              title: lesson.title,
              type: lesson.type,
              content: lesson.content,
              estimatedTime: lesson.estimatedTime,
              // Campos adicionados/contextuais
              moduleId: module.id,
              moduleTitle: module.title,
              order: order,
              // Campos opcionais de LessonType - tratar undefined para evitar problemas com Firestore
              coverImage: lesson.coverImage || '', // Usar string vazia se undefined
              aiHint: lesson.aiHint || '',       // Usar string vazia se undefined
              references: lesson.references || [], // Usar array vazio se undefined
            };
            
            // Validação simples de campos essenciais (opcional, mas útil)
            if (!lessonData.title || !lessonData.moduleId || !lessonData.moduleTitle) {
                console.warn(`Lição com ID '${lesson.id}' está com campos essenciais faltando (title, moduleId, moduleTitle). Pulando.`);
                continue;
            }

            const lessonRef = lessonsCollection.doc(lesson.id); // Usar o ID da lição como ID do documento
            batch.set(lessonRef, lessonData);
            operationsInBatch++;
            lessonsMigratedCount++;

            if (operationsInBatch >= BATCH_LIMIT) {
              console.log(`Enviando lote de ${operationsInBatch} lições...`);
              await batch.commit();
              batch = db.batch(); // Inicia um novo lote
              operationsInBatch = 0;
            }
          }
        } else {
          console.log(`Módulo '${module.title}' (ID: ${module.id}) não possui lições. Pulando.`);
        }
      }
    } else {
      console.log(`Trilha '${roadmap.title}' (ID: ${roadmap.id}) não possui módulos. Pulando.`);
    }
  }

  if (operationsInBatch > 0) {
    console.log(`Enviando lote final de ${operationsInBatch} lições...`);
    await batch.commit();
  }

  console.log(`\nMigração concluída! ${lessonsMigratedCount} lições foram processadas.`);
  if (allLessonIds.size !== lessonsMigratedCount) {
      console.warn(`ATENÇÃO: Foram processadas ${lessonsMigratedCount} lições, mas existem ${allLessonIds.size} IDs únicos. Pode haver duplicidade ou lições puladas. Verifique os logs.`);
  }
  console.log("Verifique sua coleção 'lessons' no console do Firebase.");
}

migrateLessons().catch(error => {
  console.error('Erro catastrófico durante a migração:', error);
  process.exit(1);
});
