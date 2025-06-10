// src/app/(main)/achievements/page.tsx
"use client";

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AchievementCard } from '@/components/gamification/AchievementCard';
import { mockAchievements } from '@/lib/mockData';
import type { Achievement } from '@/lib/types';
import { Trophy, Loader2, UserCircle } from 'lucide-react'; // Removido LogIn
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AchievementsPage() {
  const { userProfile, loading: authLoading, refreshUserProfile } = useAuth();

  useEffect(() => {
    refreshUserProfile(); // Garante que os dados estão atualizados ao carregar a página
  }, [refreshUserProfile]);

  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!userProfile) {
    // Este caso deve ser raro com a nova lógica do AuthContext,
    // mas é bom ter um fallback.
    return (
      <div className="container mx-auto py-12 text-center">
        <Trophy className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Erro ao Carregar Conquistas</h2>
        <p className="text-muted-foreground mb-6">
          Não foi possível carregar seu progresso. Tente recarregar a página.
        </p>
        <Button onClick={refreshUserProfile}>Recarregar</Button>
      </div>
    );
  }
  
  const unlockedAchievementIds = userProfile.unlockedAchievements || [];

  const displayedAchievements: Achievement[] = mockAchievements.map(mockAch => {
    const isUnlocked = unlockedAchievementIds.includes(mockAch.id);
    const dateUnlocked = isUnlocked ? (mockAch.dateUnlocked || 'Desbloqueado') : '';
    return {
      ...mockAch,
      isUnlocked,
      dateUnlocked,
    };
  }).sort((a,b) => {
      if (a.isUnlocked && !b.isUnlocked) return -1;
      if (!a.isUnlocked && b.isUnlocked) return 1;
      // Opcional: ordenar por título se o status de desbloqueio for o mesmo
      return a.title.localeCompare(b.title);
  });

  return (
    <div className="container mx-auto py-8">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight flex items-center justify-center">
          <Trophy className="w-10 h-10 mr-3 text-primary" />
          Suas Conquistas <span role="img" aria-label="troféu">🏆</span>
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
