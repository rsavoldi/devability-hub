
import type { Lesson } from '@/lib/types';
// Importações individuais das lições
import { lessonM1L1 } from './lessons/module1/lesson-m1-l1';
import { lessonM1L2 } from './lessons/module1/lesson-m1-l2';
import { lessonM1L3 } from './lessons/module1/lesson-m1-l3';
import { lessonM1L4 } from './lessons/module1/lesson-m1-l4';

export const module1Lessons: Lesson[] = [
  lessonM1L1,
  lessonM1L2,
  lessonM1L3,
  lessonM1L4,
];
