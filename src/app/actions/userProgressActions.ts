// src/app/actions/userProgressActions.ts
"use server"; // Esta diretiva pode ser mantida, mas a lógica é client-side via chamada indireta

import type { UserProfile, Achievement } from "@/lib/types";
import { mockAchievements } from "@/lib/mockData";
import { LOCAL_STORAGE_KEYS } from '@/constants';

interface MarkLessonCompletedResult {
  success: boolean;
  message: string;
  updatedProfile?: UserProfile | null; // Opcional, pois o AuthContext pode reler
  unlockedAchievementsDetails?: Achievement[];
}

// Esta função será chamada no contexto do servidor (ou pode ser convertida para client-side)
// mas para este exemplo, vamos assumir que ela é chamada e o AuthContext no cliente
// vai lidar com a atualização do localStorage e do estado.
// Para uma solução puramente client-side, moveríamos essa lógica para o AuthContext ou um hook.
// Por enquanto, faremos ela retornar os dados para o cliente atualizar o localStorage.

interface UserProgressUpdate {
  completedLessons?: string[];
  points?: number;
  unlockedAchievements?: string[];
  // Adicione outros campos se necessário
}

export async function markLessonAsCompleted(
  currentProfile: UserProfile | null, // Perfil atual vindo do cliente
  lessonId: string
): Promise<MarkLessonCompletedResult> {
  if (!lessonId) {
    return { success: false, message: "ID da lição ausente.", unlockedAchievementsDetails: [] };
  }

  const profileToUpdate = currentProfile ? { ...currentProfile } : {
    id: "guest_user", // Ou um ID gerado
    name: "Convidado(a)",
    points: 0,
    completedLessons: [],
    completedExercises: [],
    unlockedAchievements: ['ach1'],
    completedModules: [],
    roles: ['guest'],
  };

  const currentCompletedLessons = profileToUpdate.completedLessons || [];
  const currentUnlockedAchievements = profileToUpdate.unlockedAchievements || [];
  let currentPoints = profileToUpdate.points || 0;

  const newlyUnlockedAchievementsDetails: Achievement[] = [];
  let pointsToAdd = 0;
  const newAchievementsToUnlock: string[] = [];

  if (!currentCompletedLessons.includes(lessonId)) {
    currentCompletedLessons.push(lessonId);
    pointsToAdd = 10; // Pontos pela conclusão da lição

    // Conquista "Leitor Assíduo" (ach3) - Primeira lição concluída
    // Se ach3 não está nas conquistas E esta é a primeira lição sendo completada
    if (!currentUnlockedAchievements.includes('ach3') && currentCompletedLessons.length === 1) {
      newAchievementsToUnlock.push('ach3');
    }
    
    // Conquista "Explorador de Trilhas" (ach2)
    // Assumindo que ao completar a primeira lição, também "explorou" a primeira trilha.
    // Poderia ter uma lógica mais complexa aqui.
    if (!currentUnlockedAchievements.includes('ach2') && currentCompletedLessons.length > 0) {
      newAchievementsToUnlock.push('ach2');
    }
    // Adicionar outras lógicas de conquista aqui...
  }

  profileToUpdate.completedLessons = [...new Set(currentCompletedLessons)]; // Garante unicidade
  profileToUpdate.points = currentPoints + pointsToAdd;
  profileToUpdate.unlockedAchievements = [...new Set([...currentUnlockedAchievements, ...newAchievementsToUnlock])];

  newAchievementsToUnlock.forEach(achId => {
    const achDetails = mockAchievements.find(a => a.id === achId);
    if (achDetails) {
      newlyUnlockedAchievementsDetails.push({...achDetails, isUnlocked: true, dateUnlocked: new Date().toLocaleDateString('pt-BR')});
    }
  });
  
  // O cliente (LessonView) será responsável por salvar este perfil atualizado no localStorage
  // e atualizar o estado do AuthContext.
  return {
    success: true,
    message: "Progresso da lição registrado para atualização local.",
    updatedProfile: profileToUpdate,
    unlockedAchievementsDetails: newlyUnlockedAchievementsDetails,
  };
}

// Placeholder para futura action de exercícios
export async function markExerciseAsCompleted(
  currentProfile: UserProfile | null,
  exerciseId: string,
  pointsAwarded: number
): Promise<MarkLessonCompletedResult> { // Reutilizando o tipo de resultado por simplicidade
   if (!exerciseId) {
    return { success: false, message: "ID do exercício ausente.", unlockedAchievementsDetails: [] };
  }

  const profileToUpdate = currentProfile ? { ...currentProfile } : {
    id: "guest_user",
    name: "Convidado(a)",
    points: 0,
    completedLessons: [],
    completedExercises: [],
    unlockedAchievements: ['ach1'],
    completedModules: [],
    roles: ['guest'],
  };

  const currentCompletedExercises = profileToUpdate.completedExercises || [];
  const currentUnlockedAchievements = profileToUpdate.unlockedAchievements || [];
  let currentPoints = profileToUpdate.points || 0;

  const newlyUnlockedAchievementsDetails: Achievement[] = [];
  let newPointsToAdd = 0;
  const newAchievementsToUnlock: string[] = [];

  if (!currentCompletedExercises.includes(exerciseId)) {
    currentCompletedExercises.push(exerciseId);
    newPointsToAdd = pointsAwarded;

    // Exemplo: Conquista "Mestre dos Conceitos" (ach4) - Acertou 5 exercícios de múltipla escolha.
    // Esta lógica precisaria saber o tipo de exercício e o total de MC completados.
    // Por simplicidade, vamos assumir que este exercício (se for o quinto MC) desbloqueia.
    // const mcExercisesCompleted = currentCompletedExercises.filter(id => mockExercises.find(e=>e.id === id)?.type === 'multiple-choice').length;
    // if (!currentUnlockedAchievements.includes('ach4') && mcExercisesCompleted >= 5) {
    //    newAchievementsToUnlock.push('ach4');
    // }
  }

  profileToUpdate.completedExercises = [...new Set(currentCompletedExercises)];
  profileToUpdate.points = currentPoints + newPointsToAdd;
  profileToUpdate.unlockedAchievements = [...new Set([...currentUnlockedAchievements, ...newAchievementsToUnlock])];
  
   newAchievementsToUnlock.forEach(achId => {
    const achDetails = mockAchievements.find(a => a.id === achId);
    if (achDetails) {
      newlyUnlockedAchievementsDetails.push({...achDetails, isUnlocked: true, dateUnlocked: new Date().toLocaleDateString('pt-BR')});
    }
  });

  return {
    success: true,
    message: "Progresso do exercício registrado para atualização local.",
    updatedProfile: profileToUpdate,
    unlockedAchievementsDetails: newlyUnlockedAchievementsDetails,
  };
}
