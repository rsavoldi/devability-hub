
"use client";

import { useState, useEffect } from 'react';
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
import type { SaveSlot, UserProfile } from '@/lib/types';
import { LOCAL_STORAGE_KEYS } from '@/constants';
import { useAuth } from '@/contexts/AuthContext';
import { countInteractions } from '@/lib/utils';
import { mockLessons } from '@/lib/mockData';

interface RestoreProgressDialogProps {
  children: React.ReactNode;
  lessonId: string | null;
}

function formatTimestamp(timestamp: number): string {
  if (!timestamp) return "Nenhum dado";
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'medium',
  }).format(new Date(timestamp));
}

function getProgressSummary(profile: UserProfile | null, lessonId: string | null) {
    if (!profile) return { interactions: '0/0', audio: '0%', points: 0, exercises: 0 };
    
    let lessonInteractions = '0/0';
    let audioProgress = '0%';
  
    if (lessonId) {
      const lesson = mockLessons.find(l => l.id === lessonId);
      if (lesson) {
          const total = countInteractions(lesson.content);
          const completed = profile.lessonProgress[lessonId]?.completedInteractions?.length || 0;
          lessonInteractions = `${completed}/${total}`;
          audioProgress = `${Math.round(profile.lessonProgress[lessonId]?.audioProgress || 0)}%`;
      }
    }
  
    return {
      interactions: lessonInteractions,
      audio: audioProgress,
      points: profile.points || 0,
      exercises: profile.completedExercises?.length || 0,
    };
  }
  

export function RestoreProgressDialog({ children, lessonId }: RestoreProgressDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [autosaveSlot, setAutosaveSlot] = useState<SaveSlot | null>(null);
  const [manualSaveSlot, setManualSaveSlot] = useState<SaveSlot | null>(null);
  const { restoreProgressFromSlot } = useAuth();

  useEffect(() => {
    if (isOpen) {
      const autoKey = lessonId ? `${LOCAL_STORAGE_KEYS.AUTOSAVE_PROGRESS}_${lessonId}` : null;
      const manualKey = lessonId ? `${LOCAL_STORAGE_KEYS.MANUALSAVE_PROGRESS}_${lessonId}` : null;
      
      const autoRaw = autoKey ? localStorage.getItem(autoKey) : null;
      const manualRaw = manualKey ? localStorage.getItem(manualKey) : null;
      
      setAutosaveSlot(autoRaw ? JSON.parse(autoRaw) : null);
      setManualSaveSlot(manualRaw ? JSON.parse(manualRaw) : null);
    }
  }, [isOpen, lessonId]);

  const handleRestore = (slotKey: 'autosave' | 'manualsave') => {
    if (!lessonId) return;
    if (confirm(`Tem certeza que deseja carregar os dados do slot "${slotKey === 'autosave' ? 'Autosave' : 'Manual Save'}"? Seu progresso atual nesta lição será substituído.`)) {
        restoreProgressFromSlot(slotKey, lessonId);
        setIsOpen(false);
    }
  };
  
  const autoSummary = getProgressSummary(autosaveSlot?.profile ?? null, lessonId);
  const manualSummary = getProgressSummary(manualSaveSlot?.profile ?? null, lessonId);


  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Carregar Progresso da Lição</DialogTitle>
          <DialogDescription>
            {lessonId ? "Escolha um ponto de salvamento para restaurar para esta lição. Esta ação substituirá seu progresso atual nesta lição." : "Abra uma lição para ver e carregar seu progresso salvo."}
          </DialogDescription>
        </DialogHeader>
        {lessonId ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            {/* Autosave Slot */}
            <Card className={!autosaveSlot ? 'opacity-50' : ''}>
                <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Server className="h-5 w-5 text-primary" />
                    Autosave
                </CardTitle>
                <CardDescription>{formatTimestamp(autosaveSlot?.timestamp ?? 0)}</CardDescription>
                </CardHeader>
                <CardContent>
                {autosaveSlot ? (
                    <div className="space-y-1 text-sm">
                    <p><strong>Pontos Totais:</strong> {autoSummary.points}</p>
                    <p><strong>Interações na Lição:</strong> {autoSummary.interactions}</p>
                    <p><strong>Progresso do Áudio:</strong> {autoSummary.audio}</p>
                    <p><strong>Exercícios Concluídos:</strong> {autoSummary.exercises}</p>
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground">Nenhum salvamento automático encontrado para esta lição.</p>
                )}
                </CardContent>
                <DialogFooter className="p-6 pt-0">
                <Button 
                    onClick={() => handleRestore('autosave')} 
                    disabled={!autosaveSlot}
                    className="w-full"
                >
                    <Loader2 className="mr-2 h-4 w-4" /> Carregar
                </Button>
                </DialogFooter>
            </Card>
            {/* Manual Save Slot */}
            <Card className={!manualSaveSlot ? 'opacity-50' : ''}>
                <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Save className="h-5 w-5 text-primary" />
                    Manual Save
                </CardTitle>
                <CardDescription>{formatTimestamp(manualSaveSlot?.timestamp ?? 0)}</CardDescription>
                </CardHeader>
                <CardContent>
                {manualSaveSlot ? (
                    <div className="space-y-1 text-sm">
                        <p><strong>Pontos Totais:</strong> {manualSummary.points}</p>
                        <p><strong>Interações na Lição:</strong> {manualSummary.interactions}</p>
                        <p><strong>Progresso do Áudio:</strong> {manualSummary.audio}</p>
                        <p><strong>Exercícios Concluídos:</strong> {manualSummary.exercises}</p>
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground">Nenhum salvamento manual encontrado para esta lição.</p>
                )}
                </CardContent>
                <DialogFooter className="p-6 pt-0">
                <Button 
                    onClick={() => handleRestore('manualsave')} 
                    disabled={!manualSaveSlot}
                    className="w-full"
                >
                    <Loader2 className="mr-2 h-4 w-4" /> Carregar
                </Button>
                </DialogFooter>
            </Card>
            </div>
        ) : (
            <div className="py-8 text-center text-muted-foreground">
                <p>Nenhuma lição ativa para carregar o progresso.</p>
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
