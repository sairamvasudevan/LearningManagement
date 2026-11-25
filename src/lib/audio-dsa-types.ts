export type AudioSpeakerRole = "narrator" | "character" | "mentor";

export interface AudioStorySegment {
  speaker: AudioSpeakerRole;
  label: string;
  text: string;
}

export interface ComparisonRow {
  storyElement: string;
  technicalConcept: string;
  whyItMatches: string;
}

export interface AudioDsaEpisode {
  id: string;
  episodeNumber: number;
  chapterNumber: number;
  chapterTitle: string;
  title: string;
  conceptTopic: string;
  durationLabel: string;
  estimatedSeconds: number;
  teaser: string;
  castTag: string;
  segments: AudioStorySegment[];
  comparisonRows: ComparisonRow[];
  technicalExplanation: string;
  miniSnippet: {
    language: string;
    code: string;
    complexity: string;
  };
  quiz: {
    prompt: string;
    scenarioHint: string;
    options: string[];
    correctIndex: number;
    correctFeedback: string;
    wrongFeedback: string;
  };
  recallKeywords: string[];
  bonusRecallPrompt: string;
}

export interface AudioDsaChapter {
  chapterNumber: number;
  title: string;
  subtitle: string;
  episodes: AudioDsaEpisode[];
}
