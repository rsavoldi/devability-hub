
// src/lib/sounds.ts
"use client";

interface SoundMap {
  pointGain: string;
  achievementUnlock: string;
  // Adicionar novos sons conforme necessário
  lessonComplete: string;
  exerciseCorrect: string;
  moduleComplete: string;
}

const soundFiles: SoundMap = {
  pointGain: "/sounds/placeholder_point_gain.mp3",
  achievementUnlock: "/sounds/placeholder_achievement_unlock.mp3",
  lessonComplete: "/sounds/placeholder_lesson_complete.mp3", // Novo som
  exerciseCorrect: "/sounds/placeholder_exercise_correct.mp3", // Novo som
  moduleComplete: "/sounds/placeholder_module_complete.mp3", // Novo som
};

export function playSound(soundName: keyof SoundMap): void {
  if (typeof window !== "undefined" && typeof Audio !== "undefined") {
    try {
      const audio = new Audio(soundFiles[soundName]);
      audio.play().catch(error => {
        console.warn(`Could not play sound "${soundName}":`, error);
      });
    } catch (error) {
      console.error(`Error playing sound "${soundName}":`, error);
    }
  } else {
    console.warn("Audio playback not supported in this environment or Audio object is not available.");
  }
}
