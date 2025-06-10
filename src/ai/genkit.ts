
import { config } from 'dotenv';
config();

import {genkit, type Genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
// import { devLogger } from 'genkit/dev_logger'; // Removed problematic import

const plugins = []; // Initialize with an empty array

// Conditionally attempt to add the Google AI plugin
if (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY) {
  try {
    plugins.push(googleAI()); // Let googleAI() find the key from env
    console.info('Google AI plugin configured for Genkit.');
  } catch (e) {
    console.error('Error attempting to initialize Google AI plugin, it will likely not be used.', e);
  }
} else {
  console.warn(
    'GEMINI_API_KEY or GOOGLE_API_KEY not found in environment. Google AI plugin will not be initialized. ' +
    'AI features requiring it will not work. Please set the API key in your .env file or environment variables.'
  );
}

export const ai: Genkit = genkit({
  plugins: plugins,
  enableTracing: process.env.NODE_ENV === 'development',
});

// Log final plugin status for clarity during development
const activePluginNames = ai.registry.getPlugins().map(p => p.name).join(', ');
console.info(`Genkit initialized with plugins: [${activePluginNames || 'none'}]`);

if (!activePluginNames.includes('google-ai')) {
    console.warn('Google AI plugin is NOT active. AI features requiring Gemini models will be unavailable.');
}
