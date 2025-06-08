
import type { Lesson } from '@/lib/types';

// Importações individuais das lições do Módulo 11
import { lessonM11L1 } from './lessons/module11/lesson-m11-l1';
import { lessonM11L2 } from './lessons/module11/lesson-m11-l2';
import { lessonM11L3 } from './lessons/module11/lesson-m11-l3';
import { lessonM11L4 } from './lessons/module11/lesson-m11-l4';
import { lessonM11L5 } from './lessons/module11/lesson-m11-l5';
import { lessonM11L6 } from './lessons/module11/lesson-m11-l6';

// Importação dos exercícios do Módulo 11 (a partir do index.ts da pasta de exercícios)
import { module11Exercises } from './exercises/module11';


export const module11Lessons: Lesson[] = [
  lessonM11L1, 
  lessonM11L2,
  lessonM11L3,
  lessonM11L4,
  lessonM11L5,
  lessonM11L6,
];

// Atualizando títulos para refletir o novo planejamento
if (module11Lessons[0]) {
  module11Lessons[0].title = 'Lição 11.1: Acesso ao Ensino Superior: Panorama Histórico, Leis Fundamentais e o Desafio do Capacitismo';
}
if (module11Lessons[1]) {
  module11Lessons[1].title = 'Lição 11.2: Superando Barreiras no Acesso ao Ensino Superior: Estratégias e Políticas';
}
if (module11Lessons[2]) {
  module11Lessons[2].title = 'Lição 11.3: Garantindo a Permanência: Acessibilidade Acadêmica e Suportes Pedagógicos';
}
if (module11Lessons[3]) {
  module11Lessons[3].title = 'Lição 11.4: Suportes Estruturais para a Permanência e Qualidade de Vida Universitária';
}
if (module11Lessons[4]) {
  module11Lessons[4].title = 'Lição 11.5: Vida Universitária Além da Sala de Aula: Participação, Cultura Inclusiva e Protagonismo Estudantil';
}
if (module11Lessons[5]) {
  module11Lessons[5].title = 'Lição 11.6: Ensino Superior Inclusivo no Brasil: Balanço Crítico, Boas Práticas e Caminhos Futuros';
}

export { module11Exercises };
    
