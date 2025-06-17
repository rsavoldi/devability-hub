
import type { Achievement } from '@/lib/types';
import { Zap, Target, BookOpen, CheckCircle, Link2, ListOrdered, MousePointerSquareDashed, Type, Trophy, Award, Puzzle, Brain } from 'lucide-react'; // Adicionado Puzzle, Brain

export const mockAchievements: Achievement[] = [
  { id: 'ach1', title: 'Pioneiro DevAbility', description: 'Iniciou sua jornada de aprendizado na plataforma.', emoji: '🚀', icon: Zap, isUnlocked: false, criteria: 'Acessar o app pela primeira vez', pointsAwarded: 5 },
  { id: 'ach2', title: 'Explorador de Trilhas', description: 'Visitou sua primeira trilha de conhecimento.', emoji: '🗺️', icon: Target, isUnlocked: false, criteria: 'Acessar 1 trilha', pointsAwarded: 10 },
  { id: 'ach3', title: 'Leitor Assíduo', description: 'Completou sua primeira lição.', emoji: '📖', icon: BookOpen, isUnlocked: false, criteria: 'Completar 1 lição', pointsAwarded: 15 },
  { id: 'ach4', title: 'Mestre dos Conceitos', description: 'Acertou 5 exercícios de múltipla escolha.', emoji: '✅', icon: CheckCircle, isUnlocked: false, criteria: '5 acertos MC', pointsAwarded: 20 },
  { id: 'ach5', title: 'Conector de Ideias', description: 'Completou um exercício de associação.', emoji: '🔗', icon: Link2, isUnlocked: false, criteria: '1 exercício associação', pointsAwarded: 10 },
  { id: 'ach6', title: 'Organizador Nato', description: 'Completou um exercício de ordenação.', emoji: '🔢', icon: ListOrdered, isUnlocked: false, criteria: '1 exercício ordenação', pointsAwarded: 10 },
  { id: 'ach7', title: 'Arquiteto de Soluções', description: 'Completou um exercício de arrastar e soltar.', emoji: '🖐️', icon: MousePointerSquareDashed, isUnlocked: false, criteria: '1 exercício drag & drop', pointsAwarded: 10 },
  { id: 'ach8', title: 'Palavra Certa!', description: 'Acertou 3 interações de seleção de palavras em lições.', emoji: '✍️', icon: Type, isUnlocked: false, criteria: '3 acertos seleção de palavra', pointsAwarded: 15 },
  { id: 'ach_mod1', title: 'Mestre dos Módulos', description: 'Completou seu primeiro módulo.', emoji: '🧩', icon: Puzzle, isUnlocked: false, criteria: 'Completar 1 módulo', pointsAwarded: 50 },
  { id: 'ach_points100', title: 'Centurião do Saber', description: 'Alcançou 100 pontos!', emoji: '💯', icon: Award, isUnlocked: false, criteria: 'Atingir 100 pontos', pointsAwarded: 25 },
  { id: 'ach_exerc10', title: 'Praticante Dedicado', description: 'Completou 10 exercícios.', emoji: '🎯', icon: Target, isUnlocked: false, criteria: 'Completar 10 exercícios', pointsAwarded: 30 },
  { id: 'ach_lesson5', title: 'Devorador de Lições', description: 'Completou 5 lições.', emoji: '📚', icon: BookOpen, isUnlocked: false, criteria: 'Completar 5 lições', pointsAwarded: 30 },
  { id: 'ach_login', title: 'Conectado!', description: 'Fez login pela primeira vez.', emoji: '🔗', icon: Link2, isUnlocked: false, criteria: 'Fazer login', pointsAwarded: 10 },
  { id: 'ach_profile_complete', title: 'Perfil Preenchido', description: 'Completou as informações básicas do seu perfil (simulado).', emoji: '👤', icon: Brain, isUnlocked: false, criteria: 'Preencher perfil (simulado)', pointsAwarded: 10 },
];
