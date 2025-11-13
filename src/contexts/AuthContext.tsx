
"use client";

import React, { createContext, useContext, useEffect, useState, type ReactNode, useCallback } from 'react';
import type { UserProfile, SaveSlot, LessonProgress } from '@/lib/types';
import { Loader2, Trophy, Download } from 'lucide-react';
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
import { completeLessonLogic, completeExerciseLogic, completeModuleLogic, saveInteractionProgress as saveInteractionProgressAction, uncompleteInteractionLogic, resetLessonProgressLogic } from '@/app/actions/userProgressActions';
import { getUserProfile, updateUserProfile as saveUserProfileToFirestore } from '@/lib/firebase/user';
import { Button } from '@/components/ui/button';
import { FirebaseErrorListener } from '@/lib/errors/FirebaseErrorListener';
import { FirestorePermissionError } from '@/lib/errors/error-emitter';

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isUpdatingProgress: boolean;
  isRestoring: boolean;
  refreshUserProfile: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOutFirebase: () => Promise<void>;
  clearCurrentUserProgress: () => void;
  registerWithEmail: (email: string, password: string, name: string) => Promise<FirebaseUser | null>;
  signInWithEmail: (email: string, password: string) => Promise<FirebaseUser | null>;
  saveInteractionProgress: (lessonId: string, interactionId: string) => void;
  uncompleteInteraction: (lessonId: string, interactionId: string) => void;
  resetLessonProgress: (lessonId: string) => void;
  saveManualBackup: () => void;
  restoreProgressFromSlot: (slotKey: 'autosave' | 'manualsave') => Promise<void>;
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
  const [isRestoring, setIsRestoring] = useState(false);
  const { toast } = useToast();
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const handleServerProgressUpdate = useCallback(async (logicFunction: (profile: UserProfile | null) => Promise<any>, options: { silent?: boolean, isManualBackup?: boolean } = {}) => {
    if (!userProfile) {
        if (!options.silent) {
            toast({ title: "Ação não disponível", description: "O perfil de usuário não está carregado. Faça login para salvar seu progresso.", variant: "destructive" });
        }
        return;
    }
    
    setIsUpdatingProgress(true);

    try {
        const result = await logicFunction(userProfile);

        if (result.success && result.updatedProfile) {
            let finalProfile = result.updatedProfile;

            const autosaveSlot: SaveSlot = {
                timestamp: Date.now(),
                lessonProgress: finalProfile.lessonProgress
            };
            finalProfile = { ...finalProfile, autosave: autosaveSlot };

            if (options.isManualBackup) {
                finalProfile = { ...finalProfile, manualsave: { ...autosaveSlot } };
            }

            setUserProfile(finalProfile);

            if (currentUser) {
                await saveUserProfileToFirestore(currentUser.uid, finalProfile);
            } else {
                localStorage.setItem(LOCAL_STORAGE_KEYS.GUEST_PROGRESS, JSON.stringify(finalProfile));
            }

            if (!options.silent) {
                if (result.message && !result.message.includes("já estava concluíd")) {
                    toast({ title: "Progresso Salvo!", description: result.message, variant: "success" });
                }
                if (options.isManualBackup) {
                    toast({ title: "Backup Salvo!", description: "Seu progresso foi salvo manualmente no servidor." });
                }
                if (result.pointsAdded && result.pointsAdded > 0) { playSound('pointGain'); }
                result.unlockedAchievementsDetails?.forEach((ach: any, index: number) => {
                    setTimeout(() => {
                        playSound('achievementUnlock');
                        toast({
                            title: "Conquista Desbloqueada!",
                            description: ( <div className="flex items-center"> <Trophy className="h-5 w-5 mr-2 text-amber-900" /> <span>{ach.title} - {ach.description}</span> </div> ),
                            variant: "achievement",
                        });
                    }, 100 * (index + 1));
                });
            }
        } else if (!options.silent && !result.success && result.message) {
            toast({ title: "Erro", description: result.message || "Não foi possível atualizar o progresso.", variant: "destructive" });
        }
    } catch (error) {
        if (!(error instanceof FirestorePermissionError)) {
            console.error("Error during progress update:", error);
            if (!options.silent) {
                toast({ title: "Erro", description: "Ocorreu um erro ao salvar seu progresso.", variant: "destructive" });
            }
        }
    } finally {
        setIsUpdatingProgress(false);
    }
  }, [userProfile, currentUser, toast]);


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      setConnectionError(null);
      try {
        if (firebaseUser) {
          setCurrentUser(firebaseUser);
          const firestoreProfile = await getUserProfile(firebaseUser.uid);

          if (firestoreProfile) {
            // Check for newer autosave
            const localTimestamp = firestoreProfile.autosave?.timestamp || 0;
            const remoteAutosave = await getUserProfile(firebaseUser.uid); // Re-fetch for latest
            const remoteTimestamp = remoteAutosave?.autosave?.timestamp || 0;

            if (remoteTimestamp > localTimestamp + 60000) { // Notify if server is > 1 min newer
              toast({
                title: "Progresso mais recente encontrado!",
                description: "Detectamos um salvamento automático mais novo no servidor. Use a opção 'Carregar Progresso' no menu para restaurá-lo.",
                duration: 10000,
                action: <Button variant="outline" size="sm" onClick={() => {}}><Download className="mr-2 h-4 w-4"/> Carregar</Button>
              });
            }
            setUserProfile(firestoreProfile);
          } else {
            const newProfile = createDefaultProfile(firebaseUser.uid, firebaseUser.displayName, firebaseUser.email, firebaseUser.photoURL);
            await saveUserProfileToFirestore(firebaseUser.uid, newProfile);
            setUserProfile(newProfile);
          }
        } else {
          setCurrentUser(null);
          const localGuestProfileRaw = localStorage.getItem(LOCAL_STORAGE_KEYS.GUEST_PROGRESS);
          if (localGuestProfileRaw) {
            setUserProfile(JSON.parse(localGuestProfileRaw));
          } else {
            const guestProfile = createDefaultProfile(GUEST_USER_ID);
            localStorage.setItem(LOCAL_STORAGE_KEYS.GUEST_PROGRESS, JSON.stringify(guestProfile));
            setUserProfile(guestProfile);
          }
        }
      } catch (e) {
          console.error("Failed to load user profile:", e);
          if (!(e instanceof FirestorePermissionError)) {
            setConnectionError("Erro ao carregar seu perfil. Por favor, tente recarregar a página.");
          }
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [toast]);

  const refreshUserProfile = useCallback(async () => {
    if (currentUser) {
      setLoading(true);
      try {
        const profile = await getUserProfile(currentUser.uid);
        if (profile) {
          setUserProfile(profile);
        }
      } catch (error) {
        console.error("Failed to refresh user profile:", error);
      } finally {
        setLoading(false);
      }
    }
  }, [currentUser]);
  
  const saveInteractionProgress = useCallback((lessonId: string, interactionId: string) => {
    handleServerProgressUpdate((profile) => saveInteractionProgressAction(profile, lessonId, interactionId), { silent: true });
  }, [handleServerProgressUpdate]);
  
  const uncompleteInteraction = useCallback((lessonId: string, interactionId: string) => {
    handleServerProgressUpdate((profile) => uncompleteInteractionLogic(profile, lessonId, interactionId), { silent: true });
  }, [handleServerProgressUpdate]);
  
  const completeLesson = useCallback((lessonId: string) => {
      handleServerProgressUpdate((profile) => completeLessonLogic(profile, lessonId));
  }, [handleServerProgressUpdate]);
  
  const resetLessonProgress = useCallback((lessonId: string) => {
    handleServerProgressUpdate((profile) => resetLessonProgressLogic(profile, lessonId));
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
      setLoading(false);
    }
  };

  const signOutFirebase = async () => {
    if (currentUser && userProfile) {
      await saveUserProfileToFirestore(currentUser.uid, userProfile);
    }
    await signOut(auth);
    setUserProfile(null);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.GUEST_PROGRESS);
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

  const saveManualBackup = useCallback(() => {
    if (!currentUser) {
        toast({
            title: "Ação não disponível",
            description: "O salvamento manual só está disponível para usuários logados.",
            variant: "destructive",
        });
        return;
    }
    handleServerProgressUpdate(async (profile) => ({ success: true, updatedProfile: profile }), { isManualBackup: true });
  }, [currentUser, handleServerProgressUpdate, toast]);


  const restoreProgressFromSlot = useCallback(async (slotKey: 'autosave' | 'manualsave') => {
      if (!currentUser || !userProfile) {
        toast({ title: "Erro", description: "Usuário não autenticado.", variant: "destructive" });
        return;
      }

      setIsRestoring(true);
      try {
          const backupSlot = userProfile[slotKey];
          if (!backupSlot) {
              toast({ title: "Backup não encontrado", description: `Nenhum progresso encontrado no slot '${slotKey}'.`, variant: "destructive" });
              setIsRestoring(false);
              return;
          }
          
          const updatedProfile = { ...userProfile, lessonProgress: { ...backupSlot.lessonProgress } };
          await saveUserProfileToFirestore(currentUser.uid, updatedProfile);

          toast({ title: "Progresso Restaurado!", description: `Seu progresso do '${slotKey}' foi carregado. A página será atualizada.` });
          
          // Recarrega a página para garantir que todos os componentes recebam o novo estado
          setTimeout(() => window.location.reload(), 1500);

      } catch (error) {
          console.error("Error restoring backup:", error);
          toast({ title: "Erro ao Restaurar", description: "Não foi possível carregar o progresso do backup.", variant: "destructive" });
          setIsRestoring(false);
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
      isRestoring,
      refreshUserProfile,
      signInWithGoogle,
      signOutFirebase,
      clearCurrentUserProgress,
      registerWithEmail,
      signInWithEmail,
      saveInteractionProgress,
      uncompleteInteraction,
      resetLessonProgress,
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
