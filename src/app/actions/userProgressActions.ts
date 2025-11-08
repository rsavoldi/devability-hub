
"use server";

import type { UserProfile, Achievement, Lesson, Exercise, Module } from "@/lib/types";
import { mockAchievements, mockLessons, mockExercises, mockModules } from "@/lib/mockData";

interface UpdateResult {
  success: boolean;
  message: string;
  updatedProfile?: UserProfile | null;
  unlockedAchievementsDetails?: Array<Pick<Achievement, 'id' | 'title' | 'description' | 'emoji' | 'pointsAwarded'>>;
  pointsAdded?: number;
}

function createDefaultProfileIfNeeded(currentProfile: UserProfile | null, userId: string): UserProfile {
  if (currentProfile) return { ...currentProfile };
  return {
    id: userId,
    name: userId === "guest_user" ? "Convidado(a)" : "Usuário Anônimo",
    email: null,
    avatarUrl: `https://placehold.co/100x100.png?text=${(userId === "guest_user" ? "C" : "U").charAt(0).toUpperCase()}`,
    points: 0,
    lessonProgress: {},
    completedLessons: [],
    completedExercises: [],
    unlockedAchievements: ['ach1'],
    completedModules: [],
    roles: userId === "guest_user" ? ['guest'] : ['user'],
  };
}

export async function checkAndUnlockAchievementsLogic(
  profile: UserProfile,
  actionType: 'lesson' | 'exercise' | 'module' | 'points',
  relatedId?: string
): Promise<{ newAchievements: string[], newPointsFromAchievements: number, unlockedDetails: Array<Pick<Achievement, 'id' | 'title' | 'description' | 'emoji' | 'pointsAwarded'>> }> {
  const newlyUnlockedIds: string[] = [];
  let pointsFromAchievements = 0;
  const unlockedDetails: Array<Pick<Achievement, 'id' | 'title' | 'description' | 'emoji' | 'pointsAwarded'>> = [];

  const completedLessonIds = profile.completedLessons || [];

  mockAchievements.forEach(achievement => {
    if (!profile.unlockedAchievements.includes(achievement.id)) {
      let conditionMet = false;
      switch (achievement.id) {
        case 'ach3':
          conditionMet = actionType === 'lesson' && completedLessonIds.length >= 1;
          break;
        case 'ach_exerc10':
          conditionMet = actionType === 'exercise' && profile.completedExercises.length >= 10;
          break;
        case 'ach_lesson5':
          conditionMet = actionType === 'lesson' && completedLessonIds.length >= 5;
          break;
        case 'ach_mod1':
          conditionMet = actionType === 'module' && profile.completedModules.length >= 1;
          break;
        case 'ach_points100':
          conditionMet = profile.points >= 100;
          break;
      }

      if (conditionMet) {
        newlyUnlockedIds.push(achievement.id);
        pointsFromAchievements += achievement.pointsAwarded || 0;
        const { icon, ...serializableAchievementData } = achievement;
        unlockedDetails.push({ ...serializableAchievementData });
      }
    }
  });
  return { newAchievements: newlyUnlockedIds, newPointsFromAchievements: pointsFromAchievements, unlockedDetails };
}

async function checkModuleCompletionAndUpdate(profile: UserProfile, moduleId: string): Promise<UpdateResult> {
  const moduleToUpdate = mockModules.find(m => m.id === moduleId);
  if (!moduleToUpdate) {
    return { success: false, message: "Módulo para verificação não encontrado." };
  }

  const allLessonsDone = moduleToUpdate.lessons.every(l => profile.completedLessons.includes(l.id));
  const exercisesForModule = mockExercises.filter(ex => ex.moduleId === moduleToUpdate.id);
  const allExercisesDone = exercisesForModule.every(e => profile.completedExercises.includes(e.id));

  if (allLessonsDone && allExercisesDone && !profile.completedModules.includes(moduleId)) {
    return completeModuleLogic(profile, moduleId);
  }

  return { success: true, message: "Progresso atualizado, mas módulo ainda não concluído.", updatedProfile: profile, pointsAdded: 0, unlockedAchievementsDetails: [] };
}


