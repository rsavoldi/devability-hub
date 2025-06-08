import type { LearningPath } from '@/types';

export const learningPaths: LearningPath[] = [
  {
    id: 'path1',
    title: { 
      pt: 'Desenvolvimento Físico, Cognitivo, Social e Afetivo de crianças e adolescentes com deficiência', 
      en: 'Physical, Cognitive, Social, and Affective Development of children and adolescents with disabilities' 
    },
    description: {
      pt: 'Explore as nuances do desenvolvimento infantil e adolescente na presença de deficiências, abordando aspectos físicos, cognitivos, sociais e afetivos.',
      en: 'Explore the nuances of child and adolescent development in the presence of disabilities, addressing physical, cognitive, social, and affective aspects.'
    },
    icon: 'Baby', // Lucide icon
    lessons: [
      { id: 'l1-1', title: { pt: 'Introdução ao Desenvolvimento Infantil com Deficiência', en: 'Introduction to Child Development with Disabilities' }, content: { pt: 'Conteúdo da lição 1.1...', en: 'Lesson 1.1 content...' } },
      { id: 'l1-2', title: { pt: 'Marcos do Desenvolvimento Físico', en: 'PhysicalDevelopment Milestones' }, content: { pt: 'Conteúdo da lição 1.2...', en: 'Lesson 1.2 content...' } },
    ],
  },
  {
    id: 'path2',
    title: { 
      pt: 'Desenvolvimento Físico, Cognitivo, Social e Afetivo de adultos e idosos com deficiência', 
      en: 'Physical, Cognitive, Social, and Affective Development of adults and elderly with disabilities' 
    },
    description: {
      pt: 'Compreenda as trajetórias de desenvolvimento de adultos e idosos com deficiência, focando em suas necessidades e potenciais.',
      en: 'Understand the developmental trajectories of adults and elderly individuals with disabilities, focusing on their needs and potentials.'
    },
    icon: 'Users',
    lessons: [
      { id: 'l2-1', title: { pt: 'Vida Adulta e Deficiência', en: 'Adulthood and Disability' }, content: { pt: 'Conteúdo da lição 2.1...', en: 'Lesson 2.1 content...' } },
      { id: 'l2-2', title: { pt: 'Envelhecimento e Deficiência', en: 'Aging and Disability' }, content: { pt: 'Conteúdo da lição 2.2...', en: 'Lesson 2.2 content...' } },
    ],
  },
  {
    id: 'path3',
    title: { 
      pt: 'Modelos de intervenção para o favorecimento do desenvolvimento de pessoas com deficiência', 
      en: 'Intervention models to promote the development of people with disabilities' 
    },
    description: {
      pt: 'Conheça diferentes modelos de intervenção e como eles podem ser aplicados para apoiar o desenvolvimento de pessoas com deficiência.',
      en: 'Learn about different intervention models and how they can be applied to support the development of people with disabilities.'
    },
    icon: 'Puzzle',
    lessons: [
      { id: 'l3-1', title: { pt: 'Intervenções Precoces', en: 'Early Interventions' }, content: { pt: 'Conteúdo da lição 3.1...', en: 'Lesson 3.1 content...' } },
    ],
  },
  {
    id: 'path4',
    title: { 
      pt: 'Principais abordagens teóricas relativas ao desenvolvimento da pessoa com deficiência', 
      en: 'Main theoretical approaches to the development of people with disabilities' 
    },
    description: {
      pt: 'Aprofunde-se nas teorias que fundamentam a compreensão do desenvolvimento da pessoa com deficiência.',
      en: 'Delve into the theories that underpin the understanding of the development of people with disabilities.'
    },
    icon: 'Library',
    lessons: [
      { id: 'l4-1', title: { pt: 'Modelo Social da Deficiência', en: 'Social Model of Disability' }, content: { pt: 'Conteúdo da lição 4.1...', en: 'Lesson 4.1 content...' } },
    ],
  },
  {
    id: 'path5',
    title: { 
      pt: 'Contribuições da neuropsicologia para a compreensão dos fenômenos desenvolvimentais da Pessoa com Deficiência', 
      en: 'Contributions of neuropsychology to understanding developmental phenomena in People with Disabilities' 
    },
    description: {
      pt: 'Entenda como a neuropsicologia contribui para desvendar os processos de desenvolvimento em pessoas com deficiência.',
      en: 'Understand how neuropsychology contributes to unraveling developmental processes in people with disabilities.'
    },
    icon: 'Brain',
    lessons: [
      { id: 'l5-1', title: { pt: 'Neuropsicologia e Aprendizagem', en: 'Neuropsychology and Learning' }, content: { pt: 'Conteúdo da lição 5.1...', en: 'Lesson 5.1 content...' } },
    ],
  },
  {
    id: 'path6',
    title: { 
      pt: 'Fundamentos da Avaliação Psicológica e do Psicodiagnóstico da pessoa com deficiência', 
      en: 'Fundamentals of Psychological Assessment and Psychodiagnostics of people with disabilities' 
    },
    description: {
      pt: 'Aprenda os princípios da avaliação psicológica e do psicodiagnóstico aplicados a pessoas com deficiência.',
      en: 'Learn the principles of psychological assessment and psychodiagnostics applied to people with disabilities.'
    },
    icon: 'ClipboardCheck',
    lessons: [
      { id: 'l6-1', title: { pt: 'Métodos de Avaliação', en: 'Assessment Methods' }, content: { pt: 'Conteúdo da lição 6.1...', en: 'Lesson 6.1 content...' } },
    ],
  },
  {
    id: 'path7',
    title: { 
      pt: 'Tópicos de investigação, métodos de coleta e análise de dados e considerações éticas na pesquisa sobre a pessoa com deficiência', 
      en: 'Research topics, data collection and analysis methods, and ethical considerations in research on people with disabilities' 
    },
    description: {
      pt: 'Descubra como conduzir pesquisas éticas e metodologicamente sólidas na área da deficiência.',
      en: 'Discover how to conduct ethical and methodologically sound research in the field of disability.'
    },
    icon: 'FileSearch',
    lessons: [
      { id: 'l7-1', title: { pt: 'Ética em Pesquisa', en: 'Research Ethics' }, content: { pt: 'Conteúdo da lição 7.1...', en: 'Lesson 7.1 content...' } },
    ],
  },
  {
    id: 'path8',
    title: { 
      pt: 'Implicações éticas da avaliação e intervenção com pessoas com deficiência', 
      en: 'Ethical implications of assessment and intervention with people with disabilities' 
    },
    description: {
      pt: 'Reflita sobre as implicações éticas envolvidas na avaliação e intervenção junto a pessoas com deficiência.',
      en: 'Reflect on the ethical implications involved in assessment and intervention with people with disabilities.'
    },
    icon: 'Scale',
    lessons: [
      { id: 'l8-1', title: { pt: 'Consentimento Informado', en: 'Informed Consent' }, content: { pt: 'Conteúdo da lição 8.1...', en: 'Lesson 8.1 content...' } },
    ],
  },
  {
    id: 'path9',
    title: { 
      pt: 'Políticas e Processos de inclusão da pessoa com deficiência nos contextos educacionais, laborais e sociais', 
      en: 'Policies and Processes for inclusion of people with disabilities in educational, labor, and social contexts' 
    },
    description: {
      pt: 'Analise as políticas e processos que promovem a inclusão de pessoas com deficiência em diversas esferas da sociedade.',
      en: 'Analyze the policies and processes that promote the inclusion of people with disabilities in various spheres of society.'
    },
    icon: 'Landmark',
    lessons: [
      { id: 'l9-1', title: { pt: 'Inclusão Educacional', en: 'Educational Inclusion' }, content: { pt: 'Conteúdo da lição 9.1...', en: 'Lesson 9.1 content...' } },
    ],
  },
  {
    id: 'path10',
    title: { 
      pt: 'Debates contemporâneos sobre processos de inclusão: desenho universal, neurodivergências, tecnologias assistivas e deficiência oculta', 
      en: 'Contemporary debates on inclusion processes: universal design, neurodivergencies, assistive technologies, and hidden disabilities' 
    },
    description: {
      pt: 'Participe dos debates atuais sobre inclusão, abordando temas como desenho universal, neurodivergências e tecnologias assistivas.',
      en: 'Engage in current debates on inclusion, addressing topics such as universal design, neurodivergencies, and assistive technologies.'
    },
    icon: 'Accessibility',
    lessons: [
      { id: 'l10-1', title: { pt: 'Desenho Universal para Aprendizagem', en: 'Universal Design for Learning' }, content: { pt: 'Conteúdo da lição 10.1...', en: 'Lesson 10.1 content...' } },
    ],
  },
  {
    id: 'path11',
    title: { 
      pt: 'Desafios e avanços no acesso, permanência e participação de pessoas com deficiência nas instituições de ensino superior', 
      en: 'Challenges and advances in access, permanence, and participation of people with disabilities in higher education institutions' 
    },
    description: {
      pt: 'Examine os desafios e progressos relacionados à inclusão de pessoas com deficiência no ensino superior.',
      en: 'Examine the challenges and progress related to the inclusion of people with disabilities in higher education.'
    },
    icon: 'GraduationCap',
    lessons: [
      { id: 'l11-1', title: { pt: 'Acesso ao Ensino Superior', en: 'Access to Higher Education' }, content: { pt: 'Conteúdo da lição 11.1...', en: 'Lesson 11.1 content...' } },
    ],
  },
  {
    id: 'path12',
    title: { 
      pt: 'Envelhecimento humano geral, funcionalidade, autonomia e qualidade de vida de pessoas idosas e combate ao etarismo', 
      en: 'General human aging, functionality, autonomy, and quality of life of elderly people and combating ageism' 
    },
    description: {
      pt: 'Compreenda o processo de envelhecimento, a importância da funcionalidade e autonomia para idosos, e como combater o etarismo.',
      en: 'Understand the aging process, the importance of functionality and autonomy for the elderly, and how to combat ageism.'
    },
    icon: 'PersonStanding',
    lessons: [
      { id: 'l12-1', title: { pt: 'Aspectos do Envelhecimento', en: 'Aspects of Aging' }, content: { pt: 'Conteúdo da lição 12.1...', en: 'Lesson 12.1 content...' } },
    ],
  },
];
