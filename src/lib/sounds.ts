
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
  // TODO: Add the actual placeholder_achievement_unlock.mp3 file to /public/sounds and uncomment the line below
  // achievementUnlock: "/sounds/placeholder_achievement_unlock.mp3",
  achievementUnlock: "", // Temporarily set to empty string or a known existing sound if you have one as a general fallback
  lessonComplete: "/sounds/placeholder_lesson_complete.mp3",
  exerciseCorrect: "/sounds/placeholder_exercise_correct.mp3",
  moduleComplete: "/sounds/placeholder_module_complete.mp3",
};

export function playSound(soundName: keyof SoundMap): void {
  if (typeof window !== "undefined" && typeof Audio !== "undefined") {
    const soundPath = soundFiles[soundName];
    if (!soundPath) {
      console.warn(`Sound "${soundName}" is not defined or path is empty.`);
      return;
    }
    try {
      const audio = new Audio(soundPath);
      audio.play().catch(error => {
        // Log a more specific warning if playing fails, e.g., due to browser restrictions or if the path was valid but file unplayable
        console.warn(`Could not play sound "${soundName}" from path "${soundPath}":`, error);
      });
    } catch (error) {
      console.error(`Error initializing Audio for sound "${soundName}":`, error);
    }
  } else {
    console.warn("Audio playback not supported in this environment or Audio object is not available.");
  }
}

