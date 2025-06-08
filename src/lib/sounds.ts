// src/lib/sounds.ts
"use client";

interface SoundMap {
  pointGain: string;
  achievementUnlock: string;
  // Add more sound types here as needed
}

const soundFiles: SoundMap = {
  pointGain: "/sounds/placeholder_point_gain.mp3", // User will replace this
  achievementUnlock: "/sounds/placeholder_achievement_unlock.mp3", // User will replace this
};

export function playSound(soundName: keyof SoundMap): void {
  if (typeof window !== "undefined" && typeof Audio !== "undefined") {
    try {
      const audio = new Audio(soundFiles[soundName]);
      audio.play().catch(error => {
        // Autoplay was prevented or another error occurred
        console.warn(`Could not play sound "${soundName}":`, error);
      });
    } catch (error) {
      console.error(`Error playing sound "${soundName}":`, error);
    }
  } else {
    console.warn("Audio playback not supported in this environment or Audio object is not available.");
  }
}
