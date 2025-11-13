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
import { getUserProfile, updateUserProfile as saveUserProfileToFirestore, saveBackupToFirestore, restoreBackupFromFirestore } from '@/lib/firebase/user';
import { Button } from '@/components/ui/button';
import { FirestorePermissionError } from '@/lib/errors/error-emitter';
import { FirebaseErrorListener } from '@/lib/errors/FirebaseErrorListener';

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
  const [activeUpdatePromise, setActiveUpdatePromise] = useState<Promise<any> | null>(null);

  const handleServerProgressUpdate = useCallback(async (logicFunction: (profile: UserProfile | null) => Promise<any>, silent: boolean = false, lessonIdForAutosave?: string) => {
    if (activeUpdatePromise) {
      return; 
    }
    if (!userProfile) return;
  
    setIsUpdatingProgress(true);
    
    const promise = logicFunction(userProfile);
    setActiveUpdatePromise(promise);
  
    try {
      const result = await promise;
  
      if (promise !== activeUpdatePromise) {
        return;
      }
      
      if (result.success && result.updatedProfile) {
        const updatedProfile = result.updatedProfile;
        setUserProfile(updatedProfile);
        
        if (currentUser) {
          await saveUserProfileToFirestore(currentUser.uid, updatedProfile);
          if (lessonIdForAutosave) {
            await saveBackupToFirestore(currentUser.uid, lessonIdForAutosave, 'autosave', updatedProfile);
          }
        } else {
          localStorage.setItem(LOCAL_STORAGE_KEYS.GUEST_PROGRESS, JSON.stringify(updatedProfile));
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
      if (!(error instanceof FirestorePermissionError)) {
          console.error("Error during progress update:", error);
           if (!silent) {
            toast({ title: "Erro", description: "Ocorreu um erro ao salvar seu progresso.", variant: "destructive" });
          }
      }
    } finally {
      setActiveUpdatePromise(null);
      setIsUpdatingProgress(false);
    }
  }, [userProfile, currentUser, toast, activeUpdatePromise]);


 const loadProfile = useCallback(async () => {
    setLoading(true);
    setConnectionError(null);
    
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          let firestoreProfile = await getUserProfile(firebaseUser.uid);
          if (!firestoreProfile) {
            const localGuestProfileRaw = localStorage.getItem(LOCAL_STORAGE_KEYS.GUEST_PROGRESS);
            if (localGuestProfileRaw) {
               firestoreProfile = JSON.parse(localGuestProfileRaw);
               firestoreProfile.id = firebaseUser.uid;
               firestoreProfile.name = firebaseUser.displayName || firestoreProfile.name;
               firestoreProfile.email = firebaseUser.email;
               firestoreProfile.avatarUrl = firebaseUser.photoURL || firestoreProfile.avatarUrl;
            } else {
               firestoreProfile = createDefaultProfile(firebaseUser.uid, firebaseUser.displayName, firebaseUser.email, firebaseUser.photoURL);
            }
            await saveUserProfileToFirestore(firebaseUser.uid, firestoreProfile);
          }
          setCurrentUser(firebaseUser);
          setUserProfile(firestoreProfile);
          localStorage.removeItem(LOCAL_STORAGE_KEYS.GUEST_PROGRESS);
        } catch (e) {
          console.error("Failed to load user profile from Firestore:", e);
          if (!(e instanceof FirestorePermissionError)) {
            setConnectionError("Erro ao carregar seu perfil. Por favor, tente recarregar a página.");
          }
        }
      } else {
        const localGuestProfileRaw = localStorage.getItem(LOCAL_STORAGE_KEYS.GUEST_PROGRESS);
        if (localGuestProfileRaw) {
            setUserProfile(JSON.parse(localGuestProfileRaw));
        } else {
            const guestProfile = createDefaultProfile(GUEST_USER_ID);
            setUserProfile(guestProfile);
            localStorage.setItem(LOCAL_STORAGE_KEYS.GUEST_PROGRESS, JSON.stringify(guestProfile));
        }
        setCurrentUser(null);
      }
      setLoading(false);
    });
  
    return () => {
      unsubscribe();
    };
  }, []);
  
  useEffect(() => {
    loadProfile();
  }, [loadProfile]);


  const refreshUserProfile = useCallback(async () => {
    if (currentUser) {
      const profile = await getUserProfile(currentUser.uid);
      if (profile) {
        setUserProfile(profile);
      }
    }
  }, [currentUser]);
  
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
    } catch (error: any) {
      console.error("Erro ao fazer login com Google:", error);
      toast({ title: "Erro no Login", description: "Não foi possível fazer login com Google.", variant: "destructive" });
    } finally {
        // The onAuthStateChanged listener will handle setting loading to false
    }
  };

  const signOutFirebase = async () => {
    setLoading(true);
    try {
      if (currentUser && userProfile) {
        await saveUserProfileToFirestore(currentUser.uid, userProfile);
      }
      await signOut(auth);
    } catch (error: any) {
      console.error("Erro ao fazer logout:", error);
      toast({ title: "Erro no Logout", description: error.message || "Não foi possível fazer logout.", variant: "destructive" });
    } finally {
       // The onAuthStateChanged listener will handle setting loading to false
    }
  };
  
  const clearCurrentUserProgress = useCallback(async () => {
    if (confirm("Tem certeza que deseja limpar seu progresso? Esta ação não pode ser desfeita.")) {
      setIsUpdatingProgress(true);
      const activeUserId = currentUser?.uid || GUEST_USER_ID;
      const defaultProfile = createDefaultProfile(activeUserId, currentUser?.displayName, currentUser?.email, currentUser?.photoURL);
      
      setUserProfile(defaultProfile);
      
      if (currentUser) {
        await saveUserProfileToFirestore(activeUserId, defaultProfile);
      } else {
        localStorage.setItem(LOCAL_STORAGE_KEYS.GUEST_PROGRESS, JSON.stringify(defaultProfile));
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
      // onAuthStateChanged will handle the rest
      return userCredential.user;
    } catch (error: any) {
      console.error("Erro ao registrar com email:", error);
      let friendlyMessage = "Não foi possível registrar.";
      if (error.code === 'auth/email-already-in-use') {
        friendlyMessage = "Este email já está em uso. Tente fazer login ou use outro email.";
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
      // onAuthStateChanged will handle the rest
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

  const saveManualBackup = useCallback(async (lessonId: string) => {
    if (!userProfile) return;
    if (currentUser) {
        await saveBackupToFirestore(currentUser.uid, lessonId, 'manualsave', userProfile);
        toast({
            title: "Progresso Salvo Manualmente!",
            description: `Seu progresso na lição foi salvo no servidor.`,
            variant: "success",
        });
    } else {
        toast({
            title: "Ação não disponível",
            description: "O salvamento manual só está disponível para usuários logados.",
            variant: "destructive",
        });
    }
  }, [userProfile, currentUser, toast]);

  const restoreProgressFromSlot = useCallback(async (slotKey: 'autosave' | 'manualsave', lessonId: string) => {
    if (currentUser && userProfile) {
      if (confirm(`Tem certeza que deseja carregar os dados do slot "${slotKey === 'autosave' ? 'Autosave' : 'Manual Save'}"? Seu progresso atual nesta lição será substituído.`)) {
          const restoredProfile = await restoreBackupFromFirestore(currentUser.uid, lessonId, slotKey, userProfile);
          if (restoredProfile) {
              setUserProfile(restoredProfile);
              await saveUserProfileToFirestore(currentUser.uid, restoredProfile);
              toast({
                  title: "Progresso Restaurado!",
                  description: `O progresso da lição foi carregado do servidor.`,
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
      }
    }
  }, [currentUser, userProfile, toast]);

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
      <FirebaseErrorListener />
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
