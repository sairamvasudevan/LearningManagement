import {
  CommunicationExercise,
  COMMUNICATION_PRACTICE_BANK,
  CORPORATE_MOCK_ASSESSMENT,
  LsrwSkill,
} from "@/lib/communication-data";

export interface PracticeSubmissionInput {
  exerciseId: string;
  responseText?: string;
  selectedOptionIndex?: number;
  elapsedSeconds?: number;
  inputMethod?: "mic" | "typed";
  speechConfidence?: number; // 0..1 optional browser Web Speech API confidence
}

export interface DimensionBreakdown {
  sentenceMastery: number; // 20..80 (Pearson Versant standard scale)
  vocabulary: number;      // 20..80
  fluency: number;         // 20..80
  delivery: number;        // 20..80 (Pronunciation / Mechanics)
}

export interface PracticeEvaluationResult {
  exerciseId: string;
  skill: LsrwSkill;
  passed: boolean;
  percentScore: number;   // 0..100
  versantScore: number;   // 20..80
  cefrLevel: string;
  dimensions: DimensionBreakdown;
  metrics: {
    wordCount: number;
    estimatedWpm: number;
    accuracyPct: number;
    fillerWordsFound: string[];
    matchedKeywords: string[];
    missingKeywords: string[];
    grammarNotes: string[];
    inputMethod: "mic" | "typed";
  };
  summaryFeedback: string;
  actionableTips: string[];
  sampleResponse: string;
  explanation: string;
  verifierMode: "heuristic_v1_ready_for_ai";
}

export interface MockAssessmentEvaluationResult {
  assessmentId: string;
  overallVersantScore: number; // 20..80
  overallPercent: number;      // 0..100
  cefrLevel: "A2" | "B1" | "B2" | "B2+" | "C1";
  readinessVerdict: string;
  dimensions: DimensionBreakdown;
  skillPercentages: Record<LsrwSkill, number>;
  itemResults: PracticeEvaluationResult[];
  strengths: string[];
  priorityImprovements: string[];
  verifierMode: "heuristic_v1_ready_for_ai";
}

const FILLER_REGEX = /\b(um+|uh+|ah+|er+|like|basically|actually|you know|sort of|kind of|so yeah|i mean)\b/gi;
const SLANG_REGEX = /\b(plz|pls|thx|thanx|ty|u|ur|r|btw|idk|tbh|cuz|coz|gonna|wanna|kinda|asap!)\b/gi;

function normalizeWords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

// Standard token-level Levenshtein similarity for Word Error Rate / fidelity
function computeTokenAccuracy(actualText: string, candidates: string[]): number {
  const actual = normalizeWords(actualText);
  if (actual.length === 0) return 0;

  let bestScore = 0;
  for (const candidate of candidates) {
    const ref = normalizeWords(candidate);
    if (ref.length === 0) continue;

    const m = ref.length;
    const n = actual.length;
    const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        const cost = ref[i - 1] === actual[j - 1] ? 0 : 1;
        dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
      }
    }

    const wer = dp[m][n] / Math.max(m, n);
    const acc = Math.max(0, Math.round((1 - wer) * 100));
    if (acc > bestScore) bestScore = acc;
  }
  return bestScore;
}

export function percentToVersantScale(pct: number): number {
  const clamped = Math.max(0, Math.min(100, pct));
  return Math.round(20 + (clamped / 100) * 60);
}

export function versantToCefr(score: number): "A2" | "B1" | "B2" | "B2+" | "C1" {
  if (score >= 69) return "C1";
  if (score >= 62) return "B2+";
  if (score >= 54) return "B2";
  if (score >= 43) return "B1";
  return "A2";
}

function detectFillerWords(text: string): string[] {
  const matches = text.match(FILLER_REGEX) || [];
  return Array.from(new Set(matches.map((m) => m.toLowerCase())));
}

