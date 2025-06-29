
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './index';
import type { UserProfile } from '@/lib/types';

const USERS_COLLECTION = 'users';

/**
 * Fetches a user's profile from Firestore.
 * @param userId The UID of the user.
 * @returns The user profile object or null if not found.
 */
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const userDocRef = doc(db, USERS_COLLECTION, userId);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const fetchedData = userDocSnap.data();
      // Ensure that essential fields are present, merging with defaults if they are missing.
      // This makes the data structure resilient to older versions or incomplete data in Firestore.
      const profile: UserProfile = {
        id: userId,
        name: fetchedData.name || 'Usuário',
        email: fetchedData.email || null,
        avatarUrl: fetchedData.avatarUrl,
        points: fetchedData.points || 0,
        lessonProgress: fetchedData.lessonProgress || {},
        completedExercises: fetchedData.completedExercises || [],
        unlockedAchievements: fetchedData.unlockedAchievements || [],
        completedModules: fetchedData.completedModules || [],
        roles: fetchedData.roles || ['user'],
        completedLessons: fetchedData.completedLessons || [],
      };
      return profile;
    } else {
      console.log(`No profile document found for user: ${userId}`);
      return null;
    }
  } catch (error) {
    console.error("Error fetching user profile from Firestore:", error);
    return null;
  }
}

/**
 * Creates or updates a user's profile in Firestore.
 * Using `set` with `merge: true` ensures that it works for both creation (if the document doesn't exist)
 * and update (merging fields without overwriting the entire document if not all fields are provided).
 * @param userId The UID of the user.
 * @param profileData The full or partial user profile data to save.
 */
export async function updateUserProfile(userId: string, profileData: Partial<UserProfile>): Promise<void> {
  try {
    const userDocRef = doc(db, USERS_COLLECTION, userId);
    // Use `set` with `merge: true` to create or update the document non-destructively.
    await setDoc(userDocRef, profileData, { merge: true });
  } catch (error) {
    console.error("Error updating user profile in Firestore:", error);
    // Handle the error appropriately, e.g., show a notification to the user.
  }
}
