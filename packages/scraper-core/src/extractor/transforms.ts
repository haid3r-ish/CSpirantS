import type { TransformRule } from '@repo/types';

export function applyTransforms(
  value: string,
  transforms: TransformRule[] = [],
  pageUrl: string
): string {
  let result = value;

  for (const transform of transforms) {
    switch (transform.type) {
      case 'trim':
        result = result.trim();
        break;

      case 'clean-whitespace':
        result = result
          .replace(/[ \t]+/g, ' ')
          .replace(/\n{3,}/g, '\n\n')
          .trim();
        break;

      case 'strip-tags':
        result = result.replace(/<[^>]*>?/gm, '');
        break;

      case 'parse-date-iso':
        try {
          result = new Date(result).toISOString();
        } catch {
          // Keep original if parsing fails
        }
        break;

      case 'resolve-url':
        try {
          result = new URL(result, pageUrl).toString();
        } catch {
          // Keep original if resolution fails
        }
        break;

      case 'regex-extract': {
        const pattern = transform.params?.pattern;
        const matchIndex = transform.params?.matchIndex ?? 1;
        if (pattern) {
          try {
            const match = result.match(new RegExp(pattern));
            if (match && match[matchIndex] !== undefined) {
              result = match[matchIndex];
            }
          } catch {
            // Keep original if regex fails
          }
        }
        break;
      }
    }
  }

  return result;
}
