
// src/app/(main)/achievements/page.tsx
"use client";

import { useEffect, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AchievementCard } from '@/components/gamification/AchievementCard';
import { mockAchievements } from '@/lib/mockData';
import type { Achievement } from '@/lib/types';
import { Loader2 } from 'lucide-react'; 
import { Button } from '@/components/ui/button';

export default function AchievementsPage() {
  const { userProfile, loading: authLoading, refreshUserProfile } = useAuth();

  useEffect(() => {
    refreshUserProfile(); 
  }, [refreshUserProfile]);
  
  const displayedAchievements = useMemo(() => {
    const unlockedAchievementIds = userProfile?.unlockedAchievements || [];
    return mockAchievements.map(mockAch => ({
      ...mockAch,
      isUnlocked: unlockedAchievementIds.includes(mockAch.id),
      dateUnlocked: unlockedAchievementIds.includes(mockAch.id) ? (mockAch.dateUnlocked || 'Desbloqueado') : '',
    })).sort((a, b) => {
      if (a.isUnlocked && !b.isUnlocked) return -1;
      if (!a.isUnlocked && b.isUnlocked) return 1;
      return a.title.localeCompare(b.title);
    });
  }, [userProfile]);

  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="container mx-auto py-12 text-center">
        <span role="img" aria-label="Troféu" className="text-5xl mb-4 block">🏆</span>
        <h2 className="text-2xl font-semibold mb-2">Erro ao Carregar Conquistas</h2>
        <p className="text-muted-foreground mb-6">
          Não foi possível carregar seu progresso. Faça login ou tente recarregar a página.
        </p>
        <Button onClick={refreshUserProfile}>Recarregar</Button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight flex items-center justify-center">
          <span role="img" aria-label="Troféu" className="text-4xl mr-3">🏆</span>
          Suas Conquistas
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Acompanhe seu progresso e celebre suas realizações.
        </p>
      </header>
      {displayedAchievements.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayedAchievements.map(achievement => (
            <AchievementCard key={achievement.id} achievement={achievement} />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground text-lg mt-10">Nenhuma conquista para exibir no momento.</p>
      )}
    </div>
  );
}
