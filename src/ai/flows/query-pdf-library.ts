'use server';

/**
 * @fileOverview This file defines a Genkit flow for querying a PDF library using RAG (Retrieval Augmented Generation).
 *
 * - queryPdfLibrary - A function that handles the querying process.
 * - QueryPdfLibraryInput - The input type for the queryPdfLibrary function.
 * - QueryPdfLibraryOutput - The return type for the queryPdfLibrary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const QueryPdfLibraryInputSchema = z.object({
  query: z.string().describe('The question to ask the PDF library.'),
});
export type QueryPdfLibraryInput = z.infer<typeof QueryPdfLibraryInputSchema>;

const QueryPdfLibraryOutputSchema = z.object({
  answer: z.string().describe('The answer to the question based on the PDF library.'),
  sources: z.array(z.string()).describe('The sources used to answer the question.'),
});
export type QueryPdfLibraryOutput = z.infer<typeof QueryPdfLibraryOutputSchema>;

export async function queryPdfLibrary(input: QueryPdfLibraryInput): Promise<QueryPdfLibraryOutput> {
  return queryPdfLibraryFlow(input);
}

const getPdfInformation = ai.defineTool(
  {
    name: 'getPdfInformation',
    description: 'Retrieves information from the PDF library to answer user questions.',
    inputSchema: z.object({
      query: z.string().describe('The query to use when searching the PDF library.'),
    }),
    outputSchema: z.object({
      answer: z.string().describe('The answer from the PDF library.'),
      sources: z.array(z.string()).describe('The sources used to answer the question.'),
    }),
  },
  async (input) => {
    // TODO: Implement the actual PDF library querying logic here.
    // This is a placeholder implementation.
    return {
      answer: `This is a dummy answer for the query: ${input.query}.  The PDF library is not yet connected.  Check back soon for real answers!`, // Replace with actual answer from PDF library
      sources: ['dummy_pdf_1.pdf', 'dummy_pdf_2.pdf'], // Replace with actual sources from PDF library
    };
  }
);

const prompt = ai.definePrompt({
  name: 'queryPdfLibraryPrompt',
  input: {schema: QueryPdfLibraryInputSchema},
  output: {schema: QueryPdfLibraryOutputSchema},
  tools: [getPdfInformation],
  prompt: `You are a chatbot that answers questions based on a PDF library.

  Use the getPdfInformation tool to retrieve information from the PDF library to answer the user's question.

  Question: {{{query}}}
  `,config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
    ],
  },
});

const queryPdfLibraryFlow = ai.defineFlow(
  {
    name: 'queryPdfLibraryFlow',
    inputSchema: QueryPdfLibraryInputSchema,
    outputSchema: QueryPdfLibraryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
