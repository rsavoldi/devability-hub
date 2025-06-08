
import type { Lesson, Exercise } from '@/lib/types';

// Importações individuais das lições do Módulo 4
import { lessonM4L1 } from './lessons/module4/lesson-m4-l1';
import { lessonM4L2 } from './lessons/module4/lesson-m4-l2';
import { lessonM4L3 } from './lessons/module4/lesson-m4-l3';
import { lessonM4L4 } from './lessons/module4/lesson-m4-l4';
import { lessonM4L5 } from './lessons/module4/lesson-m4-l5';
import { lessonM4L6 } from './lessons/module4/lesson-m4-l6';
import { lessonM4L7 } from './lessons/module4/lesson-m4-l7';
import { lessonM4L8 } from './lessons/module4/lesson-m4-l8';
import { lessonM4L9 } from './lessons/module4/lesson-m4-l9';
import { lessonM4L10 } from './lessons/module4/lesson-m4-l10';


// Importação dos exercícios do Módulo 4
import { module4Exercises } from './exercises/module4';

export const module4Lessons: Lesson[] = [
  lessonM4L1,
  lessonM4L2,
  lessonM4L3,
  lessonM4L4,
  lessonM4L5,
  lessonM4L6,
  lessonM4L7,
  lessonM4L8,
  lessonM4L9,
  lessonM4L10,
];

export { module4Exercises };

    

    








