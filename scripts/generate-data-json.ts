// ARQUIVO TEMPORÁRIO: src/app/api/generate-data/route.ts

import { NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';
// Use o alias do Next.js para importar. Geralmente é '@/'
import { mockRoadmapData } from '@/lib/mockData'; 

// Sua função getIconName está perfeita
function getIconName(iconComponent: any): string {
  if (iconComponent && iconComponent.displayName) {
    return iconComponent.displayName;
  }
  return '';
}

// A função que será executada quando a API for chamada
export async function GET() {
  try {
    // Sua lógica de transformação está perfeita
    const pureRoadmapData = mockRoadmapData.map(roadmap => ({
      ...roadmap,
      icon: getIconName(roadmap.icon), // Transforma o ícone
      modules: roadmap.modules.map(module => ({
        ...module,
        // Limpa recursivamente se necessário, mas seus dados já parecem ok
        lessons: module.lessons,
        exercises: module.exercises,
      })),
    }));

    // Define o caminho de saída na pasta 'scripts'
    // process.cwd() aponta para a raiz do seu projeto quando executado pelo Next.js
    const outputPath = path.resolve(process.cwd(), 'scripts', 'data-for-migration.json');
    
    // Escreve o arquivo JSON
    fs.writeFileSync(outputPath, JSON.stringify(pureRoadmapData, null, 2));

    // Retorna uma resposta de sucesso
    return NextResponse.json({
      message: `✅ Dados gerados com sucesso em: ${outputPath}`
    });

  } catch (error: any) {
    console.error("Erro ao gerar dados:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}