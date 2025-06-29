// src/contexts/AuthContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useState, type ReactNode, useCallback } from 'react';
import type { UserProfile, LessonProgress } from '@/lib/types';
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
import { completeLessonLogic, completeExerciseLogic, completeModuleLogic, resetLessonProgressLogic } from '@/app/actions/userProgressActions';
import { getUserProfile, updateUserProfile as saveUserProfileToFirestore } from '@/lib/firebase/user';
import { mockLessons, mockUserProfile } from '@/lib/mockData';

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
  uncompleteInteraction: (lessonId: string, interactionId: string) => Promise<void>;
  resetLessonProgress: (lessonId: string) => Promise<void>;
  isUpdatingProgress: boolean; // Para controlar o estado de loading de ações
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
  completedLessons: [], // Adicionado para consistência
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUpdatingProgress, setIsUpdatingProgress] = useState(false);
  const { toast } = useToast();

  const updateUserProfile = useCallback(async (newProfileData: UserProfile) => {
      setUserProfile(newProfileData);
      // No modo estático, a persistência é simulada via estado do React e recarregamento do mock.
      // Em uma aplicação real, aqui seria a chamada para o Firestore/DB.
      if (newProfileData.id === GUEST_USER_ID) {
        if (typeof window !== 'undefined') {
            localStorage.setItem(LOCAL_STORAGE_KEYS.GUEST_PROGRESS, JSON.stringify(newProfileData));
        }
      } else if(currentUser) {
          await saveUserProfileToFirestore(currentUser.uid, newProfileData);
      }
  }, [currentUser]);

  const handleProgressUpdate = useCallback(async (resultPromise: Promise<any>) => {
    setIsUpdatingProgress(true);
    try {
      const result = await resultPromise;
      if (result.success && result.updatedProfile) {
        await updateUserProfile(result.updatedProfile);
        
        if (result.pointsAdded && result.pointsAdded > 0) {
          playSound('pointGain');
        }
        
        result.unlockedAchievementsDetails?.forEach((ach: any) => {
          setTimeout(() => {
            playSound('achievementUnlock');
            toast({
              title: (<div className="flex items-center"> <Trophy className="h-5 w-5 mr-2 text-amber-900" /> Conquista Desbloqueada! </div>),
              description: `${ach.title} - ${ach.description}`,
              variant: "achievement",
            });
          }, 100);
        });

        if (result.message && !(result.message.includes("já estava concluíd"))) {
           toast({ title: "Progresso Salvo!", description: result.message, variant: "success" });
        }
      } else if (!result.success && result.message && !result.message.includes("já estava concluíd")) {
          toast({ title: "Erro", description: result.message || "Não foi possível atualizar o progresso.", variant: "destructive" });
      }
    } catch (error) {
        console.error("Erro ao manusear atualização de progresso:", error);
          toast({ title: "Erro Crítico", description: "Ocorreu um erro inesperado ao atualizar seu progresso.", variant: "destructive" });
    } finally {
      setIsUpdatingProgress(false);
    }
  }, [updateUserProfile, toast]);
  

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setCurrentUser(firebaseUser);
      if (firebaseUser) {
        let profile = await getUserProfile(firebaseUser.uid);
        if (!profile) {
          profile = createDefaultProfile(firebaseUser.uid, firebaseUser.displayName, firebaseUser.email, firebaseUser.photoURL);
          await saveUserProfileToFirestore(firebaseUser.uid, profile);
        }
        setUserProfile(profile);
      } else {
        // CORREÇÃO: Carrega o perfil do mock em vez de um perfil de convidado vazio.
        // A cópia profunda garante que o estado não mute o arquivo original diretamente.
        const initialProfile = JSON.parse(JSON.stringify(mockUserProfile));
        setUserProfile(initialProfile);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);
  
  const refreshUserProfile = useCallback(async () => {
    setLoading(true);
    if (currentUser) {
      const refreshedProfile = await getUserProfile(currentUser.uid);
      if(refreshedProfile) setUserProfile(refreshedProfile);
    } else {
      // CORREÇÃO: Garante que o refresh também recarregue o perfil do mock.
      const initialProfile = JSON.parse(JSON.stringify(mockUserProfile));
      setUserProfile(initialProfile);
    }
    setLoading(false);
  }, [currentUser]);

  const saveInteractionProgress = useCallback(async (lessonId: string, interactionId: string) => {
    if (!userProfile) return;
    setIsUpdatingProgress(true);
    const newProfile = JSON.parse(JSON.stringify(userProfile));
    const currentLessonProgress = newProfile.lessonProgress[lessonId] || { completed: false, completedInteractions: [] };
    
    if (!currentLessonProgress.completedInteractions.includes(interactionId)) {
      currentLessonProgress.completedInteractions.push(interactionId);
      newProfile.lessonProgress[lessonId] = currentLessonProgress;
      await updateUserProfile(newProfile);
    }
    setIsUpdatingProgress(false);
  }, [userProfile, updateUserProfile]);

  const uncompleteInteraction = useCallback(async(lessonId: string, interactionId: string) => {
    if (!userProfile) return;
    setIsUpdatingProgress(true);
    const newProfile = JSON.parse(JSON.stringify(userProfile));
    const lessonProgress = newProfile.lessonProgress[lessonId];

    if (lessonProgress) {
        lessonProgress.completedInteractions = lessonProgress.completedInteractions.filter(id => id !== interactionId);
        lessonProgress.completed = false; // Se uma interação é desfeita, a lição não pode mais ser considerada completa
        newProfile.lessonProgress[lessonId] = lessonProgress;
        await updateUserProfile(newProfile);
    }
    setIsUpdatingProgress(false);
  }, [userProfile, updateUserProfile]);
  
  const completeLesson = useCallback(async (lessonId: string) => {
    if (!userProfile || (userProfile.lessonProgress[lessonId]?.completed)) return;
    const resultPromise = completeLessonLogic(userProfile, lessonId);
    await handleProgressUpdate(resultPromise);
  }, [userProfile, handleProgressUpdate]);

  const resetLessonProgress = useCallback(async (lessonId: string) => {
    if (!userProfile) return;
    const resultPromise = resetLessonProgressLogic(userProfile, lessonId);
    await handleProgressUpdate(resultPromise);
    const lesson = mockLessons.find(l => l.id === lessonId);
    toast({ title: "Progresso da Lição Reiniciado", description: `Você pode refazer a lição "${lesson?.title}".`});
  }, [userProfile, handleProgressUpdate, toast]);

  const completeExercise = useCallback(async (exerciseId: string) => {
    if (!userProfile || userProfile.completedExercises.includes(exerciseId)) return;
    const resultPromise = completeExerciseLogic(userProfile, exerciseId);
    await handleProgressUpdate(resultPromise);
  }, [userProfile, handleProgressUpdate]);

  const completeModule = useCallback(async (moduleId: string) => {
    if (!userProfile || userProfile.completedModules.includes(moduleId)) return;
    const resultPromise = completeModuleLogic(userProfile, moduleId);
    await handleProgressUpdate(resultPromise);
  }, [userProfile, handleProgressUpdate]);

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
  
  const clearCurrentUserProgress = useCallback(async () => {
    if (userProfile) {
      const resetProfile: UserProfile = {
        ...userProfile, // Mantém ID, nome, avatar, etc.
        points: 0,
        lessonProgress: {},
        completedExercises: [],
        unlockedAchievements: ['ach1'], // Mantém a conquista inicial
        completedModules: [],
        completedLessons: [], // Reseta as lições completas
      };
      await updateUserProfile(resetProfile);
      toast({ title: "Progresso Limpo", description: "Seu progresso foi reiniciado com sucesso." });
    }
  }, [userProfile, updateUserProfile, toast]);

  const registerWithEmail = async (email: string, password: string, name: string): Promise<FirebaseUser | null> => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateFirebaseProfile(userCredential.user, { displayName: name });
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
      userProfile,
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
      uncompleteInteraction,
      resetLessonProgress,
      isUpdatingProgress,
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
