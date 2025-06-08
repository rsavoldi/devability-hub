
import type { Exercise } from '@/lib/types';

export const module1MultipleChoiceExercises: Exercise[] = [
  {
    id: 'm1-e1.1.1',
    moduleId: 'mod-trilha1-0',
    title: 'Conceito de Modelo Biopsicossocial',
    type: 'multiple-choice',
    question: 'Qual modelo enfatiza a interação entre fatores biológicos, psicológicos e sociais na compreensão da funcionalidade e da deficiência?',
    options: [
      {id: 'opt1', text:'Modelo Médico'},
      {id: 'opt2', text:'Modelo Social'},
      {id: 'opt3', text:'Modelo Biopsicossocial'},
      {id: 'opt4', text:'Modelo Assistencialista'}
    ],
    correctAnswer: 'opt3',
    feedback: 'Correto! O modelo biopsicossocial oferece uma visão integrada, considerando a pessoa em seu contexto biopsicossocial.',
    points: 10,
    estimatedTime: '2 mins'
  },
  {
    id: 'm1-e1.1.2',
    moduleId: 'mod-trilha1-0',
    title: 'Desenvolvimento Diverso vs. Típico',
    type: 'multiple-choice',
    question: 'Na perspectiva anticapacitista, qual termo é preferível para descrever trajetórias de desenvolvimento que se diferenciam do padrão mais comum?',
    options: [
        {id: 'dev_opt1', text: 'Desenvolvimento Desviante'},
        {id: 'dev_opt2', text: 'Desenvolvimento Anormal'},
        {id: 'dev_opt3', text: 'Desenvolvimento Singular ou Diverso'},
        {id: 'dev_opt4', text: 'Desenvolvimento Retardado'}
    ],
    correctAnswer: 'dev_opt3',
    feedback: 'Exato! Termos como "singular" ou "diverso" respeitam a individualidade e promovem uma visão anticapacitista.',
    points: 10,
    estimatedTime: '2 mins'
  },
  {
    id: 'm1-e1.1.4',
    moduleId: 'mod-trilha1-0',
    title: 'Facilitadores da Inclusão',
    type: 'multiple-choice',
    question: 'Além de ambientes inclusivos e tecnologias assistivas, qual dos seguintes é um importante facilitador para a participação e autonomia da pessoa com deficiência?',
    options: [
        {id: 'fac_opt1', text: 'Isolamento social para proteção.'},
        {id: 'fac_opt2', text: 'Suporte social adequado e redes de apoio.'},
        {id: 'fac_opt3', text: 'Políticas que foquem apenas na reabilitação médica.'},
        {id: 'fac_opt4', text: 'Baixas expectativas para evitar frustração.'}
    ],
    correctAnswer: 'fac_opt2',
    feedback: 'Correto! O suporte social adequado é um facilitador crucial para a inclusão e qualidade de vida.',
    points: 10,
    estimatedTime: '2 mins'
  },
  {
    id: 'm1-e1.2.1',
    moduleId: 'mod-trilha1-0',
    title: 'Marcos Motores e Singularidade',
    type: 'multiple-choice',
    question: 'Segundo Mancini et al. (2002), a aquisição de marcos motores como sentar e andar em tempos diferentes em crianças com deficiência física significa:',
    options: [
      { id: 'ord1', text: 'Um atraso definitivo que impede o desenvolvimento futuro.' },
      { id: 'ord2', text: 'Um percurso desenvolvimental próprio, não necessariamente um atraso global.' },
      { id: 'ord3', text: 'A necessidade de intervenção cirúrgica imediata.' },
      { id: 'ord4', text: 'Que a criança nunca alcançará esses marcos.' },
    ],
    correctAnswer: 'ord2',
    feedback: 'Correto! A singularidade no desenvolvimento motor é esperada e não indica um prognóstico fechado.',
    points: 10,
    estimatedTime: '2 mins'
  },
  {
    id: 'm1-e1.2.2',
    moduleId: 'mod-trilha1-0',
    title: 'Estratégias para Deficiência Visual',
    type: 'multiple-choice',
    question: 'Crianças com deficiência visual, segundo Nunes e Lomônaco (2010), utilizam principalmente quais sentidos como estratégia compensatória para explorar o ambiente?',
    options: [
      { id: 'dnd1', text: 'Olfato e paladar intensificados.' },
      { id: 'dnd2', text: 'Apenas a visão residual, focando em luzes e sombras.' },
      { id: 'dnd3', text: 'Tato e audição para construir representações espaciais.' },
      { id: 'dnd4', text: 'Intuição e sorte.' },
    ],
    correctAnswer: 'dnd3',
    feedback: 'Exato! O tato e a audição são fundamentais para a orientação e mobilidade de crianças com deficiência visual.',
    points: 10,
    estimatedTime: '2 mins'
  },
  {
    id: 'm1-e1.2.3',
    moduleId: 'mod-trilha1-0',
    title: 'Crescimento Cefalocaudal e Proximodistal',
    type: 'multiple-choice',
    question: 'O princípio de crescimento que ocorre da cabeça para os pés é chamado de:',
    options: [
      {id: 'g_opt1', text:'Proximodistal'},
      {id: 'g_opt2', text:'Cefalocaudal'},
      {id: 'g_opt3', text:'Distalproximal'},
      {id: 'g_opt4', text:'Lateromedial'}
    ],
    correctAnswer: 'g_opt2',
    feedback: 'Correto! Cefalocaudal refere-se ao desenvolvimento que progride da cabeça em direção aos pés.',
    points: 10,
    estimatedTime: '1 min'
  },
  {
    id: 'm1-e1.3.1',
    moduleId: 'mod-trilha1-0',
    title: 'Vygotsky e Deficiência',
    type: 'multiple-choice',
    question: 'Qual o principal argumento de Vygotsky (1997) sobre o desenvolvimento da criança com deficiência?',
    options: [
        {id: 'fe1', text: 'A deficiência biológica determina um limite intransponível para o desenvolvimento cultural.'},
        {id: 'fe2', text: 'O desenvolvimento cultural, mediado socialmente, pode superar o déficit orgânico por vias alternativas.'},
        {id: 'fe3', text: 'Crianças com deficiência seguem um desenvolvimento completamente diferente e incomparável.'},
        {id: 'fe4', text: 'A compensação é um processo puramente individual e interno à criança.'}
    ],
    correctAnswer: 'fe2',
    feedback: 'Correto! Vygotsky enfatizou o poder da mediação social e dos instrumentos culturais na criação de rotas alternativas de desenvolvimento.',
    points: 10,
    estimatedTime: '2 mins'
  },
  {
    id: 'm1-e1.3.2',
    moduleId: 'mod-trilha1-0',
    title: 'Pragmática da Linguagem no TEA',
    type: 'multiple-choice',
    question: 'No Transtorno do Espectro Autista (TEA), qual aspecto da linguagem é frequentemente mais desafiador?',
    options: [
      { id: 'c1', text: 'Fonologia (produção dos sons da fala).' },
      { id: 'c2', text: 'Semântica (compreensão do significado das palavras).' },
      { id: 'c3', text: 'Pragmática (uso social e contextual da linguagem).' },
      { id: 'c4', text: 'Sintaxe (organização gramatical das frases).' },
    ],
    correctAnswer: 'c3',
    feedback: 'Exato! A pragmática, que envolve o uso da linguagem em contextos sociais, é uma área de particular desafio para muitas pessoas com TEA.',
    points: 10,
    estimatedTime: '2 mins'
  },
  {
    id: 'm1-e1.3.3',
    moduleId: 'mod-trilha1-0',
    title: 'Funções Executivas Chave',
    type: 'multiple-choice',
    question: 'Qual das seguintes opções NÃO é considerada primariamente uma Função Executiva (FE)?',
    options: [
        {id: 'fe_opt1', text: 'Memória de Trabalho'},
        {id: 'fe_opt2', text: 'Controle Inibitório'},
        {id: 'fe_opt3', text: 'Reconhecimento de Emoções Faciais'},
        {id: 'fe_opt4', text: 'Flexibilidade Cognitiva'}
    ],
    correctAnswer: 'fe_opt3',
    feedback: 'Correto! Embora o reconhecimento de emoções seja importante para a interação social, não é classicamente listado como uma das FEs centrais. As outras opções são componentes chave das Funções Executivas.',
    points: 10,
    estimatedTime: '2 mins'
  },
  {
    id: 'm1-e1.3.4',
    moduleId: 'mod-trilha1-0',
    title: 'Desenho Universal para Aprendizagem (DUA)',
    type: 'multiple-choice',
    question: 'O Desenho Universal para a Aprendizagem (DUA) propõe múltiplos meios de:',
    options: [
      {id: 'dua_opt1', text: 'Avaliação, Memorização e Repetição.'},
      {id: 'dua_opt2', text: 'Competição, Individualização e Padronização.'},
      {id: 'dua_opt3', text: 'Representação, Ação/Expressão e Engajamento.'},
      {id: 'dua_opt4', text: 'Diagnóstico, Intervenção e Medicação.'}
    ],
    correctAnswer: 'dua_opt3',
    feedback: 'Exatamente! Os três princípios do DUA são: múltiplos meios de representação (o "quê" da aprendizagem), múltiplos meios de ação e expressão (o "como" da aprendizagem), e múltiplos meios de engajamento (o "porquê" da aprendizagem).',
    points: 10,
    estimatedTime: '2 mins'
  },
  {
    id: 'm1-e1.4.1',
    moduleId: 'mod-trilha1-0',
    title: 'Barreiras Atitudinais',
    type: 'multiple-choice',
    question: 'Segundo Omote (2018), qual tipo de barreira frequentemente representa o obstáculo mais significativo ao desenvolvimento social de pessoas com deficiência?',
    options: [
      {id: 'scen1_opt1', text:'Barreiras arquitetônicas nos edifícios.'},
      {id: 'scen1_opt2', text:'Barreiras atitudinais, como preconceito e estigma.'},
      {id: 'scen1_opt3', text:'Barreiras na comunicação, como falta de intérpretes de Libras.'},
      {id: 'scen1_opt4', text:'Limitações funcionais decorrentes da própria deficiência.'}
    ],
    correctAnswer: 'scen1_opt2',
    feedback: 'Correto! Omote destaca que as barreiras atitudinais são frequentemente os maiores impedimentos à inclusão social.',
    points: 10,
    estimatedTime: '2 mins'
  },
  {
    id: 'm1-e1.4.2',
    moduleId: 'mod-trilha1-0',
    title: 'Impacto da Superproteção',
    type: 'multiple-choice',
    question: 'Conforme Glat (2004), a superproteção familiar e os estereótipos sociais que infantilizam pessoas com deficiência podem dificultar principalmente qual aspecto do desenvolvimento na adolescência?',
    options: [
        {id: 'sup1_opt1', text: 'O desenvolvimento motor fino.'},
        {id: 'sup1_opt2', text: 'O desenvolvimento afetivo-sexual saudável e a autonomia.'},
        {id: 'sup1_opt3', text: 'A aprendizagem de conteúdos acadêmicos complexos.'},
        {id: 'sup1_opt4', text: 'A aquisição da linguagem oral.'}
    ],
    correctAnswer: 'sup1_opt2',
    feedback: 'Exatamente! A superproteção pode limitar as experiências necessárias para o desenvolvimento da autonomia e uma vivência saudável da sexualidade.',
    points: 10,
    estimatedTime: '2 mins'
  },
  {
    id: 'm1-e1.4.3',
    moduleId: 'mod-trilha1-0',
    title: 'Teoria do Apego',
    type: 'multiple-choice',
    question: 'Qual teórico é mais conhecido por desenvolver a Teoria do Apego, que descreve a importância dos vínculos primários para o desenvolvimento socioafetivo?',
    options: [
        {id: 'ap_opt1', text: 'Sigmund Freud'},
        {id: 'ap_opt2', text: 'Jean Piaget'},
        {id: 'ap_opt3', text: 'John Bowlby'},
        {id: 'ap_opt4', text: 'B. F. Skinner'}
    ],
    correctAnswer: 'ap_opt3',
    feedback: 'Correto! John Bowlby, juntamente com Mary Ainsworth, foi pioneiro na Teoria do Apego.',
    points: 10,
    estimatedTime: '1 min'
  },
  {
    id: 'm1-e1.4.4',
    moduleId: 'mod-trilha1-0',
    title: 'Capacitismo vs. Empatia',
    type: 'multiple-choice',
    question: 'O que é Capacitismo?',
    options: [
      {id: 'cap_opt1', text: 'A capacidade de realizar múltiplas tarefas simultaneamente.'},
      {id: 'cap_opt2', text: 'O preconceito e a discriminação baseados na deficiência, que subestimam as capacidades das pessoas com deficiência.'},
      {id: 'cap_opt3', text: 'Um programa de treinamento para aumentar as capacidades físicas.'},
      {id: 'cap_opt4', text: 'A crença de que todas as pessoas têm as mesmas capacidades se tentarem o suficiente.'}
    ],
    correctAnswer: 'cap_opt2',
    feedback: 'Correto! Capacitismo é a discriminação e o preconceito social contra pessoas com deficiência.',
    points: 10,
    estimatedTime: '2 mins'
  },
  {
    id: 'm1-e1.5.1',
    moduleId: 'mod-trilha1-0',
    title: 'Importância do Brincar',
    type: 'multiple-choice',
    question: 'Qual é a principal contribuição do brincar para o desenvolvimento infantil, incluindo crianças com deficiência?',
    options: [
      {id: 'br_opt1', text:'Apenas entretenimento e distração.'},
      {id: 'br_opt2', text:'Desenvolvimento de habilidades motoras, cognitivas, sociais e emocionais.'},
      {id: 'br_opt3', text:'Aprendizagem exclusiva de conteúdos acadêmicos formais.'},
      {id: 'br_opt4', text:'Aumento da competitividade e individualismo.'}
    ],
    correctAnswer: 'br_opt2',
    feedback: 'Correto! O brincar é fundamental para o desenvolvimento integral, promovendo diversas habilidades de forma lúdica e natural.',
    points: 10,
    estimatedTime: '2 mins'
  },
  {
    id: 'm1-e1.6.1',
    moduleId: 'mod-trilha1-0',
    title: 'Modelo Biopsicossocial na Prática',
    type: 'multiple-choice',
    question: 'Na prática, ao aplicar o modelo biopsicossocial para entender uma criança com deficiência, qual dos seguintes aspectos NÃO seria o foco principal?',
    options: [
      {id: 'bio_opt1', text:'As condições de saúde e características biológicas da criança.'},
      {id: 'bio_opt2', text:'O ambiente familiar, escolar e as atitudes da comunidade.'},
      {id: 'bio_opt3', text:'As habilidades cognitivas, emocionais e comportamentais da criança.'},
      {id: 'bio_opt4', text:'A comparação do desempenho da criança exclusivamente com normas estatísticas de desenvolvimento.'}
    ],
    correctAnswer: 'bio_opt4',
    feedback: 'Correto! O modelo biopsicossocial foca na interação de fatores e no contexto, não apenas na comparação com normas de forma isolada.',
    points: 10,
    estimatedTime: '2 mins'
  }
];
