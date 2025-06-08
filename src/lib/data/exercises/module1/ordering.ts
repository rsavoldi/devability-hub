
import type { Exercise } from '@/lib/types';

export const module1OrderingExercises: Exercise[] = [
  {
    id: 'm1-e-ordering-example',
    moduleId: 'mod-trilha1-0',
    title: 'Sequência Correta do Desenvolvimento Motor Grosso',
    type: 'ordering',
    question: 'Organize as seguintes habilidades motoras grossas na ordem correta em que geralmente são adquiridas:',
    options: [
      { id: 'ord-opt-2', text: 'Engatinhar' },
      { id: 'ord-opt-1', text: 'Rolar (barriga para costas)' },
      { id: 'ord-opt-4', text: 'Andar com apoio' },
      { id: 'ord-opt-3', text: 'Sentar sem apoio' },
    ],
    correctAnswer: ['ord-opt-1', 'ord-opt-3', 'ord-opt-2', 'ord-opt-4'],
    feedback: 'A sequência típica é: Rolar, Sentar sem apoio, Engatinhar, e depois Andar com apoio.',
    points: 15,
    estimatedTime: '3 mins'
  },
  {
    id: 'm1-e1.5.4',
    moduleId: 'mod-trilha1-0',
    title: 'Estágios do Desenvolvimento do Apego (Bowlby)',
    type: 'ordering',
    question: 'Ordene os estágios de desenvolvimento do apego, conforme proposto por John Bowlby (simplificado):',
    options: [
      { id: 'apego_opt3', text: 'Formação de um apego focado (6-8 meses a 18-24 meses)' },
      { id: 'apego_opt1', text: 'Pré-apego ou orientação social indiscriminada (nascimento a 6-8 semanas)' },
      { id: 'apego_opt4', text: 'Formação de uma parceria recíproca (18-24 meses em diante)' },
      { id: 'apego_opt2', text: 'Apego em formação ou discriminação de figuras familiares (6-8 semanas a 6-8 meses)' },
    ],
    correctAnswer: ['apego_opt1', 'apego_opt2', 'apego_opt3', 'apego_opt4'],
    feedback: 'Correto! Esta é a sequência geral proposta por Bowlby para o desenvolvimento do apego.',
    points: 15,
    estimatedTime: '3 mins'
  },
  {
    id: 'm1-e1.6.4',
    moduleId: 'mod-trilha1-0',
    title: 'Sequência da Aquisição da Linguagem (Simplificada)',
    type: 'ordering',
    question: 'Ordene as seguintes etapas da aquisição da linguagem em uma sequência típica simplificada:',
    options: [
      { id: 'lang_seq2', text: 'Balbucio (combinações de consoante-vogal)' },
      { id: 'lang_seq4', text: 'Formação de frases simples (ex: "quer água")' },
      { id: 'lang_seq1', text: 'Choro e vocalizações reflexas' },
      { id: 'lang_seq3', text: 'Primeiras palavras reconhecíveis' },
    ],
    correctAnswer: ['lang_seq1', 'lang_seq2', 'lang_seq3', 'lang_seq4'],
    feedback: 'Ótima ordenação! Esta é uma progressão comum no desenvolvimento inicial da linguagem.',
    points: 15,
    estimatedTime: '3 mins'
  }
];
