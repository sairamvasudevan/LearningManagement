export type LsrwSkill = "listening" | "speaking" | "reading" | "writing";

export type CommunicationExerciseType =
  | "listen_repeat"
  | "listen_qa"
  | "speak_read_aloud"
  | "speak_jumbled"
  | "speak_open"
  | "read_cloze"
  | "read_comprehension"
  | "write_reconstruction"
  | "write_email"
  | "write_typing";

export interface LsrwCurriculumModule {
  id: string;
  skill: LsrwSkill;
  badge: string;
  title: string;
  subtitle: string;
  estimatedMinutes: number;
  companyBenchmarks: string[];
  whatTestsMeasure: string[];
  coreStrategies: {
    heading: string;
    detail: string;
    exampleBad?: string;
    exampleGood?: string;
  }[];
  commonTraps: string[];
  idealRubricChecklist: string[];
}

export interface CommunicationExercise {
  id: string;
  skill: LsrwSkill;
  type: CommunicationExerciseType;
  title: string;
  companyTag: string;
  difficulty: "Foundation" | "Placement Standard" | "Advanced";
  instruction: string;
  timeLimitSeconds: number;
  audioText?: string;          // Played via speechSynthesis for listening exercises
  passageText?: string;        // Displayed text (read-aloud, comprehension, or timed-hide reconstruction)
  studySeconds?: number;       // For passage reconstruction: time visible before hiding
  jumbledChunks?: string[];    // For speak_jumbled sentence builds
  promptQuestion?: string;     // Question / situational brief / email prompt
  mcqOptions?: string[];       // For read_cloze / read_comprehension
  correctOptionIndex?: number; // Server-side reference index
  expectedTexts?: string[];    // Canonical text(s) for repeat / read-aloud / jumbled / typing / Q&A
  requiredKeywords?: string[]; // Key facts/concepts expected in open/retell/reconstruction/email
  minWords?: number;
  maxWords?: number;
  explanation: string;
  sampleResponse: string;
}

export interface MockAssessmentSection {
  id: string;
  title: string;
  skill: LsrwSkill;
  benchmarkNote: string;
  items: CommunicationExercise[];
}

