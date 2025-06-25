
import type { UserProfile } from '@/lib/types';

export const mockUserProfile: UserProfile = {
  id: 'user123',
  name: 'Alex Coder',
  avatarUrl: 'https://placehold.co/100x100.png', // Placeholder for user avatar
  points: 250,
  lessonProgress: {
    'm1-l1': { completed: true, completedInteractions: [] }
  },
  completedExercises: ['m1-e1.1.1'], // Exemplo de exercício completado
  unlockedAchievements: ['ach1', 'ach3'], // Conquistas iniciais e por completar 1 lição
  completedModules: [],
  roles: ['user'],
};
