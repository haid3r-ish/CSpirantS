export interface NormalizedVocabDefinition {
  definition: string;
  examples: string[];
}

export interface NormalizedVocabMeaning {
  partOfSpeech: string;
  definitions: NormalizedVocabDefinition[];
}

export interface NormalizedVocabEntry {
  word: string;
  forms: string[];
  synonyms: string[];
  antonyms: string[];
  meanings: NormalizedVocabMeaning[];
}

export interface VocabProvider {
  name: string;
  lookup(word: string): Promise<NormalizedVocabEntry | null>;
}
