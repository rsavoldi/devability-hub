
import type { Lesson } from '@/lib/types';

// Importações individuais das lições do Módulo 6
import { lessonM6L1 } from './lessons/module6/lesson-m6-l1';
import { lessonM6L2 } from './lessons/module6/lesson-m6-l2';
import { lessonM6L3 } from './lessons/module6/lesson-m6-l3';
import { lessonM6L4 } from './lessons/module6/lesson-m6-l4';
import { lessonM6L5 } from './lessons/module6/lesson-m6-l5';
import { lessonM6L6 } from './lessons/module6/lesson-m6-l6';
import { lessonM6L7 } from './lessons/module6/lesson-m6-l7'; // Nova lição

// Importação dos exercícios do Módulo 6 (manter como está se já organizado)
import { module6Exercises } from './exercises/module6';

export const module6Lessons: Lesson[] = [
  lessonM6L1,
  lessonM6L2,
  lessonM6L3,
  lessonM6L4,
  lessonM6L5,
  lessonM6L6,
  lessonM6L7, // Nova lição adicionada
];

// Atualizando títulos conforme o novo plano
module6Lessons[0].title = 'Lição 6.1: Avaliação Psicológica e Psicodiagnóstico: Definições, Objetivos e Etapas Fundamentais';
module6Lessons[1].title = 'Lição 6.2: Modelos Teóricos da Avaliação Psicológica na Deficiência: Clínico-Tradicional, Biopsicossocial (CIF) e Ecológico';
module6Lessons[2].title = 'Lição 6.3: Compreendendo a Diversidade: Especificidades da Pessoa com Deficiência e Barreiras na Avaliação'; // M6L3 Original era Instrumentos, M6L4 era Especificidades. Reordenando e renomeando.
module6Lessons[3].title = 'Lição 6.4: Instrumentos e Técnicas de Avaliação Psicológica Adaptados para Pessoas com Deficiência';
module6Lessons[4].title = 'Lição 6.5: Boas Práticas no Psicodiagnóstico da Pessoa com Deficiência: Do Processo à Devolutiva';
module6Lessons[5].title = 'Lição 6.6: Aspectos Ético-Legais na Avaliação Psicológica da Pessoa com Deficiência';
// Lição 6.7 já tem título no seu arquivo.

export { module6Exercises };
