
"use client";

import { useEffect }
from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AchievementCard } from '@/components/gamification/AchievementCard';
import { mockAchievements } from '@/lib/mockData';
import type { Achievement } from '@/lib/types';
import { Trophy, Loader2, UserCircle, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AchievementsPage() {
  const { currentUser, userProfile, loading: authLoading, refreshUserProfile } = useAuth();

  useEffect(() => {
    if (currentUser) {
      refreshUserProfile(); 
    }
  }, [currentUser, refreshUserProfile]);

  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!currentUser || !userProfile) {
    return (
      <div className="container mx-auto py-12 text-center">
        <Trophy className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Acompanhe suas Conquistas!</h2>
        <p className="text-muted-foreground mb-6">
          Faça login ou crie uma conta para ver suas medalhas e progresso.
        </p>
        <Button asChild>
          <Link href="/login" className="flex items-center">
            <LogIn className="mr-2 h-4 w-4" />
            Entrar ou Registrar
          </Link>
        </Button>
      </div>
    );
  }

  const displayedAchievements: Achievement[] = mockAchievements.map(mockAch => {
    const isUnlocked = userProfile.unlockedAchievements.includes(mockAch.id);
    // A data de desbloqueio real precisaria ser armazenada no userProfile.
    // Por agora, se estiver desbloqueada, usamos a data do mock (se houver) ou um placeholder.
    const dateUnlocked = isUnlocked ? (mockAch.dateUnlocked || 'Desbloqueado') : '';
    return {
      ...mockAch,
      isUnlocked,
      dateUnlocked,
    };
  }).sort((a,b) => { // Opcional: Ordenar, desbloqueadas primeiro
      if (a.isUnlocked && !b.isUnlocked) return -1;
      if (!a.isUnlocked && b.isUnlocked) return 1;
      return 0;
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

    