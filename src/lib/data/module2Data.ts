
import type { Lesson } from '@/lib/types';
// Importações individuais das lições do Módulo 2
import { lessonM2L1 } from './lessons/module2/lesson-m2-l1';
import { lessonM2L2 } from './lessons/module2/lesson-m2-l2';
import { lessonM2L3 } from './lessons/module2/lesson-m2-l3';
import { lessonM2L4 } from './lessons/module2/lesson-m2-l4';
import { lessonM2L5 } from './lessons/module2/lesson-m2-l5';
import { lessonM2L6 } from './lessons/module2/lesson-m2-l6';
import { lessonM2L7 } from './lessons/module2/lesson-m2-l7';

// Os exercícios são importados do seu próprio arquivo index
import { module2Exercises } from './exercises/module2';

export const module2Lessons: Lesson[] = [
  lessonM2L1,
  lessonM2L2,
  lessonM2L3,
  lessonM2L4,
  lessonM2L5,
  lessonM2L6,
  lessonM2L7,
];

// A exportação de module2Exercises permanece
export { module2Exercises };
