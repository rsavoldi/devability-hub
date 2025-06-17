
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
import {
  checkAndUnlockAchievementsLogic,
  completeLessonLogic,
  completeExerciseLogic,
  completeModuleLogic,
  markLessonAsCompleted as markLessonCompletedAction,
  markExerciseAsCompleted as markExerciseCompletedAction,
  markModuleAsCompleted as markModuleCompletedAction,
} from '@/app/actions/userProgressActions';
import type { UpdateResult } from '@/app/actions/userProgressActions'; // Assuming UpdateResult is exported
import { mockAchievements } from '@/lib/mockData';


interface AuthContextType {
  currentUser: FirebaseUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  refreshUserProfile: () => void;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;
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

const getProfileStorageKey = (userId: string | null): string => {
  return userId ? `${LOCAL_STORAGE_KEYS.USER_PROGRESS_PREFIX}${userId}` : LOCAL_STORAGE_KEYS.GUEST_PROGRESS;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfileState, setUserProfileState] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadProfile = useCallback((userId: string | null, firebaseUser: FirebaseUser | null): UserProfile => {
    let profile: UserProfile;
    if (typeof window !== 'undefined') {
      const storageKey = getProfileStorageKey(userId);
      const storedProfileRaw = localStorage.getItem(storageKey);
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
          console.error("Erro ao parsear perfil do localStorage, criando perfil padrão:", e);
          profile = createDefaultProfile(userId || GUEST_USER_ID, firebaseUser?.displayName, firebaseUser?.email, firebaseUser?.photoURL);
        }
      } else {
        profile = createDefaultProfile(userId || GUEST_USER_ID, firebaseUser?.displayName, firebaseUser?.email, firebaseUser?.photoURL);
      }
    } else {
      profile = createDefaultProfile(userId || GUEST_USER_ID, firebaseUser?.displayName, firebaseUser?.email, firebaseUser?.photoURL);
    }
    return profile;
  }, []);

  const updateUserProfile = useCallback(async (updates: Partial<UserProfile>) => {
    setUserProfileState(prevProfile => {
      const activeUserId = currentUser?.uid || GUEST_USER_ID;
      // Certifique-se de que o prevProfile não é null antes de espalhar,
      // ou use createDefaultProfile como base se for null.
      const baseProfileForMerge = prevProfile || createDefaultProfile(activeUserId, currentUser?.displayName, currentUser?.email, currentUser?.photoURL);
      
      let finalUpdatedProfile = { ...baseProfileForMerge, ...updates, id: activeUserId };

      // Garante que os arrays não sejam sobrescritos com undefined se updates não os contiver
      finalUpdatedProfile.unlockedAchievements = [...new Set([...(baseProfileForMerge.unlockedAchievements || ['ach1']), ...(updates.unlockedAchievements || [])])];
      finalUpdatedProfile.completedLessons = [...new Set([...(baseProfileForMerge.completedLessons || []), ...(updates.completedLessons || [])])];
      finalUpdatedProfile.completedExercises = [...new Set([...(baseProfileForMerge.completedExercises || []), ...(updates.completedExercises || [])])];
      finalUpdatedProfile.completedModules = [...new Set([...(baseProfileForMerge.completedModules || []), ...(updates.completedModules || [])])];
      
      // Persistir no localStorage
      if (typeof window !== 'undefined') {
        const storageKey = getProfileStorageKey(activeUserId);
        localStorage.setItem(storageKey, JSON.stringify(finalUpdatedProfile));
      }
      return finalUpdatedProfile;
    });
  }, [currentUser]);


  useEffect(() => {
    setLoading(true);
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setCurrentUser(firebaseUser);
      const loadedUserProfile = loadProfile(firebaseUser?.uid || null, firebaseUser);
      setUserProfileState(loadedUserProfile);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [loadProfile]);

  // Efeito separado para lidar com a conquista de login após o perfil estar no estado
  useEffect(() => {
    if (currentUser && userProfileState && !userProfileState.loadingAuthContext) { // 'loadingAuthContext' é apenas um placeholder para uma verificação mais robusta
        if (!userProfileState.unlockedAchievements.includes('ach_login')) {
            const achievement = mockAchievements.find(a => a.id === 'ach_login');
            if (achievement) {
                const pointsFromLoginAchievement = achievement.pointsAwarded || 0;
                const profileUpdates: Partial<UserProfile> = {
                    unlockedAchievements: [...userProfileState.unlockedAchievements, 'ach_login'],
                    points: (userProfileState.points || 0) + pointsFromLoginAchievement
                };
                
                // Chamada async para updateUserProfile
                (async () => {
                    await updateUserProfile(profileUpdates);
                    // O toast agora é disparado após a atualização do estado ter sido processada
                    setTimeout(() => {
                        playSound('achievementUnlock');
                        toast({
                            title: (<div className="flex items-center"> <Trophy className="h-5 w-5 mr-2 text-yellow-400" /> Conquista Desbloqueada! </div>),
                            description: `${achievement.title} - ${achievement.description}`,
                            className: "bg-yellow-400 border-yellow-500 text-yellow-900 dark:bg-yellow-600 dark:text-yellow-50",
                        });
                    }, 0);
                })();
            }
        }
    }
  }, [currentUser, userProfileState, updateUserProfile, toast]);

  const refreshUserProfile = useCallback(() => {
    const activeUserId = currentUser?.uid || null;
    const refreshedProfile = loadProfile(activeUserId, currentUser);
    setUserProfileState(refreshedProfile);
  }, [currentUser, loadProfile]);

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      // onAuthStateChanged irá lidar com o carregamento do perfil e setLoading(false)
    } catch (error: any) {
      console.error("Erro ao fazer login com Google:", error);
      const errorCode = error.code;
      let friendlyMessage = "Não foi possível fazer login com Google.";
      if (errorCode === 'auth/popup-closed-by-user' || errorCode === 'auth/cancelled-popup-request') {
        friendlyMessage = "Login com Google cancelado ou janela fechada.";
      }
      setTimeout(() => {
        toast({ title: "Erro no Login", description: friendlyMessage, variant: "destructive" });
      }, 0);
      setLoading(false);
    }
  };

  const signOutFirebase = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      // onAuthStateChanged irá lidar com o carregamento do perfil de convidado e setLoading(false)
    } catch (error: any) {
      console.error("Erro ao fazer logout:", error);
      setTimeout(() => {
        toast({ title: "Erro no Logout", description: error.message || "Não foi possível fazer logout.", variant: "destructive" });
      }, 0);
      setLoading(false);
    }
  };

  const clearCurrentUserProgress = useCallback(() => {
    if (typeof window !== 'undefined') {
      const activeUserId = currentUser?.uid || GUEST_USER_ID;
      const storageKey = getProfileStorageKey(activeUserId);
      localStorage.removeItem(storageKey);
      
      const defaultProfile = createDefaultProfile(activeUserId, currentUser?.displayName, currentUser?.email, currentUser?.photoURL);
      setUserProfileState(defaultProfile); // Atualiza o estado
      // Não chama updateUserProfile aqui, pois loadProfile não salva mais. A persistência do perfil zerado acontecerá na próxima ação ou login.
      // Para garantir, podemos salvar o perfil zerado aqui explicitamente se for um convidado.
      if (activeUserId === GUEST_USER_ID) {
         localStorage.setItem(storageKey, JSON.stringify(defaultProfile));
      }
      
      setTimeout(() => {
        toast({ title: "Progresso Limpo", description: "Seu progresso local foi reiniciado." });
      },0);
    }
  }, [currentUser, loadProfile]);

  const handleProgressUpdate = useCallback(async (resultPromise: Promise<UpdateResult>) => {
    try {
      const result = await resultPromise; // Aguarda a promessa (seja local ou server action)
      if (result.success && result.updatedProfile) {
        await updateUserProfile(result.updatedProfile);

        if (result.pointsAdded && result.pointsAdded > 0) {
          setTimeout(() => playSound('pointGain'), 0);
        }
        
        result.unlockedAchievementsDetails?.forEach((ach: Pick<Achievement, 'id' | 'title' | 'description' | 'emoji' | 'pointsAwarded' | 'dateUnlocked' | 'isUnlocked'>) => {
          setTimeout(() => {
            playSound('achievementUnlock');
            toast({
              title: (<div className="flex items-center"> <Trophy className="h-5 w-5 mr-2 text-yellow-400" /> Conquista Desbloqueada! </div>),
              description: `${ach.title} - ${ach.description}`,
              className: "bg-yellow-400 border-yellow-500 text-yellow-900 dark:bg-yellow-600 dark:text-yellow-50",
            });
          }, 100); // Pequeno delay para toasts de conquista
        });

        if (result.message && (result.message.includes("concluída") || result.message.includes("concluído"))) {
           setTimeout(() => {
             toast({ title: "Progresso Salvo!", description: result.message, className: "bg-green-500 text-white dark:bg-green-600" });
           }, 0);
        }
      } else if (!result.success && result.message && !result.message.includes("já estava concluíd")) {
        setTimeout(() => {
          toast({ title: "Erro ao Salvar Progresso", description: result.message || "Não foi possível atualizar o progresso.", variant: "destructive" });
        }, 0);
      }
    } catch (error) {
        console.error("Erro ao manusear atualização de progresso:", error);
        setTimeout(() => {
          toast({ title: "Erro Crítico", description: "Ocorreu um erro inesperado ao atualizar seu progresso.", variant: "destructive" });
        }, 0);
    }
  }, [updateUserProfile, toast]);

  const completeLesson = useCallback(async (lessonId: string) => {
    if (!userProfileState) {
      setTimeout(() => toast({ title: "Erro", description: "Perfil do usuário não carregado.", variant: "destructive" }), 0);
      return;
    }
    if (userProfileState.completedLessons.includes(lessonId) && !currentUser) {
        return;
    }
    
    const logicFunction = () => completeLessonLogic(userProfileState, lessonId);
    const actionFunction = () => markLessonCompletedAction(userProfileState, lessonId);
    
    await handleProgressUpdate(currentUser ? actionFunction() : logicFunction());
  }, [userProfileState, currentUser, handleProgressUpdate, toast]);

  const completeExercise = useCallback(async (exerciseId: string) => {
    if (!userProfileState) {
      setTimeout(() => toast({ title: "Erro", description: "Perfil do usuário não carregado.", variant: "destructive" }), 0);
      return;
    }
    if (userProfileState.completedExercises.includes(exerciseId) && !currentUser) {
        return;
    }
    const logicFunction = () => completeExerciseLogic(userProfileState, exerciseId);
    const actionFunction = () => markExerciseCompletedAction(userProfileState, exerciseId);

    await handleProgressUpdate(currentUser ? actionFunction() : logicFunction());
  }, [userProfileState, currentUser, handleProgressUpdate, toast]);

  const completeModule = useCallback(async (moduleId: string) => {
    if (!userProfileState) {
      setTimeout(() => toast({ title: "Erro", description: "Perfil do usuário não carregado.", variant: "destructive" }), 0);
      return;
    }
     if (userProfileState.completedModules.includes(moduleId) && !currentUser) {
        return;
    }
    const logicFunction = () => completeModuleLogic(userProfileState, moduleId);
    const actionFunction = () => markModuleCompletedAction(userProfileState, moduleId);
    
    await handleProgressUpdate(currentUser ? actionFunction() : logicFunction());
  }, [userProfileState, currentUser, handleProgressUpdate, toast]);


  const registerWithEmail = async (email: string, password: string, name: string): Promise<FirebaseUser | null> => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateFirebaseProfile(userCredential.user, { displayName: name });
      
      // Seta o currentUser aqui para que o useEffect de onAuthStateChanged possa reagir e carregar o perfil
      // Isso é importante porque o displayName pode não estar imediatamente disponível no `auth.currentUser`
      // que `onAuthStateChanged` pega inicialmente.
      setCurrentUser(auth.currentUser); 
      // O restante do carregamento do perfil e `ach_login` será tratado pelo `onAuthStateChanged` effect
      
      setTimeout(() => toast({ title: "Registro Bem-Sucedido!", description: `Bem-vindo(a), ${name}!` }), 0);
      // setLoading(false) será chamado por onAuthStateChanged effect
      return userCredential.user;
    } catch (error: any) { // Adicionada a chave de abertura aqui
      console.error("Erro ao registrar com email:", error);
      let friendlyMessage = "Não foi possível registrar.";
      if (error.code === 'auth/email-already-in-use') {
        friendlyMessage = "Este email já está em uso. Tente fazer login ou use outro email.";
      } else if (error.code === 'auth/weak-password') {
        friendlyMessage = "A senha é muito fraca. Por favor, use uma senha mais forte.";
      }
      setTimeout(() => toast({ title: "Erro no Registro", description: error.message || friendlyMessage, variant: "destructive" }), 0);
      setLoading(false);
      return null;
    }
  };

  const signInWithEmail = async (email: string, password: string): Promise<FirebaseUser | null> => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setTimeout(() => toast({ title: "Login Bem-Sucedido!", description: `Bem-vindo(a) de volta!` }), 0);
      // setLoading(false) será chamado por onAuthStateChanged effect
      return userCredential.user;
    } catch (error: any) { // Adicionada a chave de abertura aqui
       let friendlyMessage = "Email ou senha inválidos.";
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        friendlyMessage = "Email ou senha incorretos. Por favor, verifique seus dados.";
      }
      setTimeout(() => toast({ title: "Erro no Login", description: friendlyMessage, variant: "destructive" }), 0);
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
