
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
      // TODO: Add data validation here (e.g., using Zod) to ensure the fetched data matches the UserProfile type.
      return userDocSnap.data() as UserProfile;
    } else {
      console.log(`No profile document found for user: ${userId}`);
      return null;
    }
  } catch (error) {
    console.error("Error fetching user profile from Firestore:", error);
    // Depending on requirements, you might want to handle this more gracefully.
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
export async function updateUserProfile(userId: string, profileData: UserProfile): Promise<void> {
  try {
    const userDocRef = doc(db, USERS_COLLECTION, userId);
    // Use `set` with `merge: true` to create or update the document non-destructively.
    await setDoc(userDocRef, profileData, { merge: true });
  } catch (error) {
    console.error("Error updating user profile in Firestore:", error);
    // Handle the error appropriately, e.g., show a notification to the user.
  }
}
