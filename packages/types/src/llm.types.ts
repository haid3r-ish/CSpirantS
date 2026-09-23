export type LlmMode = 'api' | 'manual';
export type LlmProviderType = 'gemini' | 'grok';

export interface LlmConfig {
  provider: LlmProviderType;
  model?: string;
  apiKey: string;
  mode: LlmMode;
  timeoutMs?: number; // default 30000
}

export interface LlmEvaluationItem {
  hash: string;
  title: string;
  description?: string;
}

export interface LlmTokenUsage {
  prompt: number;
  completion: number;
}

export interface LlmEvaluationResult {
  batchId: string;
  mode: LlmMode;
  approvedHashes: string[];
  rejectedHashes: string[];
  rawResponse?: string;
  promptCsv?: string; // Set when mode='manual', contains the full prompt to copy-paste
  tokenUsage?: LlmTokenUsage;
  estimatedCostUsd?: number;
}

export interface ManualPromptOutput {
  batchId: string;
  promptCsv: string; // The full pipe-delimited prompt ready to paste into any LLM
  instructions: string;
  itemCount: number;
}

export interface ILlmProvider {
  readonly providerType: LlmProviderType | 'manual';
  evaluate(items: LlmEvaluationItem[], batchId: string): Promise<LlmEvaluationResult>;
  generateManualPrompt(items: LlmEvaluationItem[], batchId: string): ManualPromptOutput;
}