function checkWritingMechanics(text: string, minWords = 20): { score: number; notes: string[] } {
  const trimmed = text.trim();
  const notes: string[] = [];
  let penalty = 0;

  if (!trimmed) return { score: 0, notes: ["No written response submitted."] };

  const words = normalizeWords(trimmed);
  if (words.length < minWords) {
    penalty += 25;
    notes.push(`Response is too brief (${words.length} words; target at least ${minWords} words).`);
  }

  if (/^[a-z]/.test(trimmed)) {
    penalty += 8;
    notes.push("Begin your response with an uppercase capital letter.");
  }

  if (!/[.!?]$/.test(trimmed)) {
    penalty += 8;
    notes.push("End sentences with clean terminal punctuation (. ! ?).");
  }

  if (/\bi\b/.test(trimmed)) {
    penalty += 8;
    notes.push("Always capitalize the pronoun 'I' in formal communication.");
  }

  const slangMatches = trimmed.match(SLANG_REGEX);
  if (slangMatches && slangMatches.length > 0) {
    penalty += 18;
    notes.push(`Avoid informal SMS/chat abbreviations (${Array.from(new Set(slangMatches)).join(", ")}).`);
  }

  if (/\bdespite of\b/i.test(trimmed)) {
    penalty += 10;
    notes.push("Grammar correction: use 'despite' alone (not 'despite of').");
  }

  if (/\bdiscuss about\b/i.test(trimmed)) {
    penalty += 10;
    notes.push("Grammar correction: 'discuss' is transitive—do not add 'about'.");
  }

  // Sentence structure diversity check
  const sentenceCount = trimmed.split(/[.!?]+/).filter((s) => s.trim().length > 3).length;
  if (words.length > 45 && sentenceCount <= 1) {
    penalty += 12;
    notes.push("Break run-on text into 2–4 distinct, well-punctuated sentences.");
  }

  return { score: Math.max(0, 100 - penalty), notes };
}

function checkKeywords(text: string, keywords: string[] = []): { matched: string[]; missing: string[]; pct: number } {
  if (!keywords.length) return { matched: [], missing: [], pct: 100 };
  const lower = text.toLowerCase();
  const matched: string[] = [];
  const missing: string[] = [];

  for (const kw of keywords) {
    if (lower.includes(kw.toLowerCase())) matched.push(kw);
    else missing.push(kw);
  }
  const pct = Math.round((matched.length / keywords.length) * 100);
  return { matched, missing, pct };
}

function computeVocabRichness(text: string): number {
  const tokens = normalizeWords(text);
  if (tokens.length === 0) return 0;
  const unique = new Set(tokens).size;
  const ttr = unique / tokens.length;
  // Normalize Type-Token Ratio combined with length adequacy
  const lenFactor = Math.min(1, tokens.length / 25);
  return Math.round(Math.min(100, (ttr * 75 + lenFactor * 35)));
}