export const LSRW_CURRICULUM_MODULES: LsrwCurriculumModule[] = [
  {
    id: "lsrw-listening",
    skill: "listening",
    badge: "MODULE 01 · LISTENING (L)",
    title: "Listening: Aural Memory, Repeat Sentences & Context Recall",
    subtitle: "Master Pearson Versant Part C/E & Accenture audio-repeat rounds under zero-replay time pressure.",
    estimatedMinutes: 25,
    companyBenchmarks: ["Pearson Versant (Accenture / Cognizant)", "TCS Digital / NQT", "Amazon Ops & SDE"],
    whatTestsMeasure: [
      "Working aural memory on 8 to 16 word spoken sentences",
      "Retention of numbers, dates, prices, modals, and negative qualifiers (not, never, hardly)",
      "Precision short-answer inference from fast conversational prompts",
      "Active listening through neutral Indian, US, and UK accents without guessing",
    ],
    coreStrategies: [
      {
        heading: "Meaning Chunking Instead of Word-by-Word Memorization",
        detail:
          "Human short-term memory holds ~4–5 conceptual chunks, not 14 isolated words. Group every sentence into [Who / Action / Detail] mentally as it plays.",
        exampleBad: "Remembering: 'The - regional - manager - asked - the - finance - team - to - finalize - Q3 - numbers'",
        exampleGood: "3 chunks: [The regional manager asked] + [the finance team] + [to finalize Q3 numbers].",
      },
      {
        heading: "Protect High-Risk Function Words & Endings",
        detail:
          "Automated scorers heavily penalize swapping singular/plural (-s), past tense (-ed), prepositions (at vs on), or dropping negations (cannot vs can).",
      },
      {
        heading: "1-to-3 Word Precision on Short Answer Q&A",
        detail:
          "When asked a binary or factual question (e.g., 'Do you measure fever with a thermometer or a barometer?'), reply cleanly with the target noun phrase rather than rambling.",
      },
    ],
    commonTraps: [
      "Paraphrasing during a verbatim Repeat Sentence item (synonyms lose Sentence Mastery points).",
      "Letting a missed middle word cause a freeze that makes you miss the ending clause.",
      "Confusing homophones or tense endings ('walk' vs 'walked', '15' vs '50').",
    ],
    idealRubricChecklist: [
      "Preserve exact tense, plurals, and negative words (no/not/doesn't)",
      "Capture numerical values cleanly before phrasing adjectives",
      "Respond promptly within 1–2 seconds of the prompt chime",
    ],
  },
  {
    id: "lsrw-speaking",
    skill: "speaking",
    badge: "MODULE 02 · SPEAKING (S)",
    title: "Speaking: Fluency, Sentence Builds & Story Retelling",
    subtitle: "Eliminate filler words, master syntactic scrambling, and deliver 45-second structured answers at 120–150 WPM.",
    estimatedMinutes: 30,
    companyBenchmarks: ["Mercer Mettl SpeechX / SVAR", "Pearson Versant Speaking", "Capgemini Spoken Round"],
    whatTestsMeasure: [
      "Speech continuity, steady tempo (110–155 WPM), and natural phrasing",
      "Elimination of hesitation markers ('um', 'uh', 'like', 'basically', 'you know')",
      "Syntactic speed in unscrambling spoken Jumbled Sentence Builds",
      "Spontaneous narrative coherence in Story Retelling & Open HR questions",
    ],
    coreStrategies: [
      {
        heading: "Replace Silence & Fillers With Micro-Pauses",
        detail:
          "Automated ASR tracks pause duration and filler frequency. A 0.4s silent breath at a comma is natural; a 2.5s freeze or saying 'umm actually...' lowers Fluency sharply.",
        exampleBad: "Um, like, when my project failed, uh, I basically fixed the database and all.",
        exampleGood: "When our sprint staging build failed, I audited the database schema, isolated the missing index, and resolved the timeout within twenty minutes.",
      },
      {
        heading: "Anchored Clause Method for Sentence Builds",
        detail:
          "In Jumbled Sentence Builds (Versant Part D), identify the main Subject + Verb anchor first, then snap the trailing object/prepositional clause onto it.",
      },
      {
        heading: "Use PREP / STAR for Open HR Questions",
        detail:
          "Point -> Reason -> Example -> Point (PREP) keeps a 40-second answer tight, rich in workplace vocabulary, and neatly concluded before time runs out.",
      },
    ],
    commonTraps: [
      "Speaking abnormally fast to beat the timer (causes dropped consonants & garbled ASR tokens).",
      "Imitating an unfamiliar Western accent (reduces articulation clarity; neutral clear pronunciation scores highest).",
      "Stopping after 1 single sentence in Open Questions (insufficient speech sample for fluency scoring).",
    ],
    idealRubricChecklist: [
      "Maintain steady 115–150 WPM pace with clear ending consonants",
      "Use zero filler words and keep pauses under 1 second",
      "Cover Beginning -> Action -> Outcome structure in Open/Retell tasks",
    ],
  },
  {
    id: "lsrw-reading",
    skill: "reading",
    badge: "MODULE 03 · READING (R)",
    title: "Reading: Prosody Read-Aloud, Cloze Grammar & Inference",
    subtitle: "Avoid robotic word-by-word reading and crack Versant VEPT Sentence Completion grammar traps.",
    estimatedMinutes: 25,
    companyBenchmarks: ["Versant VEPT Parts A & G", "Amcat / SHL English", "Deloitte / Wipro Verbal"],
    whatTestsMeasure: [
      "Thought-group chunking, punctuation awareness, and natural intonation",
      "Contextual vocabulary, collocations, and phrasal prepositions under time pressure",
      "Strict Subject-Verb agreement, tense consistency, and conditional clauses",
      "Rapid extraction of implicit conclusions from technical or policy notices",
    ],
    coreStrategies: [
      {
        heading: "Phrase Grouping & Commas in Read-Aloud",
        detail:
          "Read clauses as smooth phrases, rise slightly on introductory phrases, pause briefly at commas (0.3s) and periods (0.6s), and drop pitch cleanly on final words.",
        exampleBad: "Although. The. Deployment. Was. Delayed. Customers. Received. Updates.",
        exampleGood: "Although the deployment was delayed, | customers received timely status updates.",
      },
      {
        heading: "3-Step Cloze Elimination (Before Looking at Options)",
        detail:
          "Identify the missing part of speech (noun/verb/preposition/conjunction), check singular/plural cue words earlier in the sentence, and verify collocations ('comply with', 'responsible for', 'despite' + noun).",
      },
    ],
    commonTraps: [
      "Using 'despite of' (wrong — use 'despite' or 'in spite of') or 'discuss about' (wrong — use 'discuss').",
      "Matching verb plurality to the nearest noun inside a prepositional phrase ('The list of requirements ARE' -> WRONG, subject is 'list', use 'IS').",
      "Reading punctuation robotically or skipping plural '-s' and past '-ed' suffixes aloud.",
    ],
    idealRubricChecklist: [
      "Read every punctuation mark with intentional pitch modulation",
      "Check subject head noun before picking singular vs plural verbs",
      "Verify contrast connectors (although + clause vs despite + noun phrase)",
    ],
  },
  {
    id: "lsrw-writing",
    skill: "writing",
    badge: "MODULE 04 · WRITING (W)",
    title: "Writing: Passage Reconstruction & Corporate Email Etiquette",
    subtitle: "Excel at Versant Part I (30-second read -> blind rewrite) and Cognizant/TCS email writing rounds.",
    estimatedMinutes: 30,
    companyBenchmarks: ["Versant VEPT Parts H & I", "TCS / Cognizant Email Writing", "Accenture Written Assessment"],
    whatTestsMeasure: [
      "Accuracy & net WPM speed without typos or skipped capitalization",
      "Factual recall & paraphrased grammar accuracy in Passage Reconstruction",
      "Workplace tone, clarity, deadline specificity, and concise bullet structure in Emails",
      "Punctuation hygiene (avoiding comma splices, SMS slang, and lowercase 'i')",
    ],
    coreStrategies: [
      {
        heading: "Who-What-Why-When Memory Net in Passage Reconstruction",
        detail:
          "You only see the paragraph for 25–30 seconds before it vanishes. Do NOT try to memorize phrasing word-for-word. Lock in: (1) Subject, (2) Action/Problem, (3) Numbers/Dates, (4) Resolution.",
      },
      {
        heading: "4-Block Corporate Email Template (75–130 Words)",
        detail:
          "Every company rubric rewards: [Polite Greeting] -> [Direct Purpose Line] -> [Action / Impact / Concrete Timeline] -> [Clear Call-to-Action & Sign-off].",
        exampleBad: "hi sir project is late coz api crashed plz wait till tomorrow thx",
        exampleGood:
          "Dear Priya,\n\nI am writing to inform you that our v2.4 staging deployment is delayed by one day due to an authentication regression identified during integration testing.\n\nOur team has isolated the root cause and will deploy the verified fix by tomorrow at 4:00 PM IST. Please let me know if you would like a status sync earlier.\n\nBest regards,\nAditya",
      },
    ],
    commonTraps: [
      "Using text abbreviations ('u', 'plz', 'thx', 'btw'), missing greetings/sign-offs, or writing a 300-word wall of text.",
      "Inventing numbers or dropping critical dates during Passage Reconstruction.",
      "Writing incomplete fragments or comma splices ('The server failed, we restarted it').",
    ],
    idealRubricChecklist: [
      "Preserve every core fact and number during passage reconstruction",
      "Include salutation, context, specific action/timeline, and professional closing in emails",
      "Zero slang, capitalized 'I', proper terminal periods",
    ],
  },
];

