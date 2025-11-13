
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
  if (currentProfile) return JSON.parse(JSON.stringify(currentProfile)); // Return a deep copy
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

  const completedLessonIds = new Set(profile.completedLessons || []);
  const completedExerciseIds = new Set(profile.completedExercises || []);
  const completedModuleIds = new Set(profile.completedModules || []);

  mockAchievements.forEach(achievement => {
    if (!profile.unlockedAchievements.includes(achievement.id)) {
      let conditionMet = false;
      switch (achievement.id) {
        case 'ach_lesson5':
          conditionMet = actionType === 'lesson' && completedLessonIds.size >= 5;
          break;
        case 'ach_exerc10':
          conditionMet = actionType === 'exercise' && completedExerciseIds.size >= 10;
          break;
        case 'ach_mod1':
          conditionMet = actionType === 'module' && completedModuleIds.size >= 1;
          break;
        case 'ach_points100':
          conditionMet = (actionType === 'points' || actionType === 'lesson' || actionType === 'exercise' || actionType === 'module') && profile.points >= 100;
          break;
        case 'ach3':
          conditionMet = actionType === 'lesson' && completedLessonIds.size >= 1;
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

  const allLessonsDone = (moduleToUpdate.lessons || []).every(l => profile.completedLessons.includes(l.id));
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
  
  const lessonProgress = profileToUpdate.lessonProgress[lessonId] || { completed: false, completedInteractions: [], audioProgress: 0 };
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
  const profileToUpdate = createDefaultProfileIfNeeded(currentProfile, currentProfile?.id || "guest_user");
  
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
    const profileToUpdate = createDefaultProfileIfNeeded(currentProfile, currentProfile?.id || "guest_user");
    const lessonProgress = profileToUpdate.lessonProgress[lessonId];
    const lesson = mockLessons.find(l => l.id === lessonId);

    if (lessonProgress) {
        lessonProgress.completedInteractions = lessonProgress.completedInteractions.filter((id: string) => id !== interactionId);
        
        if (profileToUpdate.completedLessons.includes(lessonId)) {
           profileToUpdate.completedLessons = profileToUpdate.completedLessons.filter((id: string) => id !== lessonId);
           lessonProgress.completed = false;
        }

        if (lesson && lesson.moduleId && profileToUpdate.completedModules.includes(lesson.moduleId)) {
            profileToUpdate.completedModules = profileToUpdate.completedModules.filter((id: string) => id !== lesson.moduleId);
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
    const profileToUpdate = createDefaultProfileIfNeeded(currentProfile, currentProfile?.id || "guest_user");
    const lesson = mockLessons.find(l => l.id === lessonId);

    if (!lesson) {
        return { success: false, message: "Lição não encontrada." };
    }
    
    // Zera o progresso da lição
    if (profileToUpdate.lessonProgress[lessonId]) {
        profileToUpdate.lessonProgress[lessonId] = {
            completed: false,
            completedInteractions: [],
            audioProgress: 0,
        };
    }

    // Se a lição estava concluída, remove-a da lista e subtrai os pontos
    const wasLessonCompleted = profileToUpdate.completedLessons.includes(lessonId);
    if (wasLessonCompleted) {
        profileToUpdate.completedLessons = profileToUpdate.completedLessons.filter((id: string) => id !== lessonId);
        profileToUpdate.points -= (lesson.points || 10);
    }
    
    // Lógica futura: Desbloquear conquistas e subtrair pontos de conquistas.
    // Isso é mais complexo pois uma conquista pode ser ganha por várias lições
    // e não deve ser "re-trancada" se o critério ainda for válido por outras atividades.
    // Por simplicidade, essa parte não será implementada agora.
    
    return {
        success: true,
        message: "Progresso da lição reiniciado.",
        updatedProfile: profileToUpdate,
    };
}

export async function saveAudioProgressLogic(currentProfile: UserProfile | null, lessonId: string, progress: number): Promise<UpdateResult> {
    const profileToUpdate = createDefaultProfileIfNeeded(currentProfile, currentProfile?.id || "guest_user");
    
    const lessonProgress = profileToUpdate.lessonProgress[lessonId] || { completed: false, completedInteractions: [], audioProgress: 0 };
    lessonProgress.audioProgress = progress;
    profileToUpdate.lessonProgress[lessonId] = lessonProgress;

    return {
        success: true,
        message: "Progresso do áudio salvo.",
        updatedProfile: profileToUpdate,
    };
}
