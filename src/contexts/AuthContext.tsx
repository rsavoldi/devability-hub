
"use client";

import React, { createContext, useContext, useEffect, useState, type ReactNode, useCallback } from 'react';
import type { UserProfile, Achievement, Lesson, Exercise, Module } from '@/lib/types'; // Module importado
import { Loader2, Trophy } from 'lucide-react';
import { LOCAL_STORAGE_KEYS } from '@/constants';
import { auth, db } from '@/lib/firebase'; // db importado para futuras integrações, auth já estava
import {
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile as updateFirebaseProfile, // Renomeado para evitar conflito com a função do contexto
  type User as FirebaseUser
} from 'firebase/auth';
import { useToast } from "@/hooks/use-toast";
import { playSound } from '@/lib/sounds';
import {
  markLessonAsCompleted as completeLessonAction,
  markExerciseAsCompleted as completeExerciseAction,
  markModuleAsCompleted as completeModuleAction,
} from '@/app/actions/userProgressActions';
import { mockAchievements } from '@/lib/mockData';


interface AuthContextType {
  currentUser: FirebaseUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  refreshUserProfile: () => void;
  updateUserProfile: (updates: Partial<UserProfile>, persist?: boolean) => void;
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
  unlockedAchievements: ['ach1'], // Garante que a conquista "Pioneiro" seja padrão
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

  const updateUserProfile = useCallback((updates: Partial<UserProfile>, persist: boolean = true) => {
    setUserProfileState(prevProfile => {
      const activeUserId = currentUser?.uid || GUEST_USER_ID;
      // Se prevProfile é null (ex: primeiro carregamento ou após limpar progresso),
      // precisamos criar um perfil base para mesclar com as 'updates'.
      // Se estamos atualizando um usuário logado, tentamos usar infos do currentUser.
      // Se for convidado ou currentUser ainda não está populado com nome/avatar, cai nos defaults.
      const baseProfileForMerge = prevProfile || createDefaultProfile(
        activeUserId, 
        currentUser?.displayName, 
        currentUser?.email, 
        currentUser?.photoURL
      );
      
      const updated = { ...baseProfileForMerge, ...updates, id: activeUserId };
      
      if (persist && typeof window !== 'undefined') {
        const storageKey = getProfileStorageKey(currentUser?.uid || null);
        localStorage.setItem(storageKey, JSON.stringify(updated));
      }
      return updated;
    });
  }, [currentUser, getProfileStorageKey]);


