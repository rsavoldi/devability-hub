
import type { Achievement } from '@/lib/types';
import { Zap, Target, BookOpen, CheckCircle, Link2, Shuffle, MousePointerSquareDashed, Type } from 'lucide-react';

export const mockAchievements: Achievement[] = [
  { id: 'ach1', title: 'Pioneiro DevAbility', description: 'Iniciou sua jornada de aprendizado na plataforma.', icon: Zap, isUnlocked: false, dateUnlocked: '', criteria: 'Acessar o app' },
  { id: 'ach2', title: 'Explorador de Trilhas', description: 'Visitou sua primeira trilha de conhecimento.', icon: Target, isUnlocked: false, criteria: 'Acessar 1 trilha' },
  { id: 'ach3', title: 'Leitor Assíduo', description: 'Completou sua primeira lição.', icon: BookOpen, isUnlocked: false, criteria: 'Completar 1 lição' },
  { id: 'ach4', title: 'Mestre dos Conceitos', description: 'Acertou 5 exercícios de múltipla escolha.', icon: CheckCircle, isUnlocked: false, criteria: '5 acertos MC' },
  { id: 'ach5', title: 'Conector de Ideias', description: 'Completou um exercício de associação.', icon: Link2, isUnlocked: false, criteria: '1 exercício associação' },
  { id: 'ach6', title: 'Organizador Nato', description: 'Completou um exercício de ordenação.', icon: Shuffle, isUnlocked: false, criteria: '1 exercício ordenação' },
  { id: 'ach7', title: 'Arquiteto de Soluções', description: 'Completou um exercício de arrastar e soltar.', icon: MousePointerSquareDashed, isUnlocked: false, criteria: '1 exercício drag & drop' },
  { id: 'ach8', title: 'Palavra Certa!', description: 'Acertou 3 interações de seleção de palavras em lições.', icon: Type, isUnlocked: false, criteria: '3 acertos seleção de palavra' },
];
