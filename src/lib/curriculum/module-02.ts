import type { ModuleCurriculum } from "./types";

export const module02: ModuleCurriculum = {
  moduleNumber: 2,
  stageNumber: 1,
  stageTitle: "STAGE 01 · READ & DEFINE THE PROBLEM",
  title: "Express a Task as Input, Rule and Output",
  objective: "Describe any real-world problem as a formal black-box transformation contract: the exact information received, the invariant rule applied, and the observable outcome expected.",
  readTime: "24 min deep read",
  coreFocus: "Input Contract · Transformation Rule · Observable Output · Deterministic State Mapping",
  sections: [
    {
      kicker: "SECTION 01 · THE BLACK-BOX PARADIGM",
      title: "The Architecture of Computable Tasks",
      content: [
        "Every computational system, from a pocket calculator to a planetary-scale distributed database, can be fundamentally modeled as a black-box transformer.",
        "A black box has three components that must be defined with mathematical precision before attempting a solution:",
        "1. Input Contract (Domain): The exact schema, types, bounds, and ordering of information entering the box.",
        "2. Transformation Rule (Invariant): The deterministic logical mapping that dictates how inputs are filtered, correlated, or aggregated.",
        "3. Output Contract (Codomain): The exact observable structure, data type, and guarantees returned by the box.",
        "If you cannot specify all three components in unambiguous formal terms, you do not have a problem to solve—you have an ambiguous daydream."
      ],
      callout: {
        type: "rule",
        title: "The Law of Referential Determinism",
        text: "A valid transformation rule must produce the exact same observable output whenever given the exact same input, independent of system time, memory layout, or human mood."
      }
    },
    {
      kicker: "SECTION 02 · DOMAIN AND CODOMAIN RIGOR",
      title: "Defining Structural Types Without Code",
      content: [
        "Beginners often describe inputs using fuzzy terms like 'some user data' or 'a bunch of numbers.' Masters describe inputs using structural mathematical concepts:",
        "• Scalar: A single atomic value (e.g., integer threshold, boolean flag, string label).",
        "• Unordered Collection (Set): A group of items where order does not matter and duplicates may or may not exist (e.g., active user IDs).",
        "• Ordered Sequence (Tuple / List): A collection where sequence index matters (e.g., chronological GPS points, prioritized task list).",
        "• Key-Value Mapping (Relation / Map): An association from unique keys to values (e.g., student ID -> final score).",
        "• Network / Graph: A set of entities (nodes) connected by relationships (edges) with optional weights.",
        "Choosing the wrong mental representation for your Input or Output contract guarantees bugs before any algorithmic reasoning begins."
      ],
      callout: {
        type: "warning",
        title: "The Hidden Side-Effect Trap",
        text: "Never let your Transformation Rule modify external environment state (e.g., sending an alert email or updating a database) when the task only asked for an evaluation. Keep the rule pure and observable."
      }
    },
    {
      kicker: "SECTION 03 · THE THREE CONTRACT TRAPS",
      title: "Common Novice Failures in Contract Definition",
      content: [
        "When formalizing an Input-Rule-Output contract, watch for the 3 classic flaws:",
        "1. The Unspecified Empty Case: What is the output when the input set contains zero elements? If the task is 'Find the average,' the rule must specify whether to return null, 0, or raise an error.",
        "2. The Tie-Breaking Void: If the rule requires 'Find the highest bidder,' what happens when two bidders bid the exact same amount? Without an explicit tie-breaking rule (e.g., earliest timestamp, lowest ID), the system is non-deterministic.",
        "3. The Over-Constrained Output: Returning unnecessary auxiliary data that creates coupling. If the user asked 'Did the transaction succeed?' return a boolean, not an entire transaction history dump."
      ]
    },
    {
      kicker: "SECTION 04 · THE CONTRACT BLUEPRINT",
      title: "The Universal Problem Contract Blueprint",
      content: [
        "Before solving any problem, professional problem solvers write down the Contract Blueprint:",
        "INPUT: [Name]: [Structural Type] — [Guarantees & Bounds]",
        "RULE: For each [Entity], apply [Condition P]. Transform according to [Mapping M]. Break ties by [Tie-Breaker T].",
        "OUTPUT: [Structural Type] meeting [Post-Condition Invariant].",
        "This blueprint provides a complete mathematical boundary that isolates the core challenge from all real-world distractions."
      ],
      callout: {
        type: "tip",
        title: "The Golden Rule of Contract Brevity",
        text: "If your transformation rule requires more than 3 paragraphs to describe, you have not decomposed the problem into atomic sub-tasks. Stop and break it down."
      }
    }
  ],
  caseStudies: [
    {
      tag: "CASE STUDY A · AIRLINE SEAT UPGRADE ALLOCATOR",
      title: "The Gate Seat Upgrade Engine",
      problem: "An airline gate system must allocate 3 available First Class upgrade seats among 40 Economy passengers who requested an upgrade. Each passenger has a frequent flyer tier (Diamond > Platinum > Gold), a reservation timestamp, and an original ticket price paid. Formulate the Input, Rule, and Output contracts.",
      flawedApproach: "Saying 'give the seats to the best passengers' or writing pseudo-code that sorts by tier without specifying what happens when two passengers have the same tier.",
      correctInvariant: "Input: Set of Passengers {id, tier, timestamp, fare}, Capacity K = 3.\nRule: Sort descending by: (1) Tier priority, then (2) Fare paid, then (3) Earliest reservation timestamp.\nOutput: Ordered set of exactly min(K, total_candidates) Passenger IDs assigned to upgrade seats.",
      codeOrContract: "Input: Candidates: Set<Passenger>, K: Integer\nRule: Order by Tier DESC, Fare DESC, Timestamp ASC. Take first K elements.\nOutput: Upgraded_IDs: List<PassengerID> of length ≤ K"
    },
    {
      tag: "CASE STUDY B · FINANCIAL ARBITRAGE DETECTOR",
      title: "Currency Exchange Triangular Arbitrage",
      problem: "A currency trading desk monitors foreign exchange quotes between 10 major currencies (USD, EUR, GBP, JPY, etc.). A trader asks: 'Does there exist any sequence of currency trades starting with USD and returning to USD that yields a net profit after applying quoted exchange rates?'",
      flawedApproach: "Writing nested loops simulating random trades with specific dollar amounts ($100, $1000) and checking if cash increased.",
      correctInvariant: "Input: Directed weighted graph G = (V, E) where vertices are currencies and edge weights are exchange rates.\nRule: Determine whether there exists a directed cycle C = (v_1, v_2, ..., v_k, v_1) with v_1 = USD such that the product of edge weights along C > 1.0.\nOutput: Boolean flag: True if such a cycle exists, accompanied by the sequence of currencies in the cycle; False otherwise.",
      codeOrContract: "Input: Matrix of Exchange Rates R[i, j]\nRule: ∃ Cycle C starting/ending at USD such that ∏_{(u,v) ∈ C} R[u, v] > 1.0\nOutput: { arbitrage_detected: Boolean, cycle_path: List<Currency> }"
    },
    {
      tag: "CASE STUDY C · MEDICAL LAB SPECIMEN ROUTING",
      title: "Urgent Diagnostic Sample Dispatch",
      problem: "A pathology laboratory receives test tubes from clinics. Each tube has a barcode, patient acuity score (1 to 5, where 1 is immediate emergency), sample expiration timestamp, and test panel type. The central centrifuge can process 8 samples per batch. How must the next batch be formed?",
      flawedApproach: "Processing whichever samples arrived first on the delivery cart, risking the expiration of urgent emergency samples.",
      correctInvariant: "Input: Set of active uncentrifuged specimens with {id, acuity, expires_at, panel}, Batch Capacity = 8.\nRule: Partition into valid (expires_at > current_time). Sort ascending by acuity (1 before 5), then ascending by expires_at (soonest to expire first). Take top 8.\nOutput: List of up to 8 specimen barcodes designated for immediate loading into centrifuge batch.",
      codeOrContract: "Input: Specimens: Set<Sample>, CurrentTime: Timestamp, MaxBatch = 8\nRule: Filter(expires_at > CurrentTime) -> Sort(acuity ASC, expires_at ASC) -> Limit(8)\nOutput: Batch: List<Barcode> (size ≤ 8)"
    }
  ],
  checklist: [
    "Have I explicitly specified the data structures of all inputs (set, sequence, map, scalar)?",
    "Is the transformation rule completely deterministic (zero reliance on random numbers or unstated tie-breakers)?",
    "Have I defined the exact behavior for empty or zero-element inputs?",
    "Does the output contract return strictly what was asked, without extraneous side effects?",
    "Can the rule be evaluated independently by a third party with identical results?"
  ],
  practiceTask: {
    id: "task-02-hospital-triage-dispatch",
    title: "Hands-on Practice: The Emergency Ambulance Dispatch Contract",
    scenario: "A regional emergency call center dispatches ambulances to accident scenes. When a 911 incident occurs, it logs: incident ID, GPS coordinate, severity level (Critical, Serious, Moderate), and timestamp. Available ambulances have: ambulance ID, current GPS coordinate, and equipment level (Advanced Life Support [ALS] vs Basic Life Support [BLS]). A Critical incident requires an ALS ambulance; Serious and Moderate incidents can use either ALS or BLS. When multiple ambulances qualify, dispatch the one with the shortest straight-line distance; if distances are equal, pick the ambulance with the lower numerical ID.",
    prompt: "Formulate the complete, unambiguous Input-Rule-Output contract for this dispatch decision. Do not write code. Formulate: (1) Formal Input Schema, (2) Step-by-step Deterministic Filtering and Tie-Breaking Rule, (3) Formal Output Schema.",
    starterTemplate: "1. INPUT CONTRACT:\n• Incident Schema:\n• Ambulances Schema:\n\n2. TRANSFORMATION & MATCHING RULE:\n• Eligibility Filter:\n• Distance Metric:\n• Tie-Breaking Hierarchy:\n\n3. OUTPUT CONTRACT:\n• Return Type and Guarantees:\n• Fallback behavior if no ambulance qualifies:",
    modelSolution: "1. INPUT CONTRACT:\n• Incident: Record { id: String, location: (Float, Float), severity: Enum(Critical, Serious, Moderate), timestamp: Timestamp }\n• AvailableAmbulances: Set of Records { id: Integer, location: (Float, Float), capability: Enum(ALS, BLS) }\n\n2. TRANSFORMATION & MATCHING RULE:\n• Step 1 (Capability Filter): If Incident.severity == Critical, candidates = { a ∈ AvailableAmbulances | a.capability == ALS }. Otherwise, candidates = AvailableAmbulances.\n• Step 2 (Empty Check): If candidates is empty, return Fallback (No Unit Available).\n• Step 3 (Distance Scoring): For each a ∈ candidates, compute Euclidean distance d(a.location, Incident.location).\n• Step 4 (Deterministic Ranking & Tie-Break): Order candidates by: (1) d ASC, (2) a.id ASC.\n• Step 5 (Selection): Select the single head candidate of the sorted sequence.\n\n3. OUTPUT CONTRACT:\n• Return Type: Result<AmbulanceID, DispatchFailureReason>\n• Success Guarantee: Exactly one ambulance ID matching all capability and proximity criteria.\n• Failure Guarantee: Explicit error status 'NO_QUALIFIED_UNITS_IN_RANGE' if candidates set is empty.",
    rubric: [
      "Clearly separated ALS requirement for Critical from ALS/BLS for other severities",
      "Specified exact distance evaluation rule (Euclidean straight-line)",
      "Included explicit tie-breaking condition (lower numerical ID)",
      "Defined explicit fallback handling when zero ambulances qualify",
      "Maintained referential transparency without introducing unrequested external side effects"
    ]
  },
  questions: [
    {
      question_id: "m2q01",
      sort_order: 1,
      title: "Input Contract Completeness",
      prompt: "A developer is asked to build a function that calculates the median salary of employees in a department. The developer defines the input contract as: 'Input: A list of employee salary numbers.' What crucial specification is missing from this input contract?",
      options: [
        "The brand of computer the department uses.",
        "The specification of what to return when the list is empty, and whether salaries are integers or floating-point decimals.",
        "The names and home addresses of all employees in the department.",
        "The department manager's personal performance rating."
      ],
      hints: [
        "What happens if a new department has 0 employees?",
        "Can a salary be negative or fractional?",
        "Think about edge conditions in the domain definition."
      ],
      marks: 2,
      correct_index: 1,
      explanation: "A complete input contract must specify precision (integers vs floating-point decimals), bounds (can salaries be negative?), and the domain edge case (behavior when the collection is empty). Without this, the black-box contract is ambiguous.",
      option_explanations: [
        "Incorrect: Hardware specifications are narrative noise.",
        "Correct: Handling of empty inputs and numerical precision/type bounds are foundational to a complete input contract.",
        "Incorrect: Personal home addresses are extraneous attributes unneeded for median salary calculation.",
        "Incorrect: Manager ratings are completely irrelevant to the mathematical median calculation."
      ]
    },
    {
      question_id: "m2q02",
      sort_order: 2,
      title: "Deterministic Tie-Breaking",
      prompt: "A competitive programming scoreboard contract states: 'Output the user with the highest score.' In a contest, Player A scores 450 points at 14:02. Player B scores 450 points at 14:45. What makes the current transformation rule defective?",
      options: [
        "The scoreboard should only accept scores that are multiples of 100.",
        "The rule lacks a deterministic tie-breaker, allowing different implementations to produce conflicting winners for the exact same input data.",
        "Competitive contests should never allow two people to attempt the same problem.",
        "The output contract must always return at least three users."
      ],
      hints: [
        "What happens if two implementations run on the same inputs?",
        "Will Implementation 1 pick Player A and Implementation 2 pick Player B?",
        "A mathematical function must produce a single, deterministic answer."
      ],
      marks: 2,
      correct_index: 1,
      explanation: "Without an explicit tie-breaking invariant (such as earliest submission timestamp or lexicographical username order), the contract is non-deterministic. Two correct systems could produce different outputs from identical inputs.",
      option_explanations: [
        "Incorrect: Constraining scores to multiples of 100 is an arbitrary and irrelevant constraint.",
        "Correct: Non-deterministic rules violate the fundamental law of computable problem contracts. A tie-breaker is mandatory.",
        "Incorrect: Allowing identical scores is standard; the defect lies in the lack of an ordering tie-breaker.",
        "Incorrect: The prompt asked for 'the user' (singular); returning three users would violate the output contract."
      ]
    },
    {
      question_id: "m2q03",
      sort_order: 3,
      title: "Identifying Hidden Side Effects",
      prompt: "Which of the following transformation rule descriptions violates the principle of a pure mathematical problem contract?",
      options: [
        "Given a list of numbers, return the sum of all positive values.",
        "Given a student ID and a database of records, determine whether the student is currently enrolled.",
        "Given an overdue loan account, calculate the penalty fee, charge the customer's credit card, and send a threatening SMS message.",
        "Given two dates, calculate the exact number of business days between them."
      ],
      hints: [
        "Look for actions that alter the outside world (charging credit cards, sending text messages).",
        "A pure transformation rule computes and returns values; it does not execute unrequested mutations.",
        "Which option conflates calculating a fee with executing financial transactions and communications?"
      ],
      marks: 2,
      correct_index: 2,
      explanation: "Charging a credit card and sending an SMS message are external side effects and procedural actions, not pure mathematical transformations. A clean problem contract evaluates and outputs data; execution of side effects belongs to outer application layers.",
      option_explanations: [
        "Incorrect: Pure mathematical reduction (positive sum) with zero side effects.",
        "Incorrect: Pure boolean lookup with zero mutations.",
        "Correct: Violates contract purity by entangling evaluation with external financial charges and telecommunication side effects.",
        "Incorrect: Pure date arithmetic mapping input pairs to an integer scalar."
      ]
    },
    {
      question_id: "m2q04",
      sort_order: 4,
      title: "Structural Output Contract Alignment",
      prompt: "A client asks: 'We need to verify if our warehouse has any flammable materials stored within 10 meters of our furnace.' What is the most appropriate and minimal output contract?",
      options: [
        "A full 3D rendering of the warehouse with VR walkthrough capability.",
        "A boolean scalar: `True` if at least one flammable item is located ≤ 10m from furnace, `False` otherwise.",
        "A sorted list of all warehouse employees and their emergency contact phone numbers.",
        "An exported Excel spreadsheet containing every item in the warehouse with serial numbers."
      ],
      hints: [
        "The client asked: 'We need to verify if...' (a yes/no existential question).",
        "What is the simplest, most direct data type that answers this question?",
        "Avoid presentation-layer overkill like 3D VR engines."
      ],
      marks: 2,
      correct_index: 1,
      explanation: "The question 'verify if...' is an existential query. The minimal, mathematically sound output contract is a single boolean value (`True`/`False`), optionally paired with the offending item IDs if requested.",
      option_explanations: [
        "Incorrect: A 3D VR simulation is an enormous presentation-layer scope creep.",
        "Correct: Directly and minimally satisfies the existential predicate without unnecessary overhead or structural coupling.",
        "Incorrect: Employee emergency contacts are completely unrequested.",
        "Incorrect: Exporting an Excel spreadsheet of all items violates minimality and dumps unrequested data."
      ]
    },
    {
      question_id: "m2q05",
      sort_order: 5,
      title: "Distinguishing Domain from Codomain",
      prompt: "In a machine learning sentiment analysis system, the specification states: 'Takes a paragraph of English text up to 500 words and produces a floating-point score between -1.0 (extremely negative) and +1.0 (extremely positive).' What constitutes the Codomain of this contract?",
      options: [
        "The set of all possible English paragraphs up to 500 words.",
        "The real number interval [-1.0, +1.0].",
        "The GPU hardware cores executing the matrix multiplications.",
        "The dictionary of positive and negative English adjectives."
      ],
      hints: [
        "In mathematics, Domain is the input space; Codomain is the space of possible outputs.",
        "What type of value is produced as the result?",
        "[-1.0, +1.0] is the output range."
      ],
      marks: 2,
      correct_index: 1,
      explanation: "The Codomain is the output space. Here, the output is guaranteed to be a real number scalar in the interval [-1.0, +1.0]. The input text represents the Domain.",
      option_explanations: [
        "Incorrect: The set of English paragraphs is the Domain (input space).",
        "Correct: The continuous interval [-1.0, +1.0] defines the exact Codomain (output space).",
        "Incorrect: GPU cores represent compute infrastructure, not a mathematical set.",
        "Incorrect: The adjective dictionary is an internal model artifact, not the output space."
      ]
    },
    {
      question_id: "m2q06",
      sort_order: 6,
      title: "Synthesizing a Pure Contract",
      prompt: "Consider this request: 'Given a collection of customer grocery receipts, identify the receipt with the highest total value. If multiple receipts have the same highest total, pick the one with the earliest timestamp.' Which formulation represents a complete, watertight contract?",
      options: [
        "Input: Receipts list. Rule: Find the biggest one. Output: The receipt.",
        "Input: Non-empty Set of Receipts {id: String, total: Decimal, timestamp: DateTime}. Rule: Maximize(total), breaking ties with Minimize(timestamp). Output: Single Receipt ID matching criteria.",
        "Input: Customer names. Rule: Ask the cashier who bought the most. Output: Print an invoice.",
        "Input: Today's date. Rule: Calculate store revenue. Output: Store profit margin percentage."
      ],
      hints: [
        "Look for explicit types, handling of duplicates/ties, and clear return identifiers.",
        "A vague contract like 'find the biggest one' is not computable.",
        "Option B explicitly defines schema, objective function, tie-breaker, and return type."
      ],
      marks: 2,
      correct_index: 1,
      explanation: "Option B provides a complete formal contract: explicit input schema, strict mathematical objective function (maximize total), deterministic tie-breaker (minimize timestamp), and exact output type.",
      option_explanations: [
        "Incorrect: Far too vague. Does not specify data types, tie-breaking behavior, or exact return identifier.",
        "Correct: Watertight contract with explicit types, clear mathematical objective, deterministic tie-breaking rule, and minimal return type.",
        "Incorrect: Involves human manual interaction and undefined procedural steps.",
        "Incorrect: Solves a completely different problem (store revenue/profit margin) rather than finding the top receipt."
      ]
    }
  ]
};
