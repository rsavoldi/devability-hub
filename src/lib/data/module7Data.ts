
import type { Lesson } from '@/lib/types';

// Importações individuais das lições do Módulo 7
import { lessonM7L1 } from './lessons/module7/lesson-m7-l1';
import { lessonM7L2 } from './lessons/module7/lesson-m7-l2';
import { lessonM7L3 } from './lessons/module7/lesson-m7-l3';
import { lessonM7L4 } from './lessons/module7/lesson-m7-l4';
import { lessonM7L5 } from './lessons/module7/lesson-m7-l5';
import { lessonM7L6 } from './lessons/module7/lesson-m7-l6';
import { lessonM7L7 } from './lessons/module7/lesson-m7-l7'; // Nova lição importada

export const module7Lessons: Lesson[] = [
  lessonM7L1,
  lessonM7L2,
  lessonM7L3,
  lessonM7L4,
  lessonM7L5,
  lessonM7L6,
  lessonM7L7, 
];

    