import type { VocabProvider, NormalizedVocabEntry } from '@repo/types';
import { z } from 'zod';

const englishDictSchema = z.object({
  word: z.string(),
  forms: z.array(z.string()).optional(),
  partsOfSpeech: z.array(z.object({
    partOfSpeech: z.string(),
    definitions: z.array(z.object({ definition: z.string(), example: z.string().optional() })).optional(),
    senses: z.array(z.object({ definition: z.string(), example: z.string().optional() })).optional(),
  })).optional(),
  synonyms: z.array(z.string()).optional(),
  antonyms: z.array(z.string()).optional(),
}).passthrough();

export class DictionaryApiProvider implements VocabProvider {
  name = 'englishdictionaryapi.com';

  private adapt(raw: z.infer<typeof englishDictSchema>): NormalizedVocabEntry {
    return {
      word: raw.word,
      phonetic: undefined, // this API doesn't seem to provide a flat phonetic string by default
      meanings: raw.partsOfSpeech?.map((pos) => ({
        partOfSpeech: pos.partOfSpeech,
        definitions: (pos.senses || pos.definitions || []).map((d) => d.definition),
      })) ?? [],
    };
  }

  async lookup(word: string): Promise<NormalizedVocabEntry | null> {
    const res = await fetch(`https://englishdictionaryapi.com/api/v1/words/${encodeURIComponent(word)}`);
    if (res.status === 429 || res.status >= 500) {
      throw new Error(`rate-limit-or-server-error: ${res.status}`);
    }
    if (res.status === 404) {
      return null;
    }
    if (!res.ok) {
        throw new Error(`unexpected-error: ${res.status}`);
    }
    const rawData = await res.json();
    const parsed = englishDictSchema.parse(rawData);
    return this.adapt(parsed);
  }
}

const freeDictEntrySchema = z.object({
  word: z.string(),
  phonetics: z.array(z.object({ text: z.string().optional() })).optional(),
  meanings: z.array(z.object({
    partOfSpeech: z.string(),
    definitions: z.array(z.object({
      definition: z.string(),
      example: z.string().optional(),
      synonyms: z.array(z.string()).optional(),
      antonyms: z.array(z.string()).optional(),
    })),
    synonyms: z.array(z.string()).optional(),
    antonyms: z.array(z.string()).optional(),
  })),
});
const freeDictResponseSchema = z.array(freeDictEntrySchema).min(1);

export class FreeDictionaryApiProvider implements VocabProvider {
  name = 'api.dictionaryapi.dev';

  private adapt(raw: z.infer<typeof freeDictResponseSchema>): NormalizedVocabEntry {
    const entry = raw[0];
    return {
      word: entry.word,
      phonetic: entry.phonetics?.find(p => p.text)?.text,
      meanings: entry.meanings.map(m => ({
        partOfSpeech: m.partOfSpeech,
        definitions: m.definitions.map(d => d.definition)
      })),
    };
  }

  async lookup(word: string): Promise<NormalizedVocabEntry | null> {
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`);
    if (res.status === 429 || res.status >= 500) {
      throw new Error(`rate-limit-or-server-error: ${res.status}`);
    }
    if (res.status === 404) {
      return null;
    }
    if (!res.ok) {
        throw new Error(`unexpected-error: ${res.status}`);
    }
    const rawData = await res.json();
    const parsed = freeDictResponseSchema.parse(rawData);
    return this.adapt(parsed);
  }
}

const PROVIDERS: VocabProvider[] = [
  new DictionaryApiProvider(),
  new FreeDictionaryApiProvider(),
];

export async function lookupWord(word: string): Promise<NormalizedVocabEntry | null> {
  const normalized = word.toLowerCase().trim();
  for (const provider of PROVIDERS) {
    try {
      const result = await provider.lookup(normalized);
      return result; // null means 404 — word not found, stop chain
    } catch (error: unknown) {
      // Log and continue to next provider only on rate-limit/server errors
      const msg = error instanceof Error ? error.message : String(error);
      console.warn(`[VocabProxy] Provider "${provider.name}" failed: ${msg}. Trying next...`);
      continue;
    }
  }
  // All providers exhausted
  console.error('[VocabProxy] All providers exhausted. Returning null.');
  return null;
}
