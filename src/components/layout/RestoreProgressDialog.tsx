
"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Server, Save } from 'lucide-react';
import type { LessonProgress } from '@/lib/types';
import { useAuth } from '@/contexts/AuthContext';
import { countInteractions } from '@/lib/interaction-counter';
import { mockLessons } from '@/lib/mockData';

interface RestoreProgressDialogProps {
    children: React.ReactNode;
    lessonId?: string | null;
}

function formatTimestamp(timestamp: number | undefined): string {
  if (!timestamp) return "Nenhum salvamento";
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'medium',
  }).format(new Date(timestamp));
}

function getProgressSummary(lessonProgress: Record<string, any> | undefined) {
    if (!lessonProgress) return { interactions: '0/0', audio: '0%' };
    
    let totalInteractions = 0;
    let completedInteractions = 0;
    let totalAudioProgress = 0;
    let lessonCountWithAudio = 0;

    for (const lessonId in lessonProgress) {
        const lesson = mockLessons.find(l => l.id === lessonId);
        if (lesson) {
            const lessonTotalInteractions = countInteractions(lesson.content);
            totalInteractions += lessonTotalInteractions;
        }
        const progress = lessonProgress[lessonId];
        if (progress?.completedInteractions) {
            completedInteractions += progress.completedInteractions.length;
        }
        if (progress?.audioProgress) {
            totalAudioProgress += progress.audioProgress;
            lessonCountWithAudio++;
        }
    }
  
    const avgAudio = lessonCountWithAudio > 0 ? Math.round(totalAudioProgress / lessonCountWithAudio) : 0;

    return {
      interactions: `${completedInteractions}/${totalInteractions}`,
      audio: `${avgAudio}%`,
    };
}
  
export function RestoreProgressDialog({ children }: RestoreProgressDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, userProfile, loading, restoreProgressFromSlot } = useAuth();
  
  const autosaveSlot = userProfile?.autosave;
  const manualSaveSlot = userProfile?.manualsave;

  const autoSummary = getProgressSummary(autosaveSlot?.lessonProgress);
  const manualSummary = getProgressSummary(manualSaveSlot?.lessonProgress);


  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Carregar Progresso da Lição</DialogTitle>
          <DialogDescription>
            {currentUser ? "Escolha um ponto de salvamento para restaurar. Esta ação substituirá seu progresso atual nesta lição." : "Você precisa estar logado para ver e carregar seu progresso salvo."}
          </DialogDescription>
        </DialogHeader>
        {currentUser && !loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            {/* Autosave Slot */}
            <Card>
                <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Server className="h-5 w-5 text-primary" />
                    Autosave
                </CardTitle>
                <CardDescription>{formatTimestamp(autosaveSlot?.timestamp)}</CardDescription>
                </CardHeader>
                <CardContent>
                {autosaveSlot ? (
                    <div className="space-y-1 text-sm">
                    <p><strong>Interações na Lição:</strong> {autoSummary.interactions}</p>
                    <p><strong>Progresso Médio Áudio:</strong> {autoSummary.audio}</p>
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground">Nenhum salvamento automático encontrado.</p>
                )}
                </CardContent>
                <DialogFooter className="p-6 pt-0">
                <Button 
                    onClick={() => {
                        restoreProgressFromSlot('autosave');
                        setIsOpen(false);
                    }} 
                    disabled={!autosaveSlot}
                    className="w-full"
                >
                    <Server className="mr-2 h-4 w-4" /> Carregar Autosave
                </Button>
                </DialogFooter>
            </Card>
            {/* Manual Save Slot */}
            <Card>
                <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Save className="h-5 w-5 text-primary" />
                    Manual Save
                </CardTitle>
                <CardDescription>{formatTimestamp(manualSaveSlot?.timestamp)}</CardDescription>
                </CardHeader>
                <CardContent>
                {manualSaveSlot ? (
                    <div className="space-y-1 text-sm">
                        <p><strong>Interações na Lição:</strong> {manualSummary.interactions}</p>
                        <p><strong>Progresso Médio Áudio:</strong> {manualSummary.audio}</p>
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground">Nenhum salvamento manual encontrado.</p>
                )}
                </CardContent>
                <DialogFooter className="p-6 pt-0">
                <Button 
                    onClick={() => {
                        restoreProgressFromSlot('manualsave');
                        setIsOpen(false);
                    }} 
                    disabled={!manualSaveSlot}
                    className="w-full"
                >
                    <Save className="mr-2 h-4 w-4" /> Carregar Manual
                </Button>
                </DialogFooter>
            </Card>
            </div>
        ) : (
            <div className="py-8 text-center text-muted-foreground">
                {loading ? <Loader2 className="animate-spin mx-auto h-8 w-8" /> : <p>Faça login para acessar esta funcionalidade.</p>}
            </div>
        )}
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

    