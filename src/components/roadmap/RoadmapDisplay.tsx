
"use client";

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Loader2, UsersRound, UserCheck, ToyBrick, Brain, Microscope, BarChart3, FileText, Scale, Landmark, Accessibility, GraduationCap, HelpingHand, BookOpen, PackageSearch, PersonStanding, Rocket, type LucideIcon, CheckCircle } from 'lucide-react';
import type { RoadmapStep, Module as ModuleType } from '@/lib/types'; // Renomeado Module para ModuleType
import { useAuth } from '@/contexts/AuthContext';

// --- CONSTANTES E INTERFACES ---
const NODE_RADIUS_BASE = 40;
const ICON_SIZE = NODE_RADIUS_BASE * 0.6;
const VERTICAL_NODE_SPACING = 200;
const HORIZONTAL_ZIGZAG_OFFSET = 120;
const PADDING = 60;
const MAX_CHARS_PER_LINE_TITLE = 18;
const SVG_TEXT_LINE_HEIGHT = 15;
const TITLE_OFFSET_ABOVE_CIRCLE = 25;
const TITLE_HORIZONTAL_SHIFT_AMOUNT = 70;
const LINE_THICKNESS = 3;

interface ProcessedRoadmapNode {
    id: string;
    originalStep: RoadmapStep;
    nodeX: number;
    nodeY: number;
    titleLines: string[];
    svg_x_title: number;
    svg_title_start_y: number;
    iconName: string;
    description: string;
    firstModuleId?: string;
    isCompleted: boolean;
    isCurrent: boolean;
    order: number;
}

export const lucideIconMap: Record<string, LucideIcon> = {
    "UsersRound": UsersRound, "UserCheck": UserCheck, "ToyBrick": ToyBrick,
    "Brain": Brain, "Microscope": Microscope, "BarChart3": BarChart3,
    "FileText": FileText, "Scale": Scale, "Landmark": Landmark,
    "Accessibility": Accessibility, "GraduationCap": GraduationCap,
    "HelpingHand": HelpingHand, "BookOpen": BookOpen, "PackageSearch": PackageSearch,
    "PersonStanding": PersonStanding, "Rocket": Rocket,
};

interface RoadmapDisplayProps {
  initialRoadmapData: RoadmapStep[];
}

