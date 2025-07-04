
// src/app/api/generate-data/route.ts

import { NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';
import { mockRoadmapData } from '@/lib/mockData'; 
import type { RoadmapStep, Module as ModuleType } from '@/lib/types'; // Importando tipos

// Função para obter o nome do ícone do componente React
function getIconName(iconComponent: any): string {
  if (iconComponent && iconComponent.displayName) {
    return iconComponent.displayName;
  }
  if (iconComponent && typeof iconComponent === 'function' && iconComponent.name) {
    return iconComponent.name;
  }
  return '';
}

export async function GET() {
  try {
    const pureRoadmapData = mockRoadmapData.map(roadmap => {
      // Desestrutura para remover 'icon' (componente React) e 'modules' temporariamente
      const { icon, modules, ...restOfRoadmap } = roadmap;
      
      // Garante que iconName seja uma string, priorizando o campo já existente se houver
      const iconNameString = roadmap.iconName || getIconName(icon) || '';

      return {
        ...restOfRoadmap, // Mantém o resto dos dados da trilha (id, title, order, emoji, description)
        iconName: iconNameString, // Usa a string do nome do ícone
        modules: modules.map(module => {
          // Remove roadmapIcon dos módulos se ele existir e for um componente
          const { lessons, exercises, roadmapIcon, ...moduleRest } = module; // Renomeado para moduleRest
          return {
            ...moduleRest, // Mantém o resto dos dados do módulo (id, title, order)
            lessons: lessons, 
            exercises: exercises, 
            lessonCount: lessons?.length || 0,
            exerciseCount: exercises?.length || 0,
          };
        }),
      };
    });

    // Define o caminho de saída na pasta 'scripts'
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
