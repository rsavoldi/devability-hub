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
import { useToast } from "@/hooks/use-toast"
import { playSound } from '@/lib/sounds';
import { completeLessonLogic, completeExerciseLogic, completeModuleLogic, saveInteractionProgress as saveInteractionProgressAction, uncompleteInteractionLogic, resetLessonProgressLogic, saveAudioProgressLogic } from '@/app/actions/userProgressActions';
import { getUserProfile, updateUserProfile as saveUserProfileToFirestore } from '@/lib/firebase/user';

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isUpdatingProgress: boolean;
  refreshUserProfile: () => void;
  signInWithGoogle: () => Promise<void>;
  signOutFirebase: () => Promise<void>;
  clearCurrentUserProgress: () => void;
  registerWithEmail: (email: string, password: string, name: string) => Promise<FirebaseUser | null>;
  signInWithEmail: (email: string, password: string) => Promise<FirebaseUser | null>;
  completeLesson: (lessonId: string) => Promise<void>;
  completeExercise: (exerciseId: string) => Promise<void>;
  completeModule: (moduleId: string) => Promise<void>;
  saveInteractionProgress: (lessonId: string, interactionId: string) => void;
  uncompleteInteraction: (lessonId: string, interactionId: string) => void;
  resetLessonProgress: (lessonId: string) => Promise<void>;
  saveAudioProgress: (lessonId: string, progress: number) => void;
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
  completedLessons: [],
  completedExercises: [],
  unlockedAchievements: ['ach1'],
  completedModules: [],
  roles: userId === GUEST_USER_ID || !userId ? ['guest'] : ['user'],
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUpdatingProgress, setIsUpdatingProgress] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleServerProgressUpdate = useCallback(async (logicFunction: (profile: UserProfile | null) => Promise<any>, silent: boolean = false) => {
    if (!userProfile) return;

    setIsUpdatingProgress(true);
    
    try {
      const result = await logicFunction(userProfile);
      
      if (result.success && result.updatedProfile) {
        // Update UI with the definitive state from the action
        setUserProfile(result.updatedProfile);
        
        // Persist the updated profile
        if (result.updatedProfile.id === GUEST_USER_ID) {
          localStorage.setItem(LOCAL_STORAGE_KEYS.GUEST_PROGRESS, JSON.stringify(result.updatedProfile));
        } else if (currentUser) {
          await saveUserProfileToFirestore(currentUser.uid, result.updatedProfile);
        }
        
        // Handle sounds and toasts for achievements if not a silent update
        if (!silent) {
          if (result.pointsAdded > 0) {
            playSound('pointGain');
          }
          result.unlockedAchievementsDetails?.forEach((ach: any, index: number) => {
            setTimeout(() => {
              playSound('achievementUnlock');
              toast({
                title: "Conquista Desbloqueada!",
                description: (
                  <div className="flex items-center">
                    <Trophy className="h-5 w-5 mr-2 text-amber-900" />
                    <span>{ach.title} - {ach.description}</span>
                  </div>
                ),
                variant: "achievement",
              });
            }, 100 * (index + 1)); // Stagger toasts
          });

          // Show a success message if not silent and there is a meaningful message
          if (result.message && !result.message.includes("já estava concluíd")) {
             toast({ title: "Progresso Salvo!", description: result.message, variant: "success" });
          }
        }
      } else if (!silent && !result.success && result.message) {
          toast({ title: "Erro", description: result.message || "Não foi possível atualizar o progresso.", variant: "destructive" });
      }
    } catch (error) {
      console.error("Error during progress update:", error);
      if (!silent) {
        toast({ title: "Erro", description: "Ocorreu um erro ao salvar seu progresso.", variant: "destructive" });
      }
    } finally {
      setIsUpdatingProgress(false);
    }
  }, [userProfile, currentUser, toast]);


  const loadProfile = useCallback(async () => {
    setLoading(true);
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setCurrentUser(firebaseUser);
        let profile = await getUserProfile(firebaseUser.uid);
        if (!profile) {
          const guestProfileRaw = localStorage.getItem(LOCAL_STORAGE_KEYS.GUEST_PROGRESS);
          const guestProfile = guestProfileRaw ? JSON.parse(guestProfileRaw) : null;

          profile = createDefaultProfile(firebaseUser.uid, firebaseUser.displayName, firebaseUser.email, firebaseUser.photoURL);

          if (guestProfile) {
            profile.points = guestProfile.points;
            profile.lessonProgress = guestProfile.lessonProgress;
            profile.completedLessons = guestProfile.completedLessons;
            profile.completedExercises = guestProfile.completedExercises;
            profile.unlockedAchievements = guestProfile.unlockedAchievements;
            profile.completedModules = guestProfile.completedModules;
            localStorage.removeItem(LOCAL_STORAGE_KEYS.GUEST_PROGRESS);
          }
          await saveUserProfileToFirestore(firebaseUser.uid, profile);
        }
        setUserProfile(profile);
      } else {
        setCurrentUser(null);
        if (typeof window !== 'undefined') {
          const storedGuestProfile = localStorage.getItem(LOCAL_STORAGE_KEYS.GUEST_PROGRESS);
          if (storedGuestProfile) {
            setUserProfile(JSON.parse(storedGuestProfile));
          } else {
            setUserProfile(createDefaultProfile(GUEST_USER_ID));
          }
        } else {
            setUserProfile(createDefaultProfile(GUEST_USER_ID));
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isMounted) {
      loadProfile();
    }
  }, [isMounted, loadProfile]);
  
  const refreshUserProfile = useCallback(async () => {
    await loadProfile();
  }, [loadProfile]);

  const saveInteractionProgress = useCallback((lessonId: string, interactionId: string) => {
    if (!userProfile) return;

    // Optimistic UI update
    const newProfile = { ...userProfile };
    const lessonProgress = newProfile.lessonProgress[lessonId] || { completed: false, completedInteractions: [], audioProgress: 0 };
    if (!lessonProgress.completedInteractions.includes(interactionId)) {
      lessonProgress.completedInteractions = [...lessonProgress.completedInteractions, interactionId];
      newProfile.lessonProgress = { ...newProfile.lessonProgress, [lessonId]: lessonProgress };
      setUserProfile(newProfile); // Update UI immediately
    }
    
    // Fire-and-forget server action for persistence, now with the updated profile
    saveInteractionProgressAction(newProfile, lessonId, interactionId);

  }, [userProfile]);
  
  const uncompleteInteraction = useCallback((lessonId: string, interactionId: string) => {
    if (!userProfile) return;

    // Optimistic UI update
    const newProfile = { ...userProfile };
    const lessonProgress = newProfile.lessonProgress[lessonId];
    if (lessonProgress && lessonProgress.completedInteractions.includes(interactionId)) {
        lessonProgress.completedInteractions = lessonProgress.completedInteractions.filter(id => id !== interactionId);
        newProfile.lessonProgress = { ...newProfile.lessonProgress, [lessonId]: lessonProgress };
        setUserProfile(newProfile); // Update UI immediately
    }

    // Fire-and-forget server action for persistence
    uncompleteInteractionLogic(newProfile, lessonId, interactionId);

  }, [userProfile]);
  
  const completeLesson = useCallback(async (lessonId: string) => {
    if (!userProfile || userProfile.completedLessons.includes(lessonId)) return;
    await handleServerProgressUpdate((profile) => completeLessonLogic(profile, lessonId));
  }, [userProfile, handleServerProgressUpdate]);

  const resetLessonProgress = useCallback(async (lessonId: string) => {
    // This is a significant state change, so we will use the full server update cycle
    await handleServerProgressUpdate((profile) => resetLessonProgressLogic(profile, lessonId), true); // silent
  }, [handleServerProgressUpdate]);
  
  const saveAudioProgress = useCallback((lessonId: string, progress: number) => {
    if (!userProfile) return;

    const currentProgress = userProfile.lessonProgress[lessonId]?.audioProgress || 0;
    // Save only if progress is significant to avoid too many updates, but always save completion.
    if (Math.abs(progress - currentProgress) < 5 && progress < 100) return;

    // Optimistic UI update
    const newProfile = { ...userProfile };
    const lessonProgress = newProfile.lessonProgress[lessonId] || { completed: false, completedInteractions: [], audioProgress: 0 };
    lessonProgress.audioProgress = progress;
    newProfile.lessonProgress = { ...newProfile.lessonProgress, [lessonId]: lessonProgress };
    setUserProfile(newProfile);

    // Fire-and-forget server action
    saveAudioProgressLogic(newProfile, lessonId, progress);
  }, [userProfile]);

  const completeExercise = useCallback(async (exerciseId: string) => {
    if (!userProfile || userProfile.completedExercises.includes(exerciseId)) return;
    await handleServerProgressUpdate((profile) => completeExerciseLogic(profile, exerciseId));
  }, [userProfile, handleServerProgressUpdate]);

  const completeModule = useCallback(async (moduleId: string) => {
    if (!userProfile || userProfile.completedModules.includes(moduleId)) return;
    await handleServerProgressUpdate((profile) => completeModuleLogic(profile, moduleId));
  }, [userProfile, handleServerProgressUpdate]);

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
      const guestProfile = createDefaultProfile(GUEST_USER_ID);
      setUserProfile(guestProfile);
      if (typeof window !== 'undefined') {
        localStorage.setItem(LOCAL_STORAGE_KEYS.GUEST_PROGRESS, JSON.stringify(guestProfile));
      }
    } catch (error: any) {
      console.error("Erro ao fazer logout:", error);
      toast({ title: "Erro no Logout", description: error.message || "Não foi possível fazer logout.", variant: "destructive" });
    } finally {
        setLoading(false);
    }
  };
  
  const clearCurrentUserProgress = useCallback(async () => {
    if (typeof window !== 'undefined') {
      setIsUpdatingProgress(true);
      const activeUserId = currentUser?.uid || GUEST_USER_ID;
      const defaultProfile = createDefaultProfile(activeUserId, currentUser?.displayName, currentUser?.email, currentUser?.photoURL);
      
      // Update state immediately for instant UI feedback
      setUserProfile(defaultProfile);
      
      // Persist the change
      if (activeUserId === GUEST_USER_ID) {
        localStorage.setItem(LOCAL_STORAGE_KEYS.GUEST_PROGRESS, JSON.stringify(defaultProfile));
      } else {
        await saveUserProfileToFirestore(activeUserId, defaultProfile);
      }
      
      setIsUpdatingProgress(false);
      toast({ title: "Progresso Limpo", description: "Seu progresso foi reiniciado." });
    }
  }, [currentUser]);


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

  if (loading || !isMounted) {
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
      isUpdatingProgress,
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
      saveAudioProgress,
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
