
import type { Lesson, Exercise } from '@/lib/types';

// Importações individuais das lições do Módulo 9
import { lessonM9L1 } from './lessons/module9/lesson-m9-l1';
import { lessonM9L2 } from './lessons/module9/lesson-m9-l2';
import { lessonM9L3 } from './lessons/module9/lesson-m9-l3';
import { lessonM9L4 } from './lessons/module9/lesson-m9-l4';
import { lessonM9L5 } from './lessons/module9/lesson-m9-l5';
import { lessonM9L6 } from './lessons/module9/lesson-m9-l6';

// Importação dos exercícios do Módulo 9
import { module9Exercises } from './exercises/module9';

export const module9Lessons: Lesson[] = [
  lessonM9L1,
  lessonM9L2,
  lessonM9L3,
  lessonM9L4,
  lessonM9L5,
  lessonM9L6,
];

// Garantindo que o título das lições seja o correto conforme o plano.
if (module9Lessons[0]) {
  module9Lessons[0].title = 'Lição 9.1: Fundamentos Legais e Conceituais da Inclusão';
}
if (module9Lessons[1]) {
  module9Lessons[1].title = 'Lição 9.2: Políticas e Processos de Inclusão Educacional';
}
if (module9Lessons[2]) {
  module9Lessons[2].title = 'Lição 9.3: Políticas e Processos de Inclusão Laboral';
}
if (module9Lessons[3]) {
  module9Lessons[3].title = 'Lição 9.4: Políticas e Processos de Inclusão Social e Comunitária';
}
if (module9Lessons[4]) {
  module9Lessons[4].title = 'Lição 9.5: O Papel da Família, da Comunidade e do Estado na Inclusão';
}
if (module9Lessons[5]) {
  module9Lessons[5].title = 'Lição 9.6: Desafios e Perspectivas Futuras para a Inclusão';
}


export { module9Exercises };


    