export async function completeLessonLogic(
  currentProfile: UserProfile | null,
  lessonId: string
): Promise<UpdateResult> {
  if (!lessonId) {
    return { success: false, message: "ID da lição ausente." };
  }

  const lesson = mockLessons.find(l => l.id === lessonId);
  if (!lesson || !lesson.moduleId) {
    return { success: false, message: "Lição ou módulo associado não encontrado." };
  }

  const profileToUpdate = createDefaultProfileIfNeeded(currentProfile, currentProfile?.id || "guest_user");
  
  if (profileToUpdate.completedLessons.includes(lessonId)) {
    return { success: true, message: "Lição já estava concluída.", updatedProfile: profileToUpdate, unlockedAchievementsDetails: [], pointsAdded: 0 };
  }

  profileToUpdate.completedLessons = [...new Set([...profileToUpdate.completedLessons, lessonId])];
  
  const lessonProgress = profileToUpdate.lessonProgress[lessonId] || { completed: false, completedInteractions: [] };
  lessonProgress.completed = true;
  profileToUpdate.lessonProgress = { ...profileToUpdate.lessonProgress, [lessonId]: lessonProgress };
  
  const pointsForLesson = lesson.points || 10;
  profileToUpdate.points = (profileToUpdate.points || 0) + pointsForLesson;
  
  const achievementCheck = await checkAndUnlockAchievementsLogic(profileToUpdate, 'lesson', lessonId);
  if (achievementCheck.newAchievements.length > 0) {
    profileToUpdate.unlockedAchievements = [...new Set([...profileToUpdate.unlockedAchievements, ...achievementCheck.newAchievements])];
    profileToUpdate.points += achievementCheck.newPointsFromAchievements;
  }
  
  const pointsAchievementCheck = await checkAndUnlockAchievementsLogic(profileToUpdate, 'points');
   if (pointsAchievementCheck.newAchievements.length > 0) {
    profileToUpdate.unlockedAchievements = [...new Set([...profileToUpdate.unlockedAchievements, ...pointsAchievementCheck.newAchievements])];
    profileToUpdate.points += pointsAchievementCheck.newPointsFromAchievements;
    achievementCheck.unlockedDetails.push(...pointsAchievementCheck.unlockedDetails);
  }

  const moduleCompletionResult = await checkModuleCompletionAndUpdate(profileToUpdate, lesson.moduleId);
  if(moduleCompletionResult.success && moduleCompletionResult.updatedProfile) {
     const finalProfile = moduleCompletionResult.updatedProfile;
     finalProfile.points += (moduleCompletionResult.pointsAdded || 0);
     finalProfile.unlockedAchievements = [...new Set([...finalProfile.unlockedAchievements, ...(moduleCompletionResult.unlockedAchievementsDetails?.map(a => a.id) || [])])];
     
     const allUnlockedDetails = [...(achievementCheck.unlockedDetails || []), ...(moduleCompletionResult.unlockedAchievementsDetails || [])];
     const totalPointsAdded = pointsForLesson + (achievementCheck.newPointsFromAchievements || 0) + (moduleCompletionResult.pointsAdded || 0);
     
     return {
        success: true,
        message: `Lição "${lesson.title}" concluída! +${pointsForLesson} pontos. ` + (moduleCompletionResult.message.includes("concluído") ? moduleCompletionResult.message : ""),
        updatedProfile: finalProfile,
        unlockedAchievementsDetails: allUnlockedDetails,
        pointsAdded: totalPointsAdded,
     };
  }
  
  return {
    success: true,
    message: `Lição "${lesson.title}" concluída! +${pointsForLesson} pontos.`,
    updatedProfile: profileToUpdate,
    unlockedAchievementsDetails: achievementCheck.unlockedDetails,
    pointsAdded: pointsForLesson + achievementCheck.newPointsFromAchievements,
  };
}

