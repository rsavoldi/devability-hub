'use server';

/**
 * @fileOverview Resume o conteúdo de uma lição fornecida como texto.
 *
 * - summarizeLesson - Função que recebe o conteúdo da lição e retorna um resumo.
 * - SummarizeLessonInput - Tipo de entrada para a função summarizeLesson.
 * - SummarizeLessonOutput - Tipo de retorno para a função summarizeLesson.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeLessonInputSchema = z.object({
  lessonContent: z
    .string()
    .describe('Conteúdo da lição a ser resumida.'),
});
export type SummarizeLessonInput = z.infer<typeof SummarizeLessonInputSchema>;

const SummarizeLessonOutputSchema = z.object({
  summary: z
    .string()
    .describe('Resumo conciso do conteúdo da lição, em português brasileiro.'),
});
export type SummarizeLessonOutput = z.infer<typeof SummarizeLessonOutputSchema>;

export async function summarizeLesson(input: SummarizeLessonInput): Promise<SummarizeLessonOutput> {
  return summarizeLessonFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeLessonPrompt',
  input: {schema: SummarizeLessonInputSchema},
  output: {schema: SummarizeLessonOutputSchema},
  prompt: `Resuma o conteúdo da lição abaixo. Foque nos conceitos principais e apresente sistematizado. **O resumo deve estar em português brasileiro.**

Conteúdo da Lição:
{{{lessonContent}}}`,
});

const summarizeLessonFlow = ai.defineFlow(
  {
    name: 'summarizeLessonFlow',
    inputSchema: SummarizeLessonInputSchema,
    outputSchema: SummarizeLessonOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);