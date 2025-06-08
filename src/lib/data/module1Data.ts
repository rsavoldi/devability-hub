
import type { Lesson } from '@/lib/types';
// Importações individuais das lições
import { lessonM1L1 } from './lessons/module1/lesson-m1-l1';
import { lessonM1L2 } from './lessons/module1/lesson-m1-l2';
import { lessonM1L3 } from './lessons/module1/lesson-m1-l3';
import { lessonM1L4 } from './lessons/module1/lesson-m1-l4';

// Os exercícios continuam sendo importados de seu local agregado
// import { module1Exercises } from './exercises/module1';

export const module1Lessons: Lesson[] = [
  lessonM1L1,
  lessonM1L2,
  lessonM1L3,
  lessonM1L4,
];

// Se module1Exercises também é exportado deste arquivo (verificar mockData.ts),
// a linha abaixo deve ser mantida ou ajustada conforme a origem real de module1Exercises.
// Por agora, focamos apenas na refatoração das lições.
// export { module1Exercises }; // Esta linha foi comentada pois os exercícios já são gerenciados em mockData.ts a partir de seu próprio index.