export function evaluatePracticeExercise(
  exercise: CommunicationExercise,
  input: PracticeSubmissionInput,
): PracticeEvaluationResult {
  const responseText = (input.responseText || "").trim();
  const words = normalizeWords(responseText);
  const wordCount = words.length;
  const elapsed = Math.max(3, Math.min(600, Number(input.elapsedSeconds || 20)));
  const estimatedWpm = wordCount > 0 ? Math.round((wordCount / elapsed) * 60) : 0;
  const inputMethod = input.inputMethod === "mic" ? "mic" : "typed";
  const fillers = detectFillerWords(responseText);

  let percentScore = 0;
  let accuracyPct = 0;
  let sentenceMasteryPct = 0;
  let vocabularyPct = 0;
  let fluencyPct = 0;
  let deliveryPct = 0;
  const tips: string[] = [];
  const grammarNotes: string[] = [];
  let matchedKeywords: string[] = [];
  let missingKeywords: string[] = [];

  if (exercise.type === "read_cloze" || exercise.type === "read_comprehension") {
    const selectedIdx = typeof input.selectedOptionIndex === "number" ? input.selectedOptionIndex : -1;
    const isCorrect = selectedIdx === exercise.correctOptionIndex;
    percentScore = isCorrect ? 100 : 20;
    accuracyPct = isCorrect ? 100 : 0;
    sentenceMasteryPct = isCorrect ? 95 : 25;
    vocabularyPct = isCorrect ? 92 : 30;
    fluencyPct = elapsed <= exercise.timeLimitSeconds ? 88 : 65;
    deliveryPct = isCorrect ? 95 : 30;
    if (!isCorrect) {
      tips.push(exercise.explanation);
    }
  } else if (
    exercise.type === "listen_repeat" ||
    exercise.type === "speak_read_aloud" ||
    exercise.type === "speak_jumbled" ||
    exercise.type === "write_typing"
  ) {
    const refs = exercise.expectedTexts && exercise.expectedTexts.length > 0 ? exercise.expectedTexts : [exercise.sampleResponse];
    accuracyPct = computeTokenAccuracy(responseText, refs);

    const kw = checkKeywords(responseText, exercise.requiredKeywords);
    matchedKeywords = kw.matched;
    missingKeywords = kw.missing;

    const fillerPenalty = fillers.length * 8;
    const confBoost = typeof input.speechConfidence === "number" ? Math.round(input.speechConfidence * 100) : accuracyPct;

    // Pacing score for spoken tasks (target 90..170 WPM; typed is generous)
    const paceScore =
      wordCount === 0
        ? 0
        : inputMethod === "mic"
        ? estimatedWpm >= 95 && estimatedWpm <= 165
          ? 92
          : 72
        : Math.min(92, Math.max(50, accuracyPct));

    // Exact punctuation/capitalization bonus on typing/read
    const exactCaseScore =
      exercise.type === "write_typing"
        ? responseText === refs[0]
          ? 100
          : Math.max(0, accuracyPct - 10)
        : confBoost;

    sentenceMasteryPct = Math.round(accuracyPct * 0.75 + kw.pct * 0.25);
    vocabularyPct = Math.round(accuracyPct * 0.55 + kw.pct * 0.45);
    fluencyPct = Math.max(0, Math.round((accuracyPct * 0.5 + paceScore * 0.5) - fillerPenalty));
    deliveryPct = Math.max(0, Math.round((accuracyPct * 0.65 + exactCaseScore * 0.35) - fillerPenalty));

    percentScore = Math.round(
      sentenceMasteryPct * 0.35 + vocabularyPct * 0.2 + fluencyPct * 0.25 + deliveryPct * 0.2,
    );

    if (accuracyPct < 80) {
      tips.push(`Word fidelity was ${accuracyPct}%. Check missed keywords or endings: ${missingKeywords.slice(0, 4).join(", ") || "verify full phrase"}.`);
    }
    if (fillers.length > 0) {
      tips.push(`Eliminate filler words detected in your response: ${fillers.join(", ")}.`);
    }
    if (exercise.type === "write_typing" && responseText !== refs[0]) {
      tips.push("Match exact capitalization, commas, and terminal period character-for-character.");
    }
  } else if (exercise.type === "listen_qa") {
    const refs = exercise.expectedTexts || [exercise.sampleResponse];
    const tokenAcc = computeTokenAccuracy(responseText, refs);
    const kw = checkKeywords(responseText, exercise.requiredKeywords);
    matchedKeywords = kw.matched;
    missingKeywords = kw.missing;
    const isHit = kw.pct >= 100 || tokenAcc >= 75;
    accuracyPct = Math.max(tokenAcc, isHit ? 95 : 20);
    sentenceMasteryPct = isHit ? 90 : 30;
    vocabularyPct = isHit ? 95 : 25;
    fluencyPct = isHit ? (wordCount <= 8 ? 94 : 78) : 35;
    deliveryPct = isHit ? 92 : 30;
    percentScore = isHit ? Math.max(85, accuracyPct) : Math.min(40, tokenAcc);
    if (!isHit) {
      tips.push(`Short Answer Q&A expected core answer containing: ${exercise.requiredKeywords?.join(", ") || exercise.sampleResponse}.`);
    }
    if (wordCount > 10) {
      tips.push("Keep Versant Short-Answer replies concise (1–5 words).");
    }
  } else if (exercise.type === "speak_open") {
    const kw = checkKeywords(responseText, exercise.requiredKeywords);
    matchedKeywords = kw.matched;
    missingKeywords = kw.missing;
    const mechanics = checkWritingMechanics(responseText, exercise.minWords || 35);
    grammarNotes.push(...mechanics.notes);

    const hasStructureConnectors = /\b(first|initially|when|because|therefore|however|finally|result|resolved|agreed|impact)\b/i.test(
      responseText,
    );
    const fillerPenalty = fillers.length * 10;
    const vocabRich = computeVocabRichness(responseText);

    sentenceMasteryPct = Math.max(0, Math.round(mechanics.score * 0.7 + (hasStructureConnectors ? 30 : 10)));
    vocabularyPct = Math.round(vocabRich * 0.55 + kw.pct * 0.45);
    fluencyPct = Math.max(
      0,
      Math.round((wordCount >= (exercise.minWords || 35) ? 88 : (wordCount / 35) * 75) + (hasStructureConnectors ? 10 : 0) - fillerPenalty),
    );
    deliveryPct = Math.max(0, Math.round((mechanics.score * 0.6 + (typeof input.speechConfidence === "number" ? input.speechConfidence * 40 : 32)) - fillerPenalty));
    accuracyPct = Math.round(kw.pct * 0.5 + mechanics.score * 0.5);
    percentScore = Math.round(
      sentenceMasteryPct * 0.25 + vocabularyPct * 0.25 + fluencyPct * 0.3 + deliveryPct * 0.2,
    );

    if (!hasStructureConnectors) {
      tips.push("Add explicit transition markers (e.g., 'Initially...', 'To isolate the cause...', 'As a result...') for stronger coherence.");
    }
    if (missingKeywords.length > 0) {
      tips.push(`Include stronger workplace actions/concepts: ${missingKeywords.slice(0, 4).join(", ")}.`);
    }
    if (fillers.length > 0) {
      tips.push(`Avoid speech fillers: ${fillers.join(", ")}.`);
    }
  } else if (exercise.type === "write_reconstruction") {
    const kw = checkKeywords(responseText, exercise.requiredKeywords);
    matchedKeywords = kw.matched;
    missingKeywords = kw.missing;
    const mechanics = checkWritingMechanics(responseText, exercise.minWords || 20);
    grammarNotes.push(...mechanics.notes);
    accuracyPct = kw.pct;
    sentenceMasteryPct = Math.round(mechanics.score * 0.75 + kw.pct * 0.25);
    vocabularyPct = Math.round(kw.pct * 0.65 + computeVocabRichness(responseText) * 0.35);
    fluencyPct = Math.round(mechanics.score * 0.5 + kw.pct * 0.5);
    deliveryPct = mechanics.score;
    percentScore = Math.round(
      sentenceMasteryPct * 0.3 + vocabularyPct * 0.3 + fluencyPct * 0.2 + deliveryPct * 0.2,
    );
    if (missingKeywords.length > 0) {
      tips.push(`Missed factual anchors from passage: ${missingKeywords.join(", ")}.`);
    }
  } else if (exercise.type === "write_email") {
    const kw = checkKeywords(responseText, exercise.requiredKeywords);
    matchedKeywords = kw.matched;
    missingKeywords = kw.missing;
    const mechanics = checkWritingMechanics(responseText, exercise.minWords || 50);
    grammarNotes.push(...mechanics.notes);

    const hasGreeting = /^(dear|hello|hi)\b/im.test(responseText);
    const hasSignOff = /\b(best regards|warm regards|sincerely|regards|thank you|thanks)\b/im.test(responseText);
    const hasPurposeCue = /\b(writing to|update|request|inform|kindly|please)\b/i.test(responseText);

    if (!hasGreeting) grammarNotes.push("Include a polite salutation (e.g., 'Dear Ananya,' or 'Dear Vikram,').");
    if (!hasSignOff) grammarNotes.push("Close professionally (e.g., 'Best regards,' + your name).");
    if (!hasPurposeCue) grammarNotes.push("Open immediately with a crisp purpose statement ('I am writing to...').");

    const structureScore = (hasGreeting ? 35 : 0) + (hasSignOff ? 35 : 0) + (hasPurposeCue ? 30 : 0);
    accuracyPct = Math.round(kw.pct * 0.5 + structureScore * 0.5);
    sentenceMasteryPct = Math.round(mechanics.score * 0.65 + structureScore * 0.35);
    vocabularyPct = Math.round(computeVocabRichness(responseText) * 0.5 + kw.pct * 0.5);
    fluencyPct = Math.round(structureScore * 0.6 + mechanics.score * 0.4);
    deliveryPct = mechanics.score;
    percentScore = Math.round(
      sentenceMasteryPct * 0.3 + vocabularyPct * 0.25 + fluencyPct * 0.25 + deliveryPct * 0.2,
    );
    if (missingKeywords.length > 0) {
      tips.push(`Make sure all prompt requirements appear explicitly: ${missingKeywords.join(", ")}.`);
    }
  }

  const versantScore = percentToVersantScale(percentScore);
  const passed = percentScore >= 65;

  const dimensions: DimensionBreakdown = {
    sentenceMastery: percentToVersantScale(sentenceMasteryPct),
    vocabulary: percentToVersantScale(vocabularyPct),
    fluency: percentToVersantScale(fluencyPct),
    delivery: percentToVersantScale(deliveryPct),
  };

  if (tips.length === 0 && passed) {
    tips.push("Strong placement-standard response! Try increasing tempo slightly or tackling Advanced drills next.");
  }

  return {
    exerciseId: exercise.id,
    skill: exercise.skill,
    passed,
    percentScore,
    versantScore,
    cefrLevel: versantToCefr(versantScore),
    dimensions,
    metrics: {
      wordCount,
      estimatedWpm,
      accuracyPct,
      fillerWordsFound: fillers,
      matchedKeywords,
      missingKeywords,
      grammarNotes,
      inputMethod,
    },
    summaryFeedback: passed
      ? `Benchmark Met (${versantScore}/80 · ${versantToCefr(versantScore)}): Your ${exercise.skill} delivery satisfies corporate assessment standards.`
      : `Needs Refinement (${versantScore}/80 · ${versantToCefr(versantScore)}): Target ≥ 65% (${percentToVersantScale(65)}/80) by applying the diagnostics below.`,
    actionableTips: [...grammarNotes, ...tips],
    sampleResponse: exercise.sampleResponse,
    explanation: exercise.explanation,
    verifierMode: "heuristic_v1_ready_for_ai",
  };
}