  const loadProfile = useCallback((userId: string | null, firebaseUser: FirebaseUser | null) => {
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
    }
  }, [getProfileStorageKey]);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setCurrentUser(firebaseUser);
      if (firebaseUser) {
        loadProfile(firebaseUser.uid, firebaseUser);
        // Lógica de conquista de Login
        // Precisamos garantir que userProfileState seja carregado antes de tentar atualizá-lo
        // Uma forma é chamar loadProfile e *depois* verificar a conquista.
        // Uma alternativa é atrasar a verificação da conquista ou fazê-la dentro de um useEffect que dependa de userProfileState.
        // Por ora, vamos usar um pequeno delay para a checagem de conquista de login, ou melhor,
        // faremos a verificação após a chamada de `loadProfile`.
        const currentKey = getProfileStorageKey(firebaseUser.uid);
        const storedProfile = JSON.parse(localStorage.getItem(currentKey) || '{}') as UserProfile;
        
        if (storedProfile && !storedProfile.unlockedAchievements.includes('ach_login')) {
          const achievement = mockAchievements.find(a => a.id === 'ach_login');
          if (achievement) {
            const newAchievements = [...(storedProfile.unlockedAchievements || []), 'ach_login'];
            const newPoints = (storedProfile.points || 0) + (achievement.pointsAwarded || 0);
            const updatedProfileForAchievement = { ...storedProfile, unlockedAchievements: newAchievements, points: newPoints, id: firebaseUser.uid };
            localStorage.setItem(currentKey, JSON.stringify(updatedProfileForAchievement));
            setUserProfileState(updatedProfileForAchievement); // Atualiza o estado global também
            
            playSound('achievementUnlock');
            toast({
              title: ( <div className="flex items-center"> <Trophy className="h-5 w-5 mr-2 text-yellow-400" /> Conquista Desbloqueada! </div> ),
              description: `${achievement.title} - ${achievement.description}`,
              className: "bg-yellow-400 border-yellow-500 text-yellow-900 dark:bg-yellow-600 dark:text-yellow-50",
            });
          }
        }

      } else {
        loadProfile(null, null); // Carrega/cria perfil de convidado
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [loadProfile, toast, getProfileStorageKey]); // Removido userProfileState da dependência para evitar loops de login


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
      // onAuthStateChanged irá lidar com a atualização do perfil e estado de loading
    } catch (error: any) {
      console.error("Erro ao fazer login com Google:", error);
      const errorCode = error.code;
      let friendlyMessage = "Não foi possível fazer login com Google.";
      if (errorCode === 'auth/popup-closed-by-user') {
        friendlyMessage = "A janela de login com Google foi fechada antes da conclusão.";
      } else if (errorCode === 'auth/cancelled-popup-request') {
        friendlyMessage = "Login com Google cancelado.";
      }
      toast({ title: "Erro no Login", description: friendlyMessage, variant: "destructive" });
      setLoading(false); // Garante que loading seja false em caso de erro
    }
    // Não definir setLoading(false) aqui se o login for bem sucedido, onAuthStateChanged cuidará disso.
  };

  const signOutFirebase = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      // onAuthStateChanged irá carregar o perfil de convidado e setar loading para false
    } catch (error: any) {
      console.error("Erro ao fazer logout:", error);
      toast({ title: "Erro no Logout", description: error.message || "Não foi possível fazer logout.", variant: "destructive" });
      setLoading(false); // Garante que loading seja false em caso de erro
    }
  };

  const clearCurrentUserProgress = useCallback(() => {
    if (typeof window !== 'undefined') {
      const activeUserId = currentUser?.uid || null;
      const storageKey = getProfileStorageKey(activeUserId);
      localStorage.removeItem(storageKey);
      
      // Recarrega/recria o perfil padrão para o estado atual (logado ou convidado)
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
      
      // Forçar a atualização do currentUser e recarregar o perfil
      // Isso é importante porque onAuthStateChanged pode não pegar o displayName atualizado imediatamente.
      const updatedFirebaseUser = auth.currentUser;
      setCurrentUser(updatedFirebaseUser); // Atualiza o estado do currentUser no contexto
      
      if (updatedFirebaseUser) {
        loadProfile(updatedFirebaseUser.uid, updatedFirebaseUser); // Cria e salva o perfil local para o novo usuário
      }
      
      setLoading(false);
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
      toast({ title: "Erro no Registro", description: error.message || friendlyMessage, variant: "destructive" });
      setLoading(false);
      return null;
    }
  };

  const signInWithEmail = async (email: string, password: string): Promise<FirebaseUser | null> => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // onAuthStateChanged irá lidar com a atualização do perfil e estado de loading.
      // setLoading(false) será chamado dentro do onAuthStateChanged.
      toast({ title: "Login Bem-Sucedido!", description: `Bem-vindo(a) de volta!` });
      return userCredential.user;
    } catch (error: any) {
      console.error("Erro ao fazer login com email:", error);
      let friendlyMessage = "Email ou senha inválidos.";
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        friendlyMessage = "Email ou senha incorretos. Por favor, verifique seus dados.";
      }
      toast({ title: "Erro no Login", description: friendlyMessage, variant: "destructive" });
      setLoading(false); // Garante que loading seja false em caso de erro de login
      return null;
    }
  };

  const handleProgressUpdate = useCallback(async (actionPromise: Promise<any>) => {
    if (!userProfileState) { // Usar userProfileState aqui
      toast({ title: "Erro", description: "Perfil do usuário não carregado.", variant: "destructive" });
      return;
    }
    try {
      const result = await actionPromise;
      if (result.success && result.updatedProfile) {
        updateUserProfile(result.updatedProfile); // Isso agora usa o currentUser?.uid internamente
        if (result.pointsAdded && result.pointsAdded > 0) {
          playSound('pointGain');
        }
        result.unlockedAchievementsDetails?.forEach((ach: Achievement) => {
          playSound('achievementUnlock');
          toast({
            title: ( <div className="flex items-center"> <Trophy className="h-5 w-5 mr-2 text-yellow-400" /> Conquista Desbloqueada! </div> ),
            description: `${ach.title} - ${ach.description}`,
            className: "bg-yellow-400 border-yellow-500 text-yellow-900 dark:bg-yellow-600 dark:text-yellow-50",
          });
        });
        toast({ title: "Progresso Salvo!", description: result.message, className: "bg-green-500 text-white dark:bg-green-600" });

      } else {
        toast({ title: "Erro ao Salvar Progresso", description: result.message || "Não foi possível atualizar o progresso.", variant: "destructive" });
      }
    } catch (error) {
      console.error("Erro ao atualizar progresso:", error);
      toast({ title: "Erro Inesperado", description: "Ocorreu um erro ao salvar seu progresso.", variant: "destructive" });
    }
  }, [userProfileState, updateUserProfile, toast]); // Adicionado userProfileState

  const completeLesson = useCallback(async (lessonId: string) => {
    await handleProgressUpdate(completeLessonAction(userProfileState, lessonId));
  }, [userProfileState, handleProgressUpdate]);

  const completeExercise = useCallback(async (exerciseId: string) => {
    await handleProgressUpdate(completeExerciseAction(userProfileState, exerciseId));
  }, [userProfileState, handleProgressUpdate]);

  const completeModule = useCallback(async (moduleId: string) => {
    await handleProgressUpdate(completeModuleAction(userProfileState, moduleId));
  }, [userProfileState, handleProgressUpdate]);


  if (loading && typeof window !== 'undefined') {
    // Evita renderizar o children se ainda estiver carregando o estado inicial do Firebase
    return (
      <div className="flex justify-center items-center h-screen w-screen bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg text-foreground">Carregando...</p>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{
      currentUser,
      userProfile: userProfileState, // Usar userProfileState
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

    