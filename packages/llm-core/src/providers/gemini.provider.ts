import { GoogleGenAI } from '@google/genai';
import type { LlmConfig } from '@repo/types';
import { BaseLlmProvider } from './base.provider.js';

export class GeminiProvider extends BaseLlmProvider {
  readonly providerType = 'gemini' as const;
  private readonly ai: GoogleGenAI;
  private readonly modelName: string;

  constructor(config: LlmConfig) {
    super(config);
    this.ai = new GoogleGenAI({ apiKey: config.apiKey });
    this.modelName = config.model ?? 'gemini-3.6-flash';
  }

  protected async callApi(
    userPayload: string,
    systemPrompt: string
  ): Promise<{ text: string; usage?: { prompt: number; completion: number } }> {
    const response = await this.ai.models.generateContent({
      model: this.modelName,
      contents: userPayload,
      config: { systemInstruction: systemPrompt },
    });

    return {
      text: response.text ?? '',
      usage: response.usageMetadata
        ? {
            prompt: response.usageMetadata.promptTokenCount ?? 0,
            completion: response.usageMetadata.candidatesTokenCount ?? 0,
          }
        : undefined,
    };
  }
}
