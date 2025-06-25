
"use client";

import React, { createContext, useContext, useEffect, useState, type ReactNode, useCallback } from 'react';
import type { UserProfile, Achievement } from '@/lib/types';
import { Loader2, Trophy } from 'lucide-react';
import { LOCAL_STORAGE_KEYS } from '@/constants';
import { auth } from '@/lib/firebase';
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
import { completeLessonLogic, completeExerciseLogic, completeModuleLogic } from '@/app/actions/userProgressActions';
import { getUserProfile, updateUserProfile as saveUserProfileToFirestore } from '@/lib/firebase/user';
import { mockAchievements } from '@/lib/mockData';

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  refreshUserProfile: () => void;
  signInWithGoogle: () => Promise<void>;
  signOutFirebase: () => Promise<void>;
  clearCurrentUserProgress: () => void;
  registerWithEmail: (email: string, password: string, name: string) => Promise<FirebaseUser | null>;
  signInWithEmail: (email: string, password: string) => Promise<FirebaseUser | null>;
  completeLesson: (lessonId: string) => Promise<void>;
  completeExercise: (exerciseId: string) => Promise<void>;
  completeModule: (moduleId: string) => Promise<void>;
  saveInteractionProgress: (lessonId: string, interactionId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const GUEST_USER_ID = "guest_user";

const createDefaultProfile = (userId: string, userName?: string | null, userEmail?: string | null, userAvatar?: string | null): UserProfile => ({
  id: userId,
  name: userName || (userId === GUEST_USER_ID ? "Convidado(a)" : "Usuário Anônimo"),
  email: userEmail || null,
  avatarUrl: userAvatar || `https://placehold.co/100x100.png?text=${(userName || "G").charAt(0).toUpperCase()}`,
  points: 0,
  lessonProgress: {},
  completedExercises: [],
  unlockedAchievements: ['ach1'],
  completedModules: [],
  roles: userId === GUEST_USER_ID || !userId ? ['guest'] : ['user'],
});

const loadGuestProfile = (): UserProfile => {
  if (typeof window === 'undefined') {
    return createDefaultProfile(GUEST_USER_ID);
  }
  const storedProfileRaw = localStorage.getItem(LOCAL_STORAGE_KEYS.GUEST_PROGRESS);
  if (storedProfileRaw) {
    try {
      const profile = JSON.parse(storedProfileRaw) as UserProfile;
      // Data integrity checks
      profile.id = GUEST_USER_ID;
      profile.name = profile.name || "Convidado(a)";
      profile.roles = profile.roles || ['guest'];
      profile.lessonProgress = profile.lessonProgress || {};
      return profile;
    } catch (e) {
      console.error("Error parsing guest profile from localStorage", e);
    }
  }
  return createDefaultProfile(GUEST_USER_ID);
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfileState, setUserProfileState] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const updateUserProfileState = useCallback(async (newProfileData: UserProfile) => {
    setUserProfileState(newProfileData);
    if (newProfileData.id === GUEST_USER_ID) {
      if (typeof window !== 'undefined') {
        localStorage.setItem(LOCAL_STORAGE_KEYS.GUEST_PROGRESS, JSON.stringify(newProfileData));
      }
    } else {
      await saveUserProfileToFirestore(newProfileData.id, newProfileData);
    }
  }, []);

  const handleProgressUpdate = useCallback(async (resultPromise: Promise<any>) => {
    try {
      const result = await resultPromise;
      if (result.success && result.updatedProfile) {
        await updateUserProfileState(result.updatedProfile);
        
        if (result.pointsAdded && result.pointsAdded > 0) {
          setTimeout(() => playSound('pointGain'), 0);
        }
        
        result.unlockedAchievementsDetails?.forEach((ach: Achievement) => {
          setTimeout(() => {
            playSound('achievementUnlock');
            toast({
              title: (<div className="flex items-center"> <Trophy className="h-5 w-5 mr-2 text-yellow-400" /> Conquista Desbloqueada! </div>),
              description: `${ach.title} - ${ach.description}`,
              className: "bg-yellow-400 border-yellow-500 text-yellow-900 dark:bg-yellow-600 dark:text-yellow-50",
            });
          }, 100);
        });

        if (result.message && (result.message.includes("concluída") || result.message.includes("concluído"))) {
          setTimeout(() => {
             toast({ title: "Progresso Salvo!", description: result.message, className: "bg-green-500 text-white dark:bg-green-600" });
           }, 0);
        }
      } else if (!result.success && result.message && !result.message.includes("já estava concluíd")) {
        setTimeout(() => {
          toast({ title: "Erro", description: result.message || "Não foi possível atualizar o progresso.", variant: "destructive" });
        }, 0);
      }
    } catch (error) {
        console.error("Erro ao manusear atualização de progresso:", error);
        setTimeout(() => {
          toast({ title: "Erro Crítico", description: "Ocorreu um erro inesperado ao atualizar seu progresso.", variant: "destructive" });
        }, 0);
    }
  }, [updateUserProfileState, toast]);

  const saveInteractionProgress = useCallback(async (lessonId: string, interactionId: string) => {
    if (!userProfileState) return;

    const newProfile = { ...userProfileState };
    const currentLessonProgress = newProfile.lessonProgress[lessonId] || { completed: false, completedInteractions: [] };
    
    if (!currentLessonProgress.completedInteractions.includes(interactionId)) {
        currentLessonProgress.completedInteractions = [...currentLessonProgress.completedInteractions, interactionId];
        newProfile.lessonProgress = {
            ...newProfile.lessonProgress,
            [lessonId]: currentLessonProgress
        };
        await updateUserProfileState(newProfile);
    }
  }, [userProfileState, updateUserProfileState]);


  useEffect(() => {
    setLoading(true);
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setCurrentUser(firebaseUser);
      if (firebaseUser) {
        let profile = await getUserProfile(firebaseUser.uid);
        if (!profile) {
          // New user, create profile in Firestore
          profile = createDefaultProfile(firebaseUser.uid, firebaseUser.displayName, firebaseUser.email, firebaseUser.photoURL);
          await saveUserProfileToFirestore(firebaseUser.uid, profile);
        }
        setUserProfileState(profile);
      } else {
        // Guest user
        setUserProfileState(loadGuestProfile());
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const refreshUserProfile = useCallback(async () => {
    if (currentUser) {
      const refreshedProfile = await getUserProfile(currentUser.uid);
      if(refreshedProfile) setUserProfileState(refreshedProfile);
    } else {
      setUserProfileState(loadGuestProfile());
    }
  }, [currentUser]);

  const completeLesson = useCallback(async (lessonId: string) => {
    if (!userProfileState) return;
    if (userProfileState.lessonProgress[lessonId]?.completed) return;
    const resultPromise = completeLessonLogic(userProfileState, lessonId);
    await handleProgressUpdate(resultPromise);
  }, [userProfileState, handleProgressUpdate]);

  const completeExercise = useCallback(async (exerciseId: string) => {
    if (!userProfileState) return;
    if (userProfileState.completedExercises.includes(exerciseId)) return;
    const resultPromise = completeExerciseLogic(userProfileState, exerciseId);
    await handleProgressUpdate(resultPromise);
  }, [userProfileState, handleProgressUpdate]);

  const completeModule = useCallback(async (moduleId: string) => {
    if (!userProfileState) return;
    if (userProfileState.completedModules.includes(moduleId)) return;
    const resultPromise = completeModuleLogic(userProfileState, moduleId);
    await handleProgressUpdate(resultPromise);
  }, [userProfileState, handleProgressUpdate]);


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
      // onAuthStateChanged will handle setting the guest profile
    } catch (error: any) {
      console.error("Erro ao fazer logout:", error);
      toast({ title: "Erro no Logout", description: error.message || "Não foi possível fazer logout.", variant: "destructive" });
      setLoading(false);
    }
  };

  const clearCurrentUserProgress = useCallback(async () => {
    if (typeof window !== 'undefined') {
      const activeUserId = currentUser?.uid || GUEST_USER_ID;
      const defaultProfile = createDefaultProfile(activeUserId, currentUser?.displayName, currentUser?.email, currentUser?.photoURL);
      await updateUserProfileState(defaultProfile);
      toast({ title: "Progresso Limpo", description: "Seu progresso foi reiniciado." });
    }
  }, [currentUser, updateUserProfileState, toast]);

  const registerWithEmail = async (email: string, password: string, name: string): Promise<FirebaseUser | null> => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateFirebaseProfile(userCredential.user, { displayName: name });
      // onAuthStateChanged will handle the rest
      toast({ title: "Registro Bem-Sucedido!", description: `Bem-vindo(a), ${name}!` });
      return userCredential.user;
    } catch (error: any) {
      console.error("Erro ao registrar com email:", error);
      let friendlyMessage = "Não foi possível registrar.";
      if (error.code === 'auth/email-already-in-use') {
        friendlyMessage = "Este email já está em uso. Tente fazer login ou use outro email.";
      } else if (error.code === 'auth/weak-password') {
        friendlyMessage = "A senha é muito fraca. Por favor, use uma senha mais forte.";
      }
      toast({ title: "Erro no Registro", description: friendlyMessage, variant: "destructive" });
      setLoading(false);
      return null;
    }
  };

  const signInWithEmail = async (email: string, password: string): Promise<FirebaseUser | null> => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      toast({ title: "Login Bem-Sucedido!", description: `Bem-vindo(a) de volta!` });
      return userCredential.user;
    } catch (error: any) {
       let friendlyMessage = "Email ou senha inválidos.";
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        friendlyMessage = "Email ou senha incorretos. Por favor, verifique seus dados.";
      }
      toast({ title: "Erro no Login", description: friendlyMessage, variant: "destructive" });
      setLoading(false);
      return null;
    }
  };

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
      signInWithGoogle,
      signOutFirebase,
      clearCurrentUserProgress,
      registerWithEmail,
      signInWithEmail,
      completeLesson,
      completeExercise,
      completeModule,
      saveInteractionProgress,
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
