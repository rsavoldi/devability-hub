
import type { Lesson } from '@/lib/types';

// Importações individuais das lições do Módulo 10
import { lessonM10L1 } from './lessons/module10/lesson-m10-l1';
import { lessonM10L2 } from './lessons/module10/lesson-m10-l2';
import { lessonM10L3 } from './lessons/module10/lesson-m10-l3';
import { lessonM10L4 } from './lessons/module10/lesson-m10-l4';
import { lessonM10L5 } from './lessons/module10/lesson-m10-l5';

// Importação dos exercícios do Módulo 10 da nova estrutura
import { module10Exercises } from './exercises/module10';


export const module10Lessons: Lesson[] = [
  lessonM10L1,
  lessonM10L2,
  lessonM10L3,
  lessonM10L4,
  lessonM10L5,
];

// Atualizando títulos conforme o novo plano para o Módulo 10
if (module10Lessons[0]) {
  module10Lessons[0].title = 'Lição 10.1: Desenho Universal - Princípios, Aplicações e Impactos';
}
if (module10Lessons[1]) {
  module10Lessons[1].title = 'Lição 10.2: Neurodivergências - Além do Modelo Médico da Deficiência';
}
if (module10Lessons[2]) {
  module10Lessons[2].title = 'Lição 10.3: Tecnologias Assistivas - Inovações, Acessibilidade e Autonomia';
}
if (module10Lessons[3]) {
  module10Lessons[3].title = 'Lição 10.4: Deficiência Oculta - Desafios de Reconhecimento e Inclusão';
}
if (module10Lessons[4]) {
  module10Lessons[4].title = 'Lição 10.5: Integração e Diálogo entre Diferentes Perspectivas nos Debates sobre Inclusão';
}


export { module10Exercises };

    
 
