import type { LlmConfig } from '@repo/types';
import { BaseLlmProvider } from './base.provider.js';

export class ManualProvider extends BaseLlmProvider {
  readonly providerType = 'manual' as const;

  constructor(config: LlmConfig) {
    super(config);
  }

  protected async callApi(_userPayload: string, _systemPrompt: string): Promise<{ text: string }> {
    // ManualProvider never calls an API — it always throws to trigger the base class fallback
    throw new Error('Manual mode: no API call');
  }
}
