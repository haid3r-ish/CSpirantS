import type { VocabProvider, NormalizedVocabEntry } from '@repo/types';
import { z } from 'zod';

const freeDictSchema = z.object({
  word: z.string(),
  entries: z.array(
    z.object({
      partOfSpeech: z.string(),
      forms: z.array(z.object({ word: z.string() }).passthrough()).optional(),
      senses: z.array(
        z.object({
          definition: z.string(),
          examples: z.array(z.string()).optional(),
          quotes: z.array(z.object({ text: z.string() }).passthrough()).optional(),
          synonyms: z.array(z.string()).optional(),
          antonyms: z.array(z.string()).optional(),
        }).passthrough()
      ).optional(),
      synonyms: z.array(z.string()).optional(),
      antonyms: z.array(z.string()).optional(),
    }).passthrough()
  ).min(1),
}).passthrough();

type FreeDictPayload = z.infer<typeof freeDictSchema>;

const englishDictSchema = z.object({
  word: z.string(),
  entries: z.array(
    z.object({
      partOfSpeech: z.string(),
      forms: z.array(z.object({ word: z.string() }).passthrough()).optional(),
      senses: z.array(
        z.object({
          definition: z.string(),
          examples: z.array(z.string()).optional(),
          quotes: z.array(z.object({ text: z.string() }).passthrough()).optional(),
          synonyms: z.array(z.string()).optional(),
          antonyms: z.array(z.string()).optional(),
        }).passthrough()
      ).optional(),
      synonyms: z.array(z.string()).optional(),
      antonyms: z.array(z.string()).optional(),
    }).passthrough()
  ).min(1),
}).passthrough();

type EnglishDictPayload = z.infer<typeof englishDictSchema>;

export class FreeDictionaryApiProvider implements VocabProvider {
  name = 'freedictionaryapi.com';

  private adaptFreeDictionaryApi(raw: FreeDictPayload): NormalizedVocabEntry {
    const allForms = new Set<string>();
    const allSynonyms = new Set<string>();
    const allAntonyms = new Set<string>();

    const meanings = raw.entries.map((entry) => {
      entry.forms?.forEach((f) => allForms.add(f.word));
      entry.synonyms?.forEach((s) => allSynonyms.add(s));
      entry.antonyms?.forEach((a) => allAntonyms.add(a));

      const definitions = (entry.senses || []).map((sense) => {
        sense.synonyms?.forEach((s) => allSynonyms.add(s));
        sense.antonyms?.forEach((a) => allAntonyms.add(a));
        
        // Combine raw examples and quote text into the examples array
        const examples = [...(sense.examples || [])];
        if (sense.quotes) {
           sense.quotes.forEach(q => examples.push(q.text));
        }

        return {
          definition: sense.definition,
          examples,
        };
      });

      return {
        partOfSpeech: entry.partOfSpeech,
        definitions,
      };
    });

    return {
      word: raw.word,
      forms: Array.from(allForms),
      synonyms: Array.from(allSynonyms).slice(0, 10),
      antonyms: Array.from(allAntonyms).slice(0, 10),
      meanings,
    };
  }

  async lookup(word: string): Promise<NormalizedVocabEntry | null> {
    const res = await fetch(`https://freedictionaryapi.com/api/v1/entries/en/${encodeURIComponent(word)}`);
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
    const parsed = freeDictSchema.parse(rawData);
    return this.adaptFreeDictionaryApi(parsed);
  }
}

export class DictionaryApiProvider implements VocabProvider {
  name = 'englishdictionaryapi.com';

  private adaptEnglishDictApi(raw: EnglishDictPayload): NormalizedVocabEntry {
    const allForms = new Set<string>();
    const allSynonyms = new Set<string>();
    const allAntonyms = new Set<string>();

    const meanings = raw.entries.map((entry) => {
      entry.forms?.forEach((f) => allForms.add(f.word));
      entry.synonyms?.forEach((s) => allSynonyms.add(s));
      entry.antonyms?.forEach((a) => allAntonyms.add(a));

      const definitions = (entry.senses || []).map((sense) => {
        sense.synonyms?.forEach((s) => allSynonyms.add(s));
        sense.antonyms?.forEach((a) => allAntonyms.add(a));
        
        // Combine raw examples and quote text into the examples array
        const examples = [...(sense.examples || [])];
        if (sense.quotes) {
           sense.quotes.forEach(q => examples.push(q.text));
        }

        return {
          definition: sense.definition,
          examples,
        };
      });

      return {
        partOfSpeech: entry.partOfSpeech,
        definitions,
      };
    });

    return {
      word: raw.word,
      forms: Array.from(allForms),
      synonyms: Array.from(allSynonyms).slice(0, 10),
      antonyms: Array.from(allAntonyms).slice(0, 10),
      meanings,
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
    return this.adaptEnglishDictApi(parsed);
  }
}

// NOTE: Priority is FreeDictionaryAPI, fallback is EnglishDictionaryAPI
const PROVIDERS: VocabProvider[] = [
  new FreeDictionaryApiProvider(),
  new DictionaryApiProvider(),
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
