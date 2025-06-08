
// src/contexts/AuthContext.tsx
"use client";

import type { User as FirebaseUser } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot, type DocumentData, type Unsubscribe } from 'firebase/firestore';
import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { auth, db } from '@/lib/firebase'; // Assuming firebase.ts is in lib
import type { UserProfile } from '@/lib/types'; // Your existing UserProfile type
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

  const fetchUserProfile = async (user: FirebaseUser) => {
    if (!user) {
      setUserProfile(null);
      return null;
    }
    const userDocRef = doc(db, 'users', user.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const profileData = userDocSnap.data() as UserProfile;
      setUserProfile(profileData);
      return profileData;
    } else {
      // Create a basic profile if it doesn't exist
      const newProfile: UserProfile = {
        id: user.uid,
        name: user.displayName || user.email || 'Novo Usuário',
        avatarUrl: user.photoURL || `https://placehold.co/100x100.png?text=${(user.email || 'U').charAt(0).toUpperCase()}`,
        points: 0,
        completedLessons: [],
        completedExercises: [],
        unlockedAchievements: [],
        completedModules: [],
      };
      try {
        await setDoc(userDocRef, newProfile);
        setUserProfile(newProfile);
        return newProfile;
      } catch (error) {
        console.error("Error creating user profile:", error);
        setUserProfile(null);
        return null;
      }
    }
  };

  const refreshUserProfile = async () => {
    if (currentUser) {
      await fetchUserProfile(currentUser);
    }
  };
  
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      let unsubscribeProfile: Unsubscribe | null = null;

      if (user) {
        // Fetch initial profile
        await fetchUserProfile(user);
        
        // Set up real-time listener for profile updates
        const userDocRef = doc(db, 'users', user.uid);
        unsubscribeProfile = onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            setUserProfile(docSnap.data() as UserProfile);
          } else {
            // If doc is deleted or doesn't exist after initial fetch, create it
            fetchUserProfile(user); 
          }
        }, (error) => {
          console.error("Error listening to user profile:", error);
        });

      } else {
        setUserProfile(null);
      }
      setLoading(false);

      // Cleanup for profile listener when auth state changes or component unmounts
      return () => {
        if (unsubscribeProfile) {
          unsubscribeProfile();
        }
      };
    });

    // Cleanup for auth listener
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
