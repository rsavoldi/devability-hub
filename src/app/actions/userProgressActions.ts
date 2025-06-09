// src/app/actions/userProgressActions.ts
"use server";

import { db } from "@/lib/firebase";
import { doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";
import type { UserProfile } from "@/lib/types";

interface MarkLessonCompletedResult {
  success: boolean;
  message: string;
  updatedProfile?: UserProfile | null; // Opcional, para feedback imediato se necessário
}

export async function markLessonAsCompleted(
  userId: string,
  lessonId: string
): Promise<MarkLessonCompletedResult> {
  if (!userId || !lessonId) {
    return { success: false, message: "ID do usuário ou da lição ausente." };
  }

  const userDocRef = doc(db, "users", userId);

  try {
    // Primeiro, verifica se a lição já foi completada para evitar operações desnecessárias
    // e para manter a pontuação correta (se formos adicionar pontos aqui depois)
    const userDocSnap = await getDoc(userDocRef);
    if (userDocSnap.exists()) {
      const userProfile = userDocSnap.data() as UserProfile;
      if (userProfile.completedLessons && userProfile.completedLessons.includes(lessonId)) {
        return { success: true, message: "Lição já marcada como concluída anteriormente." };
      }
    } else {
      return { success: false, message: "Perfil do usuário não encontrado." };
    }

    // Adiciona a lição ao array de lições completas
    await updateDoc(userDocRef, {
      completedLessons: arrayUnion(lessonId),
      // Futuramente, aqui poderíamos adicionar a lógica para:
      // - Incrementar userProfile.points
      // - Verificar e adicionar achievements
      // - Verificar se o módulo/trilha foi concluído e atualizar completedModules/completedRoadmaps
    });

    // Opcional: buscar e retornar o perfil atualizado se a UI precisar de feedback imediato
    // que não possa esperar o listener do AuthContext. Por ora, não é estritamente necessário.
    // const updatedDocSnap = await getDoc(userDocRef);
    // const updatedProfile = updatedDocSnap.exists() ? (updatedDocSnap.data() as UserProfile) : null;

    return {
      success: true,
      message: "Lição marcada como concluída com sucesso!",
      // updatedProfile: updatedProfile // Descomente se for retornar
    };
  } catch (error) {
    console.error("Erro ao marcar lição como concluída:", error);
    return {
      success: false,
      message: "Erro ao marcar lição como concluída. Tente novamente.",
    };
  }
}
