import type { ModuleCurriculum } from "./types";

export const module08: ModuleCurriculum = {
  moduleNumber: 8,
  stageNumber: 1,
  stageTitle: "STAGE 01 · READ & DEFINE THE PROBLEM",
  title: "Decompose a Task into Subproblems",
  objective: "Break any complex, multi-part engineering challenge into atomic, independent, and verifiable subproblems that can each be reasoned about, solved, and tested in total isolation.",
  readTime: "24 min deep read",
  coreFocus: "Functional Decomposition · Cognitive Load Management · Orthogonality · Single Responsibility",
  sections: [
    {
      kicker: "SECTION 01 · THE MONOLITHIC PARALYSIS",
      title: "Why Complex Problems Overwhelm the Human Mind",
      content: [
        "In cognitive psychology, Miller's Law proves that the human conscious working memory can only hold between 4 and 7 chunks of information simultaneously.",
        "When an engineer attacks a 5-step problem as a single monolithic block, their brain suffers cognitive overflow: they try to think about sorting, database lookups, discount rules, time zones, and email formatting all in the same thought.",
        "The result is code spaghetti, subtle logic inversion, and paralysis.",
        "Master problem solvers do not have larger brains; they have a disciplined decomposition process: they cut complex problems into atomic subproblems, solve each subproblem independently in 2 minutes, and wire them together like Lego bricks."
      ],
      callout: {
        type: "rule",
        title: "The Law of Atomic Orthogonality",
        text: "Two subproblems are orthogonal if the internal logic of Subproblem A can be completely rewritten, replaced, or optimized without changing a single character of Subproblem B."
      }
    },
    {
      kicker: "SECTION 02 · THE 3 DECOMPOSITION ARCHETYPES",
      title: "Universal Strategies for Problem Slicing",
      content: [
        "Every complex software problem decomposes into one of three structural patterns:",
        "1. Pipeline (Sequential) Slicing: Data flows through a series of discrete transformation stages where the output of stage N is the exact input of stage N+1: Raw Data -> [Filter] -> [Group] -> [Aggregate] -> [Format].",
        "2. Partition (Branching) Slicing: The problem space is split into mutually exclusive categories that each follow independent rules (e.g., Domestic vs International, Registered vs Guest, Tier 1 vs Tier 2).",
        "3. Hierarchical (Recursive) Slicing: A problem is reduced into smaller copies of itself (e.g., sorting an array by sorting its left half and right half, or traversing an organizational chart)."
      ],
      callout: {
        type: "warning",
        title: "The Coupling Contamination",
        text: "If Subproblem 1 needs to know a private variable inside Subproblem 2, your decomposition has failed. Data must flow strictly through explicit inputs and outputs, never through hidden shared state."
      }
    },
    {
      kicker: "SECTION 03 · IDENTIFYING ATOMIC RESPONSIBILITIES",
      title: "The Single Responsibility Test for Subproblems",
      content: [
        "How do you know if a subproblem is truly atomic? Apply the Single Responsibility Test:",
        "Can you state the purpose of the subproblem using the word 'AND'?",
        "If you say: 'Subproblem 2 validates the credit card AND sends an email,' it is NOT atomic! It is two distinct subproblems glued together. Separate them into Subproblem 2A: ValidateCard and Subproblem 2B: SendEmailNotification."
      ]
    },
    {
      kicker: "SECTION 04 · THE DECOMPOSITION HIERARCHY TREE",
      title: "Visualizing Problem Architecture on Paper",
      content: [
        "Before solving, draw the Decomposition Tree:",
        "Level 0: Master Goal (e.g., Process Flight Check-in)",
        "├── Level 1.1: Verify Passport Eligibility (Boolean)",
        "├── Level 1.2: Check Baggage Allowance vs Measured Weight (Weight Delta)",
        "├── Level 1.3: Allocate Seat Based on Preferences (Seat ID)",
        "└── Level 1.4: Generate Cryptographic Boarding Pass (Pass Token)",
        "Notice how each node at Level 1 is a pure black box with its own input, rule, and output contract."
      ],
      callout: {
        type: "tip",
        title: "The Divide-and-Conquer Mental Model",
        text: "Never solve a 10-step problem. Solve five 2-step problems. Each 2-step problem is trivial, and composing them makes you look like a genius."
      }
    }
  ],
  caseStudies: [
    {
      tag: "CASE STUDY A · AIRPORT CUSTOMS KIOSK",
      title: "Automated Border Control E-Gate",
      problem: "An airport border e-gate kiosk processes arriving travelers. It must: read the passport chip, capture an infrared facial scan, compare the face against the chip photo, query the INTERPOL stolen passport database, evaluate visa validity, and unlock the physical glass turnstile.",
      flawedApproach: "Writing a single giant procedural function that handles optical hardware, network sockets, facial geometry, and mechanical door solenoids all in one loop.",
      correctInvariant: "Decompose into 4 strictly isolated atomic subproblems:\n1. Subproblem A (Biometric Matcher): Input (ChipPhoto, LiveScan) -> Output: MatchConfidenceScore: Float [0.0, 1.0].\n2. Subproblem B (Watchlist Sieve): Input (PassportNum) -> Output: IsFlagged: Boolean.\n3. Subproblem C (Visa Evaluation): Input (TravelerNationality, DestinationCountry, VisaRecord) -> Output: VisaStatus: Enum(Valid, Expired, Missing).\n4. Subproblem D (Gate Gatekeeper): Input (MatchConfidence, IsFlagged, VisaStatus) -> Output: GateAction: Enum(Open, DivertToOfficer).",
      codeOrContract: "Composition Architecture:\nMatchScore = BiometricMatcher(Chip, LiveScan)\nFlagged = WatchlistSieve(PassportID)\nVisaOK = VisaEvaluator(Record)\nGateDecision = Gatekeeper(MatchScore, Flagged, VisaOK)"
    },
    {
      tag: "CASE STUDY B · E-COMMERCE FLASH BUNDLE PRICING",
      title: "Dynamic Shopping Cart Price Engine",
      problem: "A shopping platform calculates final checkout price. The rules: apply product-level quantity discounts (buy 2 get 10% off), apply store-wide coupon codes, deduct reward points, calculate state/local sales taxes, and add shipping fees based on total weight and delivery zip code.",
      flawedApproach: "Trying to calculate discounts, taxes, and shipping in a single nested calculation where discounts accidentally apply to tax amounts and shipping fees.",
      correctInvariant: "Pipeline Decomposition:\nStage 1: Calculate Item Subtotals (Quantity × UnitPrice).\nStage 2: Apply Item Promotions -> DiscountedMerchandiseSubtotal.\nStage 3: Apply Cart-level Coupons -> NetTaxableGoodsAmount.\nStage 4: Calculate Sales Tax (NetTaxableGoods × LocalTaxRate(Zip)).\nStage 5: Calculate Shipping Fee (Weight × CarrierRate(Zip)).\nStage 6: Final Payable = NetTaxableGoods + SalesTax + Shipping - RewardPoints.",
      codeOrContract: "Sequential Pipeline:\nCart -> [ItemPromotions] -> [CartCoupons] -> [TaxEngine] -> [ShippingEngine] -> [PointsDeduction] -> TotalPayable"
    },
    {
      tag: "CASE STUDY C · TRAFFIC VIOLATION CITATION",
      title: "Automated Speed Trap Enforcement",
      problem: "An automated highway speed camera system detects speeding cars, verifies ownership, checks if the car was reported stolen, calculates the fine amount, and generates an official legal citation letter.",
      flawedApproach: "Generating citation letters immediately when radar speed > 65 mph without verifying plate legibility or stolen vehicle databases.",
      correctInvariant: "Decompose into 4 Orthogonal Subproblems:\n1. Subproblem A (Radar Calibration): Filter events where `RadarSpeed - Tolerance > SpeedLimit`.\n2. Subproblem B (OCR Plate Extraction): Optical scan -> `LicensePlate: String, Confidence: Float`.\n3. Subproblem C (Vehicle Registry Lookup): `LicensePlate -> { OwnerAddress, StolenStatus }`.\n4. Subproblem D (Citation Dispatcher): If `StolenStatus == True` -> Dispatch Police Alert. Else -> Calculate Fine and Generate Citation.",
      codeOrContract: "Decomposition Tree:\nSpeedCheck -> [PlateOCR] -> [RegistryLookup] -> [Branch: PoliceAlert vs FineCitation]"
    }
  ],
  checklist: [
    "Have I broken the complex problem into at least 3 discrete, manageable subproblems?",
    "Can each subproblem be given its own independent Input-Rule-Output contract?",
    "Does any subproblem contain the word 'AND' in its single core responsibility?",
    "Can a teammate test Subproblem 2 without having finished Subproblem 1?",
    "Is data passing between subproblems strictly through clean, observable parameters?"
  ],
  practiceTask: {
    id: "task-08-waste-management-routing",
    title: "Hands-on Practice: Autonomous City Waste Management Decomposition",
    scenario: "A municipality deploys autonomous electric garbage trucks. Every morning at 05:00, the system must organize the day's collection. The system has: 1,200 smart trash bins that transmit fill levels (percentage 0 to 100%) and odor sensor ratings; 8 electric trucks (each with battery range 120 km and payload capacity 5,000 kg); and real-time street traffic congestion data. The goal is to collect all bins that are > 75% full or have severe odor, without any truck running out of battery or exceeding its weight capacity.",
    prompt: "Decompose this complex logistics problem into 4 discrete, orthogonal, single-responsibility subproblems. For each subproblem, specify: (1) Subproblem Title & Responsibility, (2) Input Schema, (3) Transformation Rule, (4) Output Schema.",
    starterTemplate: "1. SUBPROBLEM 1 (Urgent Bin Filtering & Triage):\n• Responsibility:\n• Input:\n• Rule:\n• Output:\n\n2. SUBPROBLEM 2 (Payload & Capacity Clustering):\n• Responsibility:\n• Input:\n• Rule:\n• Output:\n\n3. SUBPROBLEM 3 (Battery-Aware Route Optimization):\n• Responsibility:\n• Input:\n• Rule:\n• Output:\n\n4. SUBPROBLEM 4 (Fleet Dispatch & Real-Time Monitoring):\n• Responsibility:\n• Input:\n• Rule:\n• Output:",
    modelSolution: "1. SUBPROBLEM 1 (Urgent Bin Sieve & Triage):\n• Responsibility: Filter the 1,200 bins to identify exclusively those requiring immediate service today.\n• Input: Set of all 1,200 bins {id, location, fill_level: Float, odor_rating: Enum(Normal, Mild, Severe)}.\n• Rule: Keep bins where `fill_level ≥ 75%` OR `odor_rating == Severe`.\n• Output: CandidateBins: Set of Bins (size $K ≤ 1200$) with estimated trash weight per bin.\n\n2. SUBPROBLEM 2 (Payload-Constrained Spatial Clustering):\n• Responsibility: Partition the CandidateBins into exactly 8 disjoint clusters, ensuring each cluster's total trash mass does not exceed a truck's 5,000 kg capacity.\n• Input: CandidateBins set, Number of Trucks (8), Max Capacity (5,000 kg).\n• Rule: Spatially group geographically proximate bins such that for every cluster $C_i$: $\\sum_{b \\in C_i} \\text{weight}(b) ≤ 5000$ kg.\n• Output: 8 Disjoint Bin Clusters {Cluster_1, ..., Cluster_8}.\n\n3. SUBPROBLEM 3 (Battery-Aware Traveling Path Optimizer):\n• Responsibility: For each individual cluster, find the minimal-distance travel path starting from and returning to the depot, verifying it is within the 120 km battery limit.\n• Input: Cluster $C_i$, Depot Location, Street Traffic Congestion Matrix, Max Range (120 km).\n• Rule: Compute optimal route visiting all bins in $C_i$. If route length $> 120$ km, insert intermediate depot dump-and-recharge stops.\n• Output: Ordered Waypoint Sequence of coordinates for each of the 8 trucks.\n\n4. SUBPROBLEM 4 (Schedule Synthesis & Dispatch Manifest):\n• Responsibility: Compile the 8 routes into time-stamped departure manifests with turn-by-turn coordinate checkpoints.\n• Input: 8 Waypoint Sequences, Driver shift schedules, Depot bay assignments.\n• Rule: Assign Truck IDs to departure bays and generate departure time tokens.\n• Output: Final Fleet Dispatch Manifest ready for autonomous vehicle execution.",
    rubric: [
      "Separated candidate filtering (Subproblem 1) from clustering (Subproblem 2)",
      "Separated weight capacity clustering from battery distance pathfinding (Subproblem 3)",
      "Ensured each subproblem has single responsibility and clean boundaries",
      "Defined explicit input and output schemas for each stage",
      "Demonstrated how the output of stage N naturally feeds stage N+1"
    ]
  },
  questions: [
    {
      question_id: "m8q01",
      sort_order: 1,
      title: "Recognizing Conflated Responsibilities",
      prompt: "A developer designs a function named `process_user_signup`. In its description, the developer writes: 'Takes user input, validates email formatting, queries the database to check if email exists, hashes the password, inserts the user row, sends a welcome email via an SMTP server, and triggers a credit card billing authorization.' What architectural flaw is present?",
      options: [
        "The function is too short.",
        "The function violates Single Responsibility: it conflates input validation, database persistence, external email communication, and financial processing into a single unmaintainable monolith.",
        "Password hashing should only be done on holidays.",
        "SMTP email servers cannot be used on Tuesdays."
      ],
      hints: [
        "How many distinct things is this function doing?",
        "If the email server goes down, should user validation fail?",
        "Count the 'ANDs': validates AND queries AND hashes AND inserts AND emails AND charges."
      ],
      marks: 2,
      correct_index: 1,
      explanation: "This function commits the classic 'God Object' fallacy. It conflates 5 completely orthogonal concerns (validation, crypto, storage, email, billing). If the email server is slow or fails, user signup crashes. Each responsibility must be an isolated, independent subproblem.",
      option_explanations: [
        "Incorrect: The function is far too complex and overloaded, not too short.",
        "Correct: Identifies the violation of single responsibility and the coupling of orthogonal concerns.",
        "Incorrect: Cryptographic password hashing is standard for every user signup.",
        "Incorrect: SMTP servers operate 24/7/365."
      ]
    },
    {
      question_id: "m8q02",
      sort_order: 2,
      title: "Pipeline vs Branching Decomposition",
      prompt: "When computing an e-commerce checkout where every single order must sequentially be: (1) Validated, (2) Discounted, (3) Taxed, and (4) Charged, which decomposition archetype is being utilized?",
      options: [
        "Pipeline (Sequential) Slicing, where data flows forward through discrete transformation stages.",
        "Hierarchical Recursive Slicing, where the cart is split in half infinitely.",
        "Random Permutation Slicing, where stages execute in arbitrary order.",
        "Quantum Superposition Slicing, where taxes are charged before items are added."
      ],
      hints: [
        "Does the output of Stage 1 become the input of Stage 2?",
        "A pipeline connects the output of one step to the input of the next.",
        "Sequential flow: Step 1 -> Step 2 -> Step 3 -> Step 4."
      ],
      marks: 2,
      correct_index: 0,
      explanation: "This is a classic Pipeline (Sequential) Decomposition. Information enters Stage 1, transforms into intermediate state, feeds directly into Stage 2, and continues through discrete linear checkpoints to the final output.",
      option_explanations: [
        "Correct: Accurately identifies Pipeline (Sequential) Slicing where stages execute in strict dataflow order.",
        "Incorrect: There is no self-similar subproblem halving (recursion) occurring.",
        "Incorrect: E-commerce stages have strict causal order; arbitrary order would calculate tax before discounts.",
        "Incorrect: Pure science-fiction parody."
      ]
    },
    {
      question_id: "m8q03",
      sort_order: 3,
      title: "Orthogonality in Practice",
      prompt: "Suppose you decompose a search engine into two subproblems: Subproblem A (Document Text Parsing) and Subproblem B (Rank Scoring). What does it mean for these two subproblems to be 'Orthogonal'?",
      options: [
        "They must be written in the same programming language by the same author.",
        "You can completely replace the text parsing logic (e.g., switching from regex to an NLP tokenizer) without modifying a single line of the rank scoring logic, provided the output schema of A matches the input schema of B.",
        "Subproblem A must run at a 90-degree angle to Subproblem B.",
        "Both subproblems must share the exact same global database connection pool."
      ],
      hints: [
        "Orthogonal in geometry means perpendicular (independent).",
        "In software architecture, orthogonality means changing one does not break the other.",
        "Clean contracts between components enable independent evolution."
      ],
      marks: 2,
      correct_index: 1,
      explanation: "Orthogonality means independence of implementation. As long as the interface contract (tokens produced by A) remains stable, the internal algorithms of A can be overhauled without affecting B in any way.",
      option_explanations: [
        "Incorrect: Orthogonality enables multi-language, multi-author development.",
        "Correct: Flawlessly captures the architectural definition of orthogonality: independent internal evolution over stable interface contracts.",
        "Incorrect: Literal geometric pun that misunderstands software abstraction.",
        "Incorrect: Shared global state creates coupling, which is the direct opposite of orthogonality."
      ]
    },
    {
      question_id: "m8q04",
      sort_order: 4,
      title: "Cognitive Load and Subproblem Boundaries",
      prompt: "According to cognitive load theory in problem solving, what is the primary benefit of dividing a 10-step problem into independent subproblems?",
      options: [
        "It eliminates the need to understand mathematics.",
        "It restricts the active cognitive load for any single task to 2–3 variables, preventing working memory overload and allowing rapid verification of correctness.",
        "It allows developers to work without thinking.",
        "It automatically reduces the time complexity of all algorithms to O(1)."
      ],
      hints: [
        "How many variables can human working memory track simultaneously? (4 to 7).",
        "When a problem has 12 variables, humans make mistakes.",
        "Decomposition keeps active cognitive load small and manageable."
      ],
      marks: 2,
      correct_index: 1,
      explanation: "Human working memory is strictly bounded (Miller's Law: $7 \\pm 2$). When a problem is decomposed into atomic subproblems, the engineer only needs to reason about the 2 or 3 variables involved in that specific step, eliminating cognitive overload.",
      option_explanations: [
        "Incorrect: Mathematics is still the foundation of problem solving.",
        "Correct: Connects cognitive psychology directly to engineering architecture: managing mental chunking and working memory bounds.",
        "Incorrect: Problem solving always requires deep analytical thought.",
        "Incorrect: Decomposition does not magically change algorithmic time complexity to O(1)."
      ]
    },
    {
      question_id: "m8q05",
      sort_order: 5,
      title: "The Danger of Leaky Subproblem Interfaces",
      prompt: "A developer breaks a social network feed generator into Subproblem 1 (Fetch Posts) and Subproblem 2 (Filter Blocked Users). However, Subproblem 2 directly reads a private global cache variable created inside Subproblem 1. What flaw has been introduced?",
      options: [
        "A Leaky Abstraction / Temporal Coupling bug: Subproblem 2 cannot be tested or executed in isolation because it has a hidden dependency on the internal execution state of Subproblem 1.",
        "The computer will run out of hard drive space.",
        "The blocked users will automatically become administrators.",
        "The posts will be translated into Latin."
      ],
      hints: [
        "Can you test Subproblem 2 by itself in a unit test if it depends on Subproblem 1's private cache?",
        "Hidden shared state couples the two components together.",
        "This is called a leaky abstraction or hidden coupling."
      ],
      marks: 2,
      correct_index: 0,
      explanation: "Reading a private global variable created by another component introduces hidden temporal coupling and leaky abstraction. Subproblem 2 can no longer be tested in isolation with dummy data, destroying the benefits of modular decomposition.",
      option_explanations: [
        "Correct: Accurately diagnoses leaky abstraction, hidden state coupling, and the destruction of testability.",
        "Incorrect: Memory or disk capacity is unrelated to this architectural boundary leak.",
        "Incorrect: Permissions logic is unaffected by cache architecture.",
        "Incorrect: Language translation has nothing to do with shared state coupling."
      ]
    },
    {
      question_id: "m8q06",
      sort_order: 6,
      title: "Synthesizing an Atomic Decomposition",
      prompt: "You are tasked with designing an automated system that reads bank check images, verifies the account has sufficient balance, and transfers the funds. Which decomposition represents the cleanest, most orthogonal atomic architecture?",
      options: [
        "Step 1: Do everything in one giant function called `process_check()`.",
        "Subproblem A: Image OCR (Image -> RoutingNum, AccountNum, Amount). Subproblem B: Account Verifier (AccountNum, Amount -> IsSufficient: Boolean). Subproblem C: Ledger Transfer (SourceAccount, DestAccount, Amount -> TransferReceipt).",
        "Step 1: Ask the bank manager to look at the check. Step 2: Give the money to the customer.",
        "Step 1: Check if the check is paper. Step 2: Burn the check."
      ],
      hints: [
        "Look for the 3 distinct phases: (1) Vision/OCR, (2) Validation, (3) Transaction.",
        "Each phase has an explicit input and output.",
        "Option B separates perception, business rules, and financial ledger mutation cleanly."
      ],
      marks: 2,
      correct_index: 1,
      explanation: "Option B is a master-level functional decomposition: Subproblem A handles visual perception/OCR; Subproblem B handles business rules/balance verification; Subproblem C handles financial ledger transaction state. Each has an explicit input and output schema.",
      option_explanations: [
        "Incorrect: Monolithic anti-pattern with zero decomposition.",
        "Correct: Pristine orthogonal decomposition separating optical recognition, business rule validation, and ledger mutation.",
        "Incorrect: Reverts to manual human labor.",
        "Incorrect: Absurd destructive procedure."
      ]
    }
  ]
};
