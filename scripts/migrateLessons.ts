
// scripts/migrateLessons.ts
import * as admin from 'firebase-admin';

// TODO: Ajuste os caminhos de importação abaixo para corresponder à estrutura do seu projeto.
// Exemplo: se seus tipos estão em 'src/types.ts' e mockData em 'src/data/mock.ts'
import { mockRoadmapData } from '../src/lib/mockData'; // Caminho para seus dados mockados (onde as lições estão)
import type { Lesson as LessonType, Module as ModuleType, RoadmapStep } from '../src/lib/types'; // Caminho para suas definições de tipo

// ----- INÍCIO DA CONFIGURAÇÃO -----

// TODO: SUBSTITUA PELO CAMINHO CORRETO PARA O SEU ARQUIVO DE CHAVE DE CONTA DE SERVIÇO DO FIREBASE ADMIN
// Exemplo: se o arquivo está na raiz do projeto: const serviceAccount = require('../serviceAccountKey.json');
// Lembre-se de adicionar este arquivo ao seu .gitignore!
const serviceAccount = require('../serviceAccountKey.json'); // <<--- SUBSTITUA AQUI

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
} catch (error: any) {
  if (error.code === 'app/duplicate-app') {
    console.warn('Firebase Admin já inicializado. Usando instância existente.');
  } else {
    console.error('Erro ao inicializar Firebase Admin:', error);
    process.exit(1);
  }
}

const db = admin.firestore();

// TODO: CONFIRME O NOME DA COLEÇÃO ONDE VOCÊ QUER SALVAR AS LIÇÕES NO FIRESTORE
const LESSONS_COLLECTION_NAME = 'lessons';
const lessonsCollection = db.collection(LESSONS_COLLECTION_NAME);
// ----- FIM DA CONFIGURAÇÃO -----

// Interface para os dados da lição que serão salvos, incluindo contexto
interface LessonWithContext extends LessonType {
  moduleId: string;
  moduleTitle: string;
  roadmapId: string;
  roadmapTitle: string;
  order: number; // Ordem da lição dentro do módulo
}

async function migrateLessons() {
  console.log(`Iniciando migração de lições para a coleção '${LESSONS_COLLECTION_NAME}'...`);
  let lessonsMigratedCount = 0;
  let batch = db.batch();
  let operationsInBatch = 0;
  const BATCH_LIMIT = 400; // Firestore recomenda lotes de até 500 operações

  if (!mockRoadmapData || mockRoadmapData.length === 0) {
    console.error('mockRoadmapData está vazio ou não foi carregado corretamente. Verifique o caminho de importação.');
    return;
  }

  for (const roadmap of mockRoadmapData) {
    if (roadmap.modules && roadmap.modules.length > 0) {
      for (const module of roadmap.modules) {
        if (module.lessons && module.lessons.length > 0) {
          for (let i = 0; i < module.lessons.length; i++) {
            const lesson = module.lessons[i];

            if (!lesson.id) {
              console.warn(`Lição sem ID encontrada no módulo '${module.title}'. Pulando... Conteúdo:`, JSON.stringify(lesson).substring(0, 100));
              continue;
            }

            const lessonData: LessonWithContext = {
              // Campos obrigatórios da sua interface LessonType (ajuste conforme sua interface)
              id: lesson.id,
              title: lesson.title,
              type: lesson.type,
              content: lesson.content,
              estimatedTime: lesson.estimatedTime,
              
              // Campos de contexto
              moduleId: module.id,
              moduleTitle: module.title,
              roadmapId: roadmap.id,
              roadmapTitle: roadmap.title,
              order: lesson.order !== undefined ? lesson.order : i + 1,

              // Campos opcionais da sua interface LessonType (trate para evitar 'undefined')
              coverImage: lesson.coverImage || '',
              aiHint: lesson.aiHint || '',
              references: lesson.references || [],
            };

            // Use o ID da lição do mockData como ID do documento no Firestore
            const lessonRef = lessonsCollection.doc(lesson.id);
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
          // console.log(`Módulo '${module.title}' não possui lições. Pulando...`);
        }
      }
    } else {
      // console.log(`Trilha '${roadmap.title}' não possui módulos. Pulando...`);
    }
  }

  if (operationsInBatch > 0) {
    console.log(`Enviando lote final de ${operationsInBatch} lições...`);
    await batch.commit();
  }

  console.log(`\nMigração concluída!`);
  console.log(`${lessonsMigratedCount} lições foram processadas.`);
  console.log(`Verifique sua coleção '${LESSONS_COLLECTION_NAME}' no console do Firebase.`);
  if (lessonsMigratedCount === 0) {
    console.warn("Nenhuma lição foi migrada. Verifique se 'mockRoadmapData' está populado e se a estrutura (roadmaps > modules > lessons) está correta.");
  }
}

// Executa a função de migração
migrateLessons().catch(error => {
  console.error('Erro catastrófico durante a migração:', error);
  process.exit(1); // Encerra o script com código de erro
});
