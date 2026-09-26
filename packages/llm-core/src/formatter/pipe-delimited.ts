import type { LlmEvaluationItem, ManualPromptOutput, LlmDuplicateGroup } from '@repo/types';
import { CSS_PMS_SYSTEM_PROMPT } from '../prompts/css-pms-filter.js';

/** Replace pipe characters in user text to prevent column corruption */
function sanitize(text: string): string {
  return text.replace(/\|/g, '-').replace(/\n/g, ' ').trim();
}

/**
 * Format evaluation items into pipe-delimited payload.
 * Format: hash|title|description|sourceGroup|publishedAt (one per line)
 * URLs are EXCLUDED — zero LLM value, massive token waste.
 */
export function formatBatchPayload(items: LlmEvaluationItem[], defaultSourceGroup: string = 'default'): string {
  return items
    .map((item) => {
      const title = sanitize(item.title);
      const desc = sanitize(item.description ?? '');
      // Format publishedAt as HH:mm if available, else --:--
      let pubTime = '--:--';
      if (item.publishedAt) {
        const d = new Date(item.publishedAt);
        if (!isNaN(d.getTime())) {
          pubTime = `${d.getUTCHours().toString().padStart(2, '0')}:${d.getUTCMinutes().toString().padStart(2, '0')}`;
        }
      }
      return `${item.hash}|${title}|${desc}|${defaultSourceGroup}|${pubTime}`;
    })
    .join('\n');
}

/**
 * Parse LLM response back into approved hash array and duplicate groups.
 * Handles two-line CSV response.
 */
export function parseEvaluationResponse(raw: string): { approvedHashes: string[]; duplicateGroups: LlmDuplicateGroup[] } {
  try {
    if (!raw) return { approvedHashes: [], duplicateGroups: [] };

    const lines = raw.trim().replace(/```[a-z]*\n?/g, '').replace(/```/g, '').split('\n').map(l => l.trim());
    
    // Line 1: Approved hashes
    const line1 = lines[0] || '';
    const approvedHashes = line1.toUpperCase() === 'NONE' 
      ? [] 
      : line1.split(',').map(h => h.trim()).filter(h => /^[a-f0-9]{16}$/i.test(h));
      
    // Line 2: Duplicate groups
    const duplicateGroups: LlmDuplicateGroup[] = [];
    if (lines.length > 1 && lines[1] && lines[1].toUpperCase() !== 'NONE') {
      const groups = lines[1].split('|').map(g => g.trim()).filter(Boolean);
      for (const group of groups) {
        const parts = group.split(':');
        if (parts.length === 2) {
          const canonical = parts[0].trim();
          const duplicates = parts[1].split(',').map(h => h.trim()).filter(Boolean);
          if (canonical && duplicates.length > 0) {
            duplicateGroups.push({ canonical, duplicates });
          }
        }
      }
    }
    
    return { approvedHashes, duplicateGroups };
  } catch (error) {
    console.error('[Parser] Failed to parse evaluation response:', error);
    return { approvedHashes: [], duplicateGroups: [] };
  }
}

/**
 * Generate the full manual prompt for admin copy-paste.
 */
export function generateManualPromptOutput(
  batchId: string,
  items: LlmEvaluationItem[]
): ManualPromptOutput {
  const payload = formatBatchPayload(items);
  const promptCsv = `${CSS_PMS_SYSTEM_PROMPT}\n\n---\n\n${payload}`;

  const instructions = [
    '1. Copy the entire prompt below (including the system instructions above the --- separator).',
    '2. Paste it into any LLM (ChatGPT, Claude, Gemini, etc.).',
    '3. Copy the two-line CSV response from the LLM.',
    `4. Go to Admin > Batch Management in the app, find Batch ID: ${batchId}`,
    '5. Paste the output into the "Response" field and click "Resume Pipeline".',
    `6. Or call: POST /api/pipeline/batches/${batchId}/resolve with body { "rawResponse": "hash1\\nhash1:hash2" }`,
  ].join('\n');

  return {
    batchId,
    promptCsv,
    instructions,
    itemCount: items.length,
  };
}
