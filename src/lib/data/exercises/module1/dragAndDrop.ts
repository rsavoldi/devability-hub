
import type { Exercise } from '@/lib/types';

export const module1DragAndDropExercises: Exercise[] = [
  {
    id: 'm1-e-drag-drop-example',
    moduleId: 'mod-trilha1-0',
    title: 'Categorização de Habilidades Motoras',
    type: 'drag-and-drop',
    question: 'Categorize as seguintes atividades como "Motor Grosso" ou "Motor Fino":',
    options: [
      { id: 'dd-opt1', text: 'Chutar uma bola' },
      { id: 'dd-opt2', text: 'Desenhar um círculo' },
      { id: 'dd-opt3', text: 'Pular corda' },
      { id: 'dd-opt4', text: 'Recortar com tesoura' },
      { id: 'dd-opt5', text: 'Subir escadas' },
      { id: 'dd-opt6', text: 'Amarrar os sapatos' },
    ],
    targetCategories: [
      { id: 'cat-grosso', text: 'Motor Grosso' },
      { id: 'cat-fino', text: 'Motor Fino' },
    ],
    correctAnswer: {
      'dd-opt1': 'cat-grosso',
      'dd-opt2': 'cat-fino',
      'dd-opt3': 'cat-grosso',
      'dd-opt4': 'cat-fino',
      'dd-opt5': 'cat-grosso',
      'dd-opt6': 'cat-fino',
    },
    feedback: 'Motor Grosso envolve grandes músculos (chutar, pular, subir escadas). Motor Fino envolve pequenos músculos (desenhar, recortar, amarrar).',
    points: 20,
    estimatedTime: '3 mins'
  },
  {
    id: 'm1-e1.5.5',
    moduleId: 'mod-trilha1-0',
    title: 'Facilitadores vs. Barreiras à Inclusão',
    type: 'drag-and-drop',
    question: 'Categorize os seguintes itens como "Facilitadores da Inclusão" ou "Barreiras à Inclusão":',
    options: [
      { id: 'inc_opt1', text: 'Ambientes acessíveis' },
      { id: 'inc_opt2', text: 'Preconceito e estigma' },
      { id: 'inc_opt3', text: 'Tecnologias Assistivas' },
      { id: 'inc_opt4', text: 'Falta de informação' },
      { id: 'inc_opt5', text: 'Políticas inclusivas' },
      { id: 'inc_opt6', text: 'Comunicação inacessível' },
    ],
    targetCategories: [
      { id: 'cat-facilitador', text: 'Facilitadores da Inclusão' },
      { id: 'cat-barreira', text: 'Barreiras à Inclusão' },
    ],
    correctAnswer: {
      'inc_opt1': 'cat-facilitador',
      'inc_opt2': 'cat-barreira',
      'inc_opt3': 'cat-facilitador',
      'inc_opt4': 'cat-barreira',
      'inc_opt5': 'cat-facilitador',
      'inc_opt6': 'cat-barreira',
    },
    feedback: 'Excelente categorização! Identificar facilitadores e barreiras é crucial para promover a inclusão.',
    points: 20,
    estimatedTime: '3 mins'
  },
  {
    id: 'm1-e1.6.5',
    moduleId: 'mod-trilha1-0',
    title: 'Domínios do Desenvolvimento',
    type: 'drag-and-drop',
    question: 'Categorize as seguintes atividades ou características em seus respectivos domínios do desenvolvimento (Físico/Motor, Cognitivo/Linguístico, Social/Afetivo):',
    options: [
      { id: 'dom_opt1', text: 'Aprender a andar de bicicleta' },
      { id: 'dom_opt2', text: 'Resolver um quebra-cabeça' },
      { id: 'dom_opt3', text: 'Fazer amigos no parquinho' },
      { id: 'dom_opt4', text: 'Contar uma história' },
      { id: 'dom_opt5', text: 'Expressar alegria ao ver um familiar' },
      { id: 'dom_opt6', text: 'Escrever o próprio nome' },
    ],
    targetCategories: [
      { id: 'cat-fisico', text: 'Físico/Motor' },
      { id: 'cat-cognitivo', text: 'Cognitivo/Linguístico' },
      { id: 'cat-social', text: 'Social/Afetivo' },
    ],
    correctAnswer: {
      'dom_opt1': 'cat-fisico',
      'dom_opt2': 'cat-cognitivo',
      'dom_opt3': 'cat-social',
      'dom_opt4': 'cat-cognitivo',
      'dom_opt5': 'cat-social',
      'dom_opt6': 'cat-fisico', // Motor fino, mas aqui agrupado em físico
    },
    feedback: 'Ótima categorização! O desenvolvimento é multidimensional: Físico/Motor (bicicleta, escrever), Cognitivo/Linguístico (quebra-cabeça, história), Social/Afetivo (amigos, expressar alegria).',
    points: 20,
    estimatedTime: '3 mins'
  }
];
