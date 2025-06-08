
import type { Lesson, Exercise, ExerciseOption } from '@/lib/types';

// Importações individuais das lições do Módulo 3
import { lessonM3L1 } from './lessons/module3/lesson-m3-l1';
import { lessonM3L2 } from './lessons/module3/lesson-m3-l2';
import { lessonM3L3 } from './lessons/module3/lesson-m3-l3';
import { lessonM3L4 } from './lessons/module3/lesson-m3-l4';
import { lessonM3L5 } from './lessons/module3/lesson-m3-l5';
import { lessonM3L6 } from './lessons/module3/lesson-m3-l6';
import { lessonM3L7 } from './lessons/module3/lesson-m3-l7';
import { lessonM3L8 } from './lessons/module3/lesson-m3-l8'; // Nova lição importada

// Importação dos exercícios do Módulo 3
import { module3Exercises } from './exercises/module3';

export const module3Lessons: Lesson[] = [
  lessonM3L1,
  lessonM3L2,
  lessonM3L3,
  lessonM3L4,
  lessonM3L5,
  lessonM3L6,
  lessonM3L7,
  lessonM3L8, // Nova lição adicionada ao array
];

export { module3Exercises };
