// src/components/roadmap/RoadmapDisplay.tsx
"use client";

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Loader2, CheckCircle } from 'lucide-react'; 
import type { RoadmapStep } from '@/lib/types';
import { useAuth } from '@/contexts/AuthContext';
import { mockRoadmapData } from '@/lib/mockData';

// --- CONSTANTES E INTERFACES ---
const NODE_RADIUS_BASE = 40;
const EMOJI_FONT_SIZE_FACTOR = 0.7; // Emoji size relative to node radius
const VERTICAL_NODE_SPACING = 200;
const HORIZONTAL_ZIGZAG_OFFSET = 120;
const PADDING = 60;
const MAX_CHARS_PER_LINE_TITLE = 18;
const SVG_TEXT_LINE_HEIGHT = 15;
const TITLE_OFFSET_ABOVE_CIRCLE = 25;
const TITLE_HORIZONTAL_SHIFT_AMOUNT = 70;
const LINE_THICKNESS = 3;
const CHECK_ICON_SIZE_FACTOR = 0.5;
const ROCKET_SIZE_FACTOR = 0.8;
const ROCKET_Y_OFFSET_FACTOR = 0.2;
const ROCKET_X_OFFSET_FACTOR = ROCKET_SIZE_FACTOR / 2;


interface ProcessedRoadmapNode {
    id: string;
    originalStep: RoadmapStep;
    nodeX: number;
    nodeY: number;
    titleLines: string[];
    svg_x_title: number;
    svg_title_start_y: number;
    emoji: string;
    description: string;
    firstModuleId?: string;
    isCompleted: boolean;
    isCurrent: boolean;
    order: number;
}

// --- FUNÇÃO HELPER ---
function splitTitleIntoLines(title: string | undefined, maxChars: number): string[] {
    if (!title) return [''];
    const emojiRegex = /^([\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F700}-\u{1F77F}]|[\u{1F780}-\u{1F7FF}]|[\u{1F800}-\u{1F8FF}]|[\u{1F900}-\u{1F9FF}]|[\u{1FA00}-\u{1FA6F}]|[\u{1FA70}-\u{1FAFF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}])\s*/u;
    const cleanTitle = title.replace(emojiRegex, '').trim();
    
    const words = cleanTitle.split(' ');
    const lines: string[] = [];
    let currentLine = "";

    for (const word of words) {
        if ((currentLine + word).length > maxChars && currentLine.length > 0) {
            lines.push(currentLine.trim());
            currentLine = word + " ";
        } else {
            currentLine += word + " ";
        }
    }
    if (currentLine.trim().length > 0) {
        lines.push(currentLine.trim());
    }
    return lines.filter(line => line.length > 0);
}

