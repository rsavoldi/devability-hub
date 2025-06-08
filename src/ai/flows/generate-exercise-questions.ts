// src/ai/flows/generate-exercise-questions.ts
'use server';

/**
 * @fileOverview A flow that generates exercise questions based on provided learning material.
 *
 * - generateExerciseQuestions - A function that generates exercise questions.
 * - GenerateExerciseQuestionsInput - The input type for the generateExerciseQuestions function.
 * - GenerateExerciseQuestionsOutput - The return type for the generateExerciseQuestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateExerciseQuestionsInputSchema = z.object({
  learningMaterial: z
    .string()
    .describe('The learning material to generate exercise questions from.'),
  numberOfQuestions: z
    .number()
    .default(3)
    .describe('The number of exercise questions to generate.'),
});

export type GenerateExerciseQuestionsInput = z.infer<
  typeof GenerateExerciseQuestionsInputSchema
>;

const GenerateExerciseQuestionsOutputSchema = z.object({
  questions: z
    .array(z.string())
    .describe('An array of exercise questions based on the learning material.'),
});

export type GenerateExerciseQuestionsOutput = z.infer<
  typeof GenerateExerciseQuestionsOutputSchema
>;

export async function generateExerciseQuestions(
  input: GenerateExerciseQuestionsInput
): Promise<GenerateExerciseQuestionsOutput> {
  return generateExerciseQuestionsFlow(input);
}

const generateExerciseQuestionsPrompt = ai.definePrompt({
  name: 'generateExerciseQuestionsPrompt',
  input: {schema: GenerateExerciseQuestionsInputSchema},
  output: {schema: GenerateExerciseQuestionsOutputSchema},
  prompt: `You are an expert at creating exercise questions based on learning material.

  Generate {{numberOfQuestions}} exercise questions based on the following learning material:

  {{learningMaterial}}

  The questions should be clear, concise, and test the user's understanding of the material.

  Format the questions as a JSON array of strings.
  `,
});

const generateExerciseQuestionsFlow = ai.defineFlow(
  {
    name: 'generateExerciseQuestionsFlow',
    inputSchema: GenerateExerciseQuestionsInputSchema,
    outputSchema: GenerateExerciseQuestionsOutputSchema,
  },
  async input => {
    const {output} = await generateExerciseQuestionsPrompt(input);
    return output!;
  }
);
