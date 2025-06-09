
// src/app/actions/userProgressActions.ts
"use server";

import { db } from "@/lib/firebase";
import { doc, updateDoc, arrayUnion, getDoc, Timestamp } from "firebase/firestore";
import type { UserProfile, Achievement } from "@/lib/types";
import { mockAchievements } from "@/lib/mockData"; // Para obter os detalhes da conquista

interface MarkLessonCompletedResult {
  success: boolean;
  message: string;
  updatedProfile?: UserProfile | null;
  unlockedAchievementsDetails?: Achievement[];
}

export async function markLessonAsCompleted(
  userId: string,
  lessonId: string
): Promise<MarkLessonCompletedResult> {
  if (!userId || !lessonId) {
    return { success: false, message: "ID do usuário ou da lição ausente.", unlockedAchievementsDetails: [] };
  }

  const userDocRef = doc(db, "users", userId);

  try {
    const userDocSnap = await getDoc(userDocRef);
    if (!userDocSnap.exists()) {
      return { success: false, message: "Perfil do usuário não encontrado.", unlockedAchievementsDetails: [] };
    }

    const userProfile = userDocSnap.data() as UserProfile;
    const currentCompletedLessons = userProfile.completedLessons || [];
    const currentUnlockedAchievements = userProfile.unlockedAchievements || [];
    const currentPoints = userProfile.points || 0;

    let pointsToAdd = 0;
    const newAchievementsToUnlock: string[] = [];
    const unlockedAchievementsDetails: Achievement[] = [];

    // Se a lição ainda não foi completada
    if (!currentCompletedLessons.includes(lessonId)) {
      pointsToAdd = 10; // Pontos pela conclusão da lição

      // Conquista "Leitor Assíduo" (ach3) - Primeira lição concluída
      if (!currentUnlockedAchievements.includes('ach3') && currentCompletedLessons.length === 0) {
        newAchievementsToUnlock.push('ach3');
        const achDetails = mockAchievements.find(a => a.id === 'ach3');
        if (achDetails) unlockedAchievementsDetails.push({...achDetails, isUnlocked: true, dateUnlocked: new Date().toLocaleDateString('pt-BR')});
      }
      
      // Conquista "Explorador de Trilhas" (ach2) - Pode ser a primeira lição de todas, ou poderíamos refinar
      // Por simplicidade, se ach3 for desbloqueada, ach2 também é (se não tiver sido antes)
      if (newAchievementsToUnlock.includes('ach3') && !currentUnlockedAchievements.includes('ach2')) {
        newAchievementsToUnlock.push('ach2');
         const achDetails = mockAchievements.find(a => a.id === 'ach2');
        if (achDetails) unlockedAchievementsDetails.push({...achDetails, isUnlocked: true, dateUnlocked: new Date().toLocaleDateString('pt-BR')});
      }
    }

    const updatedCompletedLessons = arrayUnion(lessonId);
    const updatedUnlockedAchievements = newAchievementsToUnlock.length > 0 ? arrayUnion(...newAchievementsToUnlock) : currentUnlockedAchievements; // Mantém o array se não houver novas

    await updateDoc(userDocRef, {
      completedLessons: updatedCompletedLessons,
      points: currentPoints + pointsToAdd,
      unlockedAchievements: updatedUnlockedAchievements,
    });
    
    // Para feedback imediato, podemos simular o perfil atualizado
    // Em uma aplicação real, você pode querer refetch o perfil ou usar o listener do AuthContext
     const simulatedUpdatedProfile: UserProfile = {
      ...userProfile,
      completedLessons: [...new Set([...currentCompletedLessons, lessonId])],
      points: currentPoints + pointsToAdd,
      unlockedAchievements: [...new Set([...currentUnlockedAchievements, ...newAchievementsToUnlock])],
    };

    return {
      success: true,
      message: "Lição marcada como concluída com sucesso!",
      updatedProfile: simulatedUpdatedProfile, // Para feedback otimista na UI se necessário
      unlockedAchievementsDetails,
    };
  } catch (error: any) {
    console.error("Erro detalhado ao marcar lição como concluída:", error);
    console.error("Detalhes do erro:", {
      message: error.message,
      stack: error.stack,
      userId,
      lessonId
    });
    return {
      success: false,
      message: "Erro ao marcar lição como concluída. Tente novamente.",
      unlockedAchievementsDetails: [],
    };
  }
}

// Futura action para exercícios (exemplo)
export async function markExerciseAsCompleted(userId: string, exerciseId: string, pointsAwarded: number) {
  // Lógica similar à markLessonAsCompleted
}