export const COMMUNICATION_PRACTICE_BANK: CommunicationExercise[] = [
  // LISTENING (3 drills)
  {
    id: "prac-listen-repeat-1",
    skill: "listening",
    type: "listen_repeat",
    title: "Repeat Sentence: Project Timeline Update",
    companyTag: "Accenture · Versant Part C",
    difficulty: "Foundation",
    instruction: "Play the audio prompt carefully once, then reproduce the exact sentence spoken (via microphone or exact transcript typing) without changing tense or numbers.",
    timeLimitSeconds: 45,
    audioText: "The engineering team will submit the revised architecture proposal before five o'clock on Friday.",
    expectedTexts: [
      "The engineering team will submit the revised architecture proposal before five o'clock on Friday.",
      "The engineering team will submit the revised architecture proposal before 5 o'clock on Friday.",
      "The engineering team will submit the revised architecture proposal before 5:00 on Friday.",
    ],
    requiredKeywords: ["engineering", "submit", "revised", "architecture", "proposal", "friday"],
    explanation: "Notice future tense ('will submit'), exact adjective ('revised'), and deadline ('five o'clock on Friday'). Dropping '-d' or swapping 'Friday' reduces Sentence Mastery accuracy.",
    sampleResponse: "The engineering team will submit the revised architecture proposal before five o'clock on Friday.",
  },
  {
    id: "prac-listen-repeat-2",
    skill: "listening",
    type: "listen_repeat",
    title: "Repeat Sentence: Conditional Policy Rule",
    companyTag: "Cognizant · Versant Part C",
    difficulty: "Placement Standard",
    instruction: "Listen for the negative modal ('cannot') and passive verb agreement, then repeat cleanly.",
    timeLimitSeconds: 45,
    audioText: "Although the staging server was restarted twice, the database migration cannot proceed without supervisor approval.",
    expectedTexts: [
      "Although the staging server was restarted twice, the database migration cannot proceed without supervisor approval.",
      "Although the staging server was restarted twice, the database migration can not proceed without supervisor approval.",
    ],
    requiredKeywords: ["although", "staging", "restarted", "twice", "migration", "cannot", "approval"],
    explanation: "Key markers: subordinate contrast ('Although'), passive past ('was restarted twice'), and negative constraint ('cannot proceed without supervisor approval').",
    sampleResponse: "Although the staging server was restarted twice, the database migration cannot proceed without supervisor approval.",
  },
  {
    id: "prac-listen-qa-1",
    skill: "listening",
    type: "listen_qa",
    title: "Short Answer Q&A: Rapid Logical Contrast",
    companyTag: "TCS / Versant Part E",
    difficulty: "Foundation",
    instruction: "Listen to the spoken question and reply concisely with the exact 1–4 word answer.",
    timeLimitSeconds: 25,
    audioText: "If a quarterly audit is postponed from Tuesday to Thursday, is it happening earlier or later in the week?",
    expectedTexts: ["later", "later in the week", "it is happening later", "happening later"],
    requiredKeywords: ["later"],
    explanation: "Versant Q&A expects immediate semantic comprehension. Since Tuesday -> Thursday moves forward in the week, the direct target answer is 'later' (or 'later in the week').",
    sampleResponse: "Later in the week.",
  },

  // SPEAKING (3 drills)
  {
    id: "prac-speak-jumbled-1",
    skill: "speaking",
    type: "speak_jumbled",
    title: "Sentence Build: Unscrambling Syntactic Clauses",
    companyTag: "Pearson Versant · Part D",
    difficulty: "Placement Standard",
    instruction: "Combine all three scrambled phrases below into a single grammatically natural sentence using every phrase once.",
    timeLimitSeconds: 40,
    jumbledChunks: ["before the release deadline", "every critical bug", "our QA engineers resolved"],
    expectedTexts: [
      "our qa engineers resolved every critical bug before the release deadline",
      "before the release deadline our qa engineers resolved every critical bug",
    ],
    requiredKeywords: ["qa engineers", "resolved", "every critical bug", "before the release deadline"],
    explanation: "Subject ('our QA engineers') + Transitive Verb ('resolved') + Object ('every critical bug') + Time clause ('before the release deadline').",
    sampleResponse: "Our QA engineers resolved every critical bug before the release deadline.",
  },
  {
    id: "prac-speak-jumbled-2",
    skill: "speaking",
    type: "speak_jumbled",
    title: "Sentence Build: Passive Workplace Scheduling",
    companyTag: "Accenture · Versant Part D",
    difficulty: "Advanced",
    instruction: "Assemble the three segments into a well-formed passive corporate sentence.",
    timeLimitSeconds: 40,
    jumbledChunks: ["until all stakeholders", "will not be finalized", "review the budget"],
    audioText: "wait — remember to include the missing subject? Wait: 'the quarterly schedule' is implied—let's keep complete chunks!",
    expectedTexts: [
      "the quarterly plan will not be finalized until all stakeholders review the budget",
    ],
    requiredKeywords: [],
    explanation: "Let's match complete scrambled clauses only.",
    sampleResponse: "",
  },
  {
    id: "prac-speak-open-1",
    skill: "speaking",
    type: "speak_open",
    title: "Open HR Prompt: Resolving a Team Disagreement",
    companyTag: "Mettl SpeechX · Amazon / TCS",
    difficulty: "Placement Standard",
    instruction: "Speak or draft your spoken answer (aim for 45–85 words cleanly structured using STAR / PREP: Situation, Action, Result) without fillers like 'um', 'uh', or 'like'.",
    timeLimitSeconds: 60,
    promptQuestion: "Describe a time you disagreed with a teammate on a technical or project approach, and how you resolved it professionally.",
    requiredKeywords: ["team", "approach", "data", "resolved", "agreed", "result"],
    minWords: 35,
    maxWords: 140,
    explanation: "Strong placement responses frame the disagreement around shared goals, evaluate options objectively (metrics, trade-offs, prototype), and finish with a measurable team outcome.",
    sampleResponse:
      "During our final-year microservice project, a teammate preferred storing user analytics in relational joins while I recommended an indexed summary table. Instead of debating opinions, we benchmarked both queries on ten thousand sample rows. When the latency numbers showed our summary table reduced API response time by sixty percent, we agreed on the hybrid design and shipped ahead of schedule.",
  },

  // READING (3 drills)
  {
    id: "prac-read-aloud-1",
    skill: "reading",
    type: "speak_read_aloud",
    title: "Read Aloud: Clear Technical Articulation & Prosody",
    companyTag: "Pearson Versant · Part A",
    difficulty: "Foundation",
    instruction: "Read the displayed passage aloud clearly with natural comma pauses (use Live Mic Voice Capture or type-verify word fidelity during dry-run). Focus on plural '-s' and past '-ed' endings.",
    timeLimitSeconds: 45,
    passageText:
      "Effective engineers communicate complex trade-offs clearly. Before implementing any optimization, they measure latency bottlenecks, validate edge cases, and share concise documentation with their peers.",
    expectedTexts: [
      "Effective engineers communicate complex trade-offs clearly. Before implementing any optimization, they measure latency bottlenecks, validate edge cases, and share concise documentation with their peers.",
      "Effective engineers communicate complex tradeoffs clearly. Before implementing any optimization, they measure latency bottlenecks, validate edge cases, and share concise documentation with their peers.",
    ],
    requiredKeywords: ["engineers", "communicate", "trade", "optimization", "bottlenecks", "documentation"],
    explanation: "Watch thought groups: '...any optimization,' (pause + rising inflection) -> 'they measure latency bottlenecks, validate edge cases, and share concise documentation with their peers.' (falling final tone).",
    sampleResponse:
      "Effective engineers communicate complex trade-offs clearly. Before implementing any optimization, they measure latency bottlenecks, validate edge cases, and share concise documentation with their peers.",
  },
  {
    id: "prac-read-cloze-1",
    skill: "reading",
    type: "read_cloze",
    title: "Sentence Completion: Collective Noun & Preposition Agreement",
    companyTag: "Versant VEPT Part G · Wipro / Deloitte",
    difficulty: "Placement Standard",
    instruction: "Select the grammatically sound option that preserves formal business English agreement.",
    timeLimitSeconds: 30,
    promptQuestion:
      "A comprehensive checklist of security requirements ______ mandatory before any deployment is approved for production.",
    mcqOptions: [
      "are",
      "is",
      "were being",
      "have been",
    ],
    correctOptionIndex: 1,
    explanation: "The grammatical subject is the singular head noun 'checklist', not 'requirements' (which sits inside the prepositional modifier 'of security requirements'). Therefore singular 'is' is required.",
    sampleResponse: "is",
  },
  {
    id: "prac-read-comp-1",
    skill: "reading",
    type: "read_comprehension",
    title: "Workplace Inference: Incident Postmortem Notice",
    companyTag: "Cognizant / Amazon Verbal Reasoning",
    difficulty: "Placement Standard",
    instruction: "Read the short engineering memo and choose the conclusion strictly supported by the text.",
    timeLimitSeconds: 60,
    passageText:
      "Memo: Yesterday's 14-minute API outage occurred because automated cache invalidation ran simultaneously across all twelve EU nodes instead of rolling sequentially. No customer payment records were altered, and rolling deployment safeguards have now been enforced in CI/CD so only two nodes restart at once.",
    promptQuestion: "Which statement accurately reflects the memo?",
    mcqOptions: [
      "Customer payment data had to be restored from backups.",
      "Concurrent restarts across every EU node caused the brief service interruption.",
      "Future deployments will shut down all twelve nodes together for faster recovery.",
      "Manual restarts caused the cache corruption.",
    ],
    correctOptionIndex: 1,
    explanation: "The memo states invalidation ran 'simultaneously across all twelve EU nodes' causing the 14-minute outage, and confirms no payment records were altered.",
    sampleResponse: "Concurrent restarts across every EU node caused the brief service interruption.",
  },

  // WRITING (3 drills)
  {
    id: "prac-write-recon-1",
    skill: "writing",
    type: "write_reconstruction",
    title: "Passage Reconstruction: 25-Second Memory Rewrite",
    companyTag: "Pearson Versant · VEPT Part I",
    difficulty: "Placement Standard",
    instruction: "Read the brief notice carefully during the study window. Once hidden (or when you click 'Hide Passage & Start Writing'), rewrite every key fact in clear, grammatical sentences from memory.",
    timeLimitSeconds: 90,
    studySeconds: 25,
    passageText:
      "Rohan noticed that three laptops in the campus lab failed to connect to Wi-Fi after Tuesday's firewall update. He reported the issue to IT support at 9:30 AM, and technicians restored connectivity for all affected workstations before noon.",
    requiredKeywords: ["rohan", "three", "laptop", "wi-fi", "firewall", "support", "restored", "noon"],
    minWords: 20,
    maxWords: 75,
    explanation: "Passage Reconstruction rewards preserving all factual anchors ([Rohan], [three laptops / Wi-Fi], [Tuesday firewall update], [9:30 AM IT report], [restored before noon]) without copying verbatim.",
    sampleResponse:
      "After a Tuesday firewall update, three lab laptops could not connect to Wi-Fi. Rohan notified IT support at 9:30 AM, and technicians repaired all the machines before noon.",
  },
  {
    id: "prac-write-email-1",
    skill: "writing",
    type: "write_email",
    title: "Corporate Email Writing: Client Deadline Extension",
    companyTag: "TCS Digital / Cognizant Written Round",
    difficulty: "Placement Standard",
    instruction:
      "Write a crisp, polite email (65–140 words) to your client lead, Ms. Ananya Rao, explaining that the API integration module needs 2 extra days due to third-party sandbox downtime, proposing a new delivery date (Thursday, 5 PM), and offering a staging walkthrough.",
    timeLimitSeconds: 180,
    promptQuestion:
      "Recipient: Ananya Rao (Client Lead). Required points: (1) Polite greeting & context, (2) Reason for 2-day delay (third-party sandbox downtime), (3) Revised deadline (Thursday 5:00 PM), (4) Offer partial demo/walkthrough + formal sign-off.",
    requiredKeywords: ["ananya", "delay", "sandbox", "thursday", "regards"],
    minWords: 55,
    maxWords: 160,
    explanation: "Top corporate email scores require an appropriate salutation, zero informal abbreviations ('plz', 'u', 'thx'), an accountability tone, concrete revised timestamp, and formal closing.",
    sampleResponse:
      "Dear Ananya,\n\nI am writing to provide an update on our API integration milestone. Due to unexpected downtime on the third-party payment sandbox environment over the past twenty-four hours, our end-to-end verification tests were delayed.\n\nWe have completed the core webhook handlers and kindly request a two-day extension, moving final delivery to Thursday at 5:00 PM. In the meantime, I would be happy to share a staging walkthrough of all completed endpoints tomorrow morning.\n\nPlease let me know if this timeline works for your team.\n\nBest regards,\nAditya Sharma",
  },
  {
    id: "prac-write-typing-1",
    skill: "writing",
    type: "write_typing",
    title: "Precision Typing: Accuracy & WPM Benchmark",
    companyTag: "Versant Typing Speed & Accuracy",
    difficulty: "Foundation",
    instruction: "Transcribe the displayed sentence with 100% spelling, punctuation, and capitalization accuracy as quickly as possible. Copy-paste is disabled.",
    timeLimitSeconds: 45,
    passageText:
      "Clear written documentation prevents costly misunderstandings across distributed engineering teams.",
    expectedTexts: [
      "Clear written documentation prevents costly misunderstandings across distributed engineering teams.",
    ],
    requiredKeywords: ["clear", "written", "documentation", "prevents", "misunderstandings", "distributed", "teams"],
    explanation: "Typing speed alone without high character accuracy lowers scores. Aim for >95% word fidelity with steady rhythm and accurate punctuation.",
    sampleResponse:
      "Clear written documentation prevents costly misunderstandings across distributed engineering teams.",
  },
];

