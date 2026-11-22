import type { ModuleCurriculum } from "./types";

export const module10: ModuleCurriculum = {
  moduleNumber: 10,
  stageNumber: 1,
  stageTitle: "STAGE 01 · READ & DEFINE THE PROBLEM",
  title: "Turn an Unclear Request into a Precise Brief",
  objective: "The Master Capstone: Synthesize all 9 foundational tools to take a chaotic, ambiguous, real-world request and forge it into an ironclad, implementation-ready Problem Specification Document (RFC).",
  readTime: "26 min deep read",
  coreFocus: "Master Synthesis · Problem Brief Specification · RFC Standards · Full-Spectrum De-Noising",
  sections: [
    {
      kicker: "SECTION 01 · THE CAPSTONE CRUCIBLE",
      title: "The Ultimate Test of an Engineering Mind",
      content: [
        "In the real world, problems are never handed to you as clean LeetCode prompts or textbook exercises with tidy $O(N)$ bounds.",
        "In real companies, executives and clients speak in chaotic, emotional, contradictory fragments: 'Our fraud rate is too high, make an AI that stops bad actors, but don't slow down legitimate users, and it has to launch before Black Friday!'",
        "A novice engineer starts writing code immediately, guesses what the executive meant, builds the wrong feature, and gets fired when production breaks.",
        "A Staff Engineer treats chaotic human requests as raw ore: they melt away the emotional noise, extract the mathematical invariants, map the boundary envelope, decompose the subproblems, and produce an ironclad Master Problem Brief (an RFC: Request For Comments)."
      ],
      callout: {
        type: "rule",
        title: "The Law of the Master Brief",
        text: "Code is a commodity; problem definition is the core intellectual property. If the brief is mathematically watertight, writing the solution is an exercise in translation."
      }
    },
    {
      kicker: "SECTION 02 · THE 6-SECTION MASTER BRIEF TEMPLATE",
      title: "The Industry Standard Engineering Specification",
      content: [
        "Every world-class engineering team uses a standardized 6-section Problem Brief:",
        "1. Executive Invariant: The single unambiguous mathematical sentence defining the core purpose (Module 01).",
        "2. Black-Box Contract: Formal Input Schema, Transformation Rule, and Output Schema (Module 02).",
        "3. Boundary Envelope & Constraints: Cardinality bounds, numerical limits, uniqueness, and resource budgets (Module 03).",
        "4. Epistemic Audit: Confirmed Facts vs Resolved Unknowns and Agreed Defaults (Module 04).",
        "5. Architectural Decomposition & DAG: Atomic subproblems and their topological dataflow sequence (Modules 08 & 09).",
        "6. Observable Acceptance Criteria & Boundary Test Matrix: Falsifiable Given-When-Then criteria including the 7 boundary archetypes (Modules 06 & 07)."
      ],
      callout: {
        type: "warning",
        title: "The 'TBD' Red Flag",
        text: "Never write 'TBD' (To Be Determined) next to an unknown in a final brief! A brief with an unresolved TBD is an incomplete document. If a detail cannot be confirmed, state the explicit default assumption that will be implemented until further notice."
      }
    },
    {
      kicker: "SECTION 03 · THE MASTER DE-NOISING WORKFLOW",
      title: "From Human Chaos to Mathematical Rigor in 5 Steps",
      content: [
        "When handed an ambiguous real-world request, execute the 5-Step De-Noising Protocol:",
        "Step 1: The Narrative Purge: Strip all corporate buzzwords ('synergy', 'AI-driven', 'disruptive') and emotional drama.",
        "Step 2: Entity & Predicate Anchor: What are the physical entities and what is the exact predicate being measured?",
        "Step 3: Boundary Perimeter Walk: Establish upper and lower bounds for all variables; catalogue null/empty cases.",
        "Step 4: Epistemic Interrogation: Challenge every assumption by creating minimal counterexamples.",
        "Step 5: Observable Oracle Formulation: Define the exact Given-When-Then criteria that a computer can grade as PASS or FAIL."
      ]
    },
    {
      kicker: "SECTION 04 · THE ARCHITECT'S SEAL OF COMPLETION",
      title: "Is This Problem Ready for Implementation?",
      content: [
        "Before handing a problem brief to a software team, apply the 4-Point Architect's Seal:",
        "• Determinism: Does every possible input map to exactly one unambiguous output?",
        "• Completeness: Are all 7 boundary archetypes (null, 0, 1, extremes, duplicates) accounted for?",
        "• Testability: Can an automated test suite verify every requirement without inspecting internal code?",
        "• Independence: Is the brief completely free of implementation bias (no mentioning of languages, classes, or frameworks)?",
        "When all 4 checkmarks are green, you have mastered the art of Problem Solving."
      ],
      callout: {
        type: "tip",
        title: "The Final Stage 01 Milestone",
        text: "You have completed Stage 01 of the 100-Hour Flagship. You now possess the analytical discipline of a Staff Systems Architect. You solve problems by thinking, structuring, and proving—long before touching a single line of code."
      }
    }
  ],
  caseStudies: [
    {
      tag: "CASE STUDY A · FINTECH FRAUD DETECTION",
      title: "The Ambiguous Executive Fraud Directive",
      problem: "A FinTech CEO sends an all-hands memo: 'Fraudulent credit card transactions are ruining our reputation. Build an automated system that blocks fraudsters immediately, but don't annoy our high-spending VIP customers!'",
      flawedApproach: "Writing a naive blocklist of zip codes or blocking any card that attempts a purchase over $500, which causes massive false-positive blocks for legitimate VIP shoppers.",
      correctInvariant: "The Synthesized Brief:\n1. Invariant: Calculate a risk score $R \\in [0, 100]$ for each transaction and route to {Approve, Challenge-SMS, Decline}.\n2. Rules: If $R < 30$, Approve immediately. If $30 ≤ R ≤ 70$, challenge with 2-Factor Authentication. If $R > 70$, Decline.\n3. Hard Bounds: Transaction processing time must be $\\le 150$ milliseconds; VIP false-decline rate must be $\\le 0.01\\%$.\n4. Epistemic Audit: Confirmed Fact: VIP status is a verified database flag. Resolved Unknown: Two-factor SMS challenge is defined as the non-blocking middle tier for borderline transactions.",
      codeOrContract: "Master Brief Contract:\nInput: Tx { amount, merchant, timestamp, card_id, vip_tier }\nScoring: R = RiskModel(Tx)\nOutput: Decision ∈ {APPROVE (R<30), CHALLENGE (30≤R≤70), DECLINE (R>70)}"
    },
    {
      tag: "CASE STUDY B · URBAN BIKE-SHARE REBALANCING",
      title: "The Vanishing Commuter Bicycle Dilemma",
      problem: "A city transportation department requests: 'In the morning, everyone rides bikes into the financial district, leaving outer stations empty and downtown stations overflowing. Make sure stations always have bikes.'",
      flawedApproach: "Dispatching truck drivers with instructions to 'drive around and move bikes wherever it looks crowded.'",
      correctInvariant: "The Synthesized Brief:\n1. Invariant: Maintain bike inventory at every station within the operating buffer $[0.20 \\cdot C_i, 0.80 \\cdot C_i]$ where $C_i$ is station capacity.\n2. Deficit / Surplus Metric: $D_i = \\text{TargetBikes}_i - \\text{CurrentBikes}_i$.\n3. Topological Task: Cluster surplus stations ($D_i < 0$) with proximate deficit stations ($D_j > 0$).\n4. Acceptance Criteria: GIVEN 3 rebalancing vans with 20-bike capacity, WHEN 06:00 to 09:00 executes, THEN zero stations reach 0 bikes or $C_i$ bikes for longer than 15 consecutive minutes.",
      codeOrContract: "Buffer Invariant:\n∀ station i: 0.20 · C_i ≤ CurrentBikes_i ≤ 0.80 · C_i\nDisaster Threshold: Time(Bikes == 0 ∨ Bikes == C_i) ≤ 15 min"
    },
    {
      tag: "CASE STUDY C · TELE-HEALTH APPOINTMENT TRIAGE",
      title: "The Overbooked Doctor Scheduling Crisis",
      problem: "A hospital clinic administrator says: 'Patients are waiting 4 hours in our virtual waiting room, while our pediatricians are complaining about 14-hour shifts with no lunch breaks. Fix our scheduling system!'",
      flawedApproach: "Arbitrarily limiting appointments to 10 patients a day, turning away sick children with acute emergencies.",
      correctInvariant: "The Synthesized Brief:\n1. Decompose into 3 Subproblems: (A) Acute Emergency Triage Sieve, (B) Doctor Duty-Hour Hard Constraints, (C) Dynamic Appointment Slot Allocator.\n2. Hard Invariants: Doctors cannot exceed 8 continuous hours without a mandatory 45-minute offline rest block. Patient wait times for urgent category must be $\\le 20$ minutes.\n3. Acceptance Criteria: GIVEN incoming queue Q, THEN assign patient to earliest available doctor slot that does not breach the doctor's rest block constraint.",
      codeOrContract: "Hard Boundary:\nDoctorShift ≤ 8h, MandatoryRest ≥ 45m\nSLA: MaxWaitTime(Urgent) ≤ 20m, MaxWaitTime(Routine) ≤ 90m"
    }
  ],
  checklist: [
    "Does the brief start with a single unambiguous, non-technical Executive Invariant sentence?",
    "Are all inputs, transformation rules, and outputs formalized as mathematical black boxes?",
    "Have all 5 constraint dimensions (cardinality, range, uniqueness, order, budgets) been established?",
    "Are there ZERO unclarified assumptions or lazy 'TBD' placeholders in the document?",
    "Is there a complete Given-When-Then acceptance test suite covering all 7 boundary archetypes?"
  ],
  practiceTask: {
    id: "task-10-disaster-relief-rfc",
    title: "Hands-on Practice: The Autonomous Disaster Relief Drone Fleet RFC",
    scenario: "Following a hurricane, an emergency management director sends a radio dispatch: 'Floodwaters have washed out all bridges to 14 isolated coastal towns. We have a fleet of 10 cargo drones at the regional airport. We have medical supplies, drinking water, and baby formula. The drones need to deliver these life-saving kits to town clinics immediately, but watch out for battery life and storms!'",
    prompt: "Transform this chaotic, high-stakes emergency dispatch into a complete, professional, 5-Part Problem Specification Brief (RFC): (1) Executive Invariant Sentence, (2) Black-Box Input/Output Contract, (3) Hard Physical & Operational Constraints, (4) Epistemic Audit (Facts vs Unknowns with proposed defaults), (5) Two Observable Given-When-Then Acceptance Criteria.",
    starterTemplate: "1. EXECUTIVE INVARIANT STATEMENT:\n[One unambiguous sentence]\n\n2. BLACK-BOX CONTRACT:\n• Input Schema:\n• Transformation Rule:\n• Output Schema:\n\n3. HARD OPERATIONAL & PHYSICAL CONSTRAINTS:\n• Drone Range & Payload:\n• Priority Hierarchy:\n\n4. EPISTEMIC AUDIT & RESOLVED DEFAULTS:\n• Facts:\n• Resolved Unknowns (with concrete defaults):\n\n5. OBSERVABLE ACCEPTANCE CRITERIA:\n• Criterion 1 (High-Priority Delivery Under Range):\n• Criterion 2 (Weather / Battery Abort Fail-Safe):",
    modelSolution: "1. EXECUTIVE INVARIANT STATEMENT:\nGiven 14 isolated destination coordinates and 10 cargo drones at base depot, dispatch a sequence of drone delivery sorties that delivers all high-priority emergency aid kits to clinics within maximum allowable flight ranges, prioritizing medical supplies over water and formula, without any drone exhausting battery reserve below 20%.\n\n2. BLACK-BOX CONTRACT:\n• Input: Destinations: Set of 14 Towns {id, gps_coord, elevation, priority_level: Enum(Critical_Medical, Infant_Formula, Drinking_Water), required_kg};\nFleet: 10 Drones {drone_id, max_payload_kg = 25, max_range_km = 80, battery_soc = 100%};\nWeather: WindSpeedMatrix(km/h), Precipitation(mm/h).\n• Transformation Rule: Sort supply demands descending by priority level, then ascending by distance from depot. For each demand, allocate a drone with adequate payload capacity and round-trip range under current wind conditions. If round-trip distance exceeds 80% of drone range, reject direct flight and schedule an intermediate safe landing/recharge point.\n• Output: FlightSortieManifest: List of Missions {drone_id, destination_id, payload_type, payload_kg, waypoint_path, estimated_flight_minutes, departure_timestamp}.\n\n3. HARD OPERATIONAL & PHYSICAL CONSTRAINTS:\n• Battery Hard Floor: Drone battery reserve must be ≥ 20% upon return touchdown at base depot.\n• Payload Cap: Single drone cargo mass ≤ 25 kg.\n• Weather Envelope: No drone departure permitted if wind gusts > 45 km/h or rainfall > 25 mm/h.\n• Priority Inviolability: Zero drinking water kits may be dispatched if any Critical Medical demand remains unallocated.\n\n4. EPISTEMIC AUDIT & RESOLVED DEFAULTS:\n• Fact 1: Exactly 14 isolated towns and 10 drones.\n• Fact 2: Road transport is 100% unavailable (floodwaters).\n• Resolved Unknown 1 (Landing Zone Safety): Default: Drones drop cargo via tether winch from 10 meters if clear ground touchdown cannot be visually verified by telemetry.\n• Resolved Unknown 2 (Depot Turnaround Time): Default: Battery swap and cargo reload at depot is modeled as a fixed 12-minute turnaround per drone.\n\n5. OBSERVABLE ACCEPTANCE CRITERIA:\n• Criterion 1 (Mission Success): GIVEN wind speed ≤ 30 km/h AND target distance ≤ 30 km (60 km round trip), WHEN a Critical Medical sortie is dispatched, THEN the cargo must be delivered to clinic GPS coordinate within ± 3 meters within 45 minutes of dispatch, and the drone must land back at depot with battery SOC ≥ 20%.\n• Criterion 2 (Fail-Safe Weather Abort): GIVEN a drone in mid-flight experiencing sudden wind gusts > 50 km/h, WHEN battery consumption telemetry predicts remaining battery at depot return will be < 15%, THEN the drone must abort mission, execute emergency landing at the nearest designated dry high-ground shelter waypoint, and transmit continuous emergency locator beacon pings.",
    rubric: [
      "Extracted an exact, concise Executive Invariant sentence without emotional fluff",
      "Defined formal Input and Output schemas with structural types and units (kg, km, %)",
      "Set strict numerical physical constraints (20% battery floor, 25 kg payload cap, 45 km/h wind limit)",
      "Resolved ambiguous real-world unknowns with concrete engineering defaults (winch drop, 12m battery swap)",
      "Formulated falsifiable Given-When-Then criteria including normal mission and emergency weather abort"
    ]
  },
  questions: [
    {
      question_id: "m10q01",
      sort_order: 1,
      title: "The Purpose of the Executive Invariant",
      prompt: "Why must a master engineering problem brief begin with a single-sentence Executive Invariant before detailing mathematical schemas and edge cases?",
      options: [
        "Because executives refuse to read anything longer than one sentence.",
        "Because a clear, unambiguous one-sentence invariant anchors the core signal, establishing the fundamental purpose of the system and preventing team scope creep before diving into technical details.",
        "Because it is required by the United States Patent Office.",
        "Because single sentences compile faster in Next.js."
      ],
      hints: [
        "Why do we summarize the core goal in one clear sentence?",
        "Prevents the team from getting lost in technical minutiae.",
        "Anchors the signal from noise."
      ],
      marks: 2,
      correct_index: 1,
      explanation: "The Executive Invariant serves as the architectural north star. It crystallizes the singular purpose of the system in one unambiguous sentence, ensuring that every subsequent technical decision, schema, and constraint directly serves the core invariant without scope creep.",
      option_explanations: [
        "Incorrect: Cynical generalization about executives.",
        "Correct: Formulates the foundational purpose of the Executive Invariant: establishing an unambiguous anchor against scope creep and confusion.",
        "Incorrect: Patent requirements have completely different legal formats.",
        "Incorrect: Compilers do not read introductory English specification sentences."
      ]
    },
    {
      question_id: "m10q02",
      sort_order: 2,
      title: "The 'TBD' Red Flag in Specifications",
      prompt: "A junior architect submits an RFC brief with the line: 'Section 3.2: Behavior when external payment gateway drops connection: TBD.' Why does a Senior Staff Architect immediately reject this brief?",
      options: [
        "Because the font was not Times New Roman.",
        "Because an unclarified 'TBD' in a core operational path shifts the burden of critical business logic onto junior programmers during coding, almost guaranteeing inconsistent error handling, data corruption, and production outages.",
        "Because TBD stands for 'The Best Database'.",
        "Because RFC documents can only be written in Latin."
      ],
      hints: [
        "What happens when a developer encounters 'TBD' while coding at midnight?",
        "They make a random guess!",
        "A brief must define concrete defaults, never leave open question marks."
      ],
      marks: 2,
      correct_index: 1,
      explanation: "Leaving 'TBD' in a specification is an abdication of architectural responsibility. It forces individual developers to guess how to handle critical failure modes while writing code, creating architectural inconsistencies and production bugs. A brief must specify a definitive default behavior.",
      option_explanations: [
        "Incorrect: Font choice is irrelevant typography.",
        "Correct: Identifies the fatal danger of TBDs: forcing developers to guess business-critical edge-case logic during implementation.",
        "Incorrect: Absurd acronym parody.",
        "Incorrect: Engineering RFCs are written in standard professional technical language."
      ]
    },
    {
      question_id: "m10q03",
      sort_order: 3,
      title: "Synthesizing the Complete De-Noising Pipeline",
      prompt: "You are given a 10-page disorganized complaint from customer support describing bugs with lost shopping carts. According to Stage 01 pedagogy, what is the very first action you must take?",
      options: [
        "Immediately open a code editor and start rewriting the database schema.",
        "Apply the Signal vs Noise filter: mentally delete all customer emotional venting and agent frustration to identify the primary Entity, the exact Event that caused state desynchronization, and the mathematical invariant violated.",
        "Send an angry email to the customer support team.",
        "Reboot the production server."
      ],
      hints: [
        "What is Module 01 about? (Separate the Story from the Task).",
        "Filter noise -> isolate entity -> identify invariant.",
        "Never write code before de-noising the problem."
      ],
      marks: 2,
      correct_index: 1,
      explanation: "The first step of master problem solving is always De-Noising (Module 01): strip emotional drama, support frustration, and narrative camouflage to isolate the physical entity, the event stream, and the underlying state invariant that broke.",
      option_explanations: [
        "Incorrect: Writing code or database schemas before defining the exact failure invariant guarantees building the wrong fix.",
        "Correct: Flawlessly applies the Stage 01 de-noising protocol: isolating entity, event, and mathematical invariant from emotional noise.",
        "Incorrect: Unprofessional emotional deflection.",
        "Incorrect: Blindly rebooting servers does not fix underlying logical state desynchronization."
      ]
    },
    {
      question_id: "m10q04",
      sort_order: 4,
      title: "Evaluating Full-Spectrum Edge Case Coverage",
      prompt: "An RFC brief describes a new customer loyalty points redemption engine. Which of the following proves that the brief has achieved complete boundary perimeter coverage?",
      options: [
        "The document is 100 pages long.",
        "The document explicitly defines behavior for: (1) Account with 0 points (the void), (2) Attempting to redeem negative points, (3) Attempting to redeem points exceeding current balance, (4) Redeeming points down to exact 0 balance, (5) Redeeming identical points from two devices at the exact same millisecond.",
        "The document has pictures of credit cards on every page.",
        "The document has been approved by the social media marketing team."
      ],
      hints: [
        "Look for the 7 boundary archetypes: zero, negative, overflow, exact boundary, concurrent duplicate collisions.",
        "Option B tests every single dimensional pole.",
        "Page length and pictures do not equal boundary rigor."
      ],
      marks: 2,
      correct_index: 1,
      explanation: "Option B demonstrates complete boundary perimeter coverage across the 7 archetypes: the void (0 points), sign inversion/invalid domain (< 0), overflow boundary (> balance), exact boundary transition (= balance), and concurrent duplicate execution collisions.",
      option_explanations: [
        "Incorrect: Document length is often a sign of bloat rather than mathematical boundary rigor.",
        "Correct: Comprehensively covers the boundary perimeter: zero state, domain violation, boundary cap, exact zero transition, and concurrency collisions.",
        "Incorrect: Decorative pictures add zero technical value.",
        "Incorrect: Marketing approval does not verify algorithmic boundary completeness."
      ]
    },
    {
      question_id: "m10q05",
      sort_order: 5,
      title: "The Ultimate Verification: The Black-Box Oracle Test",
      prompt: "How does a Staff Architect prove that a newly written problem brief is 100% complete and ready for implementation?",
      options: [
        "By asking an engineer who has never seen the codebase to read only the brief and construct 10 test cases with exact expected outputs. If the engineer's outputs match the specification with zero ambiguity, the brief is complete.",
        "By asking an AI to generate 5,000 lines of random Python code.",
        "By waiting until the software is deployed to customers and checking if anyone sues the company.",
        "By printing the brief and measuring its physical weight on a scale."
      ],
      hints: [
        "Can a clean third party understand the brief without asking questions?",
        "The Black-Box Oracle test: independent test construction without implementation knowledge.",
        "If they can construct tests with 100% agreement, the brief is watertight."
      ],
      marks: 2,
      correct_index: 0,
      explanation: "This is the ultimate benchmark of specification quality: if an independent third party can read only the brief and derive the exact expected test outputs with zero ambiguity, the problem has been fully defined. No guessing or unstated assumptions remain.",
      option_explanations: [
        "Correct: Demonstrates the gold standard of architectural specification: independent verification and test-case derivation without external context.",
        "Incorrect: Generating random code does not evaluate specification completeness.",
        "Incorrect: Testing in production with live customer legal risk is a catastrophic anti-pattern.",
        "Incorrect: Physical paper weight is absurdly irrelevant."
      ]
    },
    {
      question_id: "m10q06",
      sort_order: 6,
      title: "Stage 01 Milestone Mastery",
      prompt: "Having completed all 10 modules of Stage 01 (Read & Define the Problem), what is the most profound shift in your problem-solving capability?",
      options: [
        "You now memorize hundreds of algorithms and copy-paste them without thinking.",
        "You no longer jump blindly into writing code or picking data structures when faced with a problem; you systematically strip away narrative noise, formulate formal black-box contracts, extract boundary constraints, audit assumptions, disprove false heuristics with counterexamples, decompose tasks into orthogonal subproblems, and map dependency DAGs.",
        "You now only write code using assembly language.",
        "You have decided that software engineering does not need computers."
      ],
      hints: [
        "Notice the shift from reactive coding to structured, deliberate, mathematical problem deconstruction.",
        "Thinking before coding is the hallmark of master engineers.",
        "Option B summarizes the entire pedagogical journey of Stage 01."
      ],
      marks: 2,
      correct_index: 1,
      explanation: "This is the core objective of Stage 01: transforming from an intuitive, reactive coder who guesses and patches, into a disciplined, structured problem solver who deconstructs reality into formal mathematical invariants before touching a keyboard.",
      option_explanations: [
        "Incorrect: Rote memorization is the antithesis of true algorithmic reasoning.",
        "Correct: Perfect synthesis of the 10-module Stage 01 curriculum: disciplined analytical thinking, boundary analysis, falsification, and formal specification.",
        "Incorrect: Programming language choice is a low-level implementation detail.",
        "Incorrect: Computers are the execution engines for our formal models."
      ]
    }
  ]
};
