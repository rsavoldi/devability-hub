
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

function formatTimestamp(timestamp: number): string {
  if (!timestamp) return "Nenhum dado";
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'medium',
  }).format(new Date(timestamp));
}

function getProgressSummary(profile: UserProfile | null) {
  if (!profile) return { interactions: 0, exercises: 0, points: 0 };

  const totalInteractions = Object.values(profile.lessonProgress || {}).reduce(
    (acc, progress) => acc + (progress.completedInteractions?.length || 0),
    0
  );

  return {
    interactions: totalInteractions,
    exercises: profile.completedExercises?.length || 0,
    points: profile.points || 0,
  };
}

export function RestoreProgressDialog({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [autosaveSlot, setAutosaveSlot] = useState<SaveSlot | null>(null);
  const [manualSaveSlot, setManualSaveSlot] = useState<SaveSlot | null>(null);
  const { restoreProgressFromSlot } = useAuth();

  useEffect(() => {
    if (isOpen) {
      const autoRaw = localStorage.getItem(LOCAL_STORAGE_KEYS.AUTOSAVE_PROGRESS);
      const manualRaw = localStorage.getItem(LOCAL_STORAGE_KEYS.MANUALSAVE_PROGRESS);
      
      setAutosaveSlot(autoRaw ? JSON.parse(autoRaw) : null);
      setManualSaveSlot(manualRaw ? JSON.parse(manualRaw) : null);
    }
  }, [isOpen]);

  const handleRestore = (slotKey: 'autosave' | 'manualsave') => {
    if (confirm(`Tem certeza que deseja carregar os dados do slot "${slotKey === 'autosave' ? 'Autosave' : 'Manual Save'}"? Seu progresso atual será substituído.`)) {
        restoreProgressFromSlot(slotKey);
        setIsOpen(false);
    }
  };
  
  const autoSummary = getProgressSummary(autosaveSlot?.profile ?? null);
  const manualSummary = getProgressSummary(manualSaveSlot?.profile ?? null);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Carregar Progresso</DialogTitle>
          <DialogDescription>
            Escolha um ponto de salvamento para restaurar. Esta ação substituirá seu progresso atual.
          </DialogDescription>
        </DialogHeader>
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
                  <p><strong>Pontos:</strong> {autoSummary.points}</p>
                  <p><strong>Interações Concluídas:</strong> {autoSummary.interactions}</p>
                  <p><strong>Exercícios Concluídos:</strong> {autoSummary.exercises}</p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Nenhum salvamento automático encontrado.</p>
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
                  <p><strong>Pontos:</strong> {manualSummary.points}</p>
                  <p><strong>Interações Concluídas:</strong> {manualSummary.interactions}</p>
                  <p><strong>Exercícios Concluídos:</strong> {manualSummary.exercises}</p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Nenhum salvamento manual encontrado.</p>
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
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
