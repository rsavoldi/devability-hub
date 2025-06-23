
import type { Lesson } from '@/lib/types';

// Importações individuais das lições do Módulo 6
import { lessonM6L1 } from './lessons/module6/lesson-m6-l1';
import { lessonM6L2 } from './lessons/module6/lesson-m6-l2';
import { lessonM6L3 } from './lessons/module6/lesson-m6-l3';
import { lessonM6L4 } from './lessons/module6/lesson-m6-l4';
import { lessonM6L5 } from './lessons/module6/lesson-m6-l5';
import { lessonM6L6 } from './lessons/module6/lesson-m6-l6';
import { lessonM6L7 } from './lessons/module6/lesson-m6-l7'; // Nova lição

export const module6Lessons: Lesson[] = [
  lessonM6L1,
  lessonM6L2,
  lessonM6L3,
  lessonM6L4,
  lessonM6L5,
  lessonM6L6,
  lessonM6L7, // Nova lição adicionada
];

    