export async function completeExerciseLogic(
  currentProfile: UserProfile | null,
  exerciseId: string
): Promise<UpdateResult> {
  if (!exerciseId) {
    return { success: false, message: "ID do exercício ausente." };
  }

  const exercise = mockExercises.find(e => e.id === exerciseId);
  if (!exercise || !exercise.moduleId) {
    return { success: false, message: "Exercício ou módulo associado não encontrado." };
  }

  const profileToUpdate = createDefaultProfileIfNeeded(currentProfile, currentProfile?.id || "guest_user");

  if (profileToUpdate.completedExercises.includes(exerciseId)) {
     return { success: true, message: "Exercício já estava concluído.", updatedProfile: profileToUpdate, unlockedAchievementsDetails: [], pointsAdded: 0 };
  }

  profileToUpdate.completedExercises = [...new Set([...profileToUpdate.completedExercises, exerciseId])];
  const pointsForExercise = exercise.points;
  profileToUpdate.points = (profileToUpdate.points || 0) + pointsForExercise;

  const achievementCheck = await checkAndUnlockAchievementsLogic(profileToUpdate, 'exercise', exerciseId);
  if (achievementCheck.newAchievements.length > 0) {
    profileToUpdate.unlockedAchievements = [...new Set([...profileToUpdate.unlockedAchievements, ...achievementCheck.newAchievements])];
    profileToUpdate.points += achievementCheck.newPointsFromAchievements;
  }
  
  const pointsAchievementCheck = await checkAndUnlockAchievementsLogic(profileToUpdate, 'points');
  if (pointsAchievementCheck.newAchievements.length > 0) {
    profileToUpdate.unlockedAchievements = [...new Set([...profileToUpdate.unlockedAchievements, ...pointsAchievementCheck.newAchievements])];
    profileToUpdate.points += pointsAchievementCheck.newPointsFromAchievements;
    achievementCheck.unlockedDetails.push(...pointsAchievementCheck.unlockedDetails);
  }

  const moduleCompletionResult = await checkModuleCompletionAndUpdate(profileToUpdate, exercise.moduleId);
  if(moduleCompletionResult.success && moduleCompletionResult.updatedProfile) {
     const finalProfile = moduleCompletionResult.updatedProfile;
     finalProfile.points += (moduleCompletionResult.pointsAdded || 0);
     finalProfile.unlockedAchievements = [...new Set([...finalProfile.unlockedAchievements, ...(moduleCompletionResult.unlockedAchievementsDetails?.map(a => a.id) || [])])];
     
     const allUnlockedDetails = [...(achievementCheck.unlockedDetails || []), ...(moduleCompletionResult.unlockedAchievementsDetails || [])];
     const totalPointsAdded = pointsForExercise + (achievementCheck.newPointsFromAchievements || 0) + (moduleCompletionResult.pointsAdded || 0);
     
     return {
        success: true,
        message: `Exercício "${exercise.title}" concluído! +${pointsForExercise} pontos. ` + (moduleCompletionResult.message.includes("concluído") ? moduleCompletionResult.message : ""),
        updatedProfile: finalProfile,
        unlockedAchievementsDetails: allUnlockedDetails,
        pointsAdded: totalPointsAdded,
     };
  }

  return {
    success: true,
    message: `Exercício "${exercise.title}" concluído! +${pointsForExercise} pontos.`,
    updatedProfile: profileToUpdate,
    unlockedAchievementsDetails: achievementCheck.unlockedDetails,
    pointsAdded: pointsForExercise + achievementCheck.newPointsFromAchievements,
  };
}

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
  
  profileToUpdate.completedModules = [...new Set([...profileToUpdate.completedModules, moduleId])];
  const pointsForModule = 50;
  profileToUpdate.points = (profileToUpdate.points || 0) + pointsForModule;

  const achievementCheck = await checkAndUnlockAchievementsLogic(profileToUpdate, 'module', moduleId);
  if (achievementCheck.newAchievements.length > 0) {
    profileToUpdate.unlockedAchievements = [...new Set([...profileToUpdate.unlockedAchievements, ...achievementCheck.newAchievements])];
    profileToUpdate.points += achievementCheck.newPointsFromAchievements;
  }
  
  const pointsAchievementCheck = await checkAndUnlockAchievementsLogic(profileToUpdate, 'points');
   if (pointsAchievementCheck.newAchievements.length > 0) {
    profileToUpdate.unlockedAchievements = [...new Set([...profileToUpdate.unlockedAchievements, ...pointsAchievementCheck.newAchievements])];
    profileToUpdate.points += pointsAchievementCheck.newPointsFromAchievements;
    achievementCheck.unlockedDetails.push(...pointsAchievementCheck.unlockedDetails);
  }
  
  return {
    success: true,
    message: `Módulo "${module.title}" concluído! +${pointsForModule} pontos.`,
    updatedProfile: profileToUpdate,
    unlockedAchievementsDetails: achievementCheck.unlockedDetails,
    pointsAdded: pointsForModule + achievementCheck.newPointsFromAchievements,
  };
}

