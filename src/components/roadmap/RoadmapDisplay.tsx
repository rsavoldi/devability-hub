
// src/components/roadmap/RoadmapDisplay.tsx
"use client";

import React, { useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Loader2, CheckCircle } from 'lucide-react'; 
import type { RoadmapStep } from '@/lib/types';
import { useAuth } from '@/contexts/AuthContext';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { LessonItemCard } from '@/components/lessons/LessonItemCard';
import { countInteractions } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

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

interface RoadmapDisplayProps {
  initialRoadmapData?: RoadmapStep[]; // Tornar opcional para lidar com estado de carregamento
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
    const [openAccordion, setOpenAccordion] = useState<string | null>(null);

    const roadmapData = useMemo(() => {
        if (!userProfile) return [];

        const completedModulesSet = new Set(userProfile.completedModules || []);
        const completedExercisesSet = new Set(userProfile.completedExercises || []);
        const lessonProgress = userProfile.lessonProgress || {};

        return mockRoadmapData.map(trilha => {
            let allModulesInTrilhaCompleted = true;
            const updatedModules = trilha.modules.map(module => {
                const totalLessons = module.lessons?.length || 0;
                const completedLessons = totalLessons > 0 ? module.lessons.filter(l => lessonProgress[l.id]?.completed).length : 0;
                
                const totalExercises = module.exercises?.length || 0;
                const completedExercises = totalExercises > 0 ? module.exercises.filter(e => completedExercisesSet.has(e.id)).length : 0;

                const totalItems = totalLessons + totalExercises;
                const completedItems = completedLessons + completedExercises;

                const moduleIsCompleted = totalItems > 0 ? completedItems === totalItems : completedModulesSet.has(module.id);
                if (!moduleIsCompleted) {
                    allModulesInTrilhaCompleted = false;
                }

                return {
                    ...module,
                    isCompleted: moduleIsCompleted,
                    progress: totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : (moduleIsCompleted ? 100 : 0),
                };
            });
            
            return {
                ...trilha,
                modules: updatedModules,
                isCompleted: allModulesInTrilhaCompleted,
            };
        });
    }, [userProfile]);

    const handleAccordionToggle = (stepId: string) => {
        setOpenAccordion(prev => (prev === stepId ? null : stepId));
    };

    const getLessonProgress = useCallback((lessonId: string, lessonContent: string): number => {
        if (!userProfile) return 0;
        const progress = userProfile.lessonProgress[lessonId];
        if (progress?.completed) return 100;
        const totalInteractions = countInteractions(lessonContent);
        if (totalInteractions === 0) return 0;
        const completedCount = progress?.completedInteractions.length || 0;
        return Math.round((completedCount / totalInteractions) * 100);
    }, [userProfile]);


    if (authLoading) {
      return (
          <div className="flex justify-center items-center min-h-[300px] w-full">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="ml-2">Carregando trilhas...</p>
          </div>
      );
    }

    if (roadmapData.length === 0) {
        return (
            <div className="flex justify-center items-center min-h-[300px] w-full">
                <p className="text-lg text-muted-foreground">Nenhuma trilha encontrada.</p>
            </div>
        );
    }
    
    return (
        <div className="w-full space-y-4">
            {roadmapData.map(step => (
                <Accordion key={step.id} type="single" collapsible value={openAccordion} onValueChange={() => handleAccordionToggle(step.id)} className="w-full">
                    <AccordionItem value={step.id} className="border-2 rounded-lg overflow-hidden shadow-md data-[state=open]:border-primary transition-all">
                        <AccordionTrigger className="p-4 hover:no-underline hover:bg-muted/50 cursor-pointer">
                            <div className="flex items-center gap-4 w-full">
                                <span className="text-3xl">{step.emoji}</span>
                                <div className="flex-1 text-left">
                                    <h3 className="text-lg font-semibold">{step.title}</h3>
                                    <p className="text-sm text-muted-foreground">{step.description}</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <Progress value={step.modules.reduce((acc, mod) => acc + (mod.progress || 0), 0) / step.modules.length} className="h-2 w-32" />
                                        <span className="text-xs font-medium text-muted-foreground">
                                            {`${Math.round(step.modules.reduce((acc, mod) => acc + (mod.progress || 0), 0) / step.modules.length)}%`}
                                        </span>
                                        {step.isCompleted && <CheckCircle className="h-4 w-4 text-green-500" />}
                                    </div>
                                </div>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="p-6 bg-muted/20 border-t">
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                                {step.modules.flatMap(module => module.lessons).map(lesson => (
                                    <LessonItemCard
                                        key={lesson.id}
                                        lesson={lesson}
                                        progress={getLessonProgress(lesson.id, lesson.content)}
                                    />
                                ))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            ))}
        </div>
    );
}

// Manter mockRoadmapData importado e usado no useMemo.
import { mockRoadmapData } from '@/lib/mockData';
