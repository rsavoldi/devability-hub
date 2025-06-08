
"use client";

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import type { LucideIcon } from "lucide-react";
import { CheckCircle, Loader2 } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, getDocs, type QueryDocumentSnapshot, type DocumentData, orderBy, query } from 'firebase/firestore';
import type { RoadmapStep, Module as ModuleType } from '@/lib/types'; // Assuming Module is also in types
import { useAuth } from '@/contexts/AuthContext'; // Import useAuth

// Constants for SVG layout
const NODE_RADIUS_BASE = 40;
const EMOJI_FONT_SIZE_BASE = NODE_RADIUS_BASE * 0.7;
const ICON_SIZE_BASE = NODE_RADIUS_BASE * 0.65;
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
  originalStep: RoadmapStep; // Keep original data for potential use
  nodeX: number;
  nodeY: number;
  titleLines: string[];
  svg_x_title: number;
  svg_title_start_y: number;
  emoji: string | null;
  iconName?: string; // Store icon name to dynamically import later or pass to a component
  description: string;
  firstModuleId?: string;
  isCompleted: boolean;
  isCurrent: boolean;
  order: number;
}

// Helper for dynamic Lucide icon import (if storing names)
// This is conceptual; actual dynamic import in JSX can be tricky.
// It might be better to map icon names to actual Icon components.
async function getLucideIcon(iconName?: string): Promise<LucideIcon | null> {
  if (!iconName) return null;
  try {
    const icons = await import('lucide-react');
    return (icons as any)[iconName] as LucideIcon || null;
  } catch (error) {
    console.error("Error loading icon:", iconName, error);
    return null;
  }
}


