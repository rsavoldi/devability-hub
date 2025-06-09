
// src/contexts/AuthContext.tsx
"use client";

import type { User as FirebaseUser } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot, type DocumentData, type Unsubscribe } from 'firebase/firestore';
import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { auth, db } from '@/lib/firebase'; 
import type { UserProfile } from '@/lib/types'; 
import { Loader2 } from 'lucide-react';

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async (user: FirebaseUser): Promise<UserProfile | null> => {
    if (!user) {
      setUserProfile(null);
      setLoading(false); // Added to stop loading if no user
      return null;
    }
    const userDocRef = doc(db, 'users', user.uid);
    
    try {
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const profileData = userDocSnap.data() as UserProfile;
          // Ensure roles array exists, default to ['student'] if not
          const finalProfile: UserProfile = {
            ...profileData,
            roles: profileData.roles && Array.isArray(profileData.roles) ? profileData.roles : ['student'],
          };
          setUserProfile(finalProfile);
          return finalProfile;
        } else {
          console.warn(`Perfil não encontrado para UID: ${user.uid}. Criando perfil básico.`);
          const newProfile: UserProfile = {
            id: user.uid,
            name: user.displayName || user.email?.split('@')[0] || 'Novo Usuário',
            avatarUrl: user.photoURL || `https://placehold.co/100x100.png?text=${(user.displayName || user.email || 'U').charAt(0).toUpperCase()}`,
            points: 0,
            completedLessons: [],
            completedExercises: [],
            unlockedAchievements: ['ach1'],
            completedModules: [],
            roles: ['student'], // Default role
          };
          await setDoc(userDocRef, newProfile);
          setUserProfile(newProfile);
          return newProfile;
        }
    } catch (error) {
        console.error("Erro ao buscar/criar perfil do usuário:", error);
        setUserProfile(null); // Set to null on error
        return null;
    } finally {
        // setLoading(false); // Moved setting loading to false to onAuthStateChanged callback
    }
  };

  const refreshUserProfile = async () => {
    if (currentUser) {
      setLoading(true); // Indicate loading during refresh
      await fetchUserProfile(currentUser);
      setLoading(false); // Stop loading after refresh
    }
  };
  
  useEffect(() => {
    setLoading(true); // Start loading when effect runs
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      let unsubscribeProfile: Unsubscribe | null = null;

      if (user) {
        // Fetch initial profile and set up listener
        const userDocRef = doc(db, 'users', user.uid);
        
        // Initial fetch
        const fetchedProfile = await fetchUserProfile(user);
        // If fetchUserProfile itself sets loading to false too early, this might be an issue.
        // It's better to control loading state primarily from this useEffect.

        unsubscribeProfile = onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            const profileData = docSnap.data() as UserProfile;
            setUserProfile({
              ...profileData,
              roles: profileData.roles && Array.isArray(profileData.roles) ? profileData.roles : ['student'],
            });
          } else {
             // This case should ideally be handled by fetchUserProfile creating the doc if it doesn't exist
             // If it still gets here, it means the document might have been deleted after initial fetch/creation
             console.warn("User document disappeared, attempting to re-fetch/re-create for UID:", user.uid);
             fetchUserProfile(user); // Attempt to re-create or fetch if somehow missed
          }
          setLoading(false); // Set loading to false after profile is processed
        }, (error) => {
          console.error("Error listening to user profile:", error);
          setUserProfile(null);
          setLoading(false); // Set loading to false on listener error
        });

      } else {
        setUserProfile(null);
        setLoading(false); // User is logged out, stop loading
      }

      return () => {
        if (unsubscribeProfile) {
          unsubscribeProfile();
        }
      };
    });

    return () => unsubscribeAuth();
  }, []);


  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen w-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg">Carregando aplicação...</p>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ currentUser, userProfile, loading, refreshUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
