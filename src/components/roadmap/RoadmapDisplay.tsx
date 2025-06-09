
"use client";

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import type { RoadmapStep, Module as ModuleType, LucideIcon } from '@/lib/types';
import { mockRoadmapData } from '@/lib/mockData'; 
import { useAuth } from '@/contexts/AuthContext';

// --- CONSTANTES E INTERFACES ---
const NODE_RADIUS_BASE = 40;
const EMOJI_FONT_SIZE_BASE = NODE_RADIUS_BASE * 0.6; // Ligeiramente menor para ícones
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
    emoji: string | null;
    icon?: LucideIcon; 
    iconName?: string; 
    description: string;
    firstModuleId?: string;
    isCompleted: boolean;
    isCurrent: boolean;
    order: number;
}

// --- FUNÇÃO HELPER ---
function splitTitleIntoLines(title: string | undefined, maxChars: number): string[] {
    if (!title) return [''];
    const words = title.split(' ');
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
    
    const [dataLoading, setDataLoading] = useState(false); 
    const roadmapData = mockRoadmapData; 

    const handleNavigation = useCallback((moduleId: string | undefined) => {
        if (moduleId) {
            router.push(`/modules/${moduleId}`);
        }
    }, [router]);

    const processedNodes: ProcessedRoadmapNode[] = useMemo(() => {
        if (authLoading) return [];

        const completedModules = userProfile ? new Set(userProfile.completedModules || []) : new Set<string>();

        return roadmapData.map((step, index) => {
            const localizedTitleFull = step.title;
            const emoji = step.emoji || null;
            const displayTitleWithoutEmoji = localizedTitleFull.replace(emoji || '', '').trim();
            const titleLines = splitTitleIntoLines(displayTitleWithoutEmoji, MAX_CHARS_PER_LINE_TITLE);
            const titleBlockHeight = titleLines.length * SVG_TEXT_LINE_HEIGHT;

            const relativeNodeX = (index % 2 === 0 ? 0 : HORIZONTAL_ZIGZAG_OFFSET);
            const relativeNodeY = (index * VERTICAL_NODE_SPACING);
            
            const titleBaseY = relativeNodeY - NODE_RADIUS_BASE - TITLE_OFFSET_ABOVE_CIRCLE;
            const svg_title_start_y = titleBaseY - titleBlockHeight + (SVG_TEXT_LINE_HEIGHT / 2);

            let titleXShift = (index > 0) ? (index % 2 !== 0 ? TITLE_HORIZONTAL_SHIFT_AMOUNT : -TITLE_HORIZONTAL_SHIFT_AMOUNT) : 0;
            const svg_x_title = relativeNodeX + titleXShift;
            
            const firstModuleOfStep = step.modules && step.modules.length > 0 ? step.modules[0] : null;
            
            const isStepCompleted = userProfile ? (step.modules ? step.modules.every(mod => completedModules.has(mod.id)) : false) : false;

            let isCurrentNode = false;
            if (!userProfile) { 
                isCurrentNode = index === 0; 
            } else { 
                const allNodesForCurrentLogic = roadmapData.map((s, idx) => ({
                    isCompleted: s.modules ? s.modules.every(m => completedModules.has(m.id)) : false,
                    order: s.order ?? idx,
                })).sort((a,b) => a.order - b.order);

                const firstUncompletedNode = allNodesForCurrentLogic.find(n => !n.isCompleted);
                if (firstUncompletedNode) {
                    isCurrentNode = (step.order ?? index) === firstUncompletedNode.order;
                } else if (allNodesForCurrentLogic.length > 0) {
                    isCurrentNode = (step.order ?? index) === allNodesForCurrentLogic[allNodesForCurrentLogic.length -1].order;
                } else {
                    isCurrentNode = index === 0; 
                }
            }
            
            return {
                id: step.id,
                originalStep: step,
                nodeX: relativeNodeX,
                nodeY: relativeNodeY,
                titleLines,
                svg_x_title,
                svg_title_start_y,
                emoji,
                icon: step.icon,
                iconName: step.iconName,
                description: step.description,
                firstModuleId: firstModuleOfStep?.id,
                isCompleted,
                isCurrent,
                order: step.order ?? index,
            };
        });
    }, [roadmapData, userProfile, authLoading]);

    const paths = useMemo(() => {
        if (processedNodes.length < 2) return [];
        return processedNodes.slice(0, -1).map((startNode, i) => ({
            id: `line-${startNode.id}-${processedNodes[i+1].id}`,
            x1: startNode.nodeX, y1: startNode.nodeY,
            x2: processedNodes[i+1].nodeX, y2: processedNodes[i+1].nodeY,
            isCompleted: userProfile ? startNode.isCompleted : false, 
        }));
    }, [processedNodes, userProfile]);

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
        const contentWidth = maxX - minX;
        const contentHeight = maxY - minY;
        return {
            viewBoxWidth: contentWidth + PADDING * 2,
            viewBoxHeight: contentHeight + PADDING * 2,
            translateX: -minX + PADDING,
            translateY: -minY + PADDING
        };
    }, [processedNodes]);
    
    const emojiTargetNode = useMemo(() => {
        if (authLoading) return null;
        if (!userProfile) { 
            return processedNodes.length > 0 ? processedNodes[0] : null;
        }
        const currentNode = processedNodes.find(node => node.isCurrent && !node.isCompleted);
        if (currentNode) return currentNode;
        
        const firstNotCompleted = processedNodes.find(node => !node.isCompleted);
        if (firstNotCompleted) return firstNotCompleted;

        return processedNodes.length > 0 ? processedNodes[processedNodes.length - 1] : null;
    }, [processedNodes, userProfile, authLoading]);


    if (authLoading || dataLoading) {
        return (
            <div className="flex justify-center items-center min-h-[300px] w-full">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="ml-2">Carregando trilhas...</p>
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
                        const nodeAriaLabel = `Trilha: ${node.originalStep.title.replace(node.emoji || '', '').trim()}. Status: ${userProfile ? (node.isCompleted ? 'Concluído' : node.isCurrent ? 'Atual' : 'Não iniciado') : (node.isCurrent ? 'Atual' : 'Não iniciado')}. Pressione Enter ou Espaço para ${userProfile && node.isCompleted ? 'revisitar' : 'iniciar'} esta trilha.`;
                        const IconComponent = node.icon; 
                        const iconFillClass = node.isCompleted ? "fill-green-700 dark:fill-green-400" : "fill-foreground group-hover/node-visual:fill-primary";
                        const textFillClass = node.isCompleted ? "fill-green-700 dark:fill-green-300" : "fill-foreground";

                        return (
                            <g key={node.id} className={cn("group/node-visual focus:outline-none focus-visible:ring-0", node.firstModuleId && "cursor-pointer")} onClick={() => handleNavigation(node.firstModuleId)} onKeyDown={(e) => { if ((e.key === 'Enter' || e.key === ' ') && node.firstModuleId) { e.preventDefault(); handleNavigation(node.firstModuleId); }}} tabIndex={node.firstModuleId ? 0 : -1} role={node.firstModuleId ? "link" : "img"} aria-label={nodeAriaLabel}>
                                <title>{node.originalStep.title.replace(node.emoji || '', '').trim()}: {node.description}</title>
                                <circle cx={node.nodeX} cy={node.nodeY} r={NODE_RADIUS_BASE} className={cn("stroke-2 transition-all duration-200 ease-in-out", "group-hover/node-visual:stroke-primary group-hover/node-visual:opacity-90", node.isCurrent && !node.isCompleted ? "ring-4 ring-primary/50 ring-offset-0 fill-primary/10 stroke-primary dark:ring-primary/70 dark:fill-primary/20" : "", node.isCompleted ? "fill-green-100 dark:fill-green-900 stroke-green-500" : "fill-background stroke-border")} style={{ filter: node.isCompleted ? 'url(#completed-node-shadow)' : 'url(#node-shadow)' }} />
                                
                                {IconComponent ? (
                                    <IconComponent
                                        x={node.nodeX - EMOJI_FONT_SIZE_BASE / 2}
                                        y={node.nodeY - EMOJI_FONT_SIZE_BASE / 2}
                                        width={EMOJI_FONT_SIZE_BASE}
                                        height={EMOJI_FONT_SIZE_BASE}
                                        className={cn("select-none pointer-events-none transition-colors", iconFillClass)}
                                    />
                                ) : node.emoji ? (
                                    <text x={node.nodeX} y={node.nodeY} textAnchor="middle" dominantBaseline="central" style={{ fontSize: `${NODE_RADIUS_BASE * 0.7}px` }} className={cn("select-none pointer-events-none transition-colors", iconFillClass)}>{node.emoji}</text>
                                ) : null}

                                <text x={node.svg_x_title} y={node.svg_title_start_y} textAnchor="middle" dominantBaseline="hanging" className={cn("text-[11px] md:text-[13px] font-semibold select-none transition-colors duration-200 ease-in-out pointer-events-none stroke-none", "group-hover/node-visual:fill-primary", textFillClass)}>
                                    {node.titleLines.map((line, lineIndex) => (<tspan key={lineIndex} x={node.svg_x_title} dy={lineIndex === 0 ? 0 : SVG_TEXT_LINE_HEIGHT}>{line}</tspan>))}
                                </text>
                            </g>
                        );
                    })}
                    {emojiTargetNode && (<text x={emojiTargetNode.nodeX} y={emojiTargetNode.nodeY + NODE_RADIUS_BASE + EMOJI_FONT_SIZE_BASE * 0.6} fontSize={EMOJI_FONT_SIZE_BASE * 0.7} textAnchor="middle" dominantBaseline="central" className="pointer-events-none" style={{ filter: 'url(#emoji-shadow)' }}><tspan>🚀</tspan><animateTransform attributeName="transform" type="translate" values={`0 0; 0 -${NODE_RADIUS_BASE * 0.12}; 0 0`} begin="0s" dur="1.5s" repeatCount="indefinite" additive="sum" accumulate="none" /></text>)}
                </g>
            </svg>
        </div>
    );
}