function splitTitleIntoLines(title: string | undefined, maxChars: number): string[] {
  if (!title) return [''];
  const words = title.split(' ');
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    if (currentLine.length === 0 && word.length > maxChars) {
      let tempWord = word;
      while (tempWord.length > maxChars) {
        lines.push(tempWord.substring(0, maxChars) + '-');
        tempWord = '-' + tempWord.substring(maxChars);
      }
      currentLine = tempWord + " ";
      if (currentLine.trim().length === 0 && lines.length > 0) continue;
    } else if ((currentLine + word).length > maxChars && currentLine.length > 0) {
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

export function RoadmapDisplay() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [roadmapData, setRoadmapData] = useState<RoadmapStep[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const { userProfile } = useAuth(); // Get userProfile from AuthContext

  useEffect(() => {
    setIsClient(true);
    const fetchRoadmapData = async () => {
      setLoadingData(true);
      try {
        const roadmapCollectionRef = collection(db, 'roadmaps');
        const q = query(roadmapCollectionRef, orderBy("order", "asc")); // Assuming you have an 'order' field
        const roadmapSnapshot = await getDocs(q);
        const fetchedRoadmapData: RoadmapStep[] = [];
        
        for (const docSnap of roadmapSnapshot.docs) {
            const data = docSnap.data() as Omit<RoadmapStep, 'id' | 'modules'> & { modulesData?: ModuleType[]}; // modulesData is a placeholder
            
            // Fetch modules for this roadmap step
            const modulesCollectionRef = collection(db, `roadmaps/${docSnap.id}/modules`);
            const modulesQuery = query(modulesCollectionRef, orderBy("order", "asc")); // Assuming modules also have an 'order' field
            const modulesSnapshot = await getDocs(modulesQuery);
            const modules: ModuleType[] = modulesSnapshot.docs.map(modDoc => ({
                id: modDoc.id,
                ...(modDoc.data() as Omit<ModuleType, 'id' | 'lessons' | 'exercises'>),
                lessons: [], // Placeholder, lessons would be fetched similarly or be subcollections
                exercises: [], // Placeholder
            }));

            fetchedRoadmapData.push({
                id: docSnap.id,
                ...data,
                modules,
            } as RoadmapStep);
        }
        setRoadmapData(fetchedRoadmapData);
      } catch (error) {
        console.error("Error fetching roadmap data: ", error);
      } finally {
        setLoadingData(false);
      }
    };

    fetchRoadmapData();
  }, []);

  const handleNavigation = useCallback((moduleId: string | undefined) => {
    if (moduleId) {
      router.push(`/modules/${moduleId}`);
    }
  }, [router]);

  const processedNodes: ProcessedRoadmapNode[] = useMemo(() => {
    if (!userProfile || roadmapData.length === 0) return []; // Ensure userProfile is loaded

    const completedModules = userProfile.completedModules || [];

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

      let titleXShift = 0;
      if (index > 0) { 
        titleXShift = (index % 2 !== 0) ? TITLE_HORIZONTAL_SHIFT_AMOUNT : -TITLE_HORIZONTAL_SHIFT_AMOUNT;
      }
      const svg_x_title = relativeNodeX + titleXShift;
      
      const firstModuleOfStep = step.modules && step.modules.length > 0 ? step.modules[0] : null;
      
      // Determine if step is completed based on its modules
      let isStepCompleted = false;
      if (step.modules && step.modules.length > 0) {
        isStepCompleted = step.modules.every(mod => completedModules.includes(mod.id));
      } else {
        // If a step has no modules, consider it completed if the roadmap step itself is marked (e.g. for introductory steps)
        // Or, if it has no modules and no explicit completion, it's not completed by module logic.
        // For simplicity here, if no modules, it's not completed through module completion.
        isStepCompleted = step.isCompleted || false; 
      }
      
      let isStepCurrent = false;
      // Find the first roadmap step that is not fully completed
      const firstUncompletedRoadmapStepIndex = roadmapData.findIndex(s => {
        if (!s.modules || s.modules.length === 0) return !(s.isCompleted || false); // if no modules, check its own completion
        return !s.modules.every(mod => completedModules.includes(mod.id));
      });
      
      if (firstUncompletedRoadmapStepIndex === -1 && roadmapData.every(s => s.isCompleted || (s.modules && s.modules.every(mod => completedModules.includes(mod.id) )) ) ) {
         // All roadmap steps are completed
        isStepCurrent = false; 
      } else if (index === firstUncompletedRoadmapStepIndex) {
        isStepCurrent = true;
      }

      return {
        id: step.id,
        originalStep: step,
        nodeX: relativeNodeX,
        nodeY: relativeNodeY,
        titleLines,
        svg_x_title,
        svg_title_start_y,
        isCompleted: isStepCompleted,
        isCurrent: isStepCurrent,
        emoji: step.emoji || null,
        iconName: step.iconName, // Assuming 'iconName' is stored in Firestore for dynamic import
        description: step.description,
        firstModuleId: step.modules && step.modules.length > 0 ? step.modules[0].id : undefined,
        order: step.order !== undefined ? step.order : index, // Use Firestore order or index
      };
    });
  }, [roadmapData, userProfile]); // Add userProfile to dependencies

  const paths = useMemo(() => {
    if (processedNodes.length < 2) return [];
    const pathData = [];
    for (let i = 0; i < processedNodes.length - 1; i++) {
      const startNode = processedNodes[i];
      const endNode = processedNodes[i + 1];
      // Path is completed if the startNode (which is a roadmap step) is completed
      const isPathCompleted = startNode.isCompleted; 
      pathData.push({
        id: `line-${startNode.id}-${endNode.id}`,
        x1: startNode.nodeX,
        y1: startNode.nodeY,
        x2: endNode.nodeX,
        y2: endNode.nodeY,
        isCompleted: isPathCompleted,
      });
    }
    return pathData;
  }, [processedNodes]);

  const { viewBoxWidth, viewBoxHeight, translateX, translateY } = useMemo(() => {
    if (!isClient || processedNodes.length === 0) {
      return { viewBoxWidth: PADDING * 2, viewBoxHeight: PADDING * 2, translateX: PADDING, translateY: PADDING };
    }

    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    processedNodes.forEach(pos => {
      const textWidthApproximation = MAX_CHARS_PER_LINE_TITLE * (SVG_TEXT_LINE_HEIGHT * 0.4); 
      const halfTextWidth = textWidthApproximation / 2;

      minX = Math.min(minX, pos.nodeX - NODE_RADIUS_BASE, pos.svg_x_title - halfTextWidth);
      maxX = Math.max(maxX, pos.nodeX + NODE_RADIUS_BASE, pos.svg_x_title + halfTextWidth);
      
      minY = Math.min(minY, pos.svg_title_start_y - (SVG_TEXT_LINE_HEIGHT / 2)); 
      maxY = Math.max(maxY, pos.nodeY + NODE_RADIUS_BASE);
    });
    
    const contentWidth = (maxX === -Infinity || minX === Infinity) ? (NODE_RADIUS_BASE * 2 + HORIZONTAL_ZIGZAG_OFFSET) : maxX - minX;
    const contentHeight = (maxY === -Infinity || minY === Infinity) ? (NODE_RADIUS_BASE * 2 + VERTICAL_NODE_SPACING * (roadmapData.length > 0 ? roadmapData.length -1 : 0)) : maxY - minY;
    
    const vbWidth = contentWidth + PADDING * 2;
    const vbHeight = contentHeight + PADDING * 2;
    
    const transX = (minX === Infinity ? 0 : -minX) + PADDING;
    const transY = (minY === Infinity ? 0 : -minY) + PADDING;

    return { 
      viewBoxWidth: Math.max(vbWidth, 400), 
      viewBoxHeight: Math.max(vbHeight, Math.max(600, processedNodes.length * VERTICAL_NODE_SPACING * 0.3 + PADDING *2 ) ),
      translateX: transX, 
      translateY: transY 
    };
  }, [isClient, processedNodes, roadmapData.length]);

  const emojiTargetNode = useMemo(() => {
      const currentNodes = processedNodes.filter(node => node.isCurrent && !node.isCompleted);
      if (currentNodes.length > 0) return currentNodes[0];
      
      const firstNotCompleted = processedNodes.find(node => !node.isCompleted);
      if (firstNotCompleted) return firstNotCompleted;
      
      return processedNodes.length > 0 && roadmapData.every(s => s.isCompleted) ? null : (processedNodes.length > 0 ? processedNodes[processedNodes.length - 1] : null);
  }, [processedNodes, roadmapData]);

  if (!isClient || loadingData) {
    return (
      <div className="flex justify-center items-center min-h-[300px] w-full">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-2">Carregando trilhas...</p>
      </div>
    );
  }
  
  return (
    <div 
      className="w-full overflow-auto py-8 flex justify-center items-start bg-muted/20 rounded-lg shadow-inner" 
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      <svg
        width="100%"
        className="min-w-[450px] max-w-[50vw] h-auto"
        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`} 
        preserveAspectRatio="xMidYMin meet"
        aria-labelledby="roadmap-title-main"
        role="graphics-document"
      >
        <title id="roadmap-title-main">Trilhas de Conhecimento</title>
        <defs>
          <filter id="node-shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="1" dy="2" stdDeviation="2" floodColor="hsl(var(--primary) / 0.25)" />
          </filter>
          <filter id="completed-node-shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="1" dy="2" stdDeviation="2" floodColor="hsl(var(--accent) / 0.3)" />
          </filter>
           <filter id="emoji-shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0.5" dy="0.5" stdDeviation="0.25" floodColor="rgba(0,0,0,0.4)" />
          </filter>
        </defs>

        <g transform={`translate(${translateX}, ${translateY})`}>
          {paths.map(path => (
            <line
              key={path.id}
              x1={path.x1}
              y1={path.y1}
              x2={path.x2}
              y2={path.y2}
              strokeWidth={LINE_THICKNESS}
              className={cn(
                "transition-all duration-300",
                path.isCompleted ? "stroke-green-500" : "stroke-border"
              )}
            />
          ))}

          {processedNodes.map((node) => {
            // Dynamic icon rendering would require a mapping or async import strategy here
            // For simplicity, assuming iconName directly maps to something displayable or an emoji/fallback
            const NodeIconComponent = node.originalStep.icon; // Using the icon component directly from the original step data
            const nodeAriaLabel = `Trilha: ${node.originalStep.title.replace(node.emoji || '', '').trim()}. Status: ${node.isCompleted ? 'Concluído' : node.isCurrent ? 'Atual' : 'Não iniciado'}. Pressione Enter ou Espaço para ${node.isCompleted ? 'revisitar' : 'iniciar'} esta trilha.`;
            
            return (
              <g 
                key={node.id}
                className={cn(
                  "group/node-visual focus:outline-none focus-visible:ring-0",
                  node.firstModuleId && "cursor-pointer"
                )}
                onClick={() => node.firstModuleId && handleNavigation(node.firstModuleId)}
                onKeyDown={(e) => {
                  if ((e.key === 'Enter' || e.key === ' ') && node.firstModuleId) {
                    e.preventDefault(); 
                    handleNavigation(node.firstModuleId);
                  }
                }}
                tabIndex={node.firstModuleId ? 0 : -1} 
                role={node.firstModuleId ? "link" : "img"}
                aria-label={nodeAriaLabel}
              >
                <title>{node.originalStep.title.replace(node.emoji || '', '').trim()}: {node.description}</title>
                
                <circle
                  cx={node.nodeX}
                  cy={node.nodeY}
                  r={NODE_RADIUS_BASE}
                  className={cn(
                    "stroke-2 transition-all duration-200 ease-in-out",
                    "group-hover/node-visual:stroke-primary group-hover/node-visual:opacity-90",
                     node.isCurrent && !node.isCompleted ? "ring-4 ring-primary/50 ring-offset-0 fill-primary/10 stroke-primary dark:ring-primary/70 dark:fill-primary/20" : "",
                    node.isCompleted ? "fill-green-100 dark:fill-green-900 stroke-green-500" 
                                     : "fill-background stroke-border"
                  )}
                   style={{ filter: node.isCompleted ? 'url(#completed-node-shadow)' : 'url(#node-shadow)' }}
                />
                {node.emoji && (
                  <text
                    x={node.nodeX}
                    y={node.nodeY}
                    textAnchor="middle"
                    dominantBaseline="central"
                    style={{ fontSize: `${EMOJI_FONT_SIZE_BASE}px` }}
                    className={cn(
                      "select-none pointer-events-none transition-colors",
                       node.isCompleted ? "fill-green-700 dark:fill-green-400" : "fill-foreground group-hover/node-visual:fill-primary"
                    )}
                  >
                    {node.emoji}
                  </text>
                )}
                {!node.emoji && NodeIconComponent && (
                   <foreignObject
                    x={node.nodeX - ICON_SIZE_BASE / 2}
                    y={node.nodeY - ICON_SIZE_BASE / 2}
                    width={ICON_SIZE_BASE}
                    height={ICON_SIZE_BASE}
                    className="pointer-events-none overflow-visible"
                  >
                    <div className="flex items-center justify-center w-full h-full">
                      <NodeIconComponent
                        className={cn(
                          "w-full h-full transition-colors",
                          node.isCompleted ? "text-green-600 dark:text-green-400" : "text-primary"
                        )}
                      />
                    </div>
                  </foreignObject>
                )}
                <text
                  x={node.svg_x_title}
                  y={node.svg_title_start_y}
                  textAnchor="middle"
                  dominantBaseline="hanging"
                  className={cn(
                    "text-[11px] md:text-[13px] font-semibold select-none transition-colors duration-200 ease-in-out pointer-events-none stroke-none",
                    "group-hover/node-visual:fill-primary",
                    node.isCompleted ? "fill-green-700 dark:fill-green-300" : "fill-foreground"
                  )}
                >
                  {node.titleLines.map((line, lineIndex) => (
                    <tspan key={lineIndex} x={node.svg_x_title} dy={lineIndex === 0 ? 0 : SVG_TEXT_LINE_HEIGHT}>
                      {line}
                    </tspan>
                  ))}
                </text>
              </g>
            );
          })}

          {emojiTargetNode && (
            <text
              x={emojiTargetNode.nodeX}
              y={emojiTargetNode.nodeY + NODE_RADIUS_BASE + EMOJI_FONT_SIZE_BASE * 0.6} 
              fontSize={EMOJI_FONT_SIZE_BASE * 0.7} 
              textAnchor="middle"
              dominantBaseline="central"
              className="pointer-events-none"
              style={{ filter: 'url(#emoji-shadow)' }}
            >
              <tspan>🚀</tspan>
              <animateTransform
                  attributeName="transform"
                  type="translate" 
                  values={`0 0; 0 -${NODE_RADIUS_BASE * 0.12}; 0 0`}
                  begin="0s"
                  dur="1.5s"
                  repeatCount="indefinite"
                  additive="sum" 
                  accumulate="none"
              />
            </text>
          )}
        </g>
      </svg>
    </div>
  );
}
