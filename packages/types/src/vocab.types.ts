export interface VocabDefinition {
  definition: string;
  example?: string;
}

export interface VocabPartOfSpeech {
  partOfSpeech: string;
  definitions: VocabDefinition[];
}

export interface VocabLookupResult {
  word: string;
  forms?: string[];
  partsOfSpeech: VocabPartOfSpeech[];
  synonyms: string[];
  antonyms: string[];
}
