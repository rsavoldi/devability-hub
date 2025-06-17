
"use server";

import type { UserProfile, Achievement, Lesson, Exercise, Module } from "@/lib/types";
import { mockAchievements, mockLessons, mockExercises, mockModules, mockRoadmapData } from "@/lib/mockData";
import { LOCAL_STORAGE_KEYS } from '@/constants';

interface UpdateResult {
  success: boolean;
  message: string;
  updatedProfile?: UserProfile | null;
  unlockedAchievementsDetails?: Achievement[];
  pointsAdded?: number;
}

function checkAndUnlockAchievements(profile: UserProfile, actionType: 'lesson' | 'exercise' | 'module' | 'points', relatedId?: string): { newAchievements: string[], newPointsFromAchievements: number, unlockedDetails: Achievement[] } {
  const newlyUnlockedIds: string[] = [];
  let pointsFromAchievements = 0;
  const unlockedDetails: Achievement[] = [];

  mockAchievements.forEach(achievement => {
    if (!profile.unlockedAchievements.includes(achievement.id)) {
      let conditionMet = false;
      switch (achievement.id) {
        case 'ach3': // 1ª lição
          conditionMet = actionType === 'lesson' && profile.completedLessons.length === 1;
          break;
        case 'ach_exerc10': // 10 exercícios
          conditionMet = actionType === 'exercise' && profile.completedExercises.length === 10;
          break;
        case 'ach_lesson5': // 5 lições
          conditionMet = actionType === 'lesson' && profile.completedLessons.length === 5;
          break;
        case 'ach_mod1': // 1º módulo
          conditionMet = actionType === 'module' && profile.completedModules.length === 1;
          break;
        case 'ach_points100': // 100 pontos
          conditionMet = actionType === 'points' && profile.points >= 100;
          break;
        // Adicionar casos para ach4, ach5, ach6, ach7 (tipos de exercício)
        // Isso exigiria saber o tipo do exercício completado, que pode ser passado para a função
        // ou buscado em mockExercises. Por simplicidade, vou focar nos mais gerais agora.
        // Para ach_login e ach_profile_complete, a lógica seria no AuthContext ao logar ou atualizar perfil.
      }

      if (conditionMet) {
        newlyUnlockedIds.push(achievement.id);
        pointsFromAchievements += achievement.pointsAwarded || 0;
        unlockedDetails.push({...achievement, isUnlocked: true, dateUnlocked: new Date().toLocaleDateString('pt-BR')});
      }
    }
  });
  return { newAchievements: newlyUnlockedIds, newPointsFromAchievements: pointsFromAchievements, unlockedDetails };
}


export async function markLessonAsCompleted(
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

  const profileToUpdate = currentProfile ? { ...currentProfile } : createDefaultProfile("guest_user");

  if (profileToUpdate.completedLessons.includes(lessonId)) {
    return { success: true, message: "Lição já estava concluída.", updatedProfile: profileToUpdate, unlockedAchievementsDetails: [], pointsAdded: 0 };
  }

  profileToUpdate.completedLessons = [...new Set([...profileToUpdate.completedLessons, lessonId])];
  const pointsForLesson = lesson.points || 10; // Default 10 points se não especificado
  profileToUpdate.points = (profileToUpdate.points || 0) + pointsForLesson;

  const achievementCheck = checkAndUnlockAchievements(profileToUpdate, 'lesson');
  profileToUpdate.unlockedAchievements = [...new Set([...profileToUpdate.unlockedAchievements, ...achievementCheck.newAchievements])];
  profileToUpdate.points += achievementCheck.newPointsFromAchievements;
  
  // Verificar se módulo/trilha foi completado
  // (Esta lógica pode ficar mais complexa e talvez ser movida para o AuthContext após a atualização da lição)
  if (lesson.moduleId) {
    const module = mockModules.find(m => m.id === lesson.moduleId);
    if (module) {
        const allLessonsInModuleCompleted = module.lessons.every(l => profileToUpdate.completedLessons.includes(l.id));
        const allExercisesInModuleCompleted = module.exercises.every(ex => profileToUpdate.completedExercises.includes(ex.id)); // Assumindo que módulo também tem exercícios
        if (allLessonsInModuleCompleted && allExercisesInModuleCompleted && !profileToUpdate.completedModules.includes(module.id)) {
            // Se todas as lições e exercícios do módulo estiverem completos, mas o módulo não, marca como completo
            // Esta chamada recursiva ou lógica precisa ser bem pensada para evitar loops ou chamadas desnecessárias.
            // Por ora, a conclusão do módulo será tratada separadamente no ModulePage.
        }
    }
  }


  return {
    success: true,
    message: `Lição "${lesson.title}" concluída! +${pointsForLesson} pontos.`,
    updatedProfile: profileToUpdate,
    unlockedAchievementsDetails: achievementCheck.unlockedDetails,
    pointsAdded: pointsForLesson + achievementCheck.newPointsFromAchievements,
  };
}

export async function markExerciseAsCompleted(
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

  const profileToUpdate = currentProfile ? { ...currentProfile } : createDefaultProfile("guest_user");

  if (profileToUpdate.completedExercises.includes(exerciseId)) {
     return { success: true, message: "Exercício já estava concluído.", updatedProfile: profileToUpdate, unlockedAchievementsDetails: [], pointsAdded: 0 };
  }

  profileToUpdate.completedExercises = [...new Set([...profileToUpdate.completedExercises, exerciseId])];
  const pointsForExercise = exercise.points;
  profileToUpdate.points = (profileToUpdate.points || 0) + pointsForExercise;

  const achievementCheck = checkAndUnlockAchievements(profileToUpdate, 'exercise', exerciseId);
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

export async function markModuleAsCompleted(
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

  const profileToUpdate = currentProfile ? { ...currentProfile } : createDefaultProfile("guest_user");

  if (profileToUpdate.completedModules.includes(moduleId)) {
    return { success: true, message: "Módulo já estava concluído.", updatedProfile: profileToUpdate, unlockedAchievementsDetails: [], pointsAdded: 0 };
  }

  // Verificar se todas as lições e exercícios do módulo estão realmente concluídos
  const allLessonsDone = module.lessons.every(l => profileToUpdate.completedLessons.includes(l.id));
  const allExercisesDone = module.exercises.every(e => profileToUpdate.completedExercises.includes(e.id));

  if (!allLessonsDone || !allExercisesDone) {
    return { success: false, message: "Ainda há lições ou exercícios pendentes neste módulo.", updatedProfile: profileToUpdate };
  }

  profileToUpdate.completedModules = [...new Set([...profileToUpdate.completedModules, moduleId])];
  const pointsForModule = 50; // Pontuação exemplo para módulo
  profileToUpdate.points = (profileToUpdate.points || 0) + pointsForModule;

  const achievementCheck = checkAndUnlockAchievements(profileToUpdate, 'module', moduleId);
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

// Helper function - should be defined once in your project
function createDefaultProfile(userId: string, userName?: string | null, userAvatar?: string | null): UserProfile {
  return {
    id: userId,
    name: userName || (userId === "guest_user" ? "Convidado(a)" : "Usuário"),
    email: null,
    avatarUrl: userAvatar || `https://placehold.co/100x100.png?text=${(userName || (userId === "guest_user" ? "C" : "U")).charAt(0).toUpperCase()}`,
    points: 0,
    completedLessons: [],
    completedExercises: [],
    unlockedAchievements: ['ach1'], // Conquista "Pioneiro"
    completedModules: [],
    roles: userId === "guest_user" ? ['guest'] : ['user'],
  };
}