// --- COMPONENTE PRINCIPAL ---
export function RoadmapDisplay() {
    const router = useRouter();
    const { userProfile, loading: authLoading } = useAuth();
    const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

    const processedNodes = useMemo(() => {
        if (!userProfile) return [];

        const completedModulesSet = new Set(userProfile.completedModules || []);
        
        const updatedRoadmapData = mockRoadmapData.map(trilha => {
            const allModulesCompleted = trilha.modules.every(module => completedModulesSet.has(module.id));
            
            // Atualiza os módulos dentro da trilha para incluir o progresso mais recente
            const updatedModules = trilha.modules.map(module => {
                const totalLessons = module.lessons?.length || 0;
                const completedLessons = totalLessons > 0 ? module.lessons.filter(l => userProfile.lessonProgress[l.id]?.completed).length : 0;
                
                const totalExercises = module.exercises?.length || 0;
                const completedExercises = totalExercises > 0 ? module.exercises.filter(e => userProfile.completedExercises.includes(e.id)).length : 0;

                const totalItems = totalLessons + totalExercises;
                const completedItems = completedLessons + completedExercises;

                return {
                    ...module,
                    isCompleted: totalItems > 0 ? completedItems === totalItems : completedModulesSet.has(module.id),
                    progress: totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : (completedModulesSet.has(module.id) ? 100 : 0),
                };
            });

            return {
                ...trilha,
                modules: updatedModules,
                isCompleted: allModulesCompleted,
            };
        });

        let firstUncompletedTrilhaFound = false;
        const finalRoadmapData = updatedRoadmapData.map(trilha => {
            const isCurrent = !trilha.isCompleted && !firstUncompletedTrilhaFound;
            if (isCurrent) {
                firstUncompletedTrilhaFound = true;
            }
            return { ...trilha, isCurrent };
        });

        if (!firstUncompletedTrilhaFound && finalRoadmapData.length > 0 && !finalRoadmapData.every(t => t.isCompleted)) {
             const firstNotDone = finalRoadmapData.find(t => !t.isCompleted);
             if (firstNotDone) firstNotDone.isCurrent = true;
        }

        const svgWidth = 2 * (HORIZONTAL_ZIGZAG_OFFSET + NODE_RADIUS_BASE + PADDING);
        const centerX = svgWidth / 2;

        return finalRoadmapData
            .sort((a, b) => (a.order || 0) - (b.order || 0))
            .map((step, index) => {
                const nodeY = PADDING + index * VERTICAL_NODE_SPACING;
                const isOdd = index % 2 !== 0;
                const nodeX = centerX + (isOdd ? HORIZONTAL_ZIGZAG_OFFSET : -HORIZONTAL_ZIGZAG_OFFSET);
                const titleLines = splitTitleIntoLines(step.title, MAX_CHARS_PER_LINE_TITLE);
                const svg_title_start_y = nodeY - NODE_RADIUS_BASE - TITLE_OFFSET_ABOVE_CIRCLE;
                const horizontalShift = isOdd ? -TITLE_HORIZONTAL_SHIFT_AMOUNT : TITLE_HORIZONTAL_SHIFT_AMOUNT;
                const svg_x_title = nodeX + horizontalShift;

                return {
                    id: step.id,
                    originalStep: step,
                    nodeX,
                    nodeY,
                    titleLines,
                    svg_x_title,
                    svg_title_start_y: svg_title_start_y,
                    emoji: step.emoji || '🗺️',
                    description: step.description,
                    firstModuleId: step.modules.length > 0 ? step.modules[0].id : undefined,
                    isCompleted: step.isCompleted,
                    isCurrent: step.isCurrent,
                    order: step.order || index + 1,
                };
            });
    }, [userProfile]);

    const handleNodeClick = (node: ProcessedRoadmapNode) => {
        if (node.firstModuleId) {
            router.push(`/modules/${node.firstModuleId}`);
        } else {
            console.warn(`A trilha '${node.originalStep.title}' não possui módulos para navegar.`);
        }
    };
    
    if (authLoading) {
        return (
            <div className="flex justify-center items-center min-h-[300px] w-full">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="ml-2">Carregando trilhas...</p>
            </div>
        );
    }
    
    if (processedNodes.length === 0) {
        return (
            <div className="flex justify-center items-center min-h-[300px] w-full">
                <p className="text-lg text-muted-foreground">Nenhuma trilha encontrada.</p>
            </div>
        );
    }

    const svgWidth = 2 * (HORIZONTAL_ZIGZAG_OFFSET + NODE_RADIUS_BASE + PADDING);
    const svgHeight = processedNodes.length * VERTICAL_NODE_SPACING + PADDING;

    const currentStepNode = processedNodes.find(n => n.isCurrent);
    const lastCompletedNode = processedNodes.slice().reverse().find(n => n.isCompleted);

    const progressRocketPosition = useMemo(() => {
        if (!currentStepNode) {
             if (lastCompletedNode) { // Todas completas
                 return { x: lastCompletedNode.nodeX, y: lastCompletedNode.nodeY };
             }
             return null; // Nenhuma atual e nenhuma completa
        }
        
        const progressPercentage = currentStepNode.originalStep.modules.reduce((acc, mod) => acc + (mod.progress || 0), 0) / (currentStepNode.originalStep.modules.length || 1) / 100;
        
        const startNode = lastCompletedNode || { nodeX: currentStepNode.nodeX, nodeY: currentStepNode.nodeY - VERTICAL_NODE_SPACING };

        const startX = startNode.nodeX;
        const startY = startNode.nodeY;
        const endX = currentStepNode.nodeX;
        const endY = currentStepNode.nodeY;
        
        const x = startX + (endX - startX) * progressPercentage;
        const y = startY + (endY - startY) * progressPercentage;
        
        return { x, y };
    }, [currentStepNode, lastCompletedNode]);


    return (
      <div className="relative w-full overflow-x-auto">
        <svg width={svgWidth} height={svgHeight} className="mx-auto">
            {/* Linhas de conexão */}
            {processedNodes.slice(0, -1).map((node, index) => {
                const nextNode = processedNodes[index + 1];
                const isLineCompleted = node.isCompleted;

                return (
                    <line
                        key={`line-${node.id}`}
                        x1={node.nodeX}
                        y1={node.nodeY}
                        x2={nextNode.nodeX}
                        y2={nextNode.nodeY}
                        className={cn(
                            "transition-all duration-500",
                            isLineCompleted ? "stroke-primary/80" : "stroke-border",
                            nextNode.isCurrent && "stroke-primary/30"
                        )}
                        strokeWidth={LINE_THICKNESS}
                        strokeDasharray={isLineCompleted ? "none" : "8 8"}
                    />
                );
            })}

            {/* Foguete de progresso */}
            {progressRocketPosition && (
                <text
                    x={progressRocketPosition.x - (NODE_RADIUS_BASE * ROCKET_X_OFFSET_FACTOR)}
                    y={progressRocketPosition.y - (NODE_RADIUS_BASE * ROCKET_Y_OFFSET_FACTOR)}
                    fontSize={NODE_RADIUS_BASE * ROCKET_SIZE_FACTOR}
                    className="transition-all duration-1000 ease-out"
                    aria-label="Seu progresso atual"
                >
                    🚀
                </text>
            )}

            {/* Nós */}
            {processedNodes.map(node => (
                <g 
                    key={node.id} 
                    className={cn(
                        "cursor-pointer transition-transform duration-300 ease-in-out",
                        (hoveredNodeId === node.id || node.isCurrent) && "scale-110"
                    )} 
                    onMouseEnter={() => setHoveredNodeId(node.id)}
                    onMouseLeave={() => setHoveredNodeId(null)}
                    onClick={() => handleNodeClick(node)}
                    aria-label={`Trilha: ${node.originalStep.title}. Status: ${node.isCompleted ? 'Concluído' : (node.isCurrent ? 'Atual' : 'Não iniciado')}. Clique para ver os módulos.`}
                >
                    {/* Sombra */}
                    <circle
                        cx={node.nodeX}
                        cy={node.nodeY}
                        r={NODE_RADIUS_BASE}
                        className={cn(
                            "fill-muted transition-all duration-300",
                            node.isCurrent && "fill-primary/20",
                            hoveredNodeId === node.id && "fill-accent/30",
                        )}
                        filter="url(#f1)"
                    />
                    <defs>
                        <filter id="f1" x="-50%" y="-50%" width="200%" height="200%">
                          <feOffset result="offOut" in="SourceAlpha" dx="4" dy="4" />
                          <feGaussianBlur result="blurOut" in="offOut" stdDeviation="4" />
                          <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
                        </filter>
                    </defs>

                    {/* Círculo principal */}
                    <circle
                        cx={node.nodeX}
                        cy={node.nodeY}
                        r={NODE_RADIUS_BASE}
                        className={cn(
                            "stroke-2 transition-all duration-300",
                            node.isCompleted ? "fill-green-200 stroke-green-500 dark:fill-green-800/50 dark:stroke-green-600" :
                            node.isCurrent ? "fill-primary/80 stroke-primary" :
                            "fill-card stroke-border"
                        )}
                    />

                    {/* Emoji */}
                    <text
                        x={node.nodeX}
                        y={node.nodeY}
                        textAnchor="middle"
                        dy=".3em"
                        fontSize={NODE_RADIUS_BASE * EMOJI_FONT_SIZE_FACTOR}
                    >
                        {node.emoji}
                    </text>

                    {/* Ícone de Concluído */}
                    {node.isCompleted && (
                        <CheckCircle 
                           x={node.nodeX + NODE_RADIUS_BASE / 2} 
                           y={node.nodeY - NODE_RADIUS_BASE / 1.5}
                           size={NODE_RADIUS_BASE * CHECK_ICON_SIZE_FACTOR}
                           className="fill-green-600 stroke-white dark:fill-green-500 dark:stroke-background"
                           strokeWidth={2}
                        />
                    )}

                    {/* Título */}
                    <text
                        x={node.svg_x_title}
                        y={node.svg_title_start_y}
                        textAnchor="middle"
                        className="font-bold text-xs fill-foreground"
                    >
                        {node.titleLines.map((line, i) => (
                            <tspan key={i} x={node.svg_x_title} dy={i > 0 ? SVG_TEXT_LINE_HEIGHT : 0}>{line}</tspan>
                        ))}
                    </text>
                </g>
            ))}
        </svg>
      </div>
    );
}