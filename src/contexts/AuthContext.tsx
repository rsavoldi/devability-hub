
// src/contexts/AuthContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useState, type ReactNode, useCallback } from 'react';
import type { UserProfile, SaveSlot } from '@/lib/types';
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
import { mockLessons } from '@/lib/mockData';
import { countInteractions } from '@/lib/utils';


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
  completeLesson: (lessonId: string, action?: 'complete' | 'uncomplete') => void;
  completeExercise: (exerciseId: string) => void;
  completeModule: (moduleId: string) => void;
  saveInteractionProgress: (lessonId: string, interactionId: string) => void;
  uncompleteInteraction: (lessonId: string, interactionId: string) => void;
  resetLessonProgress: (lessonId: string) => void;
  saveAudioProgress: (lessonId: string, progress: number) => void;
  saveManualBackup: (lessonId: string) => void;
  restoreProgressFromSlot: (slotKey: 'autosave' | 'manualsave', lessonId: string) => void;
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
  
  const [lastProgressUpdate, setLastProgressUpdate] = useState(0);


  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleServerProgressUpdate = useCallback(async (logicFunction: (profile: UserProfile | null) => Promise<any>, silent: boolean = false, lessonIdForAutosave?: string) => {
    // Evita chamadas concorrentes se uma já estiver em andamento
    if (isUpdatingProgress) {
        console.log("Progress update already in progress. Skipping.");
        return;
    }
    if (!userProfile) return;

    setIsUpdatingProgress(true);
    
    try {
      const result = await logicFunction(userProfile);
      
      if (result.success && result.updatedProfile) {
        setUserProfile(result.updatedProfile);
        
        if (result.updatedProfile.id === GUEST_USER_ID) {
          localStorage.setItem(LOCAL_STORAGE_KEYS.GUEST_PROGRESS, JSON.stringify(result.updatedProfile));
        } else if (currentUser) {
          await saveUserProfileToFirestore(currentUser.uid, result.updatedProfile);
          localStorage.setItem(LOCAL_STORAGE_KEYS.LAST_USER_PROFILE, JSON.stringify(result.updatedProfile));
        }
        
        if (lessonIdForAutosave) {
            const autosaveSlot: SaveSlot = {
              timestamp: Date.now(),
              profile: result.updatedProfile,
            };
            localStorage.setItem(`${LOCAL_STORAGE_KEYS.AUTOSAVE_PROGRESS}_${lessonIdForAutosave}`, JSON.stringify(autosaveSlot));
        }

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
            }, 100 * (index + 1));
          });

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
  }, [userProfile, currentUser, toast, isUpdatingProgress]);

  const loadProfile = useCallback(async () => {
    setLoading(true);

    const loadLocalGuestProfile = () => {
        const localGuestProfileRaw = localStorage.getItem(LOCAL_STORAGE_KEYS.GUEST_PROGRESS);
        return localGuestProfileRaw ? JSON.parse(localGuestProfileRaw) : createDefaultProfile(GUEST_USER_ID);
    };

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
            setCurrentUser(firebaseUser);
            let firestoreProfile = await getUserProfile(firebaseUser.uid);

            if (!firestoreProfile) {
                const guestProfile = loadLocalGuestProfile();
                firestoreProfile = createDefaultProfile(firebaseUser.uid, firebaseUser.displayName, firebaseUser.email, firebaseUser.photoURL);
                
                // Merge guest progress into new user profile
                if (guestProfile && (guestProfile.points > 0 || guestProfile.completedLessons.length > 0)) {
                    firestoreProfile.points = guestProfile.points;
                    firestoreProfile.lessonProgress = guestProfile.lessonProgress;
                    firestoreProfile.completedLessons = guestProfile.completedLessons;
                    firestoreProfile.completedExercises = guestProfile.completedExercises;
                    firestoreProfile.unlockedAchievements = guestProfile.unlockedAchievements;
                    firestoreProfile.completedModules = guestProfile.completedModules;
                }
                
                await saveUserProfileToFirestore(firebaseUser.uid, firestoreProfile);
                localStorage.removeItem(LOCAL_STORAGE_KEYS.GUEST_PROGRESS);
            }
            
            setUserProfile(firestoreProfile);
            localStorage.setItem(LOCAL_STORAGE_KEYS.LAST_USER_PROFILE, JSON.stringify(firestoreProfile));

        } else { // No firebase user
            setCurrentUser(null);
            setUserProfile(loadLocalGuestProfile());
            localStorage.removeItem(LOCAL_STORAGE_KEYS.LAST_USER_PROFILE);
        }
        setLoading(false);
    });

    // Fallback if Firebase connection fails or is slow
    const connectionTimeout = setTimeout(() => {
        if (loading) { // If still loading after 5 seconds
            console.warn("Firebase connection timeout. Loading from local cache.");
            const cachedProfileRaw = localStorage.getItem(LOCAL_STORAGE_KEYS.LAST_USER_PROFILE);
            if (cachedProfileRaw) {
                setUserProfile(JSON.parse(cachedProfileRaw));
            } else {
                setUserProfile(loadLocalGuestProfile());
            }
            setLoading(false);
        }
    }, 5000);


    return () => {
        unsubscribe();
        clearTimeout(connectionTimeout);
    };
  }, [loading]);

  useEffect(() => {
    if (isMounted) {
      loadProfile();
    }
  }, [isMounted, loadProfile]);
  
  const refreshUserProfile = useCallback(async () => {
    await loadProfile();
  }, [loadProfile]);

  const saveInteractionProgress = useCallback((lessonId: string, interactionId: string) => {
    handleServerProgressUpdate((profile) => saveInteractionProgressAction(profile, lessonId, interactionId), true, lessonId);
  }, [handleServerProgressUpdate]);
  
  const uncompleteInteraction = useCallback((lessonId: string, interactionId: string) => {
    handleServerProgressUpdate((profile) => uncompleteInteractionLogic(profile, lessonId, interactionId), true, lessonId);
  }, [handleServerProgressUpdate]);
  
  const completeLesson = useCallback((lessonId: string, action: 'complete' | 'uncomplete' = 'complete') => {
    if (action === 'complete') {
        handleServerProgressUpdate((profile) => completeLessonLogic(profile, lessonId), false, lessonId);
    } else {
        // This is a more gentle "uncomplete" that doesn't reset progress
        handleServerProgressUpdate(async (profile) => {
            const profileToUpdate = JSON.parse(JSON.stringify(profile));
            if (profileToUpdate.completedLessons.includes(lessonId)) {
                profileToUpdate.completedLessons = profileToUpdate.completedLessons.filter((id: string) => id !== lessonId);
            }
            return { success: true, message: "Lição desmarcada como concluída.", updatedProfile: profileToUpdate, pointsAdded: 0, unlockedAchievementsDetails: [] };
        }, false, lessonId);
    }
  }, [handleServerProgressUpdate]);


  const resetLessonProgress = useCallback((lessonId: string) => {
    handleServerProgressUpdate((profile) => resetLessonProgressLogic(profile, lessonId), false, lessonId);
  }, [handleServerProgressUpdate]);
  
  const saveAudioProgress = useCallback((lessonId: string, progress: number) => {
    handleServerProgressUpdate((profile) => saveAudioProgressLogic(profile, lessonId, progress), true, lessonId);
  }, [handleServerProgressUpdate]);

  const completeExercise = useCallback((exerciseId: string) => {
    handleServerProgressUpdate((profile) => completeExerciseLogic(profile, exerciseId));
  }, [handleServerProgressUpdate]);

  const completeModule = useCallback((moduleId: string) => {
    handleServerProgressUpdate((profile) => completeModuleLogic(profile, moduleId));
  }, [handleServerProgressUpdate]);

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
        localStorage.removeItem(LOCAL_STORAGE_KEYS.LAST_USER_PROFILE);
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
      
      setUserProfile(defaultProfile);
      
      if (activeUserId === GUEST_USER_ID) {
        localStorage.setItem(LOCAL_STORAGE_KEYS.GUEST_PROGRESS, JSON.stringify(defaultProfile));
      } else {
        await saveUserProfileToFirestore(activeUserId, defaultProfile);
      }
      
      setIsUpdatingProgress(false);
      window.location.reload(); 
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

  const saveManualBackup = useCallback((lessonId: string) => {
    if (!userProfile) return;
    const manualSaveSlot: SaveSlot = {
      timestamp: Date.now(),
      profile: userProfile,
    };
    localStorage.setItem(`${LOCAL_STORAGE_KEYS.MANUALSAVE_PROGRESS}_${lessonId}`, JSON.stringify(manualSaveSlot));
    toast({
      title: "Progresso Salvo Manualmente!",
      description: "Seu progresso atual nesta lição foi salvo no slot de backup manual.",
      variant: "success",
    });
  }, [userProfile, toast]);

  const restoreProgressFromSlot = useCallback(async (slotKey: 'autosave' | 'manualsave', lessonId: string) => {
    const key = `${slotKey === 'autosave' ? LOCAL_STORAGE_KEYS.AUTOSAVE_PROGRESS : LOCAL_STORAGE_KEYS.MANUALSAVE_PROGRESS}_${lessonId}`;
    const savedDataRaw = localStorage.getItem(key);
    
    if (savedDataRaw && userProfile) {
      const savedSlot: SaveSlot = JSON.parse(savedDataRaw);
      const restoredProfileForLesson = savedSlot.profile.lessonProgress[lessonId];
      
      const newProfile = JSON.parse(JSON.stringify(userProfile));
      newProfile.lessonProgress[lessonId] = restoredProfileForLesson;

      // Também é importante recalcular se a lição está completa
      const lesson = mockLessons.find(l => l.id === lessonId);
      const totalInteractions = lesson ? countInteractions(lesson.content) : 0;
      const completedCount = restoredProfileForLesson?.completedInteractions?.length || 0;
      
      if (totalInteractions > 0 && completedCount >= totalInteractions) {
        if (!newProfile.completedLessons.includes(lessonId)) {
            newProfile.completedLessons.push(lessonId);
        }
      } else {
        newProfile.completedLessons = newProfile.completedLessons.filter((id: string) => id !== lessonId);
      }

      setUserProfile(newProfile);
      
      // Save updated profile back to its main source
      if (currentUser) {
        await saveUserProfileToFirestore(currentUser.uid, newProfile);
        localStorage.setItem(LOCAL_STORAGE_KEYS.LAST_USER_PROFILE, JSON.stringify(newProfile));
      } else {
        localStorage.setItem(LOCAL_STORAGE_KEYS.GUEST_PROGRESS, JSON.stringify(newProfile));
      }
      
      toast({
        title: "Progresso Restaurado!",
        description: `O progresso da lição foi carregado do slot "${slotKey === 'autosave' ? 'Autosave' : 'Manual Save'}".`,
        variant: "success",
      });
      window.location.reload(); // Recarrega para que todos os componentes reflitam o novo estado
    } else {
      toast({
        title: "Erro ao Restaurar",
        description: "Nenhum dado encontrado no slot selecionado para esta lição.",
        variant: "destructive",
      });
    }
  }, [userProfile, currentUser, toast]);

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
      saveManualBackup,
      restoreProgressFromSlot,
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
