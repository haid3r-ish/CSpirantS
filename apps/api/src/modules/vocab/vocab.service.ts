import type { VocabLookupResult } from '@repo/types';
import { z } from 'zod';

interface VocabProvider {
  name: string;
  lookup: (word: string) => Promise<VocabLookupResult | null>;
}

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

function adaptEnglishDictApi(raw: z.infer<typeof englishDictSchema>): VocabLookupResult {
  return {
    word: raw.word,
    forms: raw.forms ?? [],
    partsOfSpeech: raw.partsOfSpeech?.map((pos) => ({
      partOfSpeech: pos.partOfSpeech,
      definitions: (pos.senses || pos.definitions || []).map((d) => ({
        definition: d.definition,
        example: d.example,
      })),
    })) ?? [],
    synonyms: raw.synonyms ?? [],
    antonyms: raw.antonyms ?? [],
  };
}

const englishDictProvider: VocabProvider = {
  name: 'englishdictionaryapi.com',
  lookup: async (word: string) => {
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
    return adaptEnglishDictApi(parsed);
  }
};

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

function adaptFreeDictionaryApi(raw: z.infer<typeof freeDictResponseSchema>): VocabLookupResult {
  const entry = raw[0];
  
  const allSynonyms = new Set<string>();
  const allAntonyms = new Set<string>();
  
  entry.meanings.forEach(meaning => {
    meaning.synonyms?.forEach(s => allSynonyms.add(s));
    meaning.antonyms?.forEach(a => allAntonyms.add(a));
  });

  return {
    word: entry.word,
    forms: [],
    partsOfSpeech: entry.meanings.map(m => ({
      partOfSpeech: m.partOfSpeech,
      definitions: m.definitions.map(d => ({
        definition: d.definition,
        example: d.example,
      }))
    })),
    synonyms: Array.from(allSynonyms).slice(0, 10),
    antonyms: Array.from(allAntonyms).slice(0, 10),
  };
}

const freeDictionaryProvider: VocabProvider = {
  name: 'api.dictionaryapi.dev',
  lookup: async (word: string) => {
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
    return adaptFreeDictionaryApi(parsed);
  }
};

const PROVIDERS: VocabProvider[] = [
  englishDictProvider,
  freeDictionaryProvider,
];

export async function lookupWord(word: string): Promise<VocabLookupResult | null> {
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
