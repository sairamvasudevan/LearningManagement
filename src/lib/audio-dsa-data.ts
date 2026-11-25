import type { AudioDsaChapter, AudioDsaEpisode } from "@/lib/audio-dsa-types";
import { AUDIO_DSA_SEASON_A } from "@/lib/audio-dsa-season-a";
import { AUDIO_DSA_SEASON_B } from "@/lib/audio-dsa-season-b";

export type {
  AudioCueSfx,
  AudioSpeakerRole,
  AudioStorySegment,
  ComparisonRow,
  AudioDsaEpisode,
  AudioDsaChapter,
} from "@/lib/audio-dsa-types";

export const AUDIO_DSA_EPISODES: AudioDsaEpisode[] = [
  ...AUDIO_DSA_SEASON_A,
  ...AUDIO_DSA_SEASON_B,
];

const CHAPTER_SUBTITLES: Record<number, { title: string; subtitle: string }> = {
  1: {
    title: "Season 1 · Programming Foundations",
    subtitle: "Compile vs Runtime Errors, Memory Value/Reference, Loops & Recursion",
  },
  2: {
    title: "Season 2 · Complexity, Memory & Linear DS",
    subtitle: "Big-O Scaling, Arrays vs Linked Lists, Prefix Sums, Stacks & Queues",
  },
  3: {
    title: "Season 3 · Hashing, Windows & Binary Search",
    subtitle: "Hash Maps, Two Pointers / Floyd Cycle, Sliding Window & Binary Search",
  },
  4: {
    title: "Season 4 · Sorting, Intervals & Greedy",
    subtitle: "Merge/Quick/3-Way Sort, Greedy Traps & Merging Overlapping Intervals",
  },
  5: {
    title: "Season 5 · Trees, Heaps & Tries",
    subtitle: "Binary Trees, BST & LCA, Priority Queue Top-K & Prefix Tries",
  },
  6: {
    title: "Season 6 · Graphs, Shortest Paths & DSU",
    subtitle: "Adjacency Lists & Components, BFS vs DFS, Dijkstra/Bellman & Topo Sort/DSU",
  },
  7: {
    title: "Season 7 · Backtracking, DP & Bitwise Finale",
    subtitle: "Choose-Explore-Undo Backtracking, 1D DP, 2D Knapsack/LCS & Bitmasks/XOR",
  },
};

export const AUDIO_DSA_CHAPTERS: AudioDsaChapter[] = [1, 2, 3, 4, 5, 6, 7].map(
  (chNum) => ({
    chapterNumber: chNum,
    title: CHAPTER_SUBTITLES[chNum].title,
    subtitle: CHAPTER_SUBTITLES[chNum].subtitle,
    episodes: AUDIO_DSA_EPISODES.filter((ep) => ep.chapterNumber === chNum),
  }),
);

export function getAudioDsaEpisodeById(id: string): AudioDsaEpisode | undefined {
  return AUDIO_DSA_EPISODES.find((ep) => ep.id === id);
}

export function evaluateAudioEpisodeRecall(
  episode: AudioDsaEpisode,
  recallText: string,
): { matchedCount: number; matchedKeywords: string[]; note: string } {
  const cleaned = recallText.trim().toLowerCase();
  if (!cleaned) {
    return { matchedCount: 0, matchedKeywords: [], note: "" };
  }
  const matched = episode.recallKeywords.filter((kw) =>
    cleaned.includes(kw.toLowerCase()),
  );
  if (matched.length >= 2) {
    return {
      matchedCount: matched.length,
      matchedKeywords: matched,
      note: `Awesome recall! You nailed core concepts (${matched.slice(0, 3).join(", ")}) in your own words.`,
    };
  }
  if (matched.length === 1) {
    return {
      matchedCount: 1,
      matchedKeywords: matched,
      note: `Good start mentioning "${matched[0]}"! Try connecting both the story trigger and technical complexity next time.`,
    };
  }
  return {
    matchedCount: 0,
    matchedKeywords: [],
    note: `Nice try! Key engineering terms for this episode include: ${episode.recallKeywords.slice(0, 4).join(", ")}.`,
  };
}
