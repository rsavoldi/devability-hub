'use server';

/**
 * @fileOverview FAQ Chatbot flow for answering user questions based on a predefined FAQ.
 *
 * - faqChatbot - A function that handles the chatbot interaction.
 * - FAQChatbotInput - The input type for the faqChatbot function.
 * - FAQChatbotOutput - The return type for the faqChatbot function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FAQChatbotInputSchema = z.object({
  question: z.string().describe('The user question about disability and inclusion.'),
});
export type FAQChatbotInput = z.infer<typeof FAQChatbotInputSchema>;

const FAQChatbotOutputSchema = z.object({
  answer: z.string().describe('The chatbot answer to the user question.'),
});
export type FAQChatbotOutput = z.infer<typeof FAQChatbotOutputSchema>;

export async function faqChatbot(input: FAQChatbotInput): Promise<FAQChatbotOutput> {
  return faqChatbotFlow(input);
}

const faqPrompt = ai.definePrompt({
  name: 'faqPrompt',
  input: {schema: FAQChatbotInputSchema},
  output: {schema: FAQChatbotOutputSchema},
  prompt: `You are a chatbot designed to answer questions about disability and inclusion based on a pre-defined FAQ.

  FAQ:
  Q: What is disability?
A: Disability is any condition of the body or mind (impairment) that makes it more difficult for the person with the condition to do certain activities (activity limitation) and interact with the world around them (participation restrictions).

Q: What is inclusion?
A: Inclusion is the act of creating environments in which any individual or group can be and feel welcomed, respected, supported, and valued to fully participate.

Q: What are some models of disability?
A: Some models of disability include the medical model, the social model, and the biopsychosocial model.

Q: What are some challenges and opportunities of creating digital resources for persons with disabilities?
A: Challenges include accessibility considerations, and opportunities include creating more equitable access to resources.

Q: What are some considerations for conducting ethical research with people with disabilities?
A: Some considerations include obtaining informed consent, ensuring confidentiality, and avoiding exploitation.

  Question: {{{question}}}
  Answer:`, // The response should be a direct answer to the question based on the provided FAQ.
});

const faqChatbotFlow = ai.defineFlow(
  {
    name: 'faqChatbotFlow',
    inputSchema: FAQChatbotInputSchema,
    outputSchema: FAQChatbotOutputSchema,
  },
  async input => {
    const {output} = await faqPrompt(input);
    return output!;
  }
);
