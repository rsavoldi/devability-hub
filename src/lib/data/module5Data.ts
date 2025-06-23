
import type { Lesson, Exercise } from '@/lib/types';

// Importações individuais das lições do Módulo 5
import { lessonM5L1 } from './lessons/module5/lesson-m5-l1';
import { lessonM5L2 } from './lessons/module5/lesson-m5-l2';
import { lessonM5L3 } from './lessons/module5/lesson-m5-l3';
import { lessonM5L4 } from './lessons/module5/lesson-m5-l4';
import { lessonM5L5 } from './lessons/module5/lesson-m5-l5';
import { lessonM5L6 } from './lessons/module5/lesson-m5-l6';

export const module5Lessons: Lesson[] = [
  lessonM5L1,
  lessonM5L2,
  lessonM5L3,
  lessonM5L4,
  lessonM5L5,
  lessonM5L6,
];

    