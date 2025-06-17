
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
  updateProfile as updateFirebaseProfile,
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
  updateUserProfile: (updates: Partial<UserProfile>, persist?: boolean) => void; // persist opcional
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
  const [userProfile, setUserProfileState] = useState<UserProfile | null>(null); // Renomeado para evitar conflito
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const getProfileStorageKey = useCallback((userId: string | null) => {
    return userId ? `${LOCAL_STORAGE_KEYS.USER_PROGRESS_PREFIX}${userId}` : LOCAL_STORAGE_KEYS.GUEST_PROGRESS;
  }, []);

  const updateUserProfile = useCallback((updates: Partial<UserProfile>, persist: boolean = true) => {
    setUserProfileState(prevProfile => {
      const activeUserId = currentUser?.uid || GUEST_USER_ID;
      const baseProfile = prevProfile || createDefaultProfile(activeUserId, currentUser?.displayName, currentUser?.email, currentUser?.photoURL);
      const updated = { ...baseProfile, ...updates, id: activeUserId };
      
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
          // Garante que o perfil carregado tenha todos os campos esperados e atualizados com Firebase se logado
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
      localStorage.setItem(storageKey, JSON.stringify(profile)); // Salva o perfil (novo ou corrigido)
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
        if(userProfile && !userProfile.unlockedAchievements.includes('ach_login')) {
          const achievement = mockAchievements.find(a => a.id === 'ach_login');
          if (achievement) {
            const newAchievements = [...userProfile.unlockedAchievements, 'ach_login'];
            const newPoints = (userProfile.points || 0) + (achievement.pointsAwarded || 0);
            updateUserProfile({ unlockedAchievements: newAchievements, points: newPoints });
            playSound('achievementUnlock');
            toast({
              title: ( <div className="flex items-center"> <Trophy className="h-5 w-5 mr-2 text-yellow-400" /> Conquista Desbloqueada! </div> ),
              description: `${achievement.title} - ${achievement.description}`,
              className: "bg-yellow-400 border-yellow-500 text-yellow-900 dark:bg-yellow-600 dark:text-yellow-50",
            });
          }
        }
      } else {
        loadProfile(null, null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [loadProfile, toast, updateUserProfile, userProfile]); // Adicionado toast, updateUserProfile, userProfile


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
      // onAuthStateChanged irá lidar com a atualização do perfil
    } catch (error) {
      console.error("Erro ao fazer login com Google:", error);
      toast({ title: "Erro no Login", description: "Não foi possível fazer login com Google.", variant: "destructive" });
      setLoading(false);
    }
  };

  const signOutFirebase = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      // onAuthStateChanged irá carregar o perfil de convidado
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      toast({ title: "Erro no Logout", description: "Não foi possível fazer logout.", variant: "destructive" });
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
    }
  }, [currentUser, getProfileStorageKey, loadProfile, toast]);

  const registerWithEmail = async (email: string, password: string, name: string): Promise<FirebaseUser | null> => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      if (userCredential.user) {
        await updateFirebaseProfile(userCredential.user, { displayName: name });
        // onAuthStateChanged irá lidar com a criação do perfil local.
        // Forçar um reload do perfil para garantir que o displayName seja pego.
        setCurrentUser(auth.currentUser); // Atualiza currentUser imediatamente
        loadProfile(userCredential.user.uid, auth.currentUser); // Força o recarregamento
      }
      setLoading(false);
      return userCredential.user;
    } catch (error: any) {
      console.error("Erro ao registrar com email:", error);
      toast({ title: "Erro no Registro", description: error.message || "Não foi possível registrar.", variant: "destructive" });
      setLoading(false);
      return null;
    }
  };

  const signInWithEmail = async (email: string, password: string): Promise<FirebaseUser | null> => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // onAuthStateChanged irá lidar com a atualização do perfil.
      setLoading(false);
      return userCredential.user;
    } catch (error: any) {
      console.error("Erro ao fazer login com email:", error);
      toast({ title: "Erro no Login", description: error.message || "Email ou senha inválidos.", variant: "destructive" });
      setLoading(false);
      return null;
    }
  };

  const handleProgressUpdate = useCallback(async (actionPromise: Promise<any>) => {
    if (!userProfile) {
      toast({ title: "Erro", description: "Perfil do usuário não carregado.", variant: "destructive" });
      return;
    }
    try {
      const result = await actionPromise;
      if (result.success && result.updatedProfile) {
        updateUserProfile(result.updatedProfile);
        if (result.pointsAdded && result.pointsAdded > 0) {
          playSound('pointGain');
          // Toast de pontos já está na action, mas pode ser movido para cá se preferir
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
  }, [userProfile, updateUserProfile, toast]);

  const completeLesson = useCallback(async (lessonId: string) => {
    await handleProgressUpdate(completeLessonAction(userProfile, lessonId));
  }, [userProfile, handleProgressUpdate]);

  const completeExercise = useCallback(async (exerciseId: string) => {
    await handleProgressUpdate(completeExerciseAction(userProfile, exerciseId));
  }, [userProfile, handleProgressUpdate]);

  const completeModule = useCallback(async (moduleId: string) => {
    await handleProgressUpdate(completeModuleAction(userProfile, moduleId));
  }, [userProfile, handleProgressUpdate]);


  if (loading && typeof window !== 'undefined') {
    return (
      <div className="flex justify-center items-center h-screen w-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg">Carregando...</p>
      </div>
    );
  }

  if (typeof window === 'undefined' && loading) {
    return null;
  }

  return (
    <AuthContext.Provider value={{
      currentUser,
      userProfile,
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
