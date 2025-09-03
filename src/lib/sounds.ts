
type Sound =
  | 'achievementUnlock'
  | 'exerciseCorrect'
  | 'lessonComplete'
  | 'moduleComplete'
  | 'pointGain';

const sounds: { [key in Sound]: HTMLAudioElement | null } = {
  achievementUnlock: null,
  exerciseCorrect: null,
  lessonComplete: null,
  moduleComplete: null,
  pointGain: null,
};

const soundFiles: { [key in Sound]: string } = {
  achievementUnlock: '/sounds/achievementUnlock.mp3',
  exerciseCorrect: '/sounds/exerciseCorrect.mp3',
  lessonComplete: '/sounds/lessonComplete.mp3',
  moduleComplete: '/sounds/moduleComplete.mp3',
  pointGain: '/sounds/exerciseCorrect.mp3',
};

const initializeAudio = (sound: Sound) => {
  if (typeof window !== 'undefined' && !sounds[sound]) {
    const audio = new Audio(soundFiles[sound]);
    audio.preload = 'auto';
    sounds[sound] = audio;
  }
};

export const playSound = (sound: Sound) => {
  if (typeof window !== 'undefined') {
    if (!sounds[sound]) {
      initializeAudio(sound);
    }
    
    const audio = sounds[sound];
    
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(error => console.error(`Error playing sound: ${sound}`, error));
    }
  }
};

// Pre-initialize sounds on module load
if (typeof window !== 'undefined') {
  (Object.keys(sounds) as Sound[]).forEach(key => {
    initializeAudio(key);
  });
}
