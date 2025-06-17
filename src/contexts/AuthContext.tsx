
"use client";

import React, { createContext, useContext, useEffect, useState, type ReactNode, useCallback } from 'react';
import type { UserProfile, Achievement, Lesson, Exercise, Module } from '@/lib/types';
import { Loader2, Trophy } from 'lucide-react';
import { LOCAL_STORAGE_KEYS } from '@/constants';
import { auth, db } from '@/lib/firebase';
import {
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile as updateFirebaseProfile,
  type User as FirebaseUser
} from 'firebase/auth';
import { useToast } from "@/hooks/use-toast";
import { playSound } from '@/lib/sounds';
import {
  checkAndUnlockAchievementsLogic,
  completeLessonLogic,
  completeExerciseLogic,
  completeModuleLogic,
  markLessonAsCompleted as markLessonCompletedAction,
  markExerciseAsCompleted as markExerciseCompletedAction,
  markModuleAsCompleted as markModuleCompletedAction,
} from '@/app/actions/userProgressActions';
import { mockAchievements } from '@/lib/mockData';


interface AuthContextType {
  currentUser: FirebaseUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  refreshUserProfile: () => void;
  updateUserProfile: (updates: Partial<UserProfile>, persist?: boolean) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOutFirebase: () => Promise<void>;
  clearCurrentUserProgress: () => void;
  registerWithEmail: (email: string, password: string, name: string) => Promise<FirebaseUser | null>;
  signInWithEmail: (email: string, password: string) => Promise<FirebaseUser | null>;
  completeLesson: (lessonId: string) => Promise<void>;
  completeExercise: (exerciseId: string) => Promise<void>;
  completeModule: (moduleId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const GUEST_USER_ID = "guest_user";
const GUEST_USER_NAME = "Convidado(a)";

const createDefaultProfile = (userId: string, userName?: string | null, userEmail?: string | null, userAvatar?: string | null): UserProfile => ({
  id: userId,
  name: userName || (userId === GUEST_USER_ID ? GUEST_USER_NAME : "Usuário Anônimo"),
  email: userEmail || null,
  avatarUrl: userAvatar || `https://placehold.co/100x100.png?text=${(userName || (userId === GUEST_USER_ID ? "C" : "U")).charAt(0).toUpperCase()}`,
  points: 0,
  completedLessons: [],
  completedExercises: [],
  unlockedAchievements: ['ach1'],
  completedModules: [],
  roles: userId === GUEST_USER_ID || !userId ? ['guest'] : ['user'],
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfileState, setUserProfileState] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const getProfileStorageKey = useCallback((userId: string | null) => {
    return userId ? `${LOCAL_STORAGE_KEYS.USER_PROGRESS_PREFIX}${userId}` : LOCAL_STORAGE_KEYS.GUEST_PROGRESS;
  }, []);

  const updateUserProfile = useCallback(async (updates: Partial<UserProfile>, persist: boolean = true) => {
    let finalUpdatedProfileGlobal: UserProfile | null = null;
    setUserProfileState(prevProfile => {
      const activeUserId = currentUser?.uid || GUEST_USER_ID;
      const baseProfileForMerge = prevProfile || createDefaultProfile(
        activeUserId,
        currentUser?.displayName,
        currentUser?.email,
        currentUser?.photoURL
      );
      
      let updated = { ...baseProfileForMerge, ...updates, id: activeUserId };
      
      updated.unlockedAchievements = Array.isArray(updated.unlockedAchievements) ? [...new Set([...updated.unlockedAchievements, 'ach1'])] : ['ach1'];
      
      if (persist && typeof window !== 'undefined') {
        const storageKey = getProfileStorageKey(currentUser?.uid || null);
        localStorage.setItem(storageKey, JSON.stringify(updated));
      }
      finalUpdatedProfileGlobal = updated; // Store for post-state update logic
      return updated;
    });

    // Moved point-based achievement check here, to operate on the 'finalUpdatedProfileGlobal'
    // which reflects the state *after* the points update would have been applied by setUserProfileState
    if (finalUpdatedProfileGlobal && updates.points !== undefined && userProfileState && updates.points > userProfileState.points) {
        const achievementCheck = await checkAndUnlockAchievementsLogic(finalUpdatedProfileGlobal, 'points');
        if (achievementCheck.newAchievements.length > 0) {
            const profileWithPointAchievements = {
                ...finalUpdatedProfileGlobal,
                unlockedAchievements: [...new Set([...finalUpdatedProfileGlobal.unlockedAchievements, ...achievementCheck.newAchievements])],
                points: (finalUpdatedProfileGlobal.points || 0) + achievementCheck.newPointsFromAchievements
            };
            setUserProfileState(profileWithPointAchievements); 
             if (persist && typeof window !== 'undefined') {
                const storageKey = getProfileStorageKey(currentUser?.uid || null);
                localStorage.setItem(storageKey, JSON.stringify(profileWithPointAchievements));
            }

            achievementCheck.unlockedDetails.forEach((ach) => {
                playSound('achievementUnlock');
                toast({
                    title: ( <div className="flex items-center"> <Trophy className="h-5 w-5 mr-2 text-yellow-400" /> Conquista Desbloqueada! </div> ),
                    description: `${ach.title} - ${ach.description}`,
                    className: "bg-yellow-400 border-yellow-500 text-yellow-900 dark:bg-yellow-600 dark:text-yellow-50",
                });
            });
        }
    }

  }, [currentUser, getProfileStorageKey, toast, userProfileState]);


  const loadProfile = useCallback((userId: string | null, firebaseUser: FirebaseUser | null): UserProfile | null => {
    if (typeof window !== 'undefined') {
      const storageKey = getProfileStorageKey(userId);
      const storedProfileRaw = localStorage.getItem(storageKey);
      let profile: UserProfile;

      if (storedProfileRaw) {
        try {
          profile = JSON.parse(storedProfileRaw) as UserProfile;
          profile.id = userId || GUEST_USER_ID;
          profile.name = firebaseUser?.displayName || profile.name || (userId === GUEST_USER_ID ? GUEST_USER_NAME : "Usuário Anônimo");
          profile.email = firebaseUser?.email || profile.email || null;
          profile.avatarUrl = firebaseUser?.photoURL || profile.avatarUrl || `https://placehold.co/100x100.png?text=${(profile.name || (userId === GUEST_USER_ID ? "C" : "U")).charAt(0).toUpperCase()}`;
          profile.points = typeof profile.points === 'number' ? profile.points : 0;
          profile.completedLessons = Array.isArray(profile.completedLessons) ? profile.completedLessons : [];
          profile.completedExercises = Array.isArray(profile.completedExercises) ? profile.completedExercises : [];
          profile.unlockedAchievements = Array.isArray(profile.unlockedAchievements) ? [...new Set([...profile.unlockedAchievements, 'ach1'])] : ['ach1'];
          profile.completedModules = Array.isArray(profile.completedModules) ? profile.completedModules : [];
          profile.roles = Array.isArray(profile.roles) ? profile.roles : (userId === GUEST_USER_ID || !userId ? ['guest'] : ['user']);

        } catch (e) {
          console.error("Erro ao parsear perfil do localStorage, resetando:", e);
          profile = createDefaultProfile(userId || GUEST_USER_ID, firebaseUser?.displayName, firebaseUser?.email, firebaseUser?.photoURL);
        }
      } else {
        profile = createDefaultProfile(userId || GUEST_USER_ID, firebaseUser?.displayName, firebaseUser?.email, firebaseUser?.photoURL);
      }
      localStorage.setItem(storageKey, JSON.stringify(profile));
      setUserProfileState(profile);
      return profile;
    }
    return null;
  }, [getProfileStorageKey]);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setCurrentUser(firebaseUser);
      let loadedProfile = loadProfile(firebaseUser?.uid || null, firebaseUser);
      
      if (firebaseUser && loadedProfile) {
        if (!loadedProfile.unlockedAchievements.includes('ach_login')) {
          const achievement = mockAchievements.find(a => a.id === 'ach_login');
          if (achievement) {
            const pointsFromLoginAchievement = achievement.pointsAwarded || 0;
            // Chamar updateUserProfile para que ele lide com a lógica de salvar e atualizar o estado
            await updateUserProfile({
              unlockedAchievements: [...new Set([...(loadedProfile.unlockedAchievements || []), 'ach_login'])],
              points: (loadedProfile.points || 0) + pointsFromLoginAchievement
            }, true);
            // O toast de conquista será disparado por updateUserProfile se a conquista for nova para o estado atualizado
            // Para esta conquista específica, podemos disparar um aqui também ou garantir que updateUserProfile o faça.
            // Para simplificar, e como updateUserProfile já tem lógica de toast para conquistas de pontos,
            // vamos deixar a lógica de toast para 'ach_login' aqui, pois é um evento de login.
             playSound('achievementUnlock');
             toast({
               title: ( <div className="flex items-center"> <Trophy className="h-5 w-5 mr-2 text-yellow-400" /> Conquista Desbloqueada! </div> ),
               description: `${achievement.title} - ${achievement.description}`,
               className: "bg-yellow-400 border-yellow-500 text-yellow-900 dark:bg-yellow-600 dark:text-yellow-50",
             });
          }
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [loadProfile, toast, updateUserProfile]);


  const refreshUserProfile = useCallback(() => {
    if (currentUser) {
      loadProfile(currentUser.uid, currentUser);
    } else {
      loadProfile(null, null);
    }
  }, [currentUser, loadProfile]);

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      console.error("Erro ao fazer login com Google:", error);
      const errorCode = error.code;
      let friendlyMessage = "Não foi possível fazer login com Google.";
      if (errorCode === 'auth/popup-closed-by-user' || errorCode === 'auth/cancelled-popup-request') {
        friendlyMessage = "Login com Google cancelado ou janela fechada.";
      }
      toast({ title: "Erro no Login", description: friendlyMessage, variant: "destructive" });
      setLoading(false);
    }
  };

  const signOutFirebase = async () => {
    setLoading(true);
    try {
      await signOut(auth);
    } catch (error: any) {
      console.error("Erro ao fazer logout:", error);
      toast({ title: "Erro no Logout", description: error.message || "Não foi possível fazer logout.", variant: "destructive" });
      setLoading(false);
    }
  };

  const clearCurrentUserProgress = useCallback(() => {
    if (typeof window !== 'undefined') {
      const activeUserId = currentUser?.uid || null;
      const storageKey = getProfileStorageKey(activeUserId);
      localStorage.removeItem(storageKey);
      
      loadProfile(activeUserId, currentUser); 
      
      toast({ title: "Progresso Limpo", description: "Seu progresso local foi reiniciado." });
      console.log(`Progresso limpo para a chave: ${storageKey}`);
    }
  }, [currentUser, getProfileStorageKey, loadProfile, toast]);

  const registerWithEmail = async (email: string, password: string, name: string): Promise<FirebaseUser | null> => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateFirebaseProfile(userCredential.user, { displayName: name });
      
      const updatedFirebaseUser = auth.currentUser;
      if (updatedFirebaseUser) {
        setCurrentUser(updatedFirebaseUser);
        loadProfile(updatedFirebaseUser.uid, updatedFirebaseUser); 
      }
      
      toast({ title: "Registro Bem-Sucedido!", description: `Bem-vindo(a), ${name}!` });
      // setLoading(false) é chamado por onAuthStateChanged
      return userCredential.user;
    } catch (error: any) {
      console.error("Erro ao registrar com email:", error);
      let friendlyMessage = "Não foi possível registrar.";
      if (error.code === 'auth/email-already-in-use') {
        friendlyMessage = "Este email já está em uso. Tente fazer login ou use outro email.";
      } else if (error.code === 'auth/weak-password') {
        friendlyMessage = "A senha é muito fraca. Por favor, use uma senha mais forte.";
      }
      toast({ title: "Erro no Registro", description: error.message || friendlyMessage, variant: "destructive" });
      setLoading(false);
      return null;
    }
  };

  const signInWithEmail = async (email: string, password: string): Promise<FirebaseUser | null> => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      toast({ title: "Login Bem-Sucedido!", description: `Bem-vindo(a) de volta!` });
      // setLoading(false) é chamado por onAuthStateChanged
      return userCredential.user;
    } catch (error: any) {
      console.error("Erro ao fazer login com email:", error);
      let friendlyMessage = "Email ou senha inválidos.";
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        friendlyMessage = "Email ou senha incorretos. Por favor, verifique seus dados.";
      }
      toast({ title: "Erro no Login", description: friendlyMessage, variant: "destructive" });
      setLoading(false);
      return null;
    }
  };

  const handleProgressUpdate = useCallback(async (resultPromise: Promise<any> | any) => {
      try {
        const result = await resultPromise; 
        if (result.success && result.updatedProfile) {
          await updateUserProfile(result.updatedProfile, true); 
          if (result.pointsAdded && result.pointsAdded > 0) {
            playSound('pointGain');
          }
          result.unlockedAchievementsDetails?.forEach((ach: Pick<Achievement, 'id' | 'title' | 'description' | 'emoji' | 'pointsAwarded' | 'dateUnlocked' | 'isUnlocked'>) => {
            playSound('achievementUnlock');
            toast({
              title: ( <div className="flex items-center"> <Trophy className="h-5 w-5 mr-2 text-yellow-400" /> Conquista Desbloqueada! </div> ),
              description: `${ach.title} - ${ach.description}`,
              className: "bg-yellow-400 border-yellow-500 text-yellow-900 dark:bg-yellow-600 dark:text-yellow-50",
            });
          });
          // O toast de sucesso principal (lição/exercício/módulo) é disparado pela função chamadora, se necessário
          // ou pode ser padronizado aqui. Por ora, mantendo como estava.
          if (result.message && (result.message.includes("concluída") || result.message.includes("concluído"))) {
             toast({ title: "Progresso Salvo!", description: result.message, className: "bg-green-500 text-white dark:bg-green-600" });
          }

        } else if (!result.success && result.message && !result.message.includes("já estava concluíd")) { // Não mostrar erro se já estava completo
          toast({ title: "Erro ao Salvar Progresso", description: result.message || "Não foi possível atualizar o progresso.", variant: "destructive" });
        }
      } catch (error) {
          console.error("Erro ao manusear atualização de progresso:", error);
          toast({ title: "Erro Crítico", description: "Ocorreu um erro inesperado ao atualizar seu progresso.", variant: "destructive" });
      }
  }, [updateUserProfile, toast]);

  const completeLesson = useCallback(async (lessonId: string) => {
    if (!userProfileState) {
      toast({ title: "Erro", description: "Perfil do usuário não carregado.", variant: "destructive" });
      return;
    }
    if (userProfileState.completedLessons.includes(lessonId)) {
      // Não precisa mostrar toast se já estava completa e o usuário só revisitou/clicou de novo.
      // console.log("Lição já estava completa, não atualizando.");
      return;
    }
    if (currentUser) {
      await handleProgressUpdate(markLessonCompletedAction(userProfileState, lessonId));
    } else {
      await handleProgressUpdate(completeLessonLogic(userProfileState, lessonId));
    }
  }, [userProfileState, currentUser, handleProgressUpdate]);

  const completeExercise = useCallback(async (exerciseId: string) => {
    if (!userProfileState) {
      toast({ title: "Erro", description: "Perfil do usuário não carregado.", variant: "destructive" });
      return;
    }
     if (userProfileState.completedExercises.includes(exerciseId)) {
      // console.log("Exercício já estava completo, não atualizando.");
      return;
    }
    if (currentUser) {
      await handleProgressUpdate(markExerciseCompletedAction(userProfileState, exerciseId));
    } else {
      await handleProgressUpdate(completeExerciseLogic(userProfileState, exerciseId));
    }
  }, [userProfileState, currentUser, handleProgressUpdate]);

  const completeModule = useCallback(async (moduleId: string) => {
    if (!userProfileState) {
      toast({ title: "Erro", description: "Perfil do usuário não carregado.", variant: "destructive" });
      return;
    }
    if (userProfileState.completedModules.includes(moduleId)) {
        // console.log("Módulo já estava completo, não atualizando.");
        return;
    }
    if (currentUser) {
     await handleProgressUpdate(markModuleCompletedAction(userProfileState, moduleId));
    } else {
     await handleProgressUpdate(completeModuleLogic(userProfileState, moduleId));
    }
  }, [userProfileState, currentUser, handleProgressUpdate]);


  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen w-screen bg-background text-foreground">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg">Carregando...</p>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{
      currentUser,
      userProfile: userProfileState,
      loading,
      refreshUserProfile,
      updateUserProfile,
      signInWithGoogle,
      signOutFirebase,
      clearCurrentUserProgress,
      registerWithEmail,
      signInWithEmail,
      completeLesson,
      completeExercise,
      completeModule,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
