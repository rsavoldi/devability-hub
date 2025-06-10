// src/contexts/AuthContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useState, type ReactNode, useCallback } from 'react';
import type { UserProfile, Achievement } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import { LOCAL_STORAGE_KEYS } from '@/constants';
import { mockAchievements } from '@/lib/mockData'; // Para detalhes das conquistas

// Simula um usuário convidado (FirebaseUser teria mais campos, mas não precisamos deles aqui)
interface GuestUser {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  // Adicione outros campos que seu app pode esperar de FirebaseUser, se houver
}

interface AuthContextType {
  currentUser: GuestUser | null; // Agora GuestUser ou null
  userProfile: UserProfile | null;
  loading: boolean;
  refreshUserProfile: () => void; // Mantido, mas agora lê do localStorage
  updateUserProfile: (updates: Partial<UserProfile>) => void; // Para salvar no localStorage
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const GUEST_USER_ID = "guest_user";
const GUEST_USER_NAME = "Convidado(a)";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<GuestUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadGuestProfile = useCallback(() => {
    if (typeof window !== 'undefined') {
      const guestUser: GuestUser = {
        uid: GUEST_USER_ID,
        displayName: GUEST_USER_NAME,
        email: null,
        photoURL: `https://placehold.co/100x100.png?text=${GUEST_USER_NAME.charAt(0).toUpperCase()}`,
      };
      setCurrentUser(guestUser);

      const storedProfileRaw = localStorage.getItem(LOCAL_STORAGE_KEYS.PROGRESS);
      let profile: UserProfile;
      if (storedProfileRaw) {
        try {
          profile = JSON.parse(storedProfileRaw) as UserProfile;
          // Garantir que os arrays existam
          profile.completedLessons = profile.completedLessons || [];
          profile.completedExercises = profile.completedExercises || [];
          profile.unlockedAchievements = profile.unlockedAchievements || ['ach1'];
          profile.completedModules = profile.completedModules || [];
          profile.roles = profile.roles || ['guest'];
          profile.points = typeof profile.points === 'number' ? profile.points : 0;
        } catch (e) {
          console.error("Erro ao parsear perfil do localStorage, resetando:", e);
          profile = createDefaultGuestProfile();
          localStorage.setItem(LOCAL_STORAGE_KEYS.PROGRESS, JSON.stringify(profile));
        }
      } else {
        profile = createDefaultGuestProfile();
        localStorage.setItem(LOCAL_STORAGE_KEYS.PROGRESS, JSON.stringify(profile));
      }
      setUserProfile(profile);
    }
    setLoading(false);
  }, []);

  const createDefaultGuestProfile = (): UserProfile => ({
    id: GUEST_USER_ID,
    name: GUEST_USER_NAME,
    avatarUrl: `https://placehold.co/100x100.png?text=${GUEST_USER_NAME.charAt(0).toUpperCase()}`,
    points: 0,
    completedLessons: [],
    completedExercises: [],
    unlockedAchievements: ['ach1'], // Conquista inicial
    completedModules: [],
    roles: ['guest'],
  });

  const updateUserProfile = useCallback((updates: Partial<UserProfile>) => {
    setUserProfile(prevProfile => {
      const newProfile = { ... (prevProfile || createDefaultGuestProfile()), ...updates };
      if (typeof window !== 'undefined') {
        localStorage.setItem(LOCAL_STORAGE_KEYS.PROGRESS, JSON.stringify(newProfile));
      }
      return newProfile;
    });
  }, []);

  useEffect(() => {
    loadGuestProfile();
  }, [loadGuestProfile]);

  const refreshUserProfile = useCallback(() => {
    // Para um sistema local, "refresh" significa recarregar do localStorage
    loadGuestProfile();
  }, [loadGuestProfile]);

  if (loading && typeof window !== 'undefined') { // Não mostrar loader no SSR se ele não faz sentido
    return (
      <div className="flex justify-center items-center h-screen w-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg">Carregando...</p>
      </div>
    );
  }
  
  if (typeof window === 'undefined' && loading) {
    // Para SSR, podemos retornar null ou um placeholder mínimo até o cliente assumir
    return null; 
  }

  return (
    <AuthContext.Provider value={{ currentUser, userProfile, loading, refreshUserProfile, updateUserProfile }}>
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
