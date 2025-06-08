import { config } from 'dotenv';
config();

import '@/ai/flows/query-pdf-library.ts';
import '@/ai/flows/summarize-lesson.ts';
import '@/ai/flows/generate-exercise-questions.ts';