export async function saveInteractionProgress(
  currentProfile: UserProfile | null,
  lessonId: string,
  interactionId: string
): Promise<UpdateResult> {
  if (!currentProfile) {
    return { success: false, message: "Perfil não encontrado." };
  }

  const profileToUpdate = JSON.parse(JSON.stringify(currentProfile));
  const lessonProgress = profileToUpdate.lessonProgress[lessonId] || { completed: false, completedInteractions: [], audioProgress: 0 };
  
  if (!lessonProgress.completedInteractions.includes(interactionId)) {
    lessonProgress.completedInteractions.push(interactionId);
    profileToUpdate.lessonProgress[lessonId] = lessonProgress;
  }

  return {
    success: true,
    message: "Progresso da interação salvo.",
    updatedProfile: profileToUpdate,
  };
}


export async function uncompleteInteractionLogic(
  currentProfile: UserProfile | null,
  lessonId: string,
  interactionId: string
): Promise<UpdateResult> {
    if (!currentProfile) {
        return { success: false, message: "Perfil não encontrado." };
    }

    const profileToUpdate = JSON.parse(JSON.stringify(currentProfile));
    const lessonProgress = profileToUpdate.lessonProgress[lessonId];

    if (lessonProgress) {
        const initialInteractionCount = lessonProgress.completedInteractions.length;
        lessonProgress.completedInteractions = lessonProgress.completedInteractions.filter((id: string) => id !== interactionId);
        
        // Se a lição estava marcada como concluída e uma interação foi desfeita,
        // a lição não está mais 100% completa.
        const lesson = mockLessons.find(l => l.id === lessonId);
        const hadAllInteractions = lesson && initialInteractionCount === (lesson.content.match(/INTERACTIVE/g) || []).length;

        if(profileToUpdate.completedLessons.includes(lessonId) && hadAllInteractions && lessonProgress.completedInteractions.length < initialInteractionCount) {
           profileToUpdate.completedLessons = profileToUpdate.completedLessons.filter((id: string) => id !== lessonId);
           lessonProgress.completed = false;
           // Opcional: deduzir pontos se for a regra de negócio
        }

        profileToUpdate.lessonProgress[lessonId] = lessonProgress;
    }

    return {
        success: true,
        message: "Interação desmarcada.",
        updatedProfile: profileToUpdate,
    };
}


export async function resetLessonProgressLogic(
    currentProfile: UserProfile | null,
    lessonId: string
): Promise<UpdateResult> {
    if (!currentProfile) {
        return { success: false, message: "Perfil não encontrado." };
    }

    const profileToUpdate = JSON.parse(JSON.stringify(currentProfile));
    
    // Zera o progresso da lição específica
    if (profileToUpdate.lessonProgress[lessonId]) {
        profileToUpdate.lessonProgress[lessonId] = {
            completed: false,
            completedInteractions: [],
            audioProgress: 0,
        };
    }

    // Remove a lição da lista de concluídas
    const initialCompletedCount = profileToUpdate.completedLessons.length;
    profileToUpdate.completedLessons = profileToUpdate.completedLessons.filter((id: string) => id !== lessonId);

    // Se a lição fazia parte de um módulo completo, desmarca o módulo
    const lesson = mockLessons.find(l => l.id === lessonId);
    if (lesson && lesson.moduleId && profileToUpdate.completedModules.includes(lesson.moduleId) && profileToUpdate.completedLessons.length < initialCompletedCount) {
        profileToUpdate.completedModules = profileToUpdate.completedModules.filter((id: string) => id !== lesson.moduleId);
    }
    
    // Nota: A lógica de deduzir pontos é complexa e pode ser punitiva. 
    // Por enquanto, não vamos deduzir pontos ao reiniciar uma lição.

    return {
        success: true,
        message: "Progresso da lição reiniciado.",
        updatedProfile: profileToUpdate,
    };
}

export async function saveAudioProgressLogic(currentProfile: UserProfile | null, lessonId: string, progress: number): Promise<UpdateResult> {
    if (!currentProfile) {
        return { success: false, message: "Perfil não encontrado." };
    }
    const profileToUpdate = JSON.parse(JSON.stringify(currentProfile));
    
    const lessonProgress = profileToUpdate.lessonProgress[lessonId] || { completed: false, completedInteractions: [], audioProgress: 0 };
    lessonProgress.audioProgress = progress;
    profileToUpdate.lessonProgress[lessonId] = lessonProgress;

    return {
        success: true,
        message: "Progresso do áudio salvo.",
        updatedProfile: profileToUpdate,
    };
}

// Dummy export to satisfy the import if it's not implemented
// export const uncompleteInteractionLogic = async (profile: UserProfile | null, lessonId: string, interactionId: string): Promise<any> => ({ success: true, updatedProfile: profile });
