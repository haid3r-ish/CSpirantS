import type { ILlmProvider, LlmConfig } from '@repo/types';
import { GeminiProvider } from './gemini.provider.js';
import { ManualProvider } from './manual.provider.js';

export function createLlmProvider(config: LlmConfig): ILlmProvider {
  if (config.mode === 'manual') {
    return new ManualProvider(config);
  }
  switch (config.provider) {
    case 'gemini':
      return new GeminiProvider(config);
    default:
      throw new Error(`Unknown LLM provider: ${config.provider}`);
  }
}
