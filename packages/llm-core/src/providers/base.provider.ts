import type {
  ILlmProvider,
  LlmConfig,
  LlmEvaluationItem,
  LlmEvaluationResult,
  LlmProviderType,
  ManualPromptOutput,
} from '@repo/types';
import { formatBatchPayload, parseEvaluationResponse, generateManualPromptOutput } from '../formatter/pipe-delimited.js';
import { CSS_PMS_SYSTEM_PROMPT } from '../prompts/css-pms-filter.js';

export abstract class BaseLlmProvider implements ILlmProvider {
  abstract readonly providerType: LlmProviderType | 'manual';

  constructor(protected readonly config: LlmConfig) {}

  protected buildSystemPrompt(): string {
    return CSS_PMS_SYSTEM_PROMPT;
  }

  protected formatPayload(items: LlmEvaluationItem[]): string {
    return formatBatchPayload(items);
  }

  protected parseResponse(raw: string) {
    return parseEvaluationResponse(raw);
  }

  /**
   * Abstract: each provider implements their own API call.
   * Returns raw text response and optional token usage.
   */
  protected abstract callApi(
    userPayload: string,
    systemPrompt: string
  ): Promise<{ text: string; usage?: { prompt: number; completion: number } }>;

  generateManualPrompt(items: LlmEvaluationItem[], batchId: string): ManualPromptOutput {
    return generateManualPromptOutput(batchId, items);
  }

  async evaluate(items: LlmEvaluationItem[], batchId: string): Promise<LlmEvaluationResult> {
    const systemPrompt = this.buildSystemPrompt();
    const userPayload = this.formatPayload(items);
    const allHashes = items.map((i) => i.hash);

    try {
      // Apply timeout wrapper
      const timeoutMs = this.config.timeoutMs ?? 30000;
      const apiCallWithTimeout = Promise.race([
        this.callApi(userPayload, systemPrompt),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error(`LLM API timeout after ${timeoutMs}ms`)), timeoutMs)
        ),
      ]);

      const { text, usage } = await apiCallWithTimeout;
      const { approvedHashes, duplicateGroups } = this.parseResponse(text);
      const rejectedHashes = allHashes.filter((h) => !approvedHashes.includes(h));

      return {
        batchId,
        mode: 'api',
        approvedHashes,
        rejectedHashes,
        duplicateGroups,
        rawResponse: text,
        tokenUsage: usage,
        estimatedCostUsd: undefined, // Calculated per-provider if needed
      };
    } catch (error: unknown) {
      // FAIL-SAFE: Any error → automatic switch to manual mode
      console.error(`[LLM] API call failed for batch ${batchId}, switching to manual mode:`, error);
      const manualOutput = this.generateManualPrompt(items, batchId);

      return {
        batchId,
        mode: 'manual',
        approvedHashes: [],
        rejectedHashes: [],
        duplicateGroups: [],
        promptCsv: manualOutput.promptCsv,
        rawResponse: manualOutput.promptCsv,
      };
    }
  }
}
