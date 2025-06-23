
import type { Lesson, Exercise } from '@/lib/types';

// Importações individuais das lições do Módulo 9
import { lessonM9L1 } from './lessons/module9/lesson-m9-l1';
import { lessonM9L2 } from './lessons/module9/lesson-m9-l2';
import { lessonM9L3 } from './lessons/module9/lesson-m9-l3';
import { lessonM9L4 } from './lessons/module9/lesson-m9-l4';
import { lessonM9L5 } from './lessons/module9/lesson-m9-l5';
import { lessonM9L6 } from './lessons/module9/lesson-m9-l6';

export const module9Lessons: Lesson[] = [
  lessonM9L1,
  lessonM9L2,
  lessonM9L3,
  lessonM9L4,
  lessonM9L5,
  lessonM9L6,
];

    