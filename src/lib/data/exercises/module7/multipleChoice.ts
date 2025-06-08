
import type { Exercise } from '@/lib/types';

export const module7MultipleChoiceExercises: Exercise[] = [
  {
    id: 'm7-e1',
    moduleId: 'mod-trilha7-0',
    title: 'Interseccionalidade na Pesquisa',
    type: 'multiple-choice',
    question: 'O que significa o conceito de "interseccionalidade" na pesquisa sobre deficiência?',
    options: [
      { id: 'opt1', text: 'Focar apenas no tipo de deficiência, ignorando outros fatores.' },
      { id: 'opt2', text: 'Analisar como a deficiência interage com outras categorias sociais (gênero, raça, classe) afetando as experiências.' },
      { id: 'opt3', text: 'Um método de dividir a pesquisa em seções menores e independentes.' },
      { id: 'opt4', text: 'A colaboração entre pesquisadores de diferentes interseções geográficas.' }
    ],
    correctAnswer: 'opt2',
    feedback: 'Correto! Interseccionalidade examina como diferentes formas de opressão e identidade se cruzam e impactam as experiências das pessoas com deficiência.',
    points: 10,
    estimatedTime: '2 mins'
  },
  {
    id: 'm7-e3',
    moduleId: 'mod-trilha7-0',
    title: 'Pesquisa-Ação',
    type: 'multiple-choice',
    question: 'Qual o principal objetivo da Pesquisa-Ação no contexto da deficiência?',
    options: [
      { id: 'opt1', text: 'Apenas descrever detalhadamente uma situação social.' },
      { id: 'opt2', text: 'Produzir conhecimento teórico para publicação acadêmica exclusiva.' },
      { id: 'opt3', text: 'Combinar investigação e intervenção para produzir mudanças sociais concretas com participação dos sujeitos.' },
      { id: 'opt4', text: 'Testar hipóteses estatísticas de forma rigorosamente controlada em laboratório.' }
    ],
    correctAnswer: 'opt3',
    feedback: 'Correto! A Pesquisa-Ação visa a transformação social através da colaboração e da aplicação prática do conhecimento gerado.',
    points: 10,
    estimatedTime: '2 mins',
  },
  {
    id: 'm7-e5',
    moduleId: 'mod-trilha7-0',
    title: 'Consentimento Informado na Pesquisa',
    type: 'multiple-choice',
    question: 'Ao obter consentimento informado de uma pessoa com deficiência intelectual para participar de uma pesquisa, o que é eticamente crucial?',
    options: [
      { id: 'opt1', text: 'Acelerar o processo para não cansar o participante.' },
      { id: 'opt2', text: 'Usar linguagem técnica para garantir a precisão da informação.' },
      { id: 'opt3', text: 'Presumir incapacidade e obter consentimento apenas de um responsável legal.' },
      { id: 'opt4', text: 'Adaptar a linguagem e os materiais para garantir compreensão, oferecer suportes à decisão e verificar o consentimento de forma contínua.' }
    ],
    correctAnswer: 'opt4',
    feedback: 'Correto! O consentimento deve ser verdadeiramente informado e voluntário, com todas as adaptações necessárias para garantir a compreensão e autonomia do participante.',
    points: 10,
    estimatedTime: '2 mins',
  },
  {
    id: 'm7-e7',
    moduleId: 'mod-trilha7-0',
    title: 'Abordagens Inovadoras: Pesquisa Baseada em Artes',
    type: 'multiple-choice',
    question: 'Qual é uma vantagem principal da Pesquisa Baseada em Artes no contexto da deficiência, conforme a Lição 7.4?',
    options: [
        { id: 'art_opt1', text: 'Garantir resultados estatisticamente generalizáveis para toda a população.' },
        { id: 'art_opt2', text: 'Oferecer formas alternativas de expressão, especialmente para quem tem dificuldades de comunicação verbal.' },
        { id: 'art_opt3', text: 'Ser mais rápida e barata de conduzir do que métodos tradicionais.' },
        { id: 'art_opt4', text: 'Focar exclusivamente na produção de obras de arte, sem preocupação com a geração de conhecimento.' }
    ],
    correctAnswer: 'art_opt2',
    feedback: 'Correto! A Pesquisa Baseada em Artes pode ser muito valiosa para explorar experiências que são difíceis de verbalizar.',
    points: 10,
    estimatedTime: '2 mins'
  },
  {
    id: 'm7-e8',
    moduleId: 'mod-trilha7-0',
    title: 'Ética na Pesquisa: Representatividade',
    type: 'multiple-choice',
    question: 'Por que a "representatividade e diversidade" é uma consideração ética crucial na pesquisa sobre deficiência (Lição 7.5)?',
    options: [
        { id: 'rep_opt1', text: 'Para facilitar a comparação direta com grupos controle sem deficiência.' },
        { id: 'rep_opt2', text: 'Para garantir que os resultados da pesquisa possam ser generalizados para todas as pessoas com deficiência, independentemente de suas especificidades.' },
        { id: 'rep_opt3', text: 'Para evitar generalizações indevidas a partir de amostras homogêneas ou privilegiadas e incluir a variedade de experiências dentro da categoria "deficiência".' },
        { id: 'rep_opt4', text: 'Para simplificar a análise de dados, focando apenas nos subgrupos mais numerosos.' }
    ],
    correctAnswer: 'rep_opt3',
    feedback: 'Correto! Incluir a diversidade de experiências é essencial para evitar vieses e garantir que a pesquisa seja relevante para diferentes grupos.',
    points: 10,
    estimatedTime: '2 mins'
  },
  {
    id: 'm7-e9',
    moduleId: 'mod-trilha7-0',
    title: 'Desafios da Pesquisa em Deficiência: Acessibilidade',
    type: 'multiple-choice',
    question: 'Qual é um desafio metodológico comum na pesquisa com pessoas com deficiência, conforme a Lição 7.6?',
    options: [
        { id: 'des_opt1', text: 'A falta de interesse das pessoas com deficiência em participar de pesquisas.' },
        { id: 'des_opt2', text: 'A homogeneidade excessiva da população, dificultando a identificação de variáveis.' },
        { id: 'des_opt3', text: 'A necessidade de adaptar métodos e instrumentos para garantir acessibilidade e participação efetiva.' },
        { id: 'des_opt4', text: 'A abundância de financiamento, que torna difícil escolher prioridades de pesquisa.' }
    ],
    correctAnswer: 'des_opt3',
    feedback: 'Exato! Garantir que métodos e instrumentos sejam acessíveis é um desafio constante e crucial na pesquisa sobre deficiência.',
    points: 10,
    estimatedTime: '2 mins'
  }
];