// --- FUNÇÃO HELPER ---
function splitTitleIntoLines(title: string | undefined, maxChars: number): string[] {
    if (!title) return [''];
    const cleanTitle = title.replace(/([\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F700}-\u{1F77F}]|[\u{1F780}-\u{1F7FF}]|[\u{1F800}-\u{1F8FF}]|[\u{1F900}-\u{1F9FF}]|[\u{1FA00}-\u{1FA6F}]|[\u{1FA70}-\u{1FAFF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}])/gu, '').trim();
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
export function RoadmapDisplay({ initialRoadmapData }: RoadmapDisplayProps) {
    const router = useRouter();
    const { userProfile, loading: authLoading } = useAuth();

    const handleNavigation = useCallback((moduleId: string | undefined) => {
        if (moduleId) {
            router.push(`/modules/${moduleId}`);
        }
    }, [router]);

    const processedNodes: ProcessedRoadmapNode[] = useMemo(() => {
        if (!initialRoadmapData || initialRoadmapData.length === 0) return [];

        const completedModulesSet = userProfile ? new Set(userProfile.completedModules || []) : new Set<string>();

        const tempProcessedNodes = initialRoadmapData
            .sort((a, b) => (a.order ?? Infinity) - (b.order ?? Infinity))
            .map((step, index) => {
                const localizedTitleFull = step.title;
                const titleLines = splitTitleIntoLines(localizedTitleFull, MAX_CHARS_PER_LINE_TITLE);
                const titleBlockHeight = titleLines.length * SVG_TEXT_LINE_HEIGHT;

                const relativeNodeX = (index % 2 === 0 ? 0 : HORIZONTAL_ZIGZAG_OFFSET);
                const relativeNodeY = (index * VERTICAL_NODE_SPACING);

                const titleBaseY = relativeNodeY - NODE_RADIUS_BASE - TITLE_OFFSET_ABOVE_CIRCLE;
                const svg_title_start_y = titleBaseY - titleBlockHeight + (SVG_TEXT_LINE_HEIGHT / 2);

                let titleXShift = (index > 0) ? (index % 2 !== 0 ? TITLE_HORIZONTAL_SHIFT_AMOUNT : -TITLE_HORIZONTAL_SHIFT_AMOUNT) : 0;
                const svg_x_title = relativeNodeX + titleXShift;

                const firstModuleOfStep = step.modules && step.modules.length > 0 ? step.modules[0] : null;

                const isStepCompleted = userProfile ? (step.modules ? step.modules.every(mod => completedModulesSet.has(mod.id)) : false) : false;

                return {
                    id: step.id,
                    originalStep: step,
                    nodeX: relativeNodeX,
                    nodeY: relativeNodeY,
                    titleLines,
                    svg_x_title,
                    svg_title_start_y,
                    iconName: step.iconName || "BookOpen",
                    description: step.description,
                    firstModuleId: firstModuleOfStep?.id,
                    isCompleted: isStepCompleted,
                    isCurrent: false, // Será definido abaixo
                    order: step.order ?? index,
                };
            });
        
        // Lógica para definir isCurrent
        if (authLoading) { // Se autenticação está carregando, não faz nada de especial, espera
            return tempProcessedNodes;
        }

        let currentFound = false;
        const finalNodes = tempProcessedNodes.map(node => {
            if (!userProfile) { // Não logado, primeira é atual
                return { ...node, isCurrent: node.order === 1 || (node.order === 0 && tempProcessedNodes.length ===1) };
            }
            // Logado
            if (!node.isCompleted && !currentFound) {
                currentFound = true;
                return { ...node, isCurrent: true };
            }
            return { ...node, isCurrent: false };
        });

        // Se todas estiverem completas e logado, marca a última como atual (para o foguete)
        if (userProfile && !currentFound && finalNodes.length > 0) {
            finalNodes[finalNodes.length - 1].isCurrent = true;
        } else if (!userProfile && finalNodes.length > 0 && !finalNodes.some(n => n.isCurrent)) {
            // Garante que a primeira seja atual se não estiver logado e nenhuma foi marcada (caso de order não começar em 1)
             const minOrderNode = finalNodes.reduce((prev, curr) => (prev.order < curr.order ? prev : curr));
             minOrderNode.isCurrent = true;
        }


        return finalNodes;

    }, [initialRoadmapData, userProfile, authLoading]);

    const paths = useMemo(() => {
        if (processedNodes.length < 2) return [];
        return processedNodes.slice(0, -1).map((startNode, i) => ({
            id: `line-${startNode.id}-${processedNodes[i+1].id}`,
            x1: startNode.nodeX, y1: startNode.nodeY,
            x2: processedNodes[i+1].nodeX, y2: processedNodes[i+1].nodeY,
            isCompleted: startNode.isCompleted, // Linha completa se o nó de origem estiver completo
        }));
    }, [processedNodes]);

    const { viewBoxWidth, viewBoxHeight, translateX, translateY } = useMemo(() => {
        if (processedNodes.length === 0) return { viewBoxWidth: 400, viewBoxHeight: 600, translateX: PADDING, translateY: PADDING };
        let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
        processedNodes.forEach(pos => {
            const textWidthApprox = MAX_CHARS_PER_LINE_TITLE * 8;
            minX = Math.min(minX, pos.nodeX - NODE_RADIUS_BASE, pos.svg_x_title - textWidthApprox / 2);
            maxX = Math.max(maxX, pos.nodeX + NODE_RADIUS_BASE, pos.svg_x_title + textWidthApprox / 2);
            minY = Math.min(minY, pos.svg_title_start_y);
            maxY = Math.max(maxY, pos.nodeY + NODE_RADIUS_BASE);
        });
        const contentWidth = Math.max(maxX - minX, 300);
        const contentHeight = Math.max(maxY - minY, 500);
        return {
            viewBoxWidth: contentWidth + PADDING * 2,
            viewBoxHeight: contentHeight + PADDING * 2,
            translateX: -minX + PADDING,
            translateY: -minY + PADDING
        };
    }, [processedNodes]);

    const emojiTargetNode = useMemo(() => {
      if (authLoading) return null;
      return processedNodes.find(node => node.isCurrent) || null;
    }, [processedNodes, authLoading]);


    if (authLoading && initialRoadmapData.length === 0) {
        return (
            <div className="flex justify-center items-center min-h-[300px] w-full">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="ml-2">Carregando trilhas...</p>
            </div>
        );
    }
    
    if (initialRoadmapData.length === 0 && !authLoading) {
         return (
            <div className="flex justify-center items-center min-h-[300px] w-full">
                <p className="text-lg text-muted-foreground">Nenhuma trilha encontrada ou erro ao carregar. Tente recarregar.</p>
            </div>
        );
    }

    return (
        <div className="w-full overflow-auto py-8 flex justify-center items-start bg-muted/20 rounded-lg shadow-inner" style={{ WebkitOverflowScrolling: 'touch' }}>
            <svg width="100%" className="min-w-[450px] max-w-[50vw] h-auto" viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`} preserveAspectRatio="xMidYMin meet" aria-labelledby="roadmap-title-main" role="graphics-document">
                <title id="roadmap-title-main">Trilhas de Conhecimento</title>
                <defs>
                    <filter id="node-shadow" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="1" dy="2" stdDeviation="2" floodColor="hsl(var(--primary) / 0.25)" /></filter>
                    <filter id="completed-node-shadow" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="1" dy="2" stdDeviation="2" floodColor="hsl(var(--accent) / 0.3)" /></filter>
                    <filter id="emoji-shadow" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0.5" dy="0.5" stdDeviation="0.25" floodColor="rgba(0,0,0,0.4)" /></filter>
                </defs>
                <g transform={`translate(${translateX}, ${translateY})`}>
                    {paths.map(path => (<line key={path.id} x1={path.x1} y1={path.y1} x2={path.x2} y2={path.y2} strokeWidth={LINE_THICKNESS} className={cn("transition-all duration-300", path.isCompleted ? "stroke-green-500" : "stroke-border")} />))}
                    {processedNodes.map((node) => {
                        const nodeAriaLabel = `Trilha: ${node.originalStep.title}. Status: ${node.isCompleted ? 'Concluído' : node.isCurrent ? 'Atual' : 'Não iniciado'}. Pressione Enter ou Espaço para ${node.isCompleted ? 'revisitar' : 'iniciar'} esta trilha.`;
                        const IconComponent = lucideIconMap[node.iconName] || BookOpen;
                        
                        const iconOrEmojiFillClass = node.isCompleted
                            ? "fill-green-700 dark:fill-green-400 text-green-700 dark:text-green-400" // Ícones Lucide completos
                            : node.isCurrent 
                                ? "fill-primary text-primary" // Ícone Lucide atual
                                : "fill-foreground text-foreground group-hover/node-visual:fill-primary group-hover/node-visual:text-primary"; // Padrão e hover

                        const titleTextFillClass = node.isCompleted 
                            ? "fill-green-700 dark:fill-green-300" 
                            : "fill-foreground";

                        return (
                            <g key={node.id} className={cn("group/node-visual focus:outline-none focus-visible:ring-0", node.firstModuleId && "cursor-pointer")} onClick={() => handleNavigation(node.firstModuleId)} onKeyDown={(e) => { if ((e.key === 'Enter' || e.key === ' ') && node.firstModuleId) { e.preventDefault(); handleNavigation(node.firstModuleId); }}} tabIndex={node.firstModuleId ? 0 : -1} role={node.firstModuleId ? "link" : "img"} aria-label={nodeAriaLabel}>
                                <title>{node.originalStep.title}: {node.description}</title>
                                <circle
                                    cx={node.nodeX}
                                    cy={node.nodeY}
                                    r={NODE_RADIUS_BASE}
                                    className={cn(
                                        "stroke-2 transition-all duration-200 ease-in-out",
                                        "group-hover/node-visual:stroke-primary group-hover/node-visual:opacity-90",
                                        node.isCurrent && !node.isCompleted ? "ring-4 ring-primary/50 ring-offset-0 fill-primary/10 stroke-primary dark:ring-primary/70 dark:fill-primary/20"
                                                                          : "",
                                        node.isCompleted ? "fill-green-100 dark:fill-green-900 stroke-green-500"
                                                         : "fill-background stroke-border"
                                    )}
                                    style={{ filter: node.isCompleted ? 'url(#completed-node-shadow)' : 'url(#node-shadow)' }}
                                />
                                
                                {IconComponent ? (
                                    <IconComponent
                                        x={node.nodeX - ICON_SIZE / 2}
                                        y={node.nodeY - ICON_SIZE / 2}
                                        width={ICON_SIZE}
                                        height={ICON_SIZE}
                                        className={cn("select-none pointer-events-none transition-colors", iconOrEmojiFillClass)}
                                        strokeWidth={2}
                                    />
                                ) : node.originalStep.emoji ? ( // Fallback se iconName não for encontrado
                                    <text
                                        x={node.nodeX}
                                        y={node.nodeY}
                                        textAnchor="middle"
                                        dominantBaseline="central"
                                        style={{ fontSize: `${NODE_RADIUS_BASE * 0.7}px` }}
                                        className={cn("select-none pointer-events-none transition-colors", node.isCompleted ? "fill-green-700 dark:fill-green-300" : "fill-foreground")}
                                    >
                                        {node.originalStep.emoji}
                                    </text>
                                ) : null}
                                
                                <text
                                    x={node.svg_x_title}
                                    y={node.svg_title_start_y}
                                    textAnchor="middle"
                                    dominantBaseline="hanging"
                                    className={cn(
                                        "text-[11px] md:text-[13px] font-semibold select-none transition-colors duration-200 ease-in-out pointer-events-none stroke-none",
                                        "group-hover/node-visual:fill-primary",
                                        titleTextFillClass
                                    )}
                                >
                                    {node.titleLines.map((line, lineIndex) => (<tspan key={lineIndex} x={node.svg_x_title} dy={lineIndex === 0 ? 0 : SVG_TEXT_LINE_HEIGHT}>{line}</tspan>))}
                                </text>
                                {node.isCompleted && (
                                     <CheckCircle
                                        x={node.nodeX + NODE_RADIUS_BASE * 0.6}
                                        y={node.nodeY - NODE_RADIUS_BASE * 0.9}
                                        width={ICON_SIZE*0.5}
                                        height={ICON_SIZE*0.5}
                                        className="text-green-500 fill-background"
                                     />
                                )}
                            </g>
                        );
                    })}
                    {emojiTargetNode && (
                        <Rocket
                            x={emojiTargetNode.nodeX - (ICON_SIZE * 0.8 / 2)}
                            y={emojiTargetNode.nodeY + NODE_RADIUS_BASE + (ICON_SIZE * 0.8 * 0.2)}
                            width={ICON_SIZE * 0.8}
                            height={ICON_SIZE * 0.8}
                            className="pointer-events-none text-primary opacity-80"
                            style={{ filter: 'url(#emoji-shadow)' }}
                        >
                            <animateTransform attributeName="transform" type="translate" values={`0 0; 0 -${NODE_RADIUS_BASE * 0.12}; 0 0`} begin="0s" dur="1.5s" repeatCount="indefinite" additive="sum" accumulate="none" />
                        </Rocket>
                    )}
                </g>
            </svg>
        </div>
    );
}

    