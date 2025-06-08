
import type { Exercise } from '@/lib/types';

export const module3AssociationExercises: Exercise[] = [
  {
    id: 'm3-e2',
    moduleId: 'mod-trilha3-0',
    title: 'Modelo Social vs. Modelo Médico',
    type: 'association',
    question: 'Associe os modelos de compreensão da deficiência (Coluna A) com suas características principais (Coluna B).',
    options: [
      { id: 'a1', text: 'Coluna A: Modelo Médico' }, { id: 'b1', text: 'Coluna B: Foca na deficiência como um problema individual, uma doença a ser curada ou reabilitada.' },
      { id: 'a2', text: 'Coluna A: Modelo Social' }, { id: 'b2', text: 'Coluna B: Entende a deficiência como resultado de barreiras sociais, atitudinais e ambientais.' },
      { id: 'a3', text: 'Coluna A: Modelo Biopsicossocial (CIF)' }, { id: 'b3', text: 'Coluna B: Considera a interação entre condições de saúde e fatores contextuais (ambientais e pessoais).' },
    ],
    correctAnswer: ["a1-b1", "a2-b2", "a3-b3"], 
    feedback: 'Ótimas associações! Compreender esses modelos é fundamental.',
    points: 15,
    estimatedTime: '3 mins'
  },
  {
    id: 'm3-e9',
    moduleId: 'mod-trilha3-0',
    title: 'Tecnologias Assistivas: Exemplos e Categorias',
    type: 'association',
    question: 'Associe o tipo de Tecnologia Assistiva (Coluna A) com um exemplo (Coluna B), conforme discutido na Lição 3.6.',
    options: [
      { id: 'ta_a1', text: 'Coluna A: Comunicação Aumentativa e Alternativa (CAA)' }, { id: 'ta_b1', text: 'Coluna B: Prancha de comunicação com símbolos pictográficos.' },
      { id: 'ta_a2', text: 'Coluna A: Acessibilidade ao Computador' }, { id: 'ta_b2', text: 'Coluna B: Software leitor de tela para pessoas cegas.' },
      { id: 'ta_a3', text: 'Coluna A: Auxílios para Vida Diária' }, { id: 'ta_b3', text: 'Coluna B: Talheres com cabos engrossados para facilitar a preensão.' },
      { id: 'ta_a4', text: 'Coluna A: Adequação Postural' }, { id: 'ta_b4', text: 'Coluna B: Cadeira de rodas personalizada com suportes laterais.' }
    ],
    correctAnswer: ["ta_a1-ta_b1", "ta_a2-ta_b2", "ta_a3-ta_b3", "ta_a4-ta_b4"],
    feedback: 'Excelente! As Tecnologias Assistivas são diversas e adaptadas para muitas necessidades, melhorando a autonomia e participação.',
    points: 20,
    estimatedTime: '3 mins'
  }
];
