
"use server";

import type { UserProfile, Achievement, Lesson, Exercise, Module } from "@/lib/types";
import { mockAchievements, mockLessons, mockExercises, mockModules, mockRoadmapData } from "@/lib/mockData";
import { LOCAL_STORAGE_KEYS } from '@/constants';

interface UpdateResult {
  success: boolean;
  message: string;
  updatedProfile?: UserProfile | null;
  unlockedAchievementsDetails?: Array<Pick<Achievement, 'id' | 'title' | 'description' | 'emoji' | 'pointsAwarded' | 'dateUnlocked' | 'isUnlocked'>>;
  pointsAdded?: number;
}

// Helper para criar um perfil padrão se necessário
function createDefaultProfileIfNeeded(currentProfile: UserProfile | null, userId: string): UserProfile {
  if (currentProfile) return { ...currentProfile };
  return {
    id: userId,
    name: userId === "guest_user" ? "Convidado(a)" : "Usuário Anônimo",
    email: null,
    avatarUrl: `https://placehold.co/100x100.png?text=${(userId === "guest_user" ? "C" : "U").charAt(0).toUpperCase()}`,
    points: 0,
    completedLessons: [],
    completedExercises: [],
    unlockedAchievements: ['ach1'],
    completedModules: [],
    roles: userId === "guest_user" ? ['guest'] : ['user'],
  };
}


// Função interna para lógica de verificação e desbloqueio de conquistas
// Retorna apenas dados serializáveis
export async function checkAndUnlockAchievementsLogic(
  profile: UserProfile,
  actionType: 'lesson' | 'exercise' | 'module' | 'points',
  relatedId?: string
): Promise<{ newAchievements: string[], newPointsFromAchievements: number, unlockedDetails: Array<Pick<Achievement, 'id' | 'title' | 'description' | 'emoji' | 'pointsAwarded' | 'dateUnlocked' | 'isUnlocked'>> }> {
  const newlyUnlockedIds: string[] = [];
  let pointsFromAchievements = 0;
  const unlockedDetails: Array<Pick<Achievement, 'id' | 'title' | 'description' | 'emoji' | 'pointsAwarded' | 'dateUnlocked' | 'isUnlocked'>> = [];

  mockAchievements.forEach(achievement => {
    if (!profile.unlockedAchievements.includes(achievement.id)) {
      let conditionMet = false;
      switch (achievement.id) {
        case 'ach3': // 1ª lição
          conditionMet = actionType === 'lesson' && profile.completedLessons.length >= 1;
          break;
        case 'ach_exerc10': // 10 exercícios
          conditionMet = actionType === 'exercise' && profile.completedExercises.length >= 10;
          break;
        case 'ach_lesson5': // 5 lições
          conditionMet = actionType === 'lesson' && profile.completedLessons.length >= 5;
          break;
        case 'ach_mod1': // 1º módulo
          conditionMet = actionType === 'module' && profile.completedModules.length >= 1;
          break;
        case 'ach_points100': // 100 pontos
          conditionMet = actionType === 'points' && profile.points >= 100;
          break;
        // Adicionar mais casos se necessário
      }

      if (conditionMet) {
        newlyUnlockedIds.push(achievement.id);
        pointsFromAchievements += achievement.pointsAwarded || 0;
        const { icon, ...serializableAchievementData } = achievement;
        unlockedDetails.push({
          ...serializableAchievementData,
          isUnlocked: true, 
          dateUnlocked: new Date().toLocaleDateString('pt-BR')
        });
      }
    }
  });
  return { newAchievements: newlyUnlockedIds, newPointsFromAchievements: pointsFromAchievements, unlockedDetails };
}


// Função de lógica pura para marcar lição como completa (usada por Server Action e localmente)
export async function completeLessonLogic(
  currentProfile: UserProfile | null,
  lessonId: string
): Promise<UpdateResult> {
  if (!lessonId) {
    return { success: false, message: "ID da lição ausente." };
  }

  const lesson = mockLessons.find(l => l.id === lessonId);
  if (!lesson) {
    return { success: false, message: "Lição não encontrada." };
  }

  const profileToUpdate = createDefaultProfileIfNeeded(currentProfile, currentProfile?.id || "guest_user");

  if (profileToUpdate.completedLessons.includes(lessonId)) {
    return { success: true, message: "Lição já estava concluída.", updatedProfile: profileToUpdate, unlockedAchievementsDetails: [], pointsAdded: 0 };
  }

  profileToUpdate.completedLessons = [...new Set([...profileToUpdate.completedLessons, lessonId])];
  const pointsForLesson = lesson.points || 10;
  profileToUpdate.points = (profileToUpdate.points || 0) + pointsForLesson;

  const achievementCheck = await checkAndUnlockAchievementsLogic(profileToUpdate, 'lesson', lessonId);
  profileToUpdate.unlockedAchievements = [...new Set([...profileToUpdate.unlockedAchievements, ...achievementCheck.newAchievements])];
  profileToUpdate.points += achievementCheck.newPointsFromAchievements;
  
  return {
    success: true,
    message: `Lição "${lesson.title}" concluída! +${pointsForLesson} pontos.`,
    updatedProfile: profileToUpdate,
    unlockedAchievementsDetails: achievementCheck.unlockedDetails,
    pointsAdded: pointsForLesson + achievementCheck.newPointsFromAchievements,
  };
}