export function evaluateFullAssessment(
  answers: PracticeSubmissionInput[],
): MockAssessmentEvaluationResult {
  const byId = new Map<string, PracticeSubmissionInput>();
  for (const a of answers) {
    if (a?.exerciseId) byId.set(a.exerciseId, a);
  }

  const allItems = CORPORATE_MOCK_ASSESSMENT.sections.flatMap((s) => s.items);
  const itemResults: PracticeEvaluationResult[] = allItems.map((item) => {
    const ans = byId.get(item.id) || { exerciseId: item.id, responseText: "" };
    return evaluatePracticeExercise(item, ans);
  });

  const avg = (nums: number[]) =>
    nums.length ? Math.round(nums.reduce((a, b) => a + b, 0) / nums.length) : 20;

  const dimensions: DimensionBreakdown = {
    sentenceMastery: avg(itemResults.map((r) => r.dimensions.sentenceMastery)),
    vocabulary: avg(itemResults.map((r) => r.dimensions.vocabulary)),
    fluency: avg(itemResults.map((r) => r.dimensions.fluency)),
    delivery: avg(itemResults.map((r) => r.dimensions.delivery)),
  };

  // Weighted Versant composite formula (mirrors Pearson Ordinate weighted model)
  const overallVersantScore = Math.round(
    dimensions.sentenceMastery * 0.3 +
      dimensions.vocabulary * 0.25 +
      dimensions.fluency * 0.25 +
      dimensions.delivery * 0.2,
  );
  const overallPercent = avg(itemResults.map((r) => r.percentScore));
  const cefrLevel = versantToCefr(overallVersantScore);

  const skillPercentages: Record<LsrwSkill, number> = {
    listening: avg(itemResults.filter((r) => r.skill === "listening").map((r) => r.percentScore)),
    speaking: avg(itemResults.filter((r) => r.skill === "speaking").map((r) => r.percentScore)),
    reading: avg(itemResults.filter((r) => r.skill === "reading").map((r) => r.percentScore)),
    writing: avg(itemResults.filter((r) => r.skill === "writing").map((r) => r.percentScore)),
  };

  const readinessVerdict =
    overallVersantScore >= 64
      ? "Tier-1 Ready (Exceeds Accenture / Amazon / Cognizant Versant Cutoff)"
      : overallVersantScore >= 55
      ? "Placement Qualified (Meets B2 Corporate LSRW Standard)"
      : overallVersantScore >= 45
      ? "Developing Fluency (Target 55+ Versant Score for Guaranteed Round Clearance)"
      : "Foundation Stage (Complete Listening Repeat & Writing Structure Drills)";

  const strengths: string[] = [];
  const priorityImprovements: string[] = [];
  for (const [skill, pct] of Object.entries(skillPercentages)) {
    if (pct >= 75) strengths.push(`${skill.toUpperCase()} (${pct}%) demonstrates clear placement readiness.`);
    else priorityImprovements.push(`Practice ${skill.toUpperCase()} drills (${pct}%): review missing keywords, pacing, and sentence endings.`);
  }
  if (strengths.length === 0) strengths.push("Completed full 10-part timed mock structure across all 4 LSRW skills.");
  if (priorityImprovements.length === 0) priorityImprovements.push("Maintain 125–145 WPM cadence and expand STAR examples for Advanced interviews.");

  return {
    assessmentId: CORPORATE_MOCK_ASSESSMENT.id,
    overallVersantScore,
    overallPercent,
    cefrLevel,
    readinessVerdict,
    dimensions,
    skillPercentages,
    itemResults,
    strengths,
    priorityImprovements,
    verifierMode: "heuristic_v1_ready_for_ai",
  };
}

export function getAllPracticeCountsBySkill(): Record<LsrwSkill, number> {
  return {
    listening: COMMUNICATION_PRACTICE_BANK.filter((x) => x.skill === "listening").length,
    speaking: COMMUNICATION_PRACTICE_BANK.filter((x) => x.skill === "speaking").length,
    reading: COMMUNICATION_PRACTICE_BANK.filter((x) => x.skill === "reading").length,
    writing: COMMUNICATION_PRACTICE_BANK.filter((x) => x.skill === "writing").length,
  };
}
