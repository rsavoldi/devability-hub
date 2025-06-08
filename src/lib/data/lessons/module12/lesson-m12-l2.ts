
import type { Lesson } from '@/lib/types';

export const lessonM12L2: Lesson = {
  id: 'm12-l2',
  title: 'Lição 12.2: Envelhecimento, Funcionalidade e Autonomia',
  type: 'interactive',
  content: `O envelhecimento envolve alterações biológicas, psicológicas e sociais que afetam funcionalidade e autonomia. A **CIF (OMS, 2001)** define funcionalidade como um termo abrangente (funções corporais, atividades, participação).

**Alterações Biológicas (Neri, 2013):**
*   **Musculoesquelético:** Sarcopenia (perda de massa/força muscular), osteoporose, afetando mobilidade e equilíbrio.
*   **Nervoso:** Redução de neurônios/sinapses, afetando cognição, sentidos, motricidade.
*   **Sensoriais:** Presbiopia (visão), presbiacusia (audição), diminuição de paladar/olfato/tato.
*   Outros sistemas (cardiovascular, respiratório, digestório, geniturinário, imunológico) também sofrem alterações, mas em ritmos <!-- INTERACTIVE_WORD_CHOICE: OPTIONS=[*diferentes entre indivíduos;iguais para todos;totalmente previsíveis] -->.

**Alterações Psicológicas (Neri, 2013):**
*   Cognitivas: Algumas funções (velocidade de processamento, memória de trabalho) tendem a declinar; outras (conhecimento semântico, sabedoria) podem se manter ou melhorar.
*   Emocionais: Maior seletividade socioemocional, melhor regulação emocional, mas vulnerabilidade a depressão/ansiedade em contextos de perdas.

**Alterações Sociais:** Mudanças em papéis (aposentadoria, viuvez), relações e atividades (Camarano, 2014).

A **funcionalidade** resulta da interação entre condições de saúde e fatores contextuais (ambientais e pessoais). A OMS (2015) distingue **capacidade intrínseca** (capacidades físicas/mentais do indivíduo) de **capacidade funcional** (atributos que permitem ser e fazer o que se valoriza, resultante da interação capacidade intrínseca x ambiente).

**Autonomia** é a capacidade de decisão e comando sobre as próprias ações (Moraes, 2012). É possível ter limitações na capacidade intrínseca, mas manter autonomia com adaptações e suportes.

Avaliação da funcionalidade considera (Katz et al., 1963; Lawton & Brody, 1969):
*   **ABVDs:** Atividades Básicas de Vida Diária (autocuidado).
*   **AIVDs:** Atividades Instrumentais de Vida Diária (vida independente na comunidade).
*   <!-- INTERACTIVE_FILL_IN_BLANK: [AAVDs (Atividades Avançadas de Vida Diária)|APVDs (Atividades Profissionais de Vida Diária)|ASVDs (Atividades Sociais de Vida Diária)] -->: Atividades voluntárias sociais, ocupacionais, recreativas.

**Fragilidade** é uma síndrome de diminuição da reserva e resistência a estressores, aumentando vulnerabilidade (Fried et al., 2001). Critérios: perda de peso, fadiga, diminuição de força/velocidade de marcha, baixo nível de atividade. É potencialmente <!-- INTERACTIVE_WORD_CHOICE: OPTIONS=[*reversível;irreversível;sempre fatal] --> com intervenções.`,
  estimatedTime: '10-15 mins',
  coverImage: 'https://placehold.co/600x300.png',
  aiHint: 'funcionalidade autonomia ABVD AIVD fragilidade',
  references: [
    "OMS. (2001). Classificação Internacional de Funcionalidade, Incapacidade e Saúde.",
    "Neri, A. L. (2013). Op. cit.",
    "Camarano, A. A. (2014). Op. cit.",
    "OMS. (2015). Op. cit.",
    "Moraes, E. N. (2012). Atenção à saúde do idoso: aspectos conceituais.",
    "Katz, S., et al. (1963). Studies of illness in the aged: the index of ADL.",
    "Lawton, M. P., & Brody, E. M. (1969). Assessment of older people.",
    "Fried, L. P., et al. (2001). Frailty in older adults: evidence for a phenotype."
  ]
};
