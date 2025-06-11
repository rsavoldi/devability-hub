
// src/app/(main)/profile/page.tsx
"use client";

import { useEffect } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { mockAchievements, mockLessons, mockExercises } from "@/lib/mockData";
import { Award, CheckCircle, Edit3, Target, UserCircle, Loader2, LogIn } from "lucide-react"; // TrophyIcon e BookOpen removidos
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Link from 'next/link';
import type { Achievement } from '@/lib/types';

export default function ProfilePage() {
  const { userProfile, loading: authLoading, refreshUserProfile } = useAuth();

  useEffect(() => {
    refreshUserProfile();
  }, [refreshUserProfile]);

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
        <UserCircle className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Perfil de Convidado</h2>
        <p className="text-muted-foreground mb-6">
          Seu progresso é salvo localmente. Crie uma conta para salvar na nuvem (funcionalidade em implantação).
        </p>
        <Button onClick={refreshUserProfile}>Recarregar Progresso Local</Button>
      </div>
    );
  }

  const { name, avatarUrl, points, completedLessons, completedExercises, unlockedAchievements } = userProfile;

  const totalLessons = mockLessons.length;
  const totalExercises = mockExercises.length;
  const totalAchievements = mockAchievements.length;

  const lessonProgress = totalLessons > 0 ? (completedLessons.length / totalLessons) * 100 : 0;
  const exerciseProgress = totalExercises > 0 ? (completedExercises.length / totalExercises) * 100 : 0;
  
  const userUnlockedAchievementDetails: Achievement[] = mockAchievements
    .filter(ach => unlockedAchievements.includes(ach.id))
    .map(ach => ({
      ...ach,
      isUnlocked: true,
      dateUnlocked: ach.dateUnlocked || new Date().toLocaleDateString('pt-BR') 
    }));
  
  const achievementProgress = totalAchievements > 0 ? (userUnlockedAchievementDetails.length / totalAchievements) * 100 : 0;

  const displayName = name || "Convidado(a)";
  const displayAvatarFallback = displayName.substring(0,1).toUpperCase();
  const displayAvatarUrl = avatarUrl || `https://placehold.co/100x100.png?text=${displayAvatarFallback}`;

  return (
    <div className="container mx-auto py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight flex items-center">
            <span role="img" aria-label="Pessoa" className="text-4xl mr-3">👤</span> {/* Substituído UserCircle por emoji */}
            Seu Perfil
        </h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="md:col-span-1 shadow-lg">
          <CardHeader className="items-center text-center">
            <Avatar className="h-24 w-24 mb-4 border-2 border-primary">
              <AvatarImage src={displayAvatarUrl} alt={displayName} />
              <AvatarFallback className="text-3xl">{displayAvatarFallback}</AvatarFallback>
            </Avatar>
            <CardTitle className="text-2xl">{displayName}</CardTitle>
            <CardDescription>Aprendiz DevAbility</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="flex items-center justify-center text-2xl font-semibold text-primary mb-4">
              <Award className="h-7 w-7 mr-2" /> {/* Mantido Award para pontos por clareza */}
              {points} Pontos
            </div>
            <Button variant="outline" className="w-full" disabled>
                <Edit3 className="mr-2 h-4 w-4" /> Editar Perfil (Em implantação)
            </Button>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 shadow-lg">
          <CardHeader>
            <CardTitle>Visão Geral do Progresso</CardTitle>
            <CardDescription>Sua jornada de aprendizado em resumo.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-1">
                <Label htmlFor="lesson-progress" className="flex items-center text-sm font-medium">
                  <span role="img" aria-label="Livro Aberto" className="mr-2">📖</span> {/* Substituído BookOpen */}
                  Lições Concluídas
                </Label>
                <span className="text-sm text-muted-foreground">{completedLessons.length} / {totalLessons}</span>
              </div>
              <Progress value={lessonProgress} id="lesson-progress" aria-label={`${lessonProgress.toFixed(0)}% de lições concluídas`} />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <Label htmlFor="exercise-progress" className="flex items-center text-sm font-medium">
                  <span role="img" aria-label="Alvo" className="mr-2">🎯</span> {/* Substituído Target */}
                  Exercícios Dominados
                </Label>
                <span className="text-sm text-muted-foreground">{completedExercises.length} / {totalExercises}</span>
              </div>
              <Progress value={exerciseProgress} id="exercise-progress" aria-label={`${exerciseProgress.toFixed(0)}% de exercícios concluídos`} />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <Label htmlFor="achievement-progress" className="flex items-center text-sm font-medium">
                  <span role="img" aria-label="Troféu" className="mr-2">🏆</span> {/* Substituído TrophyIcon */}
                  Conquistas Desbloqueadas
                </Label>
                <span className="text-sm text-muted-foreground">{unlockedAchievements.length} / {totalAchievements}</span>
              </div>
              <Progress value={achievementProgress} id="achievement-progress" aria-label={`${achievementProgress.toFixed(0)}% de conquistas desbloqueadas`} />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8 shadow-lg">
        <CardHeader>
            <CardTitle>Conquistas Desbloqueadas</CardTitle>
            <CardDescription>Suas medalhas e honrarias!</CardDescription>
        </CardHeader>
        <CardContent>
            {userUnlockedAchievementDetails.length > 0 ? (
                 <ul className="space-y-3">
                    {userUnlockedAchievementDetails.map(ach =>(
                        <li key={ach.id} className="flex items-center p-3 border rounded-md bg-green-50 dark:bg-green-900/30 hover:shadow-sm transition-shadow">
                           {ach.emoji ? (
                              <span className="text-2xl mr-4 shrink-0" role="img" aria-label={ach.title}>{ach.emoji}</span>
                           ) : ach.icon ? (
                              <ach.icon className="h-6 w-6 mr-4 text-green-600 dark:text-green-400 shrink-0"/>
                           ) : (
                              <span className="text-2xl mr-4 shrink-0" role="img" aria-label="Conquista">🏆</span>
                           )}
                            <div>
                                <p className="font-semibold text-green-700 dark:text-green-300">{ach.title}</p>
                                <p className="text-sm text-muted-foreground">{ach.description}</p>
                                {ach.dateUnlocked && <p className="text-xs text-muted-foreground mt-1">Desbloqueado em: {ach.dateUnlocked}</p>}
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-muted-foreground">Nenhuma conquista desbloqueada ainda. Continue aprendendo!</p>
            )}
        </CardContent>
         <CardFooter>
            <Button variant="outline" asChild>
                <Link href="/achievements">Ver Todas as Conquistas</Link>
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
