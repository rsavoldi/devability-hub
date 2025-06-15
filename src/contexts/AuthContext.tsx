// src/contexts/AuthContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useState, type ReactNode, useCallback } from 'react';
import type { UserProfile } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import { LOCAL_STORAGE_KEYS } from '@/constants';
import { mockAchievements } from '@/lib/mockData';
import { auth } from '@/lib/firebase'; // Importar auth do Firebase
import { 
  onAuthStateChanged, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut,
  type User as FirebaseUser // Renomeado para evitar conflito com UserProfile
} from 'firebase/auth';

interface AuthContextType {
  currentUser: FirebaseUser | null; // Agora pode ser FirebaseUser ou null
  userProfile: UserProfile | null;
  loading: boolean;
  refreshUserProfile: () => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  signInWithGoogle: () => Promise<void>;
  signOutFirebase: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const GUEST_USER_ID = "guest_user";
const GUEST_USER_NAME = "Convidado(a)";

// Função para criar um perfil de convidado padrão ou para um novo usuário Firebase
const createDefaultProfile = (userId: string, userName?: string | null, userAvatar?: string | null): UserProfile => ({
  id: userId,
  name: userName || GUEST_USER_NAME,
  avatarUrl: userAvatar || `https://placehold.co/100x100.png?text=${(userName || GUEST_USER_NAME).charAt(0).toUpperCase()}`,
  points: 0,
  completedLessons: [],
  completedExercises: [],
  unlockedAchievements: ['ach1'], 
  completedModules: [],
  roles: userId === GUEST_USER_ID ? ['guest'] : ['user'],
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const getProfileStorageKey = useCallback((userId: string | null) => {
    return userId ? `${LOCAL_STORAGE_KEYS.USER_PROGRESS_PREFIX}${userId}` : LOCAL_STORAGE_KEYS.GUEST_PROGRESS;
  }, []);

  const loadProfile = useCallback((userId: string | null, firebaseUser: FirebaseUser | null) => {
    if (typeof window !== 'undefined') {
      const storageKey = getProfileStorageKey(userId);
      const storedProfileRaw = localStorage.getItem(storageKey);
      let profile: UserProfile;

      if (storedProfileRaw) {
        try {
          profile = JSON.parse(storedProfileRaw) as UserProfile;
          // Garantir que os arrays e campos essenciais existam e tenham valores padrão
          profile.id = userId || GUEST_USER_ID; // Garante que o ID está correto
          profile.name = firebaseUser?.displayName || profile.name || GUEST_USER_NAME;
          profile.avatarUrl = firebaseUser?.photoURL || profile.avatarUrl || `https://placehold.co/100x100.png?text=${(profile.name || GUEST_USER_NAME).charAt(0).toUpperCase()}`;
          profile.completedLessons = profile.completedLessons || [];
          profile.completedExercises = profile.completedExercises || [];
          profile.unlockedAchievements = profile.unlockedAchievements || (userId === GUEST_USER_ID ? ['ach1'] : []);
          profile.completedModules = profile.completedModules || [];
          profile.roles = profile.roles || (userId === GUEST_USER_ID ? ['guest'] : ['user']);
          profile.points = typeof profile.points === 'number' ? profile.points : 0;

        } catch (e) {
          console.error("Erro ao parsear perfil do localStorage, resetando:", e);
          profile = createDefaultProfile(userId || GUEST_USER_ID, firebaseUser?.displayName, firebaseUser?.photoURL);
          localStorage.setItem(storageKey, JSON.stringify(profile));
        }
      } else {
        // Se não há perfil salvo, cria um novo (para convidado ou para novo usuário Firebase)
        profile = createDefaultProfile(userId || GUEST_USER_ID, firebaseUser?.displayName, firebaseUser?.photoURL);
        localStorage.setItem(storageKey, JSON.stringify(profile));
      }
      setUserProfile(profile);
    }
  }, [getProfileStorageKey]);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setCurrentUser(firebaseUser);
      if (firebaseUser) {
        // Usuário Firebase logado
        loadProfile(firebaseUser.uid, firebaseUser);
      } else {
        // Usuário deslogado -> Carrega perfil de convidado
        loadProfile(null, null); // Passa null para indicar convidado
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [loadProfile]);

  const updateUserProfile = useCallback((updates: Partial<UserProfile>) => {
    setUserProfile(prevProfile => {
      if (!prevProfile) return null; // Não deveria acontecer se loadProfile funciona
      
      const profileIdToUpdate = currentUser?.uid || GUEST_USER_ID;
      const updatedProfile = { ...prevProfile, ...updates, id: profileIdToUpdate };
      
      if (typeof window !== 'undefined') {
        const storageKey = getProfileStorageKey(currentUser?.uid || null);
        localStorage.setItem(storageKey, JSON.stringify(updatedProfile));
      }
      return updatedProfile;
    });
  }, [currentUser, getProfileStorageKey]);

  const refreshUserProfile = useCallback(() => {
    if (currentUser) {
      loadProfile(currentUser.uid, currentUser);
    } else {
      loadProfile(null, null); // Convidado
    }
  }, [currentUser, loadProfile]);

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      // onAuthStateChanged vai lidar com a atualização do estado e carregamento do perfil
    } catch (error) {
      console.error("Erro ao fazer login com Google:", error);
      // Aqui você pode usar o sistema de Toast para notificar o usuário sobre o erro
      // Ex: toast({ title: "Erro no Login", description: "Não foi possível fazer login com o Google.", variant: "destructive" });
      setLoading(false); // Garante que o loading é desativado em caso de erro
    }
    // setLoading(false) é gerenciado pelo onAuthStateChanged
  };

  const signOutFirebase = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      // onAuthStateChanged vai lidar com a transição para o estado de convidado
      // e o carregamento do perfil de convidado.
      // setUserProfile(null); // Opcional: limpar perfil imediatamente ou deixar onAuthStateChanged tratar
      // setCurrentUser(null);
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      setLoading(false);
    }
  };

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
    <AuthContext.Provider value={{ currentUser, userProfile, loading, refreshUserProfile, updateUserProfile, signInWithGoogle, signOutFirebase }}>
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
