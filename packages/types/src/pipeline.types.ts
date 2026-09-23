export enum ArticleStatus {
  DISCOVERED = 'DISCOVERED',
  EVALUATING = 'EVALUATING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  EXTRACTING = 'EXTRACTING',
  EXTRACTED = 'EXTRACTED',
  FAILED = 'FAILED',
}

export enum PipelineStatus {
  RUNNING = 'RUNNING',
  AWAITING_MANUAL = 'AWAITING_MANUAL',
  COMPLETED = 'COMPLETED',
  PARTIAL = 'PARTIAL',
  FAILED = 'FAILED',
}

export enum PipelineStage {
  DISCOVER = 'DISCOVER',
  EVALUATE = 'EVALUATE',
  EXTRACT = 'EXTRACT',
  CLEANUP = 'CLEANUP',
}

export interface PipelineRunStats {
  discovered: number;
  approved: number;
  rejected: number;
  extracted: number;
  failed: number;
}

export interface TtlPolicy {
  metadataRetentionDays: number; // Default 30
  contentRetentionDays: number; // Default 7
  rejectedRetentionDays: number; // Default 1
}
