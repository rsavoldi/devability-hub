
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
import { useAuth } from '@/contexts/AuthContext';
import { countInteractions } from '@/lib/interaction-counter';
import type { Lesson, LessonProgress } from '@/lib/types';
import { mockLessons } from '@/lib/mockData';

interface RestoreProgressDialogProps {
  children: React.ReactNode;
}

function formatTimestamp(timestamp: number | undefined): string {
  if (!timestamp) return "Nenhum salvamento";
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'medium',
  }).format(new Date(timestamp));
}

function getProgressSummary(lessonProgress: Record<string, LessonProgress> | undefined, lessonId: string | undefined, allLessons: Lesson[]) {
    if (!lessonProgress || !lessonId) return '0/0';
    
    const lesson = allLessons.find(l => l.id === lessonId);
    if (!lesson) return 'N/A';
    
    const totalInteractions = countInteractions(lesson.content);
    const progress = lessonProgress[lessonId];
    const completedInteractions = progress?.completedInteractions?.length || 0;

    return `${completedInteractions}/${totalInteractions}`;
}
  
export function RestoreProgressDialog({ children }: RestoreProgressDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, userProfile, authStatus, restoreProgressFromSlot, isRestoring } = useAuth();
  
  const autosaveSlot = userProfile?.autosave;
  const manualSaveSlot = userProfile?.manualsave;

  const autoSummary = getProgressSummary(autosaveSlot?.lessonProgress, autosaveSlot?.lessonId, mockLessons);
  const manualSummary = getProgressSummary(manualSaveSlot?.lessonProgress, manualSaveSlot?.lessonId, mockLessons);

  const handleRestore = async (slotKey: 'autosave' | 'manualsave') => {
    if (isRestoring) return;
    await restoreProgressFromSlot(slotKey);
  };


  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Carregar Progresso da Lição</DialogTitle>
          <DialogDescription>
            {currentUser ? "Escolha um ponto de salvamento para restaurar. Esta ação substituirá seu progresso atual e recarregará a página." : "Você precisa estar logado para ver e carregar seu progresso salvo."}
          </DialogDescription>
        </DialogHeader>
        {authStatus === 'authenticated' && userProfile ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            {/* Autosave Slot */}
            <Card>
                <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Server className="h-5 w-5 text-primary" />
                    Autosave (Automático)
                </CardTitle>
                <CardDescription>{formatTimestamp(autosaveSlot?.timestamp)}</CardDescription>
                </CardHeader>
                <CardContent>
                {autosaveSlot && autosaveSlot.lessonTitle ? (
                    <div className="space-y-2 text-sm">
                      <p><strong>Lição:</strong> <span className="text-muted-foreground">{autosaveSlot.lessonTitle}</span></p>
                      <p><strong>Progresso:</strong> <span className="text-muted-foreground">{autoSummary} interações</span></p>
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground">Nenhum salvamento automático encontrado.</p>
                )}
                </CardContent>
                <DialogFooter className="p-6 pt-0">
                  <Button 
                      onClick={() => handleRestore('autosave')} 
                      disabled={!autosaveSlot || isRestoring}
                      className="w-full"
                  >
                      {isRestoring ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Server className="mr-2 h-4 w-4" />}
                      {isRestoring ? 'Carregando...' : 'Carregar Autosave'}
                  </Button>
                </DialogFooter>
            </Card>
            {/* Manual Save Slot */}
            <Card>
                <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Save className="h-5 w-5 text-primary" />
                    Manual Save (Manual)
                </CardTitle>
                <CardDescription>{formatTimestamp(manualSaveSlot?.timestamp)}</CardDescription>
                </CardHeader>
                <CardContent>
                {manualSaveSlot && manualSaveSlot.lessonTitle ? (
                    <div className="space-y-2 text-sm">
                       <p><strong>Lição:</strong> <span className="text-muted-foreground">{manualSaveSlot.lessonTitle}</span></p>
                       <p><strong>Progresso:</strong> <span className="text-muted-foreground">{manualSummary} interações</span></p>
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground">Nenhum salvamento manual encontrado.</p>
                )}
                </CardContent>
                <DialogFooter className="p-6 pt-0">
                  <Button 
                      onClick={() => handleRestore('manualsave')}
                      disabled={!manualSaveSlot || isRestoring}
                      className="w-full"
                  >
                      {isRestoring ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                      {isRestoring ? 'Carregando...' : 'Carregar Manual'}
                  </Button>
                </DialogFooter>
            </Card>
            </div>
        ) : (
            <div className="py-8 text-center text-muted-foreground">
                {authStatus === 'loading' || isRestoring ? <Loader2 className="animate-spin mx-auto h-8 w-8" /> : <p>Faça login para acessar esta funcionalidade.</p>}
            </div>
        )}
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={isRestoring}>Cancelar</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