// Server Action
export async function markLessonAsCompleted(
  currentProfile: UserProfile | null, 
  lessonId: string
): Promise<UpdateResult> {
  return completeLessonLogic(currentProfile, lessonId);
}


// Função de lógica pura para marcar exercício como completo
export async function completeExerciseLogic(
  currentProfile: UserProfile | null,
  exerciseId: string
): Promise<UpdateResult> {
  if (!exerciseId) {
    return { success: false, message: "ID do exercício ausente." };
  }

  const exercise = mockExercises.find(e => e.id === exerciseId);
  if (!exercise) {
    return { success: false, message: "Exercício não encontrado." };
  }

  const profileToUpdate = createDefaultProfileIfNeeded(currentProfile, currentProfile?.id || "guest_user");

  if (profileToUpdate.completedExercises.includes(exerciseId)) {
     return { success: true, message: "Exercício já estava concluído.", updatedProfile: profileToUpdate, unlockedAchievementsDetails: [], pointsAdded: 0 };
  }

  profileToUpdate.completedExercises = [...new Set([...profileToUpdate.completedExercises, exerciseId])];
  const pointsForExercise = exercise.points;
  profileToUpdate.points = (profileToUpdate.points || 0) + pointsForExercise;

  const achievementCheck = await checkAndUnlockAchievementsLogic(profileToUpdate, 'exercise', exerciseId);
  profileToUpdate.unlockedAchievements = [...new Set([...profileToUpdate.unlockedAchievements, ...achievementCheck.newAchievements])];
  profileToUpdate.points += achievementCheck.newPointsFromAchievements;

  return {
    success: true,
    message: `Exercício "${exercise.title}" concluído! +${pointsForExercise} pontos.`,
    updatedProfile: profileToUpdate,
    unlockedAchievementsDetails: achievementCheck.unlockedDetails,
    pointsAdded: pointsForExercise + achievementCheck.newPointsFromAchievements,
  };
}

// Server Action
export async function markExerciseAsCompleted(
  currentProfile: UserProfile | null,
  exerciseId: string
): Promise<UpdateResult> {
  return completeExerciseLogic(currentProfile, exerciseId);
}

// Função de lógica pura para marcar módulo como completo
export async function completeModuleLogic(
  currentProfile: UserProfile | null,
  moduleId: string
): Promise<UpdateResult> {
  if (!moduleId) {
    return { success: false, message: "ID do módulo ausente." };
  }
  const module = mockModules.find(m => m.id === moduleId);
  if(!module) {
    return { success: false, message: "Módulo não encontrado."};
  }

  const profileToUpdate = createDefaultProfileIfNeeded(currentProfile, currentProfile?.id || "guest_user");

  if (profileToUpdate.completedModules.includes(moduleId)) {
    return { success: true, message: "Módulo já estava concluído.", updatedProfile: profileToUpdate, unlockedAchievementsDetails: [], pointsAdded: 0 };
  }

  const allLessonsDone = module.lessons.every(l => profileToUpdate.completedLessons.includes(l.id));
  const allExercisesDone = module.exercises.every(e => profileToUpdate.completedExercises.includes(e.id));

  if (!allLessonsDone || !allExercisesDone) {
    return { success: false, message: "Ainda há lições ou exercícios pendentes neste módulo.", updatedProfile: profileToUpdate };
  }

  profileToUpdate.completedModules = [...new Set([...profileToUpdate.completedModules, moduleId])];
  const pointsForModule = 50; 
  profileToUpdate.points = (profileToUpdate.points || 0) + pointsForModule;

  const achievementCheck = await checkAndUnlockAchievementsLogic(profileToUpdate, 'module', moduleId);
  profileToUpdate.unlockedAchievements = [...new Set([...profileToUpdate.unlockedAchievements, ...achievementCheck.newAchievements])];
  profileToUpdate.points += achievementCheck.newPointsFromAchievements;
  
  return {
    success: true,
    message: `Módulo "${module.title}" concluído! +${pointsForModule} pontos.`,
    updatedProfile: profileToUpdate,
    unlockedAchievementsDetails: achievementCheck.unlockedDetails,
    pointsAdded: pointsForModule + achievementCheck.newPointsFromAchievements,
  };
}

// Server Action
export async function markModuleAsCompleted(
  currentProfile: UserProfile | null,
  moduleId: string
): Promise<UpdateResult> {
  return completeModuleLogic(currentProfile, moduleId);
}

    