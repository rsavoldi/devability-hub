
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
import { Button } from '@/components/ui/button';

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isUpdatingProgress: boolean;
  refreshUserProfile: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOutFirebase: () => Promise<void>;
  clearCurrentUserProgress: () => void;
  registerWithEmail: (email: string, password: string, name: string) => Promise<FirebaseUser | null>;
  signInWithEmail: (email: string, password: string) => Promise<FirebaseUser | null>;
  saveInteractionProgress: (lessonId: string, interactionId: string) => void;
  uncompleteInteraction: (lessonId: string, interactionId: string) => void;
  resetLessonProgress: (lessonId: string) => void;
  saveAudioProgress: (lessonId: string, progress: number) => void;
  saveManualBackup: (lessonId: string) => void;
  restoreProgressFromSlot: (slotKey: 'autosave' | 'manualsave', lessonId: string) => void;
  completeLesson: (lessonId: string) => void;
  completeExercise: (exerciseId: string) => void;
  completeModule: (moduleId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const GUEST_USER_ID = "guest_user";

const createDefaultProfile = (userId: string, userName?: string | null, userEmail?: string | null, userAvatar?: string | null): UserProfile => ({
  id: userId,
  name: userName || (userId === GUEST_USER_ID ? "Convidado(a)" : "Usuário Anônimo"),
  email: userEmail || null,
  avatarUrl: userAvatar || `https://placehold.co/100x100.png?text=${(userName || "C").charAt(0).toUpperCase()}`,
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
  const { toast } = useToast();
  const [connectionError, setConnectionError] = useState<string | null>(null);
  let activeUpdatePromise: Promise<any> | null = null;


  const handleServerProgressUpdate = useCallback(async (logicFunction: (profile: UserProfile | null) => Promise<any>, silent: boolean = false, lessonIdForAutosave?: string) => {
    if (activeUpdatePromise) {
      // Se uma atualização já estiver em andamento, ignore a nova para evitar corridas
      return;
    }
    if (!userProfile) return;
  
    setIsUpdatingProgress(true);
    
    const promise = logicFunction(userProfile);
    activeUpdatePromise = promise;
  
    try {
      const result = await promise;
  
      if (promise !== activeUpdatePromise) {
        // Se uma nova atualização foi iniciada enquanto esta estava em andamento, descarte este resultado
        return;
      }
      
      if (result.success && result.updatedProfile) {
        setUserProfile(result.updatedProfile);
        
        if (result.updatedProfile.id === GUEST_USER_ID) {
          localStorage.setItem(LOCAL_STORAGE_KEYS.GUEST_PROGRESS, JSON.stringify(result.updatedProfile));
        } else if (currentUser) {
          await saveUserProfileToFirestore(currentUser.uid, result.updatedProfile);
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
      activeUpdatePromise = null;
      setIsUpdatingProgress(false);
    }
  }, [userProfile, currentUser, toast]);


  const loadProfile = useCallback(async () => {
    setLoading(true);
    setConnectionError(null);

    const connectionTimeout = setTimeout(() => {
        if (loading) { // Apenas se ainda estiver carregando
            const lastUserProfileRaw = localStorage.getItem(LOCAL_STORAGE_KEYS.LAST_USER_PROFILE);
            if(lastUserProfileRaw) {
                setUserProfile(JSON.parse(lastUserProfileRaw));
            } else {
                 const guestProfileRaw = localStorage.getItem(LOCAL_STORAGE_KEYS.GUEST_PROGRESS);
                 if (guestProfileRaw) {
                    setUserProfile(JSON.parse(guestProfileRaw));
                 }
            }
            setConnectionError("Você está offline. Por favor, conecte-se à internet para continuar.");
            setLoading(false);
        }
    }, 10000); // 10 segundos

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        clearTimeout(connectionTimeout); // Cancela o timeout se a conexão for bem-sucedida

        if (firebaseUser) {
            setCurrentUser(firebaseUser);
            let firestoreProfile = await getUserProfile(firebaseUser.uid);
            if (!firestoreProfile) {
                firestoreProfile = createDefaultProfile(firebaseUser.uid, firebaseUser.displayName, firebaseUser.email, firebaseUser.photoURL);
                await saveUserProfileToFirestore(firebaseUser.uid, firestoreProfile);
            }
            setUserProfile(firestoreProfile);
            localStorage.setItem(LOCAL_STORAGE_KEYS.LAST_USER_PROFILE, JSON.stringify(firestoreProfile));
        } else {
            setCurrentUser(null);
            const localGuestProfileRaw = localStorage.getItem(LOCAL_STORAGE_KEYS.GUEST_PROGRESS);
            const guestProfile = localGuestProfileRaw ? JSON.parse(localGuestProfileRaw) : createDefaultProfile(GUEST_USER_ID);
            setUserProfile(guestProfile);
            localStorage.removeItem(LOCAL_STORAGE_KEYS.LAST_USER_PROFILE);
        }
        setLoading(false);
        setConnectionError(null);
    });

    return () => {
        clearTimeout(connectionTimeout);
        unsubscribe();
    };
}, [loading]); // Adicionei 'loading' como dependência


  useEffect(() => {
    loadProfile();
  }, []);

  const refreshUserProfile = useCallback(async () => {
    await loadProfile();
  }, [loadProfile]);
  
  const saveInteractionProgress = useCallback((lessonId: string, interactionId: string) => {
    handleServerProgressUpdate((profile) => saveInteractionProgressAction(profile, lessonId, interactionId), true, lessonId);
  }, [handleServerProgressUpdate]);
  
  const uncompleteInteraction = useCallback((lessonId: string, interactionId: string) => {
    handleServerProgressUpdate((profile) => uncompleteInteractionLogic(profile, lessonId, interactionId), true, lessonId);
  }, [handleServerProgressUpdate]);
  
  const completeLesson = useCallback((lessonId: string) => {
      handleServerProgressUpdate((profile) => completeLessonLogic(profile, lessonId));
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
      // onAuthStateChanged irá lidar com a atualização do perfil
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
      // onAuthStateChanged irá lidar com a criação do perfil no Firestore
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
      // onAuthStateChanged irá lidar com a atualização do perfil
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
      description: `Seu progresso na lição atual foi salvo no slot manual.`,
      variant: "success",
    });
  }, [userProfile, toast]);

  const restoreProgressFromSlot = useCallback(async (slotKey: 'autosave' | 'manualsave', lessonId: string) => {
    const key = `${slotKey === 'autosave' ? LOCAL_STORAGE_KEYS.AUTOSAVE_PROGRESS : LOCAL_STORAGE_KEYS.MANUALSAVE_PROGRESS}_${lessonId}`;
    const savedDataRaw = localStorage.getItem(key);
    
    if (savedDataRaw && userProfile) {
      const savedSlot: SaveSlot = JSON.parse(savedDataRaw);
      
      setUserProfile(savedSlot.profile);
      
      if (currentUser) {
        await saveUserProfileToFirestore(currentUser.uid, savedSlot.profile);
      } else {
        localStorage.setItem(LOCAL_STORAGE_KEYS.GUEST_PROGRESS, JSON.stringify(savedSlot.profile));
      }
      
      toast({
        title: "Progresso Restaurado!",
        description: `O progresso da lição foi carregado do slot "${slotKey === 'autosave' ? 'Autosave' : 'Manual Save'}".`,
        variant: "success",
      });
      window.location.reload(); 
    } else {
      toast({
        title: "Erro ao Restaurar",
        description: "Nenhum dado encontrado no slot selecionado para esta lição.",
        variant: "destructive",
      });
    }
  }, [userProfile, currentUser, toast]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen w-screen bg-background text-foreground">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg">Carregando...</p>
      </div>
    );
  }

  if (connectionError) {
    return (
        <div className="flex flex-col justify-center items-center h-screen w-screen bg-background text-foreground">
            <h2 className="text-2xl font-semibold mb-4">Erro de Conexão</h2>
            <p className="text-muted-foreground mb-6">{connectionError}</p>
            <Button onClick={() => window.location.reload()}>Tentar Novamente</Button>
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
      saveInteractionProgress,
      uncompleteInteraction,
      resetLessonProgress,
      saveAudioProgress,
      saveManualBackup,
      restoreProgressFromSlot,
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
