import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './index';
import type { UserProfile, SaveSlot, LessonProgress } from '@/lib/types';
import { produce } from 'immer';
import { errorEmitter, FirestorePermissionError } from '@/lib/errors/error-emitter';

const USERS_COLLECTION = 'users';

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
      return userDocSnap.data() as UserProfile;
    } else {
      console.warn(`No profile document found for user: ${userId}`);
      return null;
    }
  } catch (error: any) {
    if (error.code === 'permission-denied') {
        const customError = new FirestorePermissionError({
            operation: 'read',
            path: userDocRef.path,
            message: `Falha ao ler perfil para o usuário ${userId}. Verifique as regras do Firestore.`
        });
        errorEmitter.emit('permission-error', customError);
    }
    console.error("Error fetching user profile from Firestore:", error);
    throw error;
  }
}

/**
 * Creates or updates a user's profile in Firestore.
 * @param userId The UID of the user.
 * @param profileData The full user profile data to save.
 */
export async function updateUserProfile(userId: string, profileData: UserProfile): Promise<void> {
  const userDocRef = doc(db, USERS_COLLECTION, userId);
  try {
    await setDoc(userDocRef, profileData, { merge: true });
  } catch (error: any) {
    if (error.code === 'permission-denied') {
        const customError = new FirestorePermissionError({
            operation: 'write',
            path: userDocRef.path,
            requestResourceData: profileData,
            message: `Falha ao salvar o perfil para o usuário ${userId}. Verifique as regras do Firestore.`
        });
        errorEmitter.emit('permission-error', customError);
    }
    console.error("Error updating user profile in Firestore:", error);
    throw error;
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
    const userProfile = await getUserProfile(userId);
    if (!userProfile) {
        console.warn(`User profile not found for restore operation: ${userId}`);
        return null;
    }

    const backupSlot = slotKey === 'autosave' ? userProfile.autosave : userProfile.manualsave;
    
    if (!backupSlot || !backupSlot.lessonProgress) {
      console.warn(`No ${slotKey} backup found or backup is corrupted.`);
      return null;
    }

    // Use Immer for safe, immutable updates
    const nextProfile = produce(currentProfile, draft => {
      // Restore the entire lessonProgress object from the backup
      draft.lessonProgress = { ...backupSlot.lessonProgress };
      // Opcional: você pode querer restaurar outros dados do perfil também, como pontos.
      // Por agora, focaremos apenas no progresso da lição conforme o backup.
      // draft.points = backupSlot.profile.points; // Exemplo se quisesse restaurar pontos
    });

    return nextProfile;

  } catch (error) {
    console.error(`Error restoring ${slotKey} backup:`, error);
    throw error; // Re-throw para ser pego pelo contexto
  }
}

// Nota: As funções de saveBackup e getBackup separadas foram removidas.
// A lógica de backup agora é integrada ao updateUserProfile, salvando
// o slot de backup diretamente no documento do usuário.
