import type { DictionaryTerm } from '@/types';

export const dictionaryTerms: DictionaryTerm[] = [
  {
    id: 'disability',
    term: { pt: 'Deficiência', en: 'Disability' },
    definition: { 
      pt: 'Qualquer condição do corpo ou da mente (deficiência) que torna mais difícil para a pessoa com a condição realizar certas atividades (limitação de atividade) e interagir com o mundo ao seu redor (restrições de participação).', 
      en: 'Any condition of the body or mind (impairment) that makes it more difficult for the person with the condition to do certain activities (activity limitation) and interact with the world around them (participation restrictions).' 
    },
  },
  {
    id: 'inclusion',
    term: { pt: 'Inclusão', en: 'Inclusion' },
    definition: { 
      pt: 'O ato de criar ambientes nos quais qualquer indivíduo ou grupo pode ser e se sentir acolhido, respeitado, apoiado e valorizado para participar plenamente.', 
      en: 'The act of creating environments in which any individual or group can be and feel welcomed, respected, supported, and valued to fully participate.' 
    },
  },
  {
    id: 'accessibility',
    term: { pt: 'Acessibilidade', en: 'Accessibility' },
    definition: {
      pt: 'A qualidade de ser acessível, ou seja, de fácil alcance, uso ou compreensão, especialmente para pessoas com deficiência.',
      en: 'The quality of being accessible, or easily reached, used, or understood, especially by people with disabilities.'
    }
  },
  {
    id: 'universal-design',
    term: { pt: 'Desenho Universal', en: 'Universal Design' },
    definition: {
      pt: 'O design de produtos e ambientes para serem utilizáveis por todas as pessoas, na maior extensão possível, sem a necessidade de adaptação ou design especializado.',
      en: 'The design of products and environments to be usable by all people, to the greatest extent possible, without the need for adaptation or specialized design.'
    }
  }
];
