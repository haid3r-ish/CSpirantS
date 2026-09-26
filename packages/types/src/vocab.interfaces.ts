export interface DictionaryApiMeaning {
  partOfSpeech: string;
  definitions?: { definition: string; example?: string }[];
  senses?: { definition: string; example?: string }[];
}

export interface DictionaryApiResponse {
  word: string;
  forms?: string[];
  partsOfSpeech?: DictionaryApiMeaning[];
  synonyms?: string[];
  antonyms?: string[];
}

export interface FreeDictionaryApiMeaning {
  partOfSpeech: string;
  definitions: {
    definition: string;
    example?: string;
    synonyms?: string[];
    antonyms?: string[];
  }[];
  synonyms?: string[];
  antonyms?: string[];
}

export interface FreeDictionaryApiResponse {
  word: string;
  phonetics?: { text?: string }[];
  meanings: FreeDictionaryApiMeaning[];
}

export interface NormalizedVocabMeaning {
  partOfSpeech: string;
  definitions: string[];
}

export interface NormalizedVocabEntry {
  word: string;
  phonetic?: string;
  meanings: NormalizedVocabMeaning[];
}

export interface VocabProvider {
  name: string;
  lookup(word: string): Promise<NormalizedVocabEntry | null>;
}
