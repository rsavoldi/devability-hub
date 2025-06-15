
export const LOCAL_STORAGE_KEYS = {
  PROGRESS: 'devability_progress', // Mantido para compatibilidade ou uso futuro, mas o de convidado será específico
  GUEST_PROGRESS: 'devability_progress_guest', // Chave para progresso do convidado
  USER_PROGRESS_PREFIX: 'devability_progress_user_', // Prefixo para progresso de usuários logados (ex: devability_progress_user_UID)
  ACHIEVEMENTS: 'devability_achievements', // Pode ser específico do usuário ou geral
  STREAKS: 'devability_streaks', // Pode ser específico do usuário ou geral
  LANGUAGE: 'devability_language',
  GUEST_COMPLETED_LESSONS: 'devability_guest_completed_lessons', // Mantido, mas pode ser integrado ao objeto de progresso
};

export const TOTAL_LEARNING_PATHS = 12;