// Clean up jumbled sentence exercise #2 so chunks assemble into a full sentence cleanly
COMMUNICATION_PRACTICE_BANK[4] = {
  id: "prac-speak-jumbled-2",
  skill: "speaking",
  type: "speak_jumbled",
  title: "Sentence Build: Passive Workplace Scheduling",
  companyTag: "Accenture · Versant Part D",
  difficulty: "Advanced",
  instruction: "Assemble all four segments below into a grammatically complete formal sentence.",
  timeLimitSeconds: 40,
  jumbledChunks: ["will not be approved", "until every stakeholder", "the quarterly deployment", "signs off on security"],
  expectedTexts: [
    "the quarterly deployment will not be approved until every stakeholder signs off on security",
    "until every stakeholder signs off on security the quarterly deployment will not be approved",
  ],
  requiredKeywords: ["quarterly deployment", "will not be approved", "until", "stakeholder", "security"],
  explanation: "Main clause: 'The quarterly deployment will not be approved' + Conditional time clause: 'until every stakeholder signs off on security.'",
  sampleResponse: "The quarterly deployment will not be approved until every stakeholder signs off on security.",
};

export const CORPORATE_MOCK_ASSESSMENT: {
  id: string;
  title: string;
  benchmarkLabel: string;
  durationMinutes: number;
  sections: MockAssessmentSection[];
} = {
  id: "corporate-lsrw-mock-v1",
  title: "All-India Campus Placement Communication Assessment (Versant / SpeechX Style)",
  benchmarkLabel: "Aligned with Accenture · Cognizant · TCS · Amazon LSRW Standards",
  durationMinutes: 15,
  sections: [
    {
      id: "sec-reading",
      title: "Section A · Reading & Grammar Mechanics",
      skill: "reading",
      benchmarkNote: "Evaluates thought-group fluency and subject-verb / preposition precision.",
      items: [
        {
          id: "mock-read-1",
          skill: "reading",
          type: "speak_read_aloud",
          title: "Part 1: Read Aloud",
          companyTag: "Versant Part A",
          difficulty: "Placement Standard",
          instruction: "Read or recite the exact sentence clearly using natural clause pauses.",
          timeLimitSeconds: 35,
          passageText:
            "Reliable distributed systems detect partial failures early and recover gracefully without corrupting customer state.",
          expectedTexts: [
            "Reliable distributed systems detect partial failures early and recover gracefully without corrupting customer state.",
          ],
          requiredKeywords: ["reliable", "distributed", "failures", "gracefully", "corrupting"],
          explanation: "Tests consonant endings ('systems', 'detect', 'failures', 'corrupting') and phrasing.",
          sampleResponse:
            "Reliable distributed systems detect partial failures early and recover gracefully without corrupting customer state.",
        },
        {
          id: "mock-read-2",
          skill: "reading",
          type: "read_cloze",
          title: "Part 2: Contrast Connector Cloze",
          companyTag: "Versant VEPT Part G",
          difficulty: "Placement Standard",
          instruction: "Choose the grammatically correct connector.",
          timeLimitSeconds: 30,
          promptQuestion:
            "______ the heavy traffic spike during the morning sale, every checkout service remained responsive.",
          mcqOptions: ["Although", "Despite", "However", "In spite"],
          correctOptionIndex: 1,
          explanation: "The blank precedes a noun phrase ('the heavy traffic spike...'), not a subject+verb clause, so 'Despite' (without 'of') is correct.",
          sampleResponse: "Despite",
        },
      ],
    },
    {
      id: "sec-listening",
      title: "Section B · Listening Memory & Q&A",
      skill: "listening",
      benchmarkNote: "Evaluates working memory, negative qualifiers, and rapid factual comprehension.",
      items: [
        {
          id: "mock-listen-1",
          skill: "listening",
          type: "listen_repeat",
          title: "Part 3: Repeat Sentence (Factual Clause)",
          companyTag: "Versant Part C",
          difficulty: "Placement Standard",
          instruction: "Play the prompt once, then repeat the exact sentence spoken.",
          timeLimitSeconds: 40,
          audioText: "Please upload your signed internship verification form to the portal before noon tomorrow.",
          expectedTexts: [
            "Please upload your signed internship verification form to the portal before noon tomorrow.",
          ],
          requiredKeywords: ["upload", "signed", "internship", "verification", "portal", "noon", "tomorrow"],
          explanation: "Preserves exact noun modifiers ('signed internship verification form') and time frame ('before noon tomorrow').",
          sampleResponse: "Please upload your signed internship verification form to the portal before noon tomorrow.",
        },
        {
          id: "mock-listen-2",
          skill: "listening",
          type: "listen_repeat",
          title: "Part 4: Repeat Sentence (Conditional Constraint)",
          companyTag: "Versant Part C",
          difficulty: "Advanced",
          instruction: "Listen carefully to modal negatives and repeat accurately.",
          timeLimitSeconds: 45,
          audioText: "Neither the client team nor the backend lead approved merging unreviewed changes directly to main.",
          expectedTexts: [
            "Neither the client team nor the backend lead approved merging unreviewed changes directly to main.",
          ],
          requiredKeywords: ["neither", "client", "nor", "approved", "unreviewed", "main"],
          explanation: "Correlative conjunction ('neither... nor') plus past tense ('approved') and gerund ('merging').",
          sampleResponse: "Neither the client team nor the backend lead approved merging unreviewed changes directly to main.",
        },
        {
          id: "mock-listen-3",
          skill: "listening",
          type: "listen_qa",
          title: "Part 5: Spoken Short-Answer Q&A",
          companyTag: "Versant Part E",
          difficulty: "Foundation",
          instruction: "Listen and answer briefly (1–3 words).",
          timeLimitSeconds: 25,
          audioText: "When reviewing source code for errors before deployment, are you performing debugging or manufacturing?",
          expectedTexts: ["debugging", "performing debugging"],
          requiredKeywords: ["debugging"],
          explanation: "Direct choice question requiring precise vocabulary extraction ('debugging').",
          sampleResponse: "Debugging.",
        },
      ],
    },
    {
      id: "sec-speaking",
      title: "Section C · Speaking Coherence & Syntax",
      skill: "speaking",
      benchmarkNote: "Evaluates sentence construction speed, fluency, low filler rate, and structured ideas.",
      items: [
        {
          id: "mock-speak-1",
          skill: "speaking",
          type: "speak_jumbled",
          title: "Part 6: Jumbled Sentence Build",
          companyTag: "Versant Part D",
          difficulty: "Placement Standard",
          instruction: "Speak or assemble the phrases into one coherent sentence.",
          timeLimitSeconds: 35,
          jumbledChunks: ["with automated tests", "every pull request", "must be verified", "before deployment"],
          expectedTexts: [
            "every pull request must be verified with automated tests before deployment",
            "before deployment every pull request must be verified with automated tests",
          ],
          requiredKeywords: ["every pull request", "must be verified", "with automated tests", "before deployment"],
          explanation: "Passive modal structure: 'Every pull request must be verified with automated tests before deployment.'",
          sampleResponse: "Every pull request must be verified with automated tests before deployment.",
        },
        {
          id: "mock-speak-2",
          skill: "speaking",
          type: "speak_open",
          title: "Part 7: Open Workplace Situation",
          companyTag: "Mettl SpeechX / Open Question",
          difficulty: "Placement Standard",
          instruction: "Deliver a well-paced, structured answer (40–90 words) using Situation -> Action -> Outcome with zero fillers.",
          timeLimitSeconds: 60,
          promptQuestion:
            "If you discover a critical bug two hours before a product demo, what steps do you take and how do you inform stakeholders?",
          requiredKeywords: ["reproduce", "root cause", "notify", "stakeholders", "workaround", "fix"],
          minWords: 35,
          maxWords: 140,
          explanation: "High-scoring responses cover: (1) Triage/reproduce severity, (2) Communicate transparently with timeline/mitigation, (3) Patch or prepare clean fallback before demo.",
          sampleResponse:
            "First, I would reproduce the bug immediately to assess its blast radius and see if a quick rollback or safe workaround stabilizes the demo path. Simultaneously, I would notify my tech lead concisely with impact and ETA rather than hiding the issue. Finally, after applying the fix or isolation flag, I would run a quick sanity check on the full demo script.",
        },
      ],
    },
    {
      id: "sec-writing",
      title: "Section D · Written Precision, Recall & Emails",
      skill: "writing",
      benchmarkNote: "Evaluates Versant Part I factual recall and formal corporate email communication.",
      items: [
        {
          id: "mock-write-1",
          skill: "writing",
          type: "write_typing",
          title: "Part 8: Precision Sentence Transcription",
          companyTag: "Versant Typing Accuracy",
          difficulty: "Foundation",
          instruction: "Type the exact sentence cleanly without copy-pasting.",
          timeLimitSeconds: 40,
          passageText:
            "Consistent API contracts allow frontend and backend engineers to ship features independently.",
          expectedTexts: [
            "Consistent API contracts allow frontend and backend engineers to ship features independently.",
          ],
          requiredKeywords: ["consistent", "contracts", "frontend", "backend", "independently"],
          explanation: "Measures exact orthographic accuracy, capitalization, and speed.",
          sampleResponse:
            "Consistent API contracts allow frontend and backend engineers to ship features independently.",
        },
        {
          id: "mock-write-2",
          skill: "writing",
          type: "write_reconstruction",
          title: "Part 9: Blind Passage Reconstruction",
          companyTag: "Versant VEPT Part I",
          difficulty: "Placement Standard",
          instruction: "Study the 38-word note for 20 seconds, then hide it and reconstruct all key facts in your own clear sentences.",
          timeLimitSeconds: 80,
          studySeconds: 20,
          passageText:
            "Meera organized a two-day workshop on cloud security for sixty sophomore students. Because thirty participants needed Linux setup help, two teaching assistants stayed after 5 PM to verify every machine.",
          requiredKeywords: ["meera", "two-day", "workshop", "cloud security", "sixty", "linux", "assistants", "5 pm"],
          minWords: 20,
          maxWords: 75,
          explanation: "Checks factual recall across 4 units: Meera + two-day cloud security workshop, 60 sophomores, 30 Linux setups, 2 assistants after 5 PM.",
          sampleResponse:
            "Meera conducted a two-day cloud security workshop attended by sixty sophomore students. Since thirty attendees required assistance configuring Linux, two teaching assistants stayed past 5 PM to ensure every workstation worked.",
        },
        {
          id: "mock-write-3",
          skill: "writing",
          type: "write_email",
          title: "Part 10: Formal Clarification Email",
          companyTag: "TCS / Cognizant Email Round",
          difficulty: "Placement Standard",
          instruction:
            "Write a formal email (60–140 words) to Mr. Vikram Nair requesting access credentials for the analytics staging database so your team can complete performance testing before Wednesday.",
          timeLimitSeconds: 180,
          promptQuestion:
            "Recipient: Vikram Nair. Purpose: Request read-only analytics staging DB credentials for performance testing by Wednesday.",
          requiredKeywords: ["vikram", "credentials", "staging", "testing", "wednesday", "regards"],
          minWords: 50,
          maxWords: 160,
          explanation: "Evaluates salutation, polite request clarity, least-privilege mention (read-only), deadline ('Wednesday'), formal closing, and clean mechanics.",
          sampleResponse:
            "Dear Vikram,\n\nI hope your week is going well. I am writing to request read-only access credentials to the analytics staging database for our team's upcoming load and query performance benchmarks.\n\nCould you please provision the account by Tuesday afternoon so we can finalize our latency test report ahead of Wednesday's review? Please let me know if any security approval ticket is needed from my manager.\n\nThank you for your support.\n\nBest regards,\nAditya",
        },
      ],
    },
  ],
};

export const ALL_COMMUNICATION_EXERCISES: CommunicationExercise[] = [
  ...COMMUNICATION_PRACTICE_BANK,
  ...CORPORATE_MOCK_ASSESSMENT.sections.flatMap((s) => s.items),
];

export function getCommunicationExerciseById(id: string): CommunicationExercise | undefined {
  return ALL_COMMUNICATION_EXERCISES.find((ex) => ex.id === id);
}
