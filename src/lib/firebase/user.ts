import { doc, getDoc, setDoc, collection, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from './index';
import type { UserProfile, SaveSlot } from '@/lib/types';
import { produce } from 'immer';
import { errorEmitter, FirestorePermissionError } from '@/lib/errors/error-emitter';
import type { User as FirebaseUser } from 'firebase/auth';

const USERS_COLLECTION = 'users';
const SAVE_SLOTS_SUBCOLLECTION = 'saveSlots';


/**
 * Fetches a user's profile from Firestore.
 * @param userId The UID of the user.
 * @returns The user profile object or null if not found.
 */
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const userDocRef = doc(db, USERS_COLLECTION, userId);
  try {
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const fetchedData = userDocSnap.data();
      const profile: UserProfile = {
        id: userId,
        name: fetchedData.name || 'Usuário',
        email: fetchedData.email || null,
        avatarUrl: fetchedData.avatarUrl,
        points: fetchedData.points || 0,
        lessonProgress: fetchedData.lessonProgress || {},
        completedLessons: fetchedData.completedLessons || [],
        completedExercises: fetchedData.completedExercises || [],
        unlockedAchievements: fetchedData.unlockedAchievements || [],
        completedModules: fetchedData.completedModules || [],
        roles: fetchedData.roles || ['user'],
      };
      return profile;
    } else {
      console.log(`No profile document found for user: ${userId}`);
      return null;
    }
  } catch (error: any) {
    if (error.code === 'permission-denied') {
        const customError = new FirestorePermissionError(
            'read',
            userDocRef,
            null,
            `Failed to read user profile for user ${userId}. Check firestore rules.`
        );
        errorEmitter.emit('permission-error', customError);
    }
    console.error("Error fetching user profile from Firestore:", error);
    throw error;
  }
}

/**
 * Creates or updates a user's profile in Firestore.
 * @param userId The UID of the user.
 * @param profileData The full or partial user profile data to save.
 */
export async function updateUserProfile(userId: string, profileData: Partial<UserProfile>): Promise<void> {
  const userDocRef = doc(db, USERS_COLLECTION, userId);
  try {
    await setDoc(userDocRef, profileData, { merge: true });
  } catch (error: any) {
    if (error.code === 'permission-denied') {
        const customError = new FirestorePermissionError(
            'write',
            userDocRef,
            profileData,
            `Failed to write user profile for user ${userId}. Check firestore rules.`
        );
        errorEmitter.emit('permission-error', customError);
    }
    console.error("Error updating user profile in Firestore:", error);
    throw error;
  }
}


/**
 * Saves a backup of the current user profile to a specific slot in Firestore.
 * @param userId The UID of the user.
 * @param lessonId The ID of the current lesson to associate the save with.
 * @param slotKey 'autosave' or 'manualsave'.
 * @param profile The full user profile to back up.
 */
export async function saveBackupToFirestore(userId: string, lessonId: string, slotKey: 'autosave' | 'manualsave', profile: UserProfile): Promise<void> {
  const slotDocRef = doc(db, USERS_COLLECTION, userId, SAVE_SLOTS_SUBCOLLECTION, `${slotKey}_${lessonId}`);
  const saveData: SaveSlot = {
      timestamp: Date.now(),
      profile: profile,
    };
  try {
    await setDoc(slotDocRef, saveData);
  } catch (error: any) {
     if (error.code === 'permission-denied') {
        const customError = new FirestorePermissionError(
            'write',
            slotDocRef,
            saveData,
            `Failed to save backup slot '${slotKey}' for user ${userId} and lesson ${lessonId}. Check firestore rules.`
        );
        errorEmitter.emit('permission-error', customError);
    }
    console.error(`Error saving ${slotKey} backup to Firestore:`, error);
  }
}


/**
 * Retrieves a specific backup slot from Firestore.
 * @param userId The UID of the user.
 * @param lessonId The ID of the lesson.
 * @param slotKey 'autosave' or 'manualsave'.
 * @returns The SaveSlot data or null if not found.
 */
export async function getBackupFromFirestore(userId: string, lessonId: string, slotKey: 'autosave' | 'manualsave'): Promise<SaveSlot | null> {
    const slotDocRef = doc(db, USERS_COLLECTION, userId, SAVE_SLOTS_SUBCOLLECTION, `${slotKey}_${lessonId}`);
    try {
        const docSnap = await getDoc(slotDocRef);
        if (docSnap.exists()) {
            return docSnap.data() as SaveSlot;
        }
        return null;
    } catch (error:any) {
        if (error.code === 'permission-denied') {
            const customError = new FirestorePermissionError(
                'read',
                slotDocRef,
                null,
                `Failed to read backup slot '${slotKey}' for user ${userId} and lesson ${lessonId}. Check firestore rules.`
            );
            errorEmitter.emit('permission-error', customError);
        }
        console.error(`Error getting ${slotKey} backup from Firestore:`, error);
        throw error; // Lança o erro para ser tratado por quem chamou
    }
}


/**
 * Restores progress for a specific lesson from a saved slot in Firestore.
 * @param userId The UID of the user.
 * @param lessonId The ID of the lesson to restore progress for.
 * @param slotKey 'autosave' or 'manualsave'.
 * @param currentProfile The user's current profile.
 * @returns The updated user profile or null on failure.
 */
export async function restoreBackupFromFirestore(userId: string, lessonId: string, slotKey: 'autosave' | 'manualsave', currentProfile: UserProfile): Promise<UserProfile | null> {
  try {
    const backupSlot = await getBackupFromFirestore(userId, lessonId, slotKey);
    if (!backupSlot) {
      console.warn(`No ${slotKey} backup found for lesson ${lessonId}.`);
      return null;
    }

    // Use Immer for safe, immutable updates
    const nextProfile = produce(currentProfile, draft => {
      // Restore only the progress related to the specific lesson
      draft.lessonProgress[lessonId] = backupSlot.profile.lessonProgress[lessonId];
    });

    return nextProfile;

  } catch (error) {
    console.error(`Error restoring ${slotKey} backup:`, error);
    return null;
  }
}
