import type { ModuleCurriculum } from "./types";

export const module04: ModuleCurriculum = {
  moduleNumber: 4,
  stageNumber: 1,
  stageTitle: "STAGE 01 · READ & DEFINE THE PROBLEM",
  title: "Separate Facts, Assumptions and Unknowns",
  objective: "Distinguish strictly guaranteed mathematical invariants from unverified human beliefs, and isolate critical unknowns before designing solution logic.",
  readTime: "23 min deep read",
  coreFocus: "Epistemic Trinity · Fact vs Assumption vs Unknown · Ambiguity Elimination · Clarification Protocol",
  sections: [
    {
      kicker: "SECTION 01 · THE EPISTEMIC TRINITY",
      title: "The Anatomy of Problem Statements",
      content: [
        "Every sentence in a problem brief or technical specification falls into one of three epistemic categories:",
        "1. Facts: Ironclad invariants guaranteed by the problem statement or mathematical law (e.g., 'Array length is between 1 and 1,000' or 'Timestamps are formatted as ISO-8601 UTC').",
        "2. Assumptions: Unverified beliefs that the solver unconsciously projects onto the problem because they seem 'reasonable' or 'typical' (e.g., 'All users have unique email addresses' or 'Events arrive in chronological order').",
        "3. Unknowns: Critical information omitted by the specification that must be determined before an optimal, correct solution can be guaranteed.",
        "Novices treat their assumptions as facts. Masters actively interrogate their own assumptions until every assumption is either proven by a fact or exposed as a dangerous unknown."
      ],
      callout: {
        type: "rule",
        title: "The Law of Epistemic Rigor",
        text: "An unvalidated assumption is a bug waiting to happen in production. If a requirement is not explicitly stated in writing, it is an Unknown, never a Fact."
      }
    },
    {
      kicker: "SECTION 02 · THE 6 DEADLIEST ASSUMPTIONS",
      title: "The Hall of Shame of Unexamined Assumptions",
      content: [
        "In technical problem solving, 90% of incorrect submissions fail due to one of the 6 Deadliest Assumptions:",
        "1. The Monotonicity Assumption: Believing inputs are sorted in ascending order when the prompt only said 'a list of numbers.'",
        "2. The Uniqueness Assumption: Assuming identifiers or keys never have duplicates or collisions.",
        "3. The Positivity Assumption: Assuming metrics like distances, prices, or balances can never be zero or negative.",
        "4. The Continuity Assumption: Assuming time sequences have no gaps, or that data points arrive at perfectly spaced intervals.",
        "5. The Synchronicity Assumption: Assuming network messages or events arrive in the exact order they were sent.",
        "6. The Homogeneity Assumption: Assuming all elements have identical structures and no null or malformed fields."
      ],
      callout: {
        type: "warning",
        title: "The Assumption Audit",
        text: "Whenever you catch yourself saying 'Obviously, it will never happen that...', STOP. Write down that exact scenario and verify whether the specification explicitly rules it out. If it does not, you must handle it."
      }
    },
    {
      kicker: "SECTION 03 · THE CLARIFICATION PROTOCOL",
      title: "How Senior Engineers Query the Unknown",
      content: [
        "When an Unknown is discovered, novices freeze, guess, or ask naive questions like 'What should I do?'.",
        "Senior problem solvers use the Structured Clarification Protocol: they formulate closed-loop, hypothesis-driven questions that propose sensible defaults:",
        "• Flawed Question: 'What if the list is empty?'",
        "• Master Question: 'The specification does not define behavior for an empty input. Should the function return an empty set, return null, or raise an invalid argument exception? In production, returning an empty set is standard unless an error contract is preferred.'",
        "This proves mastery: you identify the boundary hole, specify the exact trade-off, and offer a concrete resolution."
      ]
    },
    {
      kicker: "SECTION 04 · THE TRINITY MATRIX",
      title: "The Fact-Assumption-Unknown Worksheet",
      content: [
        "Before solving an ambiguous problem, construct the 3-column Trinity Matrix:",
        "| Explicit Facts (Guaranteed) | Solver Assumptions (Dangerous) | Actionable Unknowns (To Clarify) |",
        "Transferring items from column 2 (Assumptions) into column 1 (Facts via confirmation) or column 3 (Unknowns via clarification) completely de-risks the problem."
      ],
      callout: {
        type: "tip",
        title: "The Counterexample Probe",
        text: "To test if an assumption is safe, construct the smallest possible counterexample. If you assume 'all elements are positive,' test [-1]. If your logic breaks, your assumption was a hidden dependency."
      }
    }
  ],
  caseStudies: [
    {
      tag: "CASE STUDY A · PHARMACY DOSING CALCULATOR",
      title: "Pediatric Medication Dosage Engine",
      problem: "A clinical software tool calculates antibiotic dosage based on patient body weight. The specification says: 'Dosage = weight_kg × 15 mg.' A junior engineer deploys the logic. A neonatal infant weighing 1.8 kg is prescribed 27 mg of adult-strength antibiotic, causing an overdose alert.",
      flawedApproach: "Assuming all patients are adults or older children, and assuming a single linear multiplier is safe across all age groups without minimum/maximum absolute dosage bounds.",
      correctInvariant: "Fact: Formula weight × 15 mg is given. Assumption: Patient is in standard pediatric weight bracket [10 kg, 40 kg]. Unknown: What is the minimum absolute floor and maximum safety ceiling dosage? What are the age boundaries (neonatal vs child vs adult)?",
      codeOrContract: "Clarified Contract:\nInput: Weight_kg: Decimal, Age_Months: Integer\nFacts: Rate = 15 mg/kg\nResolved Bounds: MinFloor = 50 mg, MaxCap = 500 mg, MinAge = 6 months"
    },
    {
      tag: "CASE STUDY B · HIGHWAY TOLL RFID RECONCILIATION",
      title: "Expressway Electronic Toll Gantry",
      problem: "An automated toll gantry scans vehicle RFID tags and overhead license plate cameras. The spec states: 'Deduct $4.50 from the account associated with the tag.' When a car towing a boat trailer passes under the gantry, the camera detects two license plates, but only one RFID tag is read.",
      flawedApproach: "Assuming every vehicle has exactly one license plate, exactly one RFID tag, and exactly two axles.",
      correctInvariant: "Fact: One RFID tag was read. Unknown: Is this a single vehicle with a trailer, or two vehicles tailgating? Rule must handle multiplicity: link trailer plates to primary tow vehicle or verify axle count sensors before debiting.",
      codeOrContract: "Epistemic Audit:\nFact: 1 RFID read, 2 Plates photographed, 3 Axles detected\nAssumption: 1 Car = 1 Plate (FALSE)\nResolved Invariant: VehicleComposite = { PrimaryVehicle + OptionalTrailer }"
    },
    {
      tag: "CASE STUDY C · CLOUD FILE SYNCHRONIZATION",
      title: "Multi-Device Document Sync Conflict",
      problem: "A mobile cloud drive syncs user document edits. A spec says: 'If both the phone and laptop edit document.txt while offline, keep the version with the latest timestamp.'",
      flawedApproach: "Assuming the physical clocks on the user's phone and laptop are perfectly synchronized to the exact same millisecond.",
      correctInvariant: "Fact: Phone and laptop generate independent local timestamps. Assumption: Clocks are identical (Physical clock skew can be seconds or hours off!). Unknown: How do we establish causal ordering without synchronized physical clocks? (Requires Lamport logical clocks or vector clocks, not wall-clock timestamps).",
      codeOrContract: "Epistemic Trap: Wall-clock t_phone vs t_laptop\nTruth: Clocks drift. Causal ordering > Physical timestamp"
    }
  ],
  checklist: [
    "Have I extracted every explicitly guaranteed fact and verified it against the text?",
    "Have I listed all my personal assumptions about ordering, uniqueness, and positivity?",
    "Did I test whether any assumption breaks under negative numbers, zero, or duplicates?",
    "Have I identified all critical unknowns and formulated structured clarifying questions?",
    "Does my mental model rely only on verified facts and explicitly agreed-upon defaults?"
  ],
  practiceTask: {
    id: "task-04-ev-charger-sharing",
    title: "Hands-on Practice: The Community EV Charger Allocation Audit",
    scenario: "An apartment complex installs 4 shared Level-2 Electric Vehicle charging stations for 60 residents. A resident committee writes this brief: 'Residents reserve a charger on the mobile app. Cars can charge for up to 4 hours. If a car finishes charging early, the next resident gets the charger. Drivers who leave their car plugged in after it is fully charged will be fined $10 per hour.'",
    prompt: "Perform a thorough Epistemic Audit of this brief without writing code: (1) List 3 Explicit Facts. (2) List 3 Dangerous Unexamined Assumptions that would cause bugs or resident disputes. (3) Formulate 3 Critical Unknowns as professional, structured clarifying questions with sensible proposed defaults.",
    starterTemplate: "1. EXPLICIT GUARANTEED FACTS:\n• Fact 1:\n• Fact 2:\n• Fact 3:\n\n2. DANGEROUS UNEXAMINED ASSUMPTIONS:\n• Assumption 1:\n• Assumption 2:\n• Assumption 3:\n\n3. ACTIONABLE UNKNOWNS & CLARIFYING PROPOSALS:\n• Question 1 (with proposed default):\n• Question 2 (with proposed default):\n• Question 3 (with proposed default):",
    modelSolution: "1. EXPLICIT GUARANTEED FACTS:\n• There are exactly 4 shared Level-2 charging stations.\n• Maximum continuous charging session duration is 4 hours.\n• Penalty fee for post-charge stall occupancy is $10 per hour.\n\n2. DANGEROUS UNEXAMINED ASSUMPTIONS:\n• Assumption 1 (Instant Telemetry): Assuming the charger hardware can automatically detect and report when an EV battery hits 100% full (many older EVs do not signal state-of-charge over standard J1772 connectors).\n• Assumption 2 (Zero Move Latency): Assuming the next resident in queue is immediately physically present in the parking garage the instant a car finishes early.\n• Assumption 3 (Grace Period): Assuming residents will immediately unplug at 03:00 AM without a grace period (e.g. overnight charging etiquette).\n\n3. ACTIONABLE UNKNOWNS & CLARIFYING PROPOSALS:\n• Unknown 1: How is 'finished charging early' detected? Proposal: When current draw drops below 0.5 kW for 10 consecutive minutes, mark session as complete.\n• Unknown 2: What is the grace period before the $10/hour idle penalty begins? Proposal: A 20-minute notification grace period during daytime hours (08:00–22:00) and no idle fees charged between 22:00 and 07:00.\n• Unknown 3: How long does the next queued resident have to claim the stall? Proposal: If the next reserved driver does not plug in within 15 minutes of stall vacancy, the slot is released to the next queued user.",
    rubric: [
      "Extracted real facts from the text without distortion",
      "Identified hardware/physical disconnects (telemetry signaling, physical transit time)",
      "Identified missing operational edge cases (overnight charging, grace periods)",
      "Formulated closed-loop clarifying questions with concrete engineering defaults",
      "Avoided coding syntax, focusing strictly on domain and boundary invariants"
    ]
  },
  questions: [
    {
      question_id: "m4q01",
      sort_order: 1,
      title: "Classifying Epistemic Statements",
      prompt: "A problem brief says: 'Given a customer's phone number, find their account balance.' A developer states: 'All phone numbers will have 10 digits and will start with a valid area code.' How should this developer's statement be classified?",
      options: [
        "As an Explicit Fact guaranteed by international mathematics.",
        "As an Unexamined Assumption that is completely unverified and will crash when given international numbers, extensions, or toll-free numbers.",
        "As an Observable Acceptance Criterion.",
        "As a Hardware Execution Constraint."
      ],
      hints: [
        "Did the prompt state: 'All phone numbers have 10 digits'?",
        "Do people in the UK, Germany, or India have 10-digit US numbers?",
        "Assuming a specific country format without specification is a classic assumption."
      ],
      marks: 2,
      correct_index: 1,
      explanation: "The prompt only said 'a customer's phone number'. Assuming a 10-digit US format with valid area codes is a classic unexamined regional assumption that fails for international numbers, country codes, or alphanumeric contact handles.",
      option_explanations: [
        "Incorrect: International phone numbers have varied lengths and formats; it is not a mathematical fact.",
        "Correct: It is an unverified assumption that creates severe production vulnerabilities.",
        "Incorrect: Acceptance criteria define expected output, not input assumptions.",
        "Incorrect: Hardware constraints relate to memory, CPU, or bandwidth limits."
      ]
    },
    {
      question_id: "m4q02",
      sort_order: 2,
      title: "The Dangerous Monotonicity Assumption",
      prompt: "A prompt reads: 'Given a list of flight departure times, determine the shortest layover between any two consecutive flights.' Which of the following is a fatal assumption?",
      options: [
        "Assuming flight departure times can be represented as timestamps.",
        "Assuming the flights in the input list are already sorted chronologically from earliest to latest.",
        "Assuming layovers are calculated by taking the difference between departure times.",
        "Assuming that time flows forward."
      ],
      hints: [
        "Does the prompt say 'a chronologically sorted list' or just 'a list'?",
        "If the list is [14:00, 09:00, 18:00], what happens if you compare consecutive list indices without sorting?",
        "List order in the data structure does not equal chronological order in reality."
      ],
      marks: 2,
      correct_index: 1,
      explanation: "The prompt said 'a list of departure times,' NOT 'a chronologically sorted list.' Assuming consecutive elements in the list represent consecutive flights in real time is a fatal assumption. The list must be sorted chronologically before computing differences.",
      option_explanations: [
        "Incorrect: Timestamps are the natural representation of departure times.",
        "Correct: Assuming pre-sorted input when the prompt only specified 'a list' causes immediate incorrect layover calculations.",
        "Incorrect: Computing differences between flight times is the core definition of a layover.",
        "Incorrect: Forward flow of time is a foundational physical fact."
      ]
    },
    {
      question_id: "m4q03",
      sort_order: 3,
      title: "Identifying True Unknowns",
      prompt: "A project manager requests: 'Generate a leaderboard of our top 10 most loyal app users.' Which critical detail is an Actionable Unknown that MUST be clarified before building the solution?",
      options: [
        "The brand of coffee the project manager drinks in the morning.",
        "The formal definition of 'loyalty' (e.g., total dollars spent? number of days logged in? total app sessions? account age?).",
        "The hexadecimal color code of the database server case.",
        "The operating system version running on the project manager's smart watch."
      ],
      hints: [
        "What does 'loyal' mean in mathematics?",
        "Is loyalty dollars, visits, or account age?",
        "Without a metric formula, loyalty is completely undefined."
      ],
      marks: 2,
      correct_index: 1,
      explanation: "'Loyalty' is an ambiguous business buzzword with zero mathematical definition. Without clarifying the exact metric (e.g., consecutive login days vs total spend), any algorithm implemented is merely a guess.",
      option_explanations: [
        "Incorrect: Irrelevant personal trivia.",
        "Correct: The metric defining 'loyalty' is the fundamental unknown that determines the entire mathematical ranking function.",
        "Incorrect: Irrelevant server hardware aesthetics.",
        "Incorrect: Irrelevant personal device specification."
      ]
    },
    {
      question_id: "m4q04",
      sort_order: 4,
      title: "The Professional Clarification Question",
      prompt: "When discovering that a specification omits what to do when two products have the exact same customer review rating, which response demonstrates the most senior engineering approach?",
      options: [
        "Say nothing, write random logic, and blame the client if they complain later.",
        "Ask: 'The spec does not define tie-breaking for equal ratings. Should we break ties by total number of reviews descending, then by newest release date? That would ensure stable, deterministic ordering.'",
        "Refuse to work on the task until the client writes a 50-page legal document.",
        "Implement a random number generator to pick whichever product feels luckier."
      ],
      hints: [
        "Senior engineers propose structured solutions with reasonable defaults.",
        "Never guess silently; never stall aggressively.",
        "Propose: identify the gap + suggest sensible tie-breaker."
      ],
      marks: 2,
      correct_index: 1,
      explanation: "Option B demonstrates elite senior communication: it isolates the exact ambiguity (tie-breaking), proposes a concrete multi-tiered deterministic rule (review count then release date), and explains the architectural benefit (stable ordering).",
      option_explanations: [
        "Incorrect: Passive-aggressive and unprofessional; guarantees production defects.",
        "Correct: Closed-loop, hypothesis-driven clarification question that demonstrates domain competence and proactive problem solving.",
        "Incorrect: Obstructive and disproportionate response.",
        "Incorrect: Introduces non-determinism and ruins reproducibility."
      ]
    },
    {
      question_id: "m4q05",
      sort_order: 5,
      title: "Testing Assumptions via Minimal Counterexamples",
      prompt: "A developer assumes: 'If the sum of a list of integers is greater than 0, then the majority of the numbers in the list must be positive.' Which minimal counterexample immediately proves this assumption FALSE?",
      options: [
        "`[1, 2, 3]` (Sum = 6, 3 positive numbers).",
        "`[-1, -1, -1, 10]` (Sum = 7, but 3 numbers are negative and only 1 is positive).",
        "`[5, 5, 5]` (Sum = 15, 3 positive numbers).",
        "`[0, 0, 0]` (Sum = 0, no positive numbers)."
      ],
      hints: [
        "Find a list where sum > 0, but count(positive) < count(negative).",
        "Can a single giant positive number outweigh multiple small negative numbers?",
        "Look at `[-1, -1, -1, 10]`."
      ],
      marks: 2,
      correct_index: 1,
      explanation: "In `[-1, -1, -1, 10]`, the sum is +7 (greater than 0), but 75% of the numbers are negative. A single large positive value completely falsifies the developer's naive intuition about majority counts.",
      option_explanations: [
        "Incorrect: This example supports the assumption rather than disproving it.",
        "Correct: Flawlessly disproves the assumption with a 4-element counterexample where sum > 0 yet 3 out of 4 numbers are negative.",
        "Incorrect: All numbers are positive; does not serve as a counterexample.",
        "Incorrect: The sum is 0, which does not meet the premise (sum > 0)."
      ]
    },
    {
      question_id: "m4q06",
      sort_order: 6,
      title: "The Epistemic Audit in Architecture",
      prompt: "Why is conducting an explicit Fact-Assumption-Unknown audit at the start of a project the most cost-effective engineering practice?",
      options: [
        "Because it makes the documents look longer, allowing agencies to bill more hours.",
        "Because fixing an unexamined false assumption after code is written, tested, and deployed costs up to 100x more than clarifying it in the problem definition phase.",
        "Because assumptions are illegal under international copyright law.",
        "Because computers refuse to compile code unless an assumption audit is attached as a PDF."
      ],
      hints: [
        "Think of the cost of rewriting architecture vs asking a 2-minute question upfront.",
        "Boehm's curve of software cost of change.",
        "Clarifying early prevents building the wrong system entirely."
      ],
      marks: 2,
      correct_index: 1,
      explanation: "Decades of software engineering research (Boehm's Cost of Change curve) show that defects caught in the requirement definition phase cost orders of magnitude less to resolve than defects caught in testing or production, where entire architectures may have to be scrapped.",
      option_explanations: [
        "Incorrect: Cynical billing scam that has nothing to do with engineering quality.",
        "Correct: Captures the exponential cost of defect discovery: catching conceptual flaws upfront is exponentially cheaper than post-deployment refactoring.",
        "Incorrect: Assumptions are cognitive errors, not copyright infringements.",
        "Incorrect: Compilers check syntax and types, not business requirements."
      ]
    }
  ]
};
