
import {genkit, type Genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import { devLogger } from 'genkit/dev_logger'; // For better logging

const plugins = [devLogger]; // devLogger is always good to have

// Conditionally attempt to add the Google AI plugin
if (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY) {
  try {
    plugins.push(googleAI()); // Let googleAI() find the key from env
    devLogger.info('Google AI plugin configured for Genkit.');
  } catch (e) {
    // This catch might not be strictly necessary if googleAI() only throws if no key is found
    // and we're already checking for the key. But it's safer.
    devLogger.error('Error attempting to initialize Google AI plugin, it will likely not be used.', e);
  }
} else {
  devLogger.warn(
    'GEMINI_API_KEY or GOOGLE_API_KEY not found in environment. Google AI plugin will not be initialized. ' +
    'AI features requiring it will not work. Please set the API key in your .env file or environment variables.'
  );
}

export const ai: Genkit = genkit({
  plugins: plugins,
  enableTracing: process.env.NODE_ENV === 'development',
  // The 'model' option is not a top-level configuration for genkit() in v1.x.
  // Models should be specified in ai.generate() calls or within definePrompt configurations.
  // If a default model was intended, it should be handled at the point of use or via a custom wrapper.
});

// Log final plugin status for clarity during development
const activePluginNames = ai.registry.getPlugins().map(p => p.name).join(', ');
devLogger.info(`Genkit initialized with plugins: [${activePluginNames || 'none'}]`);

if (!activePluginNames.includes('google-ai')) {
    devLogger.warn('Google AI plugin is NOT active. AI features requiring Gemini models will be unavailable.');
}
