"use client";

import { useState, useEffect, useCallback } from 'react';
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
import { useAuth } from '@/contexts/AuthContext';
import { getBackupFromFirestore } from '@/lib/firebase/user';
import { countInteractions } from '@/lib/interaction-counter';
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
  const [isLoading, setIsLoading] = useState(false);
  const [autosaveSlot, setAutosaveSlot] = useState<SaveSlot | null>(null);
  const [manualSaveSlot, setManualSaveSlot] = useState<SaveSlot | null>(null);
  const { currentUser, restoreProgressFromSlot } = useAuth();

  const fetchBackups = useCallback(async () => {
    if (!isOpen || !currentUser || !lessonId) {
      return;
    }
    setIsLoading(true);
    try {
      const [auto, manual] = await Promise.all([
        getBackupFromFirestore(currentUser.uid, lessonId, 'autosave'),
        getBackupFromFirestore(currentUser.uid, lessonId, 'manualsave')
      ]);
      setAutosaveSlot(auto);
      setManualSaveSlot(manual);
    } catch (error) {
      console.error("Failed to fetch backups:", error);
      // Toast notification is handled by the global error listener
    } finally {
      setIsLoading(false);
    }
  }, [isOpen, currentUser, lessonId]);

  useEffect(() => {
    if(isOpen) {
      fetchBackups();
    }
  }, [isOpen, fetchBackups]);

  const handleRestore = (slotKey: 'autosave' | 'manualsave') => {
    if (!lessonId) return;
    restoreProgressFromSlot(slotKey, lessonId);
    setIsOpen(false);
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
            {lessonId && currentUser ? "Escolha um ponto de salvamento para restaurar. Esta ação substituirá seu progresso atual nesta lição." : "Abra uma lição e esteja logado para ver e carregar seu progresso salvo."}
          </DialogDescription>
        </DialogHeader>
        {lessonId && currentUser ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            {/* Autosave Slot */}
            <Card className={isLoading ? 'opacity-50' : ''}>
                <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Server className="h-5 w-5 text-primary" />
                    Autosave
                </CardTitle>
                <CardDescription>{isLoading ? 'Carregando...' : formatTimestamp(autosaveSlot?.timestamp ?? 0)}</CardDescription>
                </CardHeader>
                <CardContent>
                {isLoading ? <Loader2 className="animate-spin" /> : autosaveSlot ? (
                    <div className="space-y-1 text-sm">
                    <p><strong>Pontos Totais:</strong> {autoSummary.points}</p>
                    <p><strong>Interações na Lição:</strong> {autoSummary.interactions}</p>
                    <p><strong>Progresso do Áudio:</strong> {autoSummary.audio}</p>
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground">Nenhum salvamento automático encontrado para esta lição.</p>
                )}
                </CardContent>
                <DialogFooter className="p-6 pt-0">
                <Button 
                    onClick={() => handleRestore('autosave')} 
                    disabled={!autosaveSlot || isLoading}
                    className="w-full"
                >
                    <Server className="mr-2 h-4 w-4" /> Carregar Autosave
                </Button>
                </DialogFooter>
            </Card>
            {/* Manual Save Slot */}
            <Card className={isLoading ? 'opacity-50' : ''}>
                <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Save className="h-5 w-5 text-primary" />
                    Manual Save
                </CardTitle>
                <CardDescription>{isLoading ? 'Carregando...' : formatTimestamp(manualSaveSlot?.timestamp ?? 0)}</CardDescription>
                </CardHeader>
                <CardContent>
                {isLoading ? <Loader2 className="animate-spin" /> : manualSaveSlot ? (
                    <div className="space-y-1 text-sm">
                        <p><strong>Pontos Totais:</strong> {manualSummary.points}</p>
                        <p><strong>Interações na Lição:</strong> {manualSummary.interactions}</p>
                        <p><strong>Progresso do Áudio:</strong> {manualSummary.audio}</p>
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground">Nenhum salvamento manual encontrado para esta lição.</p>
                )}
                </CardContent>
                <DialogFooter className="p-6 pt-0">
                <Button 
                    onClick={() => handleRestore('manualsave')} 
                    disabled={!manualSaveSlot || isLoading}
                    className="w-full"
                >
                    <Save className="mr-2 h-4 w-4" /> Carregar Manual
                </Button>
                </DialogFooter>
            </Card>
            </div>
        ) : (
            <div className="py-8 text-center text-muted-foreground">
                <p>Nenhuma lição ativa ou usuário não logado.</p>
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
