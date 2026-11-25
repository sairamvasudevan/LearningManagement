export type EloTier = "Intern" | "Junior SDE" | "SDE-2" | "Staff Engineer" | "FAANG Bar Raiser";

export type BotPersonality =
  | "supportive" // ELO 800: gentle, patient, guides with helpful hints
  | "standard"   // ELO 1200: friendly yet professional, tests fundamental correctness
  | "rigorous"   // ELO 1600: precise, demands optimal Big-O, tests space trade-offs
  | "demanding"  // ELO 2000: senior staff lead, probes invariants, scale, concurrency
  | "ruthless";  // ELO 2400: FAANG bar raiser, adversarial counterexamples, zero hand-waving

export interface InterviewBot {
  id: string;
  name: string;
  elo: number;
  tier: EloTier;
  title: string;
  avatarColor: string;
  tagline: string;
  companyStyle: string;
  personality: BotPersonality;
  speechPitch: number; // 0.8 - 1.3
  speechRate: number;  // 0.85 - 1.2
  defaultLanguage: "python" | "javascript" | "java" | "cpp";
  introGreeting: string;
}

export type InterviewStage =
  | "INTRO"          // Bot welcoming candidate, stating problem
  | "CLARIFICATION"  // Candidate clarifying assumptions / edge cases
  | "APPROACH"       // Candidate proposing naive vs optimal algorithm & Big-O
  | "CODING"         // Candidate implementing code
  | "GRILL"          // Bot probing candidate with hard edge cases & stress tests
  | "CONCLUDED";     // Session finished, final scorecard ready

export interface InterviewMessage {
  id: string;
  sender: "bot" | "candidate" | "system";
  text: string;
  audioScript?: string;
  stage: InterviewStage;
  codeSnippet?: string;
  timestamp: string;
}

export interface QuestionExample {
  input: string;
  output: string;
  explanation?: string;
}

export interface QuestionGrillProbe {
  triggerKeywords: string[];
  probeQuestion: string;
  probeAudioScript: string;
  focusArea: "time_complexity" | "space_complexity" | "edge_cases" | "invariants" | "scale_limit";
  expectedDefense: string;
}

export interface InterviewQuestion {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  targetElo: number;
  topic: string;
  prompt: string;
  examples: QuestionExample[];
  constraints: string[];
  clarificationAnswers: Record<string, string>;
  expectedOptimalTime: string;
  expectedOptimalSpace: string;
  starterCode: {
    python: string;
    javascript: string;
    java: string;
    cpp: string;
  };
  grillProbes: QuestionGrillProbe[];
}

export interface RubricDimension {
  score: number; // 0..20
  max: number;   // 20
  feedback: string;
}

export type HiringRecommendation =
  | "Strong Hire"
  | "Hire"
  | "Lean Hire"
  | "Lean No Hire"
  | "No Hire";

export interface InterviewFeedback {
  overallScore: number; // 0..100
  candidateElo: number; // estimated candidate rating
  recommendation: HiringRecommendation;
  rubric: {
    problemSolving: RubricDimension;
    algorithmCorrectness: RubricDimension;
    complexityAnalysis: RubricDimension;
    grillingDefense: RubricDimension;
    communicationClarity: RubricDimension;
  };
  strengths: string[];
  improvements: string[];
  grillingHighlights: string[];
  summary: string;
  createdAt: string;
}

export interface InterviewSession {
  id: string;
  userId: string;
  botId: string;
  botElo: number;
  questionId: string;
  stage: InterviewStage;
  messages: InterviewMessage[];
  code: string;
  language: string;
  feedback: InterviewFeedback | null;
  turnCount: number;
  status: "active" | "concluded";
  createdAt: string;
  updatedAt: string;
}

export interface UserInterviewCredits {
  userId: string;
  freeSlots: number;
  purchasedSlots: number;
  totalInterviews: number;
  lastRefillDate: string;
  updatedAt: string;
